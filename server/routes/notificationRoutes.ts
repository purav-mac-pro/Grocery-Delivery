import express from "express";
import auth from "../middleware/auth.js";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", auth, getNotifications);

notificationRouter.put(
    "/:id/read",
    auth,
    markNotificationAsRead
);

notificationRouter.put(
    "/read-all",
    auth,
    markAllNotificationsAsRead
);

export default notificationRouter;