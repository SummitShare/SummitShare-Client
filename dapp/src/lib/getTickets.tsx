'use client';
import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

interface Ticket {
  buyer: string;
}

interface TicketQueryResponse {
  tickets: Ticket[];
}

const TICKET_COUNT_QUERY = gql`
  query GetTickets {
    tickets {
      buyer
    }
  }
`;

const useTicketCount = () => {
  const [ticketCount, setTicketCount] = useState<number>(0);

  const { data } = useQuery<TicketQueryResponse>(TICKET_COUNT_QUERY, {
    pollInterval: 3600000, //  polls every hour 
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (data && data.tickets) {
      setTicketCount(data.tickets.length);
    }
  }, [data]);

  return ticketCount;
};

export default useTicketCount;

/*
 * Usage:
 *
 * import useTicketCount from './useTicketCount';
 *
 * function MyComponent() {
 *   const ticketCount = useTicketCount();
 *   
 *   return (
 *     <div className="text-6xl font-bold">{ticketCount}</div>
 *   );
 * }
 */