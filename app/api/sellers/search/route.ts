import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Seller } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product');
    const quantity = Number(searchParams.get('quantity')) || 0;
    const budget = Number(searchParams.get('budget')) || Infinity;
    const quality = searchParams.get('quality');

    const allSellers = await db.getSellers();

    const filtered = allSellers.filter((seller) => {
        // Basic filtering logic
        if (seller.status !== 'Active' || seller.approvalStatus !== 'Approved') return false;

        if (product && !seller.productsOffered.some(p => p.toLowerCase().includes(product.toLowerCase()))) return false;

        // Check if seller has enough capacity (optional logic, for now assume capacity check is loose or based on monthlyCapacity)
        // if (seller.availableQuantity < quantity) return false; 

        if (seller.pricePerUnit > budget) return false;

        // Quality check - if buyer wants Premium, seller must be Premium (simplified)
        if (quality && seller.qualityLevel !== quality) {
            // Maybe allow Premium to satisfy Standard requests?
            if (quality === 'Standard' && seller.qualityLevel === 'Premium') {
                // allow
            } else {
                return false;
            }
        }

        return true;
    });

    // Mask the data
    const masked = filtered.map(s => ({
        sellerId: s.sellerId,
        productDetails: s.productDetails,
        pricePerUnit: s.pricePerUnit,
        qualityLevel: s.qualityLevel,
        certifications: s.certifications,
        productsOffered: s.productsOffered,
        availableQuantity: s.availableQuantity,
        coldChainCapability: s.coldChainCapability
        // No company name, email, phone
    }));

    return NextResponse.json(masked);
}
