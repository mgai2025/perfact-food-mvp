import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function InterestsPage() {
    const interests = await db.getInterests();
    // We might want to joint buyer/seller data here, but for now just showing IDs is okay or we fetch all.
    // In a real app we'd map it. Let's do a quick map if possible.
    const buyers = await db.getBuyers();
    const sellers = await db.getSellers();

    const getBuyerName = (id: string) => buyers.find(b => b.buyerId === id)?.companyName || id;
    const getSellerName = (id: string) => sellers.find(s => s.sellerId === id)?.companyName || id;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Interest Management</h1>
            </div>

            <div className="bg-white rounded-md border text-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left">
                            <th className="p-4 font-medium text-gray-500">ID</th>
                            <th className="p-4 font-medium text-gray-500">Buyer</th>
                            <th className="p-4 font-medium text-gray-500">Seller</th>
                            <th className="p-4 font-medium text-gray-500">Product</th>
                            <th className="p-4 font-medium text-gray-500">Date</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interests.map((interest) => (
                            <tr key={interest.interestId} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-mono text-gray-500">{interest.interestId}</td>
                                <td className="p-4 font-medium text-gray-900">
                                    <div>{getBuyerName(interest.buyerId)}</div>
                                    <div className="text-xs text-blue-500 hover:underline cursor-pointer">{interest.buyerId}</div>
                                </td>
                                <td className="p-4 text-gray-600">
                                    <div>{getSellerName(interest.sellerId)}</div>
                                    <div className="text-xs text-gray-400">{interest.sellerId}</div>
                                </td>
                                <td className="p-4 text-gray-600 font-medium">{interest.product} - {interest.quantity} MT</td>
                                <td className="p-4 text-gray-500">{new Date(interest.dateInterested).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <Badge variant={interest.status === 'Interested' ? 'warning' : 'default'}>
                                        {interest.status}
                                    </Badge>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <Button variant="outline" size="sm">Contact</Button>
                                    <Button variant="ghost" size="sm">View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
