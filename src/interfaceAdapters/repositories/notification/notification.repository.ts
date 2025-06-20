import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import {
  INotificationModel,
  NotificationModel,
} from "../../../frameworks/database/mongoDb/models/notification.model";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { INotificationEntity } from "../../../entities/models/notification.entity";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotificationModel>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }
  async getNotificationsByUser({
    userId,
  }: {
    userId: string;
  }): Promise<INotificationEntity[]> {
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAllNotificationsAsReadByUser({
    userId,
  }: {
    userId: string;
  }): Promise<void> {
    await NotificationModel.updateMany(
      { userId },
      { isRead: true },
      { new: true }
    );
  }
}
