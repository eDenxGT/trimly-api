"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
const custom_error_1 = require("../../entities/utils/custom.error");
let UserController = class UserController {
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
    refreshSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.user;
                if (!userId || !role) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_TOKEN,
                    });
                    return;
                }
                const user = yield this._getUserDetailsUseCase.execute(userId, role);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    user: user,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️ Get All Users (Role Based)
    //* ─────────────────────────────────────────────────────────────
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "", userType } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const userTypeString = typeof userType === "string" ? userType : "client";
                const searchTermString = typeof search === "string" ? search : "";
                if (userType === "barber") {
                    const { shops, total } = yield this._getAllShopsUseCase.execute("not-pending", pageNumber, pageSize, searchTermString);
                    res.status(constants_1.HTTP_STATUS.OK).json({
                        success: true,
                        users: shops,
                        totalPages: total,
                        currentPage: pageNumber,
                    });
                    return;
                }
                const { users, total } = yield this._getAllUsersUseCase.execute(userTypeString, pageNumber, pageSize, searchTermString);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    users,
                    totalPages: total,
                    currentPage: pageNumber,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Update User Status
    //* ─────────────────────────────────────────────────────────────
    updateUserStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userType, userId } = req.query;
                yield this._updateUserStatusUseCase.execute(userType, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Change User Password
    //* ─────────────────────────────────────────────────────────────
    changeUserPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword } = req.body;
                const { email, role } = req.user;
                yield this._changePasswordUseCase.execute({
                    oldPassword,
                    newPassword,
                    email,
                    role,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Update User Details
    //* ─────────────────────────────────────────────────────────────
    updateUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { userId, role } = req.user;
                const updatedUser = yield this._updateUserDetailsUseCase.execute(userId, role, data);
                if (!updatedUser) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                }
                const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    user: userWithoutPassword,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetAllUsersUseCase")),
    __param(1, (0, tsyringe_1.inject)("IUpdateUserStatusUseCase")),
    __param(2, (0, tsyringe_1.inject)("IChangeUserPasswordUseCase")),
    __param(3, (0, tsyringe_1.inject)("IUpdateUserDetailsUseCase")),
    __param(4, (0, tsyringe_1.inject)("IGetUserDetailsUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGetAllShopsUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], UserController);
