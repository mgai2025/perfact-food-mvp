import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            redirect("/api/auth/signin");
        }

        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 ml-64 p-8">
                    {children}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Auth Session Error:", error);
        // Fallback to signin if session check errors out
        redirect("/api/auth/signin");
    }
}
