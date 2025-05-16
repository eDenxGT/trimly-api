var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let SendBookingConfirmationNotificationUseCase = class SendBookingConfirmationNotificationUseCase {
    _notificationRepository;
    _notificationSocketHandler;
    constructor(_notificationRepository, _notificationSocketHandler) {
        this._notificationRepository = _notificationRepository;
        this._notificationSocketHandler = _notificationSocketHandler;
    }
    async execute({ receiverId, message, }) {
        const notification = {
            notificationId: generateUniqueId("notification"),
            userId: receiverId,
            message,
            isRead: false,
            createdAt: new Date(),
        };
        await this._notificationRepository.save(notification);
        await this._notificationSocketHandler.handleSendNotificationByUserId({
            receiverId,
            payload: notification,
        });
    }
};
SendBookingConfirmationNotificationUseCase = __decorate([
    injectable(),
    __param(0, inject("INotificationRepository")),
    __param(1, inject("INotificationSocketHandler")),
    __metadata("design:paramtypes", [Object, Object])
], SendBookingConfirmationNotificationUseCase);
export { SendBookingConfirmationNotificationUseCase };
