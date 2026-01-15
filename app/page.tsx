import Navbar from "@/components/Navbar";
import BuyerFlow from "@/components/BuyerFlow";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 to-white">
            <Navbar />
            <BuyerFlow />
        </main>
    );
}
