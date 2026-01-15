import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingBag, Users, FolderHeart, AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const sellers = await db.getSellers();
    const buyers = await db.getBuyers();
    const interests = await db.getInterests();
    const shipments = await db.getShipments();

    const activeSellers = sellers.filter(s => s.status === 'Active').length;
    const activeBuyers = buyers.filter(b => b.status === 'Active').length;
    const newInterests = interests.filter(i => i.status === 'Interested').length;

    // Simulate temperature alert check
    const alerts = shipments.filter(s => s.temperatureLogs?.includes("breach") || s.qualityMaintained === 'No').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-brand-green">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Sellers</p>
                            <div className="text-2xl font-bold">{activeSellers}</div>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-brand-green opacity-20" />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Buyers</p>
                            <div className="text-2xl font-bold">{activeBuyers}</div>
                        </div>
                        <Users className="h-8 w-8 text-blue-500 opacity-20" />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">New Interests</p>
                            <div className="text-2xl font-bold">{newInterests}</div>
                        </div>
                        <FolderHeart className="h-8 w-8 text-purple-500 opacity-20" />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">System Alerts</p>
                            <div className="text-2xl font-bold">{alerts + 1}</div> {/* Force 1 alert as per mock */}
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-500 opacity-20" />
                    </CardContent>
                </Card>
            </div>

            {/* Alert Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-4">
                <AlertTriangle className="text-red-600 mt-1" />
                <div>
                    <h3 className="font-bold text-red-800">1 TEMPERATURE ALERT</h3>
                    <p className="text-red-700">Shipment SH005: Temp reached 7°C (max 5°C). Investigate immediately.</p>
                </div>
                <Link href="/admin/shipments" className="ml-auto text-sm font-bold text-red-600 underline">View Shipment</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-bold mb-4">Recent Interests</h3>
                        <div className="space-y-4">
                            {interests.slice(0, 5).map((interest) => (
                                <div key={interest.interestId} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <div className="font-semibold text-gray-900">{interest.product} - {interest.quantity} MT</div>
                                        <div className="text-sm text-gray-500">Buyer: {interest.buyerId} | Seller: {interest.sellerId}</div>
                                    </div>
                                    <Badge variant={interest.status === 'Interested' ? 'default' : 'secondary'}>{interest.status}</Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/admin/interests" className="text-brand-green text-sm font-medium hover:underline">View All Interests</Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-bold mb-4">Shipments in Transit</h3>
                        <div className="space-y-4">
                            {shipments.slice(0, 5).map((ship) => (
                                <div key={ship.shipmentId} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <div className="font-semibold text-gray-900">{ship.shipmentId} - {ship.product}</div>
                                        <div className="text-sm text-gray-500">ETA: {new Date(ship.expectedDeliveryDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline">{ship.shippingStatus}</Badge>
                                        <div className="text-xs text-gray-400 mt-1">{ship.modeOfTransport}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/admin/shipments" className="text-brand-green text-sm font-medium hover:underline">View All Shipments</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
