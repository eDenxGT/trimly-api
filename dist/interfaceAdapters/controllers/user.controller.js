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
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES, } from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";
let UserController = class UserController {
    _getAllUsersUseCase;
    _updateUserStatusUseCase;
    _changePasswordUseCase;
    _updateUserDetailsUseCase;
    _getUserDetailsUseCase;
    _getAllShopsUseCase;
    constructor(_getAllUsersUseCase, _updateUserStatusUseCase, _changePasswordUseCase, _updateUserDetailsUseCase, _getUserDetailsUseCase, _getAllShopsUseCase) {
        this._getAllUsersUseCase = _getAllUsersUseCase;
        this._updateUserStatusUseCase = _updateUserStatusUseCase;
        this._changePasswordUseCase = _changePasswordUseCase;
        this._updateUserDetailsUseCase = _updateUserDetailsUseCase;
        this._getUserDetailsUseCase = _getUserDetailsUseCase;
        this._getAllShopsUseCase = _getAllShopsUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Refresh Session
    //* ─────────────────────────────────────────────────────────────
    async refreshSession(req, res) {
        try {
            const { userId, role } = req.user;
            if (!userId || !role) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_TOKEN,
                });
                return;
            }
            const user = await this._getUserDetailsUseCase.execute(userId, role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                user: user,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️ Get All Users (Role Based)
    //* ─────────────────────────────────────────────────────────────
    async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, search = "", userType } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const userTypeString = typeof userType === "string" ? userType : "client";
            const searchTermString = typeof search === "string" ? search : "";
            if (userType === "barber") {
                const { shops, total } = await this._getAllShopsUseCase.execute("not-pending", pageNumber, pageSize, searchTermString);
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    users: shops,
                    totalPages: total,
                    currentPage: pageNumber,
                });
                return;
            }
            const { users, total } = await this._getAllUsersUseCase.execute(userTypeString, pageNumber, pageSize, searchTermString);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                users,
                totalPages: total,
                currentPage: pageNumber,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Update User Status
    //* ─────────────────────────────────────────────────────────────
    async updateUserStatus(req, res) {
        try {
            const { userType, userId } = req.query;
            await this._updateUserStatusUseCase.execute(userType, userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Change User Password
    //* ─────────────────────────────────────────────────────────────
    async changeUserPassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const { email, role } = req.user;
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
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Update User Details
    //* ─────────────────────────────────────────────────────────────
    async updateUserDetails(req, res) {
        try {
            const data = req.body;
            const { userId, role } = req.user;
            const updatedUser = await this._updateUserDetailsUseCase.execute(userId, role, data);
            if (!updatedUser) {
                throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            }
            const { password, ...userWithoutPassword } = updatedUser;
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                user: userWithoutPassword,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
UserController = __decorate([
    injectable(),
    __param(0, inject("IGetAllUsersUseCase")),
    __param(1, inject("IUpdateUserStatusUseCase")),
    __param(2, inject("IChangeUserPasswordUseCase")),
    __param(3, inject("IUpdateUserDetailsUseCase")),
    __param(4, inject("IGetUserDetailsUseCase")),
    __param(5, inject("IGetAllShopsUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], UserController);
export { UserController };
