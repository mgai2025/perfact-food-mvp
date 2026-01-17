"use server";

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const HEADERS = {
    'Sellers': ['sellerId', 'companyName', 'contactPerson', 'phone', 'email', 'country', 'region', 'productsOffered', 'productDetails', 'pricePerUnit', 'monthlyCapacity', 'availableQuantity', 'qualityLevel', 'certifications', 'qualityAssuranceProcess', 'coldChainCapability', 'temperatureRange', 'approvalStatus', 'approvedBy', 'approvalDate', 'status', 'notes'],
    'Buyers': ['buyerId', 'companyName', 'contactPerson', 'phone', 'email', 'country', 'city', 'productInterest', 'quantityNeeded', 'budgetPerUnit', 'qualityPreference', 'requiredCertifications', 'specialRequirements', 'deliveryPreference', 'coldChainRequired', 'maxTemperatureAcceptable', 'status', 'firstContactDate', 'lastContactDate', 'assignedSalesRep', 'notes'],
    'Interests': ['interestId', 'buyerId', 'sellerId', 'product', 'quantity', 'budgetRange', 'dateInterested', 'status', 'adminNotes', 'assignedTo'],
    'QualityAssurance': ['qaId', 'shipmentId', 'sellerId', 'product', 'batchDate', 'labTestResults', 'qcPhotos', 'defectRate', 'overallQualityScore', 'approvedForShipment', 'qcInspectorName', 'qcDate', 'notes'],
    'Shipments': ['shipmentId', 'orderId', 'buyerId', 'sellerId', 'product', 'quantity', 'departureDate', 'expectedDeliveryDate', 'actualDeliveryDate', 'modeOfTransport', 'coldChainUsed', 'shippingStatus', 'qualityMaintained', 'temperatureLogs', 'spoilageRate', 'documents', 'assignedLogistics', 'cost', 'notes'],
    'Notifications': ['notificationId', 'recipientType', 'recipientEmail', 'eventType', 'message', 'relatedId', 'sentDate', 'status']
};

export async function initializeDatabase() {
    try {
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const key = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.SHEET_ID;

        if (!email || !key || !sheetId) {
            return { success: false, error: 'Missing Credentials in Environment Variables' };
        }

        const jwt = new JWT({
            email,
            key: key.includes('\\n') ? key.replace(/\\n/g, '\n') : key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(sheetId, jwt);
        await doc.loadInfo();

        const results = [];

        for (const [title, headers] of Object.entries(HEADERS)) {
            let sheet = doc.sheetsByTitle[title];
            if (!sheet) {
                try {
                    sheet = await doc.addSheet({ title, headerValues: headers });
                    results.push({ sheet: title, status: 'Created' });
                } catch (e: any) {
                    results.push({ sheet: title, status: 'Error creating: ' + e.message });
                }
            } else {
                try {
                    await sheet.loadHeaderRow();
                    await sheet.setHeaderRow(headers);
                    results.push({ sheet: title, status: 'Headers Updated' });
                } catch (e: any) {
                    results.push({ sheet: title, status: 'Error updating headers: ' + e.message });
                }
            }
        }

        return { success: true, results };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
