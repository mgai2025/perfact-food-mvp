"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, FolderHeart, Truck, Activity, Bell, FileText, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/interests", label: "Interests", icon: FolderHeart },
    { href: "/admin/shipments", label: "Shipments", icon: Truck },
    { href: "/admin/qa", label: "Quality Assurance", icon: Activity },
    { href: "/admin/sellers", label: "Sellers", icon: ShoppingBag },
    { href: "/admin/buyers", label: "Buyers", icon: Users },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/reports", label: "Reports", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 text-white">
            <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Perfact<span className="text-brand-green">Food</span></span>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}>
                            <div className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                active ? "bg-green-50 text-brand-green" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}>
                                <Icon className={cn("w-5 h-5", active ? "text-brand-green" : "text-gray-400")} />
                                <span>{link.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100">
                <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-red-500 w-full text-sm font-medium">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
