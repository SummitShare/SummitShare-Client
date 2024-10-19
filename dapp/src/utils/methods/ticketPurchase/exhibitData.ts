import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import useExhibit from '@/lib/useGetExhibitById'; // Your subgraph query hook
import { CONTRACT_ADDRESSES } from '@/utils/dev/contractInit';
import { estimateGasFees } from './gasEstimator';

const ExhibitComponent = () => {
  // Hardcoded exhibit ID for demo
  const exhibitId = CONTRACT_ADDRESSES.exhibitId;
  const eventId = CONTRACT_ADDRESSES.eventId;

  // State for formatted ticket price and total price
  const [ticketPriceFormatted, setTicketPriceFormatted] = useState<string>('');
  const [estimatedGasFees, setEstimatedGasFees] = useState<string>('0');
  const [totalPrice, setTotalPrice] = useState<string>('0');

  // Fetch exhibit data using the exhibit ID
  const exhibit = useExhibit(exhibitId);

  // Format the ticket price once exhibit data is available
  useEffect(() => {
    if (exhibit && exhibit.exhibitDetails[0]?.ticketPrice) {
      const ticketPriceWei = exhibit.exhibitDetails[0].ticketPrice;
      const formattedPrice = ethers.utils.formatUnits(ticketPriceWei, 18); // Assuming 18 decimals for USDT
      setTicketPriceFormatted(formattedPrice);
    }
  }, [exhibit]);

  // Calculate the total price including gas fees
  useEffect(() => {
    if (ticketPriceFormatted && estimatedGasFees) {
      const ticketPrice = parseFloat(ticketPriceFormatted);
      const gasFees = parseFloat(estimatedGasFees);
      const total = ticketPrice + gasFees;
      setTotalPrice(total.toFixed(2)); // Format to 2 decimal places
    }
  }, [ticketPriceFormatted, estimatedGasFees]);

  // Ticket price and total price are now available to be used in other components
  return null; // Not rendering anything, just assigning values
};

export default ExhibitComponent;
