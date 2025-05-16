import { Request, Response } from "express";

export interface INotificationController {
	getNotificationsByUser(req: Request, res: Response): Promise<void>;
}