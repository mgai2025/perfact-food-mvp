"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, Truck, Thermometer, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/input"; // Using the export from input.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BuyerFlow() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        product: "Rice",
        quantity: "",
        budget: "",
        quality: "Premium",
        certifications: [] as string[],
        specialReqs: [] as string[],
    });

    const handleSearch = async () => {
        setLoading(true);
        // Simulate network delay for effect
        setTimeout(async () => {
            try {
                const params = new URLSearchParams();
                params.append("product", formData.product);
                params.append("quantity", formData.quantity);
                params.append("budget", formData.budget);
                params.append("quality", formData.quality);

                const res = await fetch(`/api/sellers/search?${params.toString()}`);
                const data = await res.json();
                setResults(data);
                setStep(2);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, 1000); // 1s visual delay
    };

    const handleInterest = async (sellerId: string) => {
        const res = await fetch('/api/interests', {
            method: 'POST',
            body: JSON.stringify({
                sellerId,
                product: formData.product,
                quantity: Number(formData.quantity)
            })
        });
        if (res.ok) {
            alert("Interest Registered! Our team will contact you shortly.");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            {step === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                            Find Certified <span className="text-brand-green">Indian Suppliers</span>
                        </h1>
                        <p className="text-lg text-gray-600">
                            Directly connect with verified agricultural exporters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">What product do you need? *</label>
                            <Select
                                value={formData.product}
                                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                            >
                                <option value="Rice">Rice</option>
                                <option value="Produce">Fresh Produce</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Tea">Tea</option>
                                <option value="Spices">Spices</option>
                                <option value="Fruits">Fruits</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Quantity (MT/month) *</label>
                            <Input
                                type="number"
                                placeholder="e.g. 500"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Max Price per Unit (USD) *</label>
                            <Input
                                type="number"
                                placeholder="e.g. 500"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Quality Level *</label>
                            <Select
                                value={formData.quality}
                                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                            >
                                <option value="Premium">Premium</option>
                                <option value="Standard">Standard</option>
                                <option value="Institutional">Institutional</option>
                            </Select>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Required Certifications</label>
                        <div className="flex flex-wrap gap-3">
                            {['GAP', 'ISO', 'Organic', 'GLOBALGAP', 'APEDA'].map((cert) => (
                                <button
                                    key={cert}
                                    onClick={() => {
                                        const newCerts = formData.certifications.includes(cert)
                                            ? formData.certifications.filter(c => c !== cert)
                                            : [...formData.certifications, cert];
                                        setFormData({ ...formData, certifications: newCerts });
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${formData.certifications.includes(cert)
                                            ? "bg-brand-green text-white border-brand-green"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-brand-green"
                                        }`}
                                >
                                    {formData.certifications.includes(cert) && <Check className="w-3 h-3 inline mr-1" />}
                                    {cert}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 text-lg bg-brand-green hover:bg-green-700 shadow-lg shadow-green-200"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "FIND SUPPLIERS"}
                    </Button>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Matches Found ({results.length})</h2>
                        <Button variant="outline" onClick={() => setStep(1)}>Modify Search</Button>
                    </div>

                    {results.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No suppliers found matching your strict criteria.</p>
                            <Button variant="link" onClick={() => setStep(1)} className="mt-2">Try adjusting your filters</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {results.map((seller) => (
                                <Card key={seller.sellerId} className="hover:shadow-lg transition-shadow border-l-4 border-l-brand-green">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">Supplier {seller.sellerId}</h3>
                                                    {seller.qualityLevel === 'Premium' && <Badge variant="default">Premium Quality</Badge>}
                                                    {seller.coldChainCapability && <Badge variant="secondary" className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> Cold Chain Ready</Badge>}
                                                </div>
                                                <p className="text-gray-600 mb-2">{seller.productDetails}</p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {seller.certifications.map((c: string) => (
                                                        <Badge key={c} variant="outline" className="bg-gray-50 text-gray-600">{c}</Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end min-w-[200px] gap-2">
                                                <div className="text-right">
                                                    <span className="text-3xl font-bold text-brand-green">${seller.pricePerUnit}</span>
                                                    <span className="text-gray-500 text-sm"> / MT</span>
                                                </div>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    Approx. {seller.availableQuantity} MT Available
                                                </div>
                                                <Button onClick={() => handleInterest(seller.sellerId)} className="w-full">
                                                    I'M INTERESTED
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
