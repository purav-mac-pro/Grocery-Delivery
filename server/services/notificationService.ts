import { prisma } from "../config/prisma.js";

const getNotificationContent = (status: string) => {
    switch (status) {
        case "Placed":
            return {
                title: "Order placed ",
                message: "Your order has been placed successfully.",
            };

        case "Assigned":
            return {
                title: "Delivery partner assigned ",
                message: "A delivery partner has been assigned to your order.",
            };

        case "Packed":
            return {
                title: "Order packed ",
                message: "Your order has been packed and is ready for delivery.",
            };

        case "Out for Delivery":
            return {
                title: "Out for delivery ",
                message: "Your order is on the way.",
            };

        case "Delivered":
            return {
                title: "Order delivered ",
                message: "Your order has been delivered successfully.",
            };

        case "Cancelled":
            return {
                title: "Order cancelled ",
                message: "Your order has been cancelled.",
            };

        default:
            return {
                title: "Order status updated",
                message: `Your order status is now ${status}.`,
            };
    }
};

export const createOrderStatusNotification = async ({
    userId,
    orderId,
    oldStatus,
    newStatus,
}: {
    userId: string;
    orderId: string;
    oldStatus: string | null;
    newStatus: string;
}) => {
    
    if (oldStatus === newStatus) {
        return null;
    }

    const { title, message } = getNotificationContent(newStatus);

    return prisma.notification.create({
        data: {
            userId,
            orderId,
            title,
            message,
            type: "ORDER_STATUS",
        },
    });
};