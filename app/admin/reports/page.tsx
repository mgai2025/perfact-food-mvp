import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    const sellers = await db.getSellers();
    const interests = await db.getInterests();
    const qa = await db.getQA();

    const totalInterests = interests.length;
    const wonInterests = interests.filter(i => i.status === 'Won').length;
    const conversionRate = totalInterests ? Math.round((wonInterests / totalInterests) * 100) : 0;

    const avgQuality = qa.length ? (qa.reduce((acc, q) => acc + q.overallQualityScore, 0) / qa.length).toFixed(1) : "N/A";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Performance Reports</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-gray-500 font-medium mb-2">Conversion Rate</h3>
                        <div className="text-4xl font-bold text-brand-green">{conversionRate}%</div>
                        <p className="text-sm text-gray-400 mt-2">{wonInterests} deals won out of {totalInterests} interests</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-gray-500 font-medium mb-2">Avg Quality Score</h3>
                        <div className="text-4xl font-bold text-blue-600">{avgQuality}</div>
                        <p className="text-sm text-gray-400 mt-2">Across all shipments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-gray-500 font-medium mb-2">Seller Network</h3>
                        <div className="text-4xl font-bold text-purple-600">{sellers.length}</div>
                        <p className="text-sm text-gray-400 mt-2">Active verified suppliers</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white p-8 rounded-lg border text-center text-gray-400 italic">
                More detailed analytics charts (latency, regional heatmaps) would go here in Phase 2.
            </div>
        </div>
    );
}
