import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IUserController } from "../../entities/controllerInterfaces/users/user-controller.interface";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	SUCCESS_MESSAGES,
	TRole,
} from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom.error";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IUpdateUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/update-user-details-usecase.interface";
import { IChangeUserPasswordUseCase } from "../../entities/useCaseInterfaces/users/change-user-password-usecase.interface";
import { IGetAllUsersUseCase } from "../../entities/useCaseInterfaces/users/get-all-users-usecase.interface";
import { IUpdateUserStatusUseCase } from "../../entities/useCaseInterfaces/users/update-user-status-usecase.interface";
import { IGetUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/get-user-details-usecase.interface";
import { IGetAllShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-shops-usecase.interface";

@injectable()
export class UserController implements IUserController {
	constructor(
		@inject("IGetAllUsersUseCase")
		private _getAllUsersUseCase: IGetAllUsersUseCase,
		@inject("IUpdateUserStatusUseCase")
		private _updateUserStatusUseCase: IUpdateUserStatusUseCase,
		@inject("IChangeUserPasswordUseCase")
		private _changePasswordUseCase: IChangeUserPasswordUseCase,
		@inject("IUpdateUserDetailsUseCase")
		private _updateUserDetailsUseCase: IUpdateUserDetailsUseCase,
		@inject("IGetUserDetailsUseCase")
		private _getUserDetailsUseCase: IGetUserDetailsUseCase,
		@inject("IGetAllShopsUseCase")
		private _getAllShopsUseCase: IGetAllShopsUseCase
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ Refresh Session
	//* ─────────────────────────────────────────────────────────────
	async refreshSession(req: Request, res: Response): Promise<void> {
		try {
			const { userId, role } = (req as CustomRequest).user;
			if (!userId || !role) {
				res.status(HTTP_STATUS.UNAUTHORIZED).json({
					success: false,
					message: ERROR_MESSAGES.INVALID_TOKEN,
				});
				return;
			}
			const user = await this._getUserDetailsUseCase.execute(
				userId,
				role as TRole
			);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				user: user,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*               🛠️ Get All Users (Role Based)
	//* ─────────────────────────────────────────────────────────────
	async getAllUsers(req: Request, res: Response): Promise<void> {
		try {
			const { page = 1, limit = 10, search = "", userType } = req.query;
			const pageNumber = Number(page);
			const pageSize = Number(limit);
			const userTypeString =
				typeof userType === "string" ? userType : "client";
			const searchTermString = typeof search === "string" ? search : "";

			if (userType === "barber") {
				const { shops, total } = await this._getAllShopsUseCase.execute(
					"not-pending",
					pageNumber,
					pageSize,
					searchTermString
				);
				res.status(HTTP_STATUS.OK).json({
					success: true,
					users: shops,
					totalPages: total,
					currentPage: pageNumber,
				});
				return;
			}

			const { users, total } = await this._getAllUsersUseCase.execute(
				userTypeString,
				pageNumber,
				pageSize,
				searchTermString
			);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				users,
				totalPages: total,
				currentPage: pageNumber,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ Update User Status
	//* ─────────────────────────────────────────────────────────────
	async updateUserStatus(req: Request, res: Response): Promise<void> {
		try {
			const { userType, userId } = req.query as {
				userType: string;
				userId: any;
			};

			await this._updateUserStatusUseCase.execute(userType, userId);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ Change User Password
	//* ─────────────────────────────────────────────────────────────
	async changeUserPassword(req: Request, res: Response): Promise<void> {
		try {
			const { oldPassword, newPassword } = req.body;
			const { email, role } = (req as CustomRequest).user;

			await this._changePasswordUseCase.execute({
				oldPassword,
				newPassword,
				email,
				role,
			});
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ Update User Details
	//* ─────────────────────────────────────────────────────────────
	async updateUserDetails(req: Request, res: Response): Promise<void> {
		try {
			const data = req.body;
			const { userId, role } = (req as CustomRequest).user;
			const updatedUser = await this._updateUserDetailsUseCase.execute(
				userId,
				role,
				data
			);
			if (!updatedUser) {
				throw new CustomError(
					ERROR_MESSAGES.USER_NOT_FOUND,
					HTTP_STATUS.NOT_FOUND
				);
			}
			const { password, ...userWithoutPassword } = updatedUser;
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
				user: userWithoutPassword,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}
}
