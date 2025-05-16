import { IBaseRepository } from "../base-repository.interface.js";
import { INotificationEntity } from "../../models/notification.entity.js";

export interface INotificationRepository
  extends IBaseRepository<INotificationEntity> {}
