import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <nav className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Perfact<span className="text-brand-green">Food</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-brand-green">Marketplace</Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-brand-green">How it Works</Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-brand-green">About Us</Link>
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/api/auth/signin">
                    <Button variant="outline" size="sm">Admin Login</Button>
                </Link>
                <Button size="sm">Get Started</Button>
            </div>
        </nav>
    );
}
