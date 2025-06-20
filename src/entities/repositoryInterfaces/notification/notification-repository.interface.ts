import { IBaseRepository } from "../base-repository.interface";
import { INotificationEntity } from "../../models/notification.entity";

export interface INotificationRepository
  extends IBaseRepository<INotificationEntity> {
  getNotificationsByUser({
    userId,
  }: {
    userId: string;
  }): Promise<INotificationEntity[]>;

  markAllNotificationsAsReadByUser({
    userId,
  }: {
    userId: string;
  }): Promise<void>;
}
