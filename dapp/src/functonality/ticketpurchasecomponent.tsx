import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  TicketPurchaseProps,
  EthereumWindow,
  TransactionReceipt,
} from '@/utils/dev/typeInit';
import {
  CONTRACT_ADDRESSES,
  contracts,
  estimateGas,
} from '@/utils/dev/contractInit';
import TicketPurchaseUI from '@/utils/methods/ticketPurchase/ticketPurchaseUI';
import { handleContractError } from '@/utils/dev/handleContractError';
import useExhibit from '@/lib/useGetExhibitById';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  calculateTimeLeft,
} from '@/functonality/countdownTimer';
import { validateTicket } from '@/utils/methods/ticketPurchase/ticketService';
import { estimateGasFees } from '@/utils/methods/ticketPurchase/gasEstimator';


// # TODO : CLEAN UP A BIT MORE

const TicketPurchaseComponent = ({ userAddress }: TicketPurchaseProps) => {
  const session = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [estimatedGasFees, setEstimatedGasFees] = useState('0.00');
  const [isEstimating, setIsEstimating] = useState(false);
  const [buttonType, setButtonType] = useState<
    'primary' | 'secondary' | 'tartary' | 'subTartary'
  >('primary');
  const [buttonText, setButtonText] = useState('Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const user_id = session.data?.user.id;
  const host = process.env.NEXT_PUBLIC_HOST;
  const url = '${host}/api/v1/events/tickets/create';

  // event & exhibit ID values
  const exhibitId = CONTRACT_ADDRESSES.exhibitId;
  const eventId = CONTRACT_ADDRESSES.eventId;

  // State hooks for managing component state
  const [status, setStatus] = useState<string>('');
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);
  const [isCountdownOver, setIsCountdownOver] = useState(false);
  const [purchaseFailed, setPurchaseFailed] = useState<boolean>(false);
  const [hasTicket, setHasTicket] = useState(false);
  const exhibit = useExhibit(exhibitId);
  const [isHovering, setIsHovering] = useState(false);

  // Effect hook to check if the user has already purchased a ticket
  useEffect(() => {
    validateTicket(userAddress, eventId, setHasTicket, setButtonType, setButtonText);
  }, [userAddress, eventId]);

  // Effect hook for timeouts
  useEffect(() => {
    if (status) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Check countdown status periodically
  useEffect(() => {
    const checkCountdown = () => {
      const timeLeft = calculateTimeLeft();
      setIsCountdownOver(!timeLeft);
    };

    // Check initially
    checkCountdown();

    // Set up interval to check countdown
    const timer = setInterval(checkCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  // Effect hook to trigger actions post successful ticketPurchase
  useEffect(() => {
    if (purchaseSuccessful) {
      setIsPopupVisible(false);
      setShowSuccessMessage(true);
      setButtonType('secondary');
    }
  }, [purchaseSuccessful]);

  // Effect hook to initialize the Web3 provider when the component mounts or exhibitId changes
  useEffect(() => {
    const ethWindow = window as EthereumWindow;
    if (ethWindow.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(
        ethWindow.ethereum
      );

      web3Provider
        .send('eth_requestAccounts', [])
        .then(() => {
          setProvider(web3Provider);
        })
        .catch((err) => {
          setStatus(`Error connecting to user wallet: ${err.message}`);
        });
    } else {
      setStatus(
        'Please install a Web3 wallet (e.g., Coinbase, MetaMask) to purchase tickets.'
      );
    }
  }, [exhibitId]);

  // Check for exhibitID from query client
  if (!exhibit) {
    return <div>Loading or no Matching Exhibit Found.</div>;
  }

  // set ticket price from object pulled from subgraph
  const ticketPrice = exhibit.exhibitDetails[0]?.ticketPrice || '';
  // Exhibit Details
  //console.log("details:", exhibit);

  // Assign ticekt price  from exhibit object and format to human readable (normal) integers
  const ticketPriceWei = BigInt(ticketPrice);
  const ticketPriceFormatted = ethers.utils.formatUnits(ticketPriceWei, 18);
  const ticketPriceWithToken = `${ticketPriceFormatted} USDT`;


  // function to calculate total price incl. gas fees
  const calculateTotalPrice = () => {
    const ticketPrice = parseFloat(ticketPriceFormatted);
    const gasFees = parseFloat(estimatedGasFees);
    const total = ticketPrice + gasFees;
    return total.toFixed(2);
  };

    // Estimate gas fees function for app. and purchase to display on total tickt amount on purchase component
  const handleEstimateGas = async () => {
    await estimateGasFees(provider, contracts, ticketPrice, eventId, setStatus, setEstimatedGasFees, setIsEstimating);
  };

  // pop up component
  const togglePopup = async () => {
    if (!isPopupVisible) {
      // Estimate gas fees when opening the popup
      await handleEstimateGas();
    }
    setIsPopupVisible(!isPopupVisible);
  };

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  // Function to handle ticket purchase
  const purchaseTicket = async () => {
    if (!provider) {
      setStatus('Web3 provider is not initialized.');
      return;
    }

    try {
      // Contract Init with Modular Approach
      const usdcContract = contracts.getMUSDC();
      const museumContract = contracts.getMuseum();

      // Update states
      setStatus('Approving token transfer...');
      setIsProcessing(true);
      setButtonText('processing...');

      // approve method execution
      const gasLimitApprove = await estimateGas(usdcContract, 'approve', [
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice,
      ]);
      const approveTx = await usdcContract.approve(
        CONTRACT_ADDRESSES.MuseumAdd,
        ticketPrice,
        { gasLimit: gasLimitApprove }
      );
      await approveTx.wait(1);

      // Execute ticket purchase transaction
      setStatus('Purchasing ticket...');
      const gasLimitPurchase = await estimateGas(
        museumContract,
        'purchaseTicket',
        [eventId, ticketPrice]
      );
      const purchaseTx = await museumContract.purchaseTicket(
        eventId,
        ticketPrice,
        { gasLimit: gasLimitPurchase }
      );
      const receipt00: TransactionReceipt = await purchaseTx.wait(2);

      //State update after successful ticket purchase
      setPurchaseSuccessful(true);
      setStatus('Ticket purchased successfully!');

      try {
        // assign user ticket details post successful ticketPurchase
        const walletAddress = receipt00.from;
        const event_Id = '419a0b2d-dee9-4782-9cff-341c5f8343a6';
        const userId = user_id;
        const HOST = process.env.NEXT_PUBLIC_HOST;
        const eventLink = `${HOST}/exhibit`;
        const transactionId = receipt00.transactionHash;

        // prepare object for API call
        const userTicketData = {
          wallet_address: walletAddress,
          event_id: event_Id,
          user_id: userId,
          eventLink: eventLink,
          transaction_id: transactionId,
        };

        const response = await axios.post(
          'api/v1/events/tickets/create',
          userTicketData
        );

        if (response.status === 200) {
          console.log('Ticket created successfully!');
        } else {
          console.error(`Wife and kids have no home:`, response.data.message);
        }
        return response.data;
      } catch (error) {}
      setButtonText('Pay');
    } catch (error: any) {
      console.error('Smart Contract Interaction Failed:', error);
      const friendlyMessage = handleContractError(error as any); // Typecasting
      setStatus(friendlyMessage);
      setButtonText('Pay');
    }
  };

  // Modify the button text and action based on purchase and countdown status
  const getButtonConfig = () => {
    if (purchaseSuccessful) {
      if (isCountdownOver) {
        return {
          text: 'View Exhibit',
          action: () => window.open('https://summitshare.co/exhibit', '_blank'),
          type: 'secondary' as 'secondary',
        };
      }
      return {
        text: 'Ticket Purchased ✓',
        action: () => {},
        type: 'secondary' as 'secondary',
      };
    }
    return {
      text: 'Purchase',
      action: togglePopup,
      type: 'primary' as 'primary',
    };
  };
  const buttonConfig = getButtonConfig();

    // Props for TicketPurchaseUI
    const uiProps = {
      userAddress,
      setHasTicket,
      setButtonType,
      buttonType,
      setButtonText,
      status,
      purchaseSuccessful,
      isCountdownOver,
      showSuccessMessage,
      togglePopup: () => setIsPopupVisible(!isPopupVisible),
      purchaseTicket,
      buttonConfig,
      isVisible,
      isPopupVisible,
      estimatedGasFees,
      isEstimating,
      buttonText,
      isProcessing,
      setIsHovering,
      isHovering,
      closeSuccessMessage,
      hasTicket,
      ticketPriceWithToken,
      calculateTotalPrice,
      ticketPriceFormatted,
      validateTicket,
      // Add more necessary state and functions here
    };

  // Render the Ticket Purchase UI
  return (
<TicketPurchaseUI {...uiProps} />
  );
};
 

export default TicketPurchaseComponent;
