import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';

export async function POST(req: Request, res: NextResponse) {
   try {
      const { userAddress, eventId, user_id } = await req.json();

      // Log incoming data
      console.log('Received data:', { userAddress, eventId, user_id });

      if (!userAddress) {
         return NextResponse.json(
            { message: 'no wallet address sent' },
            { status: 400 }
         );
      }
      if (!eventId) {
         return NextResponse.json(
            { message: 'no event id sent' },
            { status: 400 }
         );
      }
      if (!user_id) {
         return NextResponse.json(
            { message: 'no user_id sent' },
            { status: 400 }
         );
      }

      const ticket = await prisma.tickets.findFirst({
         where: {
            wallet_address: userAddress,
            event_id: eventId,
            user_id,
         },
      });

      if (!ticket) {
         return NextResponse.json(
            { message: 'no tickets found' },
            { status: 401 }
         );
      }

      return NextResponse.json({ message: 'ticket validated' }, { status: 200 });
   } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
   }
}
