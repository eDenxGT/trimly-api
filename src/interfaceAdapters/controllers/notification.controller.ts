import { inject, injectable } from "tsyringe";
import { INotificationController } from "../../entities/controllerInterfaces/notifications/notification-controller.interface.js";
import { Request, Response } from "express";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetNotificationsByUserUseCase } from "../../entities/useCaseInterfaces/notifications/get-notifications-by-user-usecase.interface.js";
import { HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("IGetNotificationsByUserUseCase")
    private _getNotificationsByUserUseCase: IGetNotificationsByUserUseCase
  ) {}
  async getNotificationsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const notifications = await this._getNotificationsByUserUseCase.execute({
        userId,
      });
      console.log("notifications", notifications);
      res.status(HTTP_STATUS.OK).json({ success: true, notifications });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
