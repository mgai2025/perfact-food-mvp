import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Interest } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { buyerDetails, sellerId, product, quantity } = body;

        // In a real app, we would look up or create the buyer first if not authenticated.
        // For this MVP flow, the buyer "Fills search form" but their details are not fully captured until they click interest 
        // OR we assume they are a guest and we capture their details in a popup?
        // The PRD says "Buyer clicks I'M INTERESTED -> System saves to Interests sheet".
        // It doesn't explicitly say "Buyer Login". Phase 1 might be open with a contact form on interest?
        // Wait, "Buyer sees popup: Thank you! Our sales team will review".
        // How do we know WHO the buyer is?
        // Item 2 in Buyer Flow: "Fills search form...". It doesn't ask for Name/Email.
        // Item 9 in Sample Data: "Buyer... Unicorn Supply".
        // Implication: Buyers are already in the system or we need to capture their info.
        // I will add a "Guest Buyer" or "Buyer Details" form in the "I'm Interested" popup if they are not logged in.
        // For this MVP, I will auto-assign a Mock Buyer ID (e.g., B001) for demonstration, or ask.
        // I'll simulate "Unicorn Supply Singapore" (B001) is performing the action for the demo video.

        // Create new Interest
        const newInterest: Interest = {
            interestId: `I${Math.floor(Math.random() * 10000)}`,
            buyerId: 'B001', // Hardcoded for demo as per "Buyer clicks..." without login step in prompt
            sellerId: sellerId,
            product: product,
            quantity: quantity,
            dateInterested: new Date().toISOString(),
            status: 'Interested',
            adminNotes: 'Auto-generated interest from web',
        };

        await db.addInterest(newInterest);

        // Create Notification
        await db.addNotification({
            notificationId: `N${Date.now()}`,
            recipientType: 'Admin',
            recipientEmail: 'admin@perfactfood.com',
            eventType: 'New Interest',
            message: `New interest from Buyer B001 for Seller ${sellerId}`,
            relatedId: newInterest.interestId,
            sentDate: new Date().toISOString(),
            status: 'Sent'
        });

        return NextResponse.json({ success: true, interestId: newInterest.interestId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
