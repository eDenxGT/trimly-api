import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import {
  INotificationModel,
  NotificationModel,
} from "../../../frameworks/database/mongoDb/models/notification.model.js";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/notification/notification-repository.interface.js";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotificationModel>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }
  async getNotificationsByUser({ userId }: { userId: string }) {
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 });
  }
}
