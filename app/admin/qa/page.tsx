import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function QualityAssurancePage() {
    const qaRecords = await db.getQA();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quality Assurance</h1>
                <Button>New Inspection</Button>
            </div>

            <div className="bg-white rounded-md border text-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left">
                            <th className="p-4 font-medium text-gray-500">QA ID</th>
                            <th className="p-4 font-medium text-gray-500">Related Shipment</th>
                            <th className="p-4 font-medium text-gray-500">Product</th>
                            <th className="p-4 font-medium text-gray-500">Lab Results</th>
                            <th className="p-4 font-medium text-gray-500">Score</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Inspector</th>
                        </tr>
                    </thead>
                    <tbody>
                        {qaRecords.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No QA records found</td></tr>
                        ) : qaRecords.map((qa) => (
                            <tr key={qa.qaId} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-mono text-gray-500">{qa.qaId}</td>
                                <td className="p-4 text-blue-500 hover:underline">{qa.shipmentId}</td>
                                <td className="p-4 text-gray-900">{qa.product}</td>
                                <td className="p-4 text-gray-600 text-xs max-w-xs">{qa.labTestResults}</td>
                                <td className="p-4 font-bold text-lg">
                                    {qa.overallQualityScore >= 8 ? <span className="text-green-600">{qa.overallQualityScore}</span> : <span className="text-yellow-600">{qa.overallQualityScore}</span>}
                                    <span className="text-gray-400 text-sm font-normal">/10</span>
                                </td>
                                <td className="p-4">
                                    <Badge variant={qa.approvedForShipment ? 'success' : 'destructive'}>
                                        {qa.approvedForShipment ? 'Approved' : 'Rejected'}
                                    </Badge>
                                </td>
                                <td className="p-4 text-gray-600">
                                    <div>{qa.qcInspectorName}</div>
                                    <div className="text-xs text-gray-400">{new Date(qa.qcDate).toLocaleDateString()}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
