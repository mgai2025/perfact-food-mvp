import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function SellersPage() {
    const sellers = await db.getSellers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sellers Directory</h1>
                <Button>Add Seller</Button>
            </div>

            <div className="bg-white rounded-md border text-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left">
                            <th className="p-4 font-medium text-gray-500">ID</th>
                            <th className="p-4 font-medium text-gray-500">Company</th>
                            <th className="p-4 font-medium text-gray-500">Region</th>
                            <th className="p-4 font-medium text-gray-500">Products</th>
                            <th className="p-4 font-medium text-gray-500">Certifications</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellers.map((seller) => (
                            <tr key={seller.sellerId} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-mono text-gray-500">{seller.sellerId}</td>
                                <td className="p-4 font-medium text-gray-900">
                                    <div>{seller.companyName}</div>
                                    <div className="text-xs text-gray-400">{seller.contactPerson}</div>
                                </td>
                                <td className="p-4 text-gray-600">{seller.region}, {seller.country}</td>
                                <td className="p-4 text-gray-600 max-w-xs truncate">{seller.productsOffered.join(', ')}</td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {seller.certifications.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge variant={seller.approvalStatus === 'Approved' ? 'default' : 'secondary'}>
                                        {seller.approvalStatus}
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
