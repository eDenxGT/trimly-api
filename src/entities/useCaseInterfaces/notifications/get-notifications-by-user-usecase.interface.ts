import { INotificationEntity } from "../../models/notification.entity";

export interface IGetNotificationsByUserUseCase {
  execute({ userId }: { userId: string }): Promise<INotificationEntity[]>;
}
