import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function BuyersPage() {
    const buyers = await db.getBuyers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Buyers Directory</h1>
                <Button>Add Buyer</Button>
            </div>

            <div className="bg-white rounded-md border text-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left">
                            <th className="p-4 font-medium text-gray-500">ID</th>
                            <th className="p-4 font-medium text-gray-500">Company</th>
                            <th className="p-4 font-medium text-gray-500">Location</th>
                            <th className="p-4 font-medium text-gray-500">Interest</th>
                            <th className="p-4 font-medium text-gray-500">Needs</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyers.map((buyer) => (
                            <tr key={buyer.buyerId} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-mono text-gray-500">{buyer.buyerId}</td>
                                <td className="p-4 font-medium text-gray-900">
                                    <div>{buyer.companyName}</div>
                                    <div className="text-xs text-gray-400">{buyer.contactPerson}</div>
                                </td>
                                <td className="p-4 text-gray-600">{buyer.city}, {buyer.country}</td>
                                <td className="p-4 text-gray-600">{buyer.productInterest}</td>
                                <td className="p-4 text-gray-600">
                                    {buyer.quantityNeeded} MT
                                    <div className="text-xs text-brand-green">${buyer.budgetPerUnit}/MT</div>
                                </td>
                                <td className="p-4">
                                    <Badge variant={buyer.status === 'Active' ? 'success' : 'secondary'}>
                                        {buyer.status}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
