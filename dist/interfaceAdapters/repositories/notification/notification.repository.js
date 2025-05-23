var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { NotificationModel, } from "../../../frameworks/database/mongoDb/models/notification.model.js";
let NotificationRepository = class NotificationRepository extends BaseRepository {
    constructor() {
        super(NotificationModel);
    }
    async getNotificationsByUser({ userId, }) {
        return await NotificationModel.find({ userId }).sort({ createdAt: -1 });
    }
    async markAllNotificationsAsReadByUser({ userId, }) {
        await NotificationModel.updateMany({ userId }, { isRead: true }, { new: true });
    }
};
NotificationRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], NotificationRepository);
export { NotificationRepository };
