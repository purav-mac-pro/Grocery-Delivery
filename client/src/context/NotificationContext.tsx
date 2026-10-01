import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

import api from "../config/api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import type { Notification } from "../types";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

const NotificationContext =
    createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { user, loading: authLoading } = useAuth();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const initialized = useRef(false);
    const knownNotificationIds = useRef<Set<string>>(new Set());

    const refreshNotifications = async () => {
        if (!user) return;

        try {
            const { data } = await api.get("/notifications");

            const incoming: Notification[] = data.notifications || [];

            // First request:
            // store existing notifications without showing old ones as toast.
            if (!initialized.current) {
                incoming.forEach((notification) => {
                    knownNotificationIds.current.add(notification.id);
                });

                initialized.current = true;
            } else {
                // Find notifications that weren't present before.
                const newNotifications = incoming.filter(
                    (notification) =>
                        !knownNotificationIds.current.has(notification.id)
                );

                newNotifications.forEach((notification) => {
                    knownNotificationIds.current.add(notification.id);

                    toast(notification.message, {
                        icon: "🔔",
                        duration: 5000,
                    });
                });
            }

            setNotifications(incoming);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error
            );
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setNotifications([]);
            setUnreadCount(0);

            initialized.current = false;
            knownNotificationIds.current.clear();

            return;
        }

        refreshNotifications();

        const interval = setInterval(() => {
            refreshNotifications();
        }, 5000);

        return () => clearInterval(interval);
    }, [user, authLoading]);

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setUnreadCount((prev) =>
                Math.max(0, prev - 1)
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Failed to mark notifications as read:",
                error
            );
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                refreshNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used within NotificationProvider"
        );
    }

    return context;
}