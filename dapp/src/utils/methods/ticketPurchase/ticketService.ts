// ticketService.ts

import axios from 'axios';

export const validateTicket = async (
  userAddress: string | undefined,
  eventId: string,
  setHasTicket: React.Dispatch<React.SetStateAction<boolean>>,
  setButtonType: React.Dispatch<React.SetStateAction<"primary" | "secondary" | "tartary" | "subTartary">>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  // Early return if no userAddress
  if (!userAddress) {
    setHasTicket(false);
    setButtonText('Connect Wallet');
    return;
  }

  try {
    const response = await axios.post('/api/validateTicket', {
      userAddress,
      eventId,
    });
    if (response.data.hasTicket) {
      setHasTicket(true);
      setButtonType('secondary'); // Valid value
      setButtonText('View Exhibit');
    } else {
      // Handle case where user doesn't have a ticket
      setHasTicket(false);
      setButtonType('primary'); // Valid value
      setButtonText('Purchase Ticket');
    }
  } catch (error) {
    console.error('Error validating ticket:', error);
    // Handle error state
    setHasTicket(false);
    setButtonType('primary'); // Valid value
    setButtonText('Purchase Ticket');
  }
};
