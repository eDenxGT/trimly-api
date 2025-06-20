import { Document, model, ObjectId } from "mongoose";
import { INotificationEntity } from "../../../../entities/models/notification.entity";
import { notificationSchema } from "../schemas/notification.schema";

export interface INotificationModel extends INotificationEntity, Document {
  _id: ObjectId;
}

export const NotificationModel = model<INotificationModel>(
  "Notification",
  notificationSchema
);
