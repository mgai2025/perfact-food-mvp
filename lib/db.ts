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
}

const mockDb = new MockDatabase();

// Google Sheets Service
class SheetService {
    private doc: GoogleSpreadsheet | null = null;
    public isInitialized = false;

    async init() {
        if (this.isInitialized) return true;

        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const key = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.SHEET_ID;

        if (!email || !key || !sheetId) {
            console.warn('Google Sheets credentials missing. Using Mock Database.');
            return false;
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
            return true;
        } catch (error) {
            console.error('Failed to connect to Google Sheets:', error);
            return false;
        }
    }

    async getRows<T>(sheetTitle: string): Promise<T[]> {
        if (!this.doc) return [];
        try {
            const sheet = this.doc.sheetsByTitle[sheetTitle];
            if (!sheet) {
                console.warn(`Sheet '${sheetTitle}' not found.`);
                return [];
            }
            const rows = await sheet.getRows();
            return rows.map(row => row.toObject()) as T[];
        } catch (err: any) {
            console.error(`Error fetching rows for ${sheetTitle}:`, err.message);
            return [];
        }
    }

    async addRow(sheetTitle: string, data: any) {
        if (!this.doc) return;
        try {
            const sheet = this.doc.sheetsByTitle[sheetTitle];
            if (sheet) await sheet.addRow(data);
        } catch (err) {
            console.error(`Error adding row to ${sheetTitle}:`, err);
        }
    }
}

const sheetService = new SheetService();

// Helper to handle hybrid fetching
async function fetchOrMock<T>(sheetName: string, mockData: T[]): Promise<T[]> {
    try {
        const connected = await sheetService.init();
        if (connected) {
            const rows = await sheetService.getRows<any>(sheetName);
            if (rows.length === 0) return mockData; // Fallback to mock if sheet is empty (optional decision, but helpful for empty new sheets)

            return rows.map(row => {
                // Quick cleanup of numeric strings and boolean strings
                const obj: any = { ...row };
                // Specific field parsers:
                if (obj.productsOffered && typeof obj.productsOffered === 'string') obj.productsOffered = obj.productsOffered.split(',').map((s: string) => s.trim());
                if (obj.certifications && typeof obj.certifications === 'string') obj.certifications = obj.certifications.split(',').map((s: string) => s.trim());
                if (obj.pricePerUnit) obj.pricePerUnit = Number(obj.pricePerUnit) || 0;
                if (obj.quantity) obj.quantity = Number(obj.quantity) || 0;
                if (obj.budgetPerUnit) obj.budgetPerUnit = Number(obj.budgetPerUnit) || 0;

                // Ensure IDs exist
                // if (!obj.sellerId) ...
                return obj as T;
            });
        }
    } catch (e) {
        console.error("Global Fetch Error:", e);
    }
    return mockData;
}

export const db = {
    getSellers: async () => fetchOrMock('Sellers', mockDb.sellers),

    addSeller: async (seller: Seller) => {
        const connected = await sheetService.init();
        if (connected) {
            // Flatten arrays for sheet
            const row = { ...seller, productsOffered: seller.productsOffered.join(', '), certifications: seller.certifications.join(', ') };
            await sheetService.addRow('Sellers', row);
        } else {
            mockDb.sellers.push(seller);
        }
        return seller;
    },

    getBuyers: async () => fetchOrMock('Buyers', mockDb.buyers),

    getInterests: async () => fetchOrMock('Interests', mockDb.interests),

    addInterest: async (interest: Interest) => {
        const connected = await sheetService.init();
        if (connected) await sheetService.addRow('Interests', interest);
        else mockDb.interests.push(interest);
        return interest;
    },

    getShipments: async () => fetchOrMock('Shipments', mockDb.shipments),

    getQA: async () => fetchOrMock('QualityAssurance', mockDb.qa),

    getNotifications: async () => fetchOrMock('Notifications', mockDb.notifications),

    addNotification: async (notif: Notification) => {
        const connected = await sheetService.init();
        if (connected) await sheetService.addRow('Notifications', notif);
        else mockDb.notifications.push(notif);
        return notif;
    }
};
