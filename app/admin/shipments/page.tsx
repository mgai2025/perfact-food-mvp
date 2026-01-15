import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function ShipmentsPage() {
    const shipments = await db.getShipments();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shipment Tracking</h1>
                <div className="flex space-x-2">
                    <Button variant="outline">Download Report</Button>
                    <Button>New Shipment</Button>
                </div>
            </div>

            <div className="bg-white rounded-md border text-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left">
                            <th className="p-4 font-medium text-gray-500">ID</th>
                            <th className="p-4 font-medium text-gray-500">Route</th>
                            <th className="p-4 font-medium text-gray-500">Product</th>
                            <th className="p-4 font-medium text-gray-500">ETA</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Temp/Quality</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No active shipments</td></tr>
                        ) : shipments.map((s) => (
                            <tr key={s.shipmentId} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-mono text-gray-500">{s.shipmentId}</td>
                                <td className="p-4 text-gray-900">
                                    <div className="text-xs text-gray-400">From</div>
                                    <div>{s.sellerId}</div>
                                    <div className="text-xs text-gray-400">To</div>
                                    <div>{s.buyerId}</div>
                                </td>
                                <td className="p-4 text-gray-600 font-medium">{s.product} ({s.quantity} MT)</td>
                                <td className="p-4 text-gray-600">
                                    <div>{new Date(s.expectedDeliveryDate).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-400">{s.modeOfTransport}</div>
                                </td>
                                <td className="p-4">
                                    <Badge variant={s.shippingStatus === 'Delivered' ? 'success' : 'info'}>
                                        {s.shippingStatus}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    {s.temperatureLogs === 'Ambient' ? (
                                        <span className="text-gray-500">Ambient</span>
                                    ) : (
                                        <div className="text-blue-600 font-bold flex items-center gap-1">
                                            {/* Mock logic for temp display */}
                                            2.5°C
                                        </div>
                                    )}
                                    <div className="text-xs mt-1">
                                        {s.qualityMaintained === 'Yes' ? <span className="text-green-600">✓ Quality OK</span> : <span className="text-red-500">Issues Found</span>}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Button variant="ghost" size="sm">Track</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
