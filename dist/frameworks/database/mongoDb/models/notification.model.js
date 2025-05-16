import { model } from "mongoose";
import { notificationSchema } from "../schemas/notification.schema.js";
export const NotificationModel = model("Notification", notificationSchema);
