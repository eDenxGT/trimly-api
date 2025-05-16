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
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { HTTP_STATUS } from "../../shared/constants.js";
let NotificationController = class NotificationController {
    _getNotificationsByUserUseCase;
    constructor(_getNotificationsByUserUseCase) {
        this._getNotificationsByUserUseCase = _getNotificationsByUserUseCase;
    }
    async getNotificationsByUser(req, res) {
        try {
            const { userId } = req.user;
            const notifications = await this._getNotificationsByUserUseCase.execute({
                userId,
            });
            console.log("notifications", notifications);
            res.status(HTTP_STATUS.OK).json({ success: true, notifications });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
NotificationController = __decorate([
    injectable(),
    __param(0, inject("IGetNotificationsByUserUseCase")),
    __metadata("design:paramtypes", [Object])
], NotificationController);
export { NotificationController };
