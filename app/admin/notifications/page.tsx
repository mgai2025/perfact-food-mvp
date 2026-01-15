import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const notifications = await db.getNotifications();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
            </div>

            <div className="bg-white rounded-md border text-sm">
                <div className="p-4 border-b bg-gray-50 font-medium text-gray-500">Recent Alerts & Messages</div>

                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <Bell className="w-8 h-8 text-gray-300 mb-2" />
                        No notifications yet
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notif) => (
                            <div key={notif.notificationId} className="p-4 flex items-start gap-4 hover:bg-gray-50">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.eventType === 'Temperature Alert' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-gray-900">{notif.eventType}</span>
                                        <span className="text-xs text-gray-400">{new Date(notif.sentDate).toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-600 mt-1">{notif.message}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{notif.recipientType}</Badge>
                                        <span className="text-xs text-brand-green">{notif.recipientEmail}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
