import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getNotifications = async (
    req: Request,
    res: Response
) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: req.user!.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 50,
        });

        const unreadCount = await prisma.notification.count({
            where: {
                userId: req.user!.id,
                isRead: false,
            },
        });

        res.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            message: "Failed to fetch notifications",
        });
    }
};

export const markNotificationAsRead = async (
    req: Request,
    res: Response
) => {
    try {
        const notification = await prisma.notification.updateMany({
            where: {
                id: req.params.id as string,
                userId: req.user!.id,
            },
            data: {
                isRead: true,
            },
        });

        if (notification.count === 0) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        res.json({
            message: "Notification marked as read",
        });
    } catch (error) {
        console.error("Mark notification read error:", error);

        res.status(500).json({
            message: "Failed to update notification",
        });
    }
};

export const markAllNotificationsAsRead = async (
    req: Request,
    res: Response
) => {
    try {
        await prisma.notification.updateMany({
            where: {
                userId: req.user!.id,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        res.json({
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("Mark all notifications read error:", error);

        res.status(500).json({
            message: "Failed to update notifications",
        });
    }
};