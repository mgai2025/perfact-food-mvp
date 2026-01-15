import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Seller, Buyer, Interest, QualityAssurance, Shipment, Notification } from './types';
import { INITIAL_SELLERS, INITIAL_BUYERS, INITIAL_INTERESTS, INITIAL_SHIPMENTS, INITIAL_QA, INITIAL_NOTIFICATIONS } from './data';

// In-memory store for MVP demo without credentials
class MockDatabase {
    sellers: Seller[] = [...INITIAL_SELLERS];
    buyers: Buyer[] = [...INITIAL_BUYERS];
    interests: Interest[] = [...INITIAL_INTERESTS];
    shipments: Shipment[] = [...INITIAL_SHIPMENTS];
    qa: QualityAssurance[] = [...INITIAL_QA];
    notifications: Notification[] = [...INITIAL_NOTIFICATIONS];

    constructor() {
        console.log('MockDatabase initialized with seed data.');
    }
}

const mockDb = new MockDatabase();

// Google Sheets Service
class SheetService {
    private doc: GoogleSpreadsheet | null = null;
    private isInitialized = false;

    async init() {
        if (this.isInitialized) return;

        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const key = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.SHEET_ID;

        if (!email || !key || !sheetId) {
            console.warn('Google Sheets credentials missing. Using Mock Database.');
            return;
        }

        try {
            const jwt = new JWT({
                email,
                key: key.replace(/\\n/g, '\n'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            this.doc = new GoogleSpreadsheet(sheetId, jwt);
            await this.doc.loadInfo();
            this.isInitialized = true;
            console.log('Connected to Google Sheets');
        } catch (error) {
            console.error('Failed to connect to Google Sheets:', error);
        }
    }

    // Generic methods would go here, mapping arrays to sheets
    // For this MVP, we will abstract the CRUD operations
}

export const db = {
    getSellers: async () => {
        // In a real app, we would fetch from sheets here
        return mockDb.sellers;
    },
    addSeller: async (seller: Seller) => {
        mockDb.sellers.push(seller);
        return seller;
    },
    // ... implement other methods
    getBuyers: async () => mockDb.buyers,
    getInterests: async () => mockDb.interests,
    addInterest: async (interest: Interest) => {
        mockDb.interests.push(interest);
        return interest;
    },
    getShipments: async () => mockDb.shipments,
    getQA: async () => mockDb.qa,
    getNotifications: async () => mockDb.notifications,
    addNotification: async (notif: Notification) => {
        mockDb.notifications.push(notif);
        return notif;
    }
};
