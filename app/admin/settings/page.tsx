"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Check, Database, Loader2 } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleInit = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/admin/init-db', { method: 'POST' });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            setResult({ success: false, error: "Network Error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
            </div>

            <Card>
                <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Database className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Google Sheets Database Connection</h3>
                            <p className="text-gray-500 mb-4">
                                Initialize or repair the connection to your Google Sheet. This action will:
                                <ul className="list-disc ml-5 mt-2 space-y-1">
                                    <li>Check if all 6 required sheets exist.</li>
                                    <li>Create missing sheets (Sellers, Buyers, etc).</li>
                                    <li>Set the correct column headers (SellerID, etc) in Row 1.</li>
                                </ul>
                            </p>

                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6 text-sm text-yellow-800 flex gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5" />
                                <div>
                                    <strong>Warning:</strong> Ensure your Vercel Environment Variables (SHEET_ID, etc.) are set correctly before running this.
                                </div>
                            </div>

                            <Button onClick={handleInit} disabled={loading} size="lg">
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {loading ? "Initializing..." : "Initialize Database Headers"}
                            </Button>

                            {result && (
                                <div className={`mt-6 p-4 rounded-lg border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                                    <div className="flex items-center gap-2 font-bold mb-2">
                                        {result.success ? <Check className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                                        {result.success ? "Success" : "Error"}
                                    </div>
                                    {result.error && <p className="text-red-700">{result.error}</p>}
                                    {result.results && (
                                        <ul className="text-sm space-y-1 text-gray-700">
                                            {result.results.map((r: any, i: number) => (
                                                <li key={i} className="flex justify-between">
                                                    <span>{r.sheet}:</span>
                                                    <span className="font-mono">{r.status}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-400 mt-12">
                Perfact Food MVP v1.0.0
            </div>
        </div>
    );
}
