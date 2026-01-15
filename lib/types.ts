export interface Seller {
    sellerId: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    country: string;
    region: string;
    productsOffered: string[]; // multi-select
    productDetails: string;
    pricePerUnit: number;
    monthlyCapacity: number;
    availableQuantity: number;
    qualityLevel: 'Premium' | 'Standard' | 'Institutional';
    certifications: string[];
    qualityAssuranceProcess: string;
    coldChainCapability: boolean;
    temperatureRange: string;
    approvalStatus: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    approvalDate?: string;
    status: 'Active' | 'Inactive';
    notes?: string;
}

export interface Buyer {
    buyerId: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    productInterest: string; // dropdown
    quantityNeeded: number;
    budgetPerUnit: number;
    qualityPreference: 'Premium' | 'Standard' | 'Institutional';
    requiredCertifications: string[];
    specialRequirements?: string;
    deliveryPreference: 'FOB' | 'CIF' | 'DDP';
    coldChainRequired: boolean;
    maxTemperatureAcceptable?: number;
    status: 'Active' | 'Contacted' | 'Negotiating' | 'Won';
    firstContactDate: string;
    lastContactDate?: string;
    assignedSalesRep?: string;
    notes?: string;
}

export interface Interest {
    interestId: string;
    buyerId: string;
    sellerId: string;
    product: string;
    quantity: number;
    budgetRange?: string;
    dateInterested: string;
    status: 'Interested' | 'Under Review' | 'Contacted' | 'Negotiating' | 'Quote Sent' | 'Won' | 'Lost';
    adminNotes?: string;
    assignedTo?: string;
}

export interface QualityAssurance {
    qaId: string;
    shipmentId: string;
    sellerId: string;
    product: string;
    batchDate: string;
    labTestResults: string;
    qcPhotos: string[]; // URLs
    defectRate: number;
    overallQualityScore: number; // 1-10
    approvedForShipment: boolean;
    qcInspectorName: string;
    qcDate: string;
    notes?: string;
}

export interface Shipment {
    shipmentId: string;
    orderId: string; // Interest ID primarily
    buyerId: string;
    sellerId: string;
    product: string;
    quantity: number;
    departureDate: string;
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    modeOfTransport: 'Air' | 'Sea' | 'Road' | 'Multi-modal';
    coldChainUsed: boolean;
    shippingStatus: 'Preparing' | 'In Transit' | 'In Port' | 'Delivered' | 'Received';
    qualityMaintained: 'Yes' | 'No' | 'Minor Issues';
    temperatureLogs: string;
    spoilageRate?: number;
    documents?: string[];
    assignedLogistics?: string;
    cost?: number;
    notes?: string;
}

export interface Notification {
    notificationId: string;
    recipientType: 'Admin' | 'Sales Team' | 'Seller' | 'Buyer';
    recipientEmail: string;
    eventType: 'New Interest' | 'Admin Approval' | 'Shipment Shipped' | 'Temperature Alert' | 'Delivery Confirmation';
    message: string;
    relatedId?: string;
    sentDate: string;
    status: 'Sent' | 'Opened' | 'Clicked';
}
