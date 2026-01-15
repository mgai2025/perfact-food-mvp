const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// This script initializes the 6 required sheets in a new Google Sheet
// Usage: node setup-sheets.js <SHEET_ID> <SERVICE_ACCOUNT_EMAIL> <PRIVATE_KEY>
// Or set env vars

const SHEET_TITLES = ['Sellers', 'Buyers', 'Interests', 'QualityAssurance', 'Shipments', 'Notifications'];

const HEADERS = {
    'Sellers': ['SellerID', 'CompanyName', 'ContactPerson', 'Phone', 'Email', 'Country', 'Region', 'ProductsOffered', 'ProductDetails', 'PricePerUnit', 'MonthlyCapacity', 'AvailableQuantity', 'QualityLevel', 'Certifications', 'QualityAssuranceProcess', 'ColdChainCapability', 'TemperatureRange', 'ApprovalStatus', 'ApprovedBy', 'ApprovalDate', 'Status', 'Notes'],
    'Buyers': ['BuyerID', 'CompanyName', 'ContactPerson', 'Phone', 'Email', 'Country', 'City', 'ProductInterest', 'QuantityNeeded', 'BudgetPerUnit', 'QualityPreference', 'RequiredCertifications', 'SpecialRequirements', 'DeliveryPreference', 'ColdChainRequired', 'MaxTemperatureAcceptable', 'Status', 'FirstContactDate', 'LastContactDate', 'AssignedSalesRep', 'Notes'],
    'Interests': ['InterestID', 'BuyerID', 'SellerID', 'Product', 'Quantity', 'BudgetRange', 'DateInterested', 'Status', 'AdminNotes', 'AssignedTo'],
    'QualityAssurance': ['QAID', 'ShipmentID', 'SellerID', 'Product', 'BatchDate', 'LabTestResults', 'QCPhotos', 'DefectRate', 'OverallQualityScore', 'ApprovedForShipment', 'QCInspectorName', 'QCDate', 'Notes'],
    'Shipments': ['ShipmentID', 'OrderID', 'BuyerID', 'SellerID', 'Product', 'Quantity', 'DepartureDate', 'ExpectedDeliveryDate', 'ActualDeliveryDate', 'ModeOfTransport', 'ColdChainUsed', 'ShippingStatus', 'QualityMaintained', 'TemperatureLogs', 'SpoilageRate', 'Documents', 'AssignedLogistics', 'Cost', 'Notes'],
    'Notifications': ['NotificationID', 'RecipientType', 'RecipientEmail', 'EventType', 'Message', 'RelatedID', 'SentDate', 'Status']
};

async function setup() {
    const sheetId = process.env.SHEET_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !email || !key) {
        console.error('Missing credentials. Please set SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY.');
        process.exit(1);
    }

    const jwt = new JWT({
        email,
        key: key.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, jwt);
    await doc.loadInfo();
    console.log(`Connected to spreadsheet: ${doc.title}`);

    for (const title of SHEET_TITLES) {
        let sheet = doc.sheetsByTitle[title];
        if (!sheet) {
            console.log(`Creating sheet: ${title}`);
            sheet = await doc.addSheet({ title });
        } else {
            console.log(`Sheet exists: ${title}`);
        }

        await sheet.setHeaderRow(HEADERS[title]);
        console.log(`Set headers for ${title}`);
    }

    console.log('All sheets initialized successfully.');
}

setup().catch(console.error);
