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
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
let DashboardController = class DashboardController {
    _getNearest3ShopsForClientUseCase;
    _getLastBookingByUserUseCase;
    _getBarberDashboardDataUseCase;
    _getAdminDashboardDataUseCase;
    constructor(_getNearest3ShopsForClientUseCase, _getLastBookingByUserUseCase, _getBarberDashboardDataUseCase, _getAdminDashboardDataUseCase) {
        this._getNearest3ShopsForClientUseCase = _getNearest3ShopsForClientUseCase;
        this._getLastBookingByUserUseCase = _getLastBookingByUserUseCase;
        this._getBarberDashboardDataUseCase = _getBarberDashboardDataUseCase;
        this._getAdminDashboardDataUseCase = _getAdminDashboardDataUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️ Get Client Home Page Data
    //* ─────────────────────────────────────────────────────────────
    async getClientHomePageData(req, res) {
        try {
            const { userId } = req.user;
            const { latitude, longitude } = req.query;
            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                });
                return;
            }
            const shops = await this._getNearest3ShopsForClientUseCase.execute({
                userId,
                latitude: Number(latitude),
                longitude: Number(longitude),
            });
            const lastBooking = await this._getLastBookingByUserUseCase.execute({
                userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                shops,
                lastBooking,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Get Barber Dashboard Data
    //* ─────────────────────────────────────────────────────────────
    async getBarberDashboardData(req, res) {
        try {
            const { userId } = req.user;
            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                });
                return;
            }
            const dashboardData = await this._getBarberDashboardDataUseCase.execute({
                userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: dashboardData,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Get Admin Dashboard Data
    //* ─────────────────────────────────────────────────────────────
    async getAdminDashboardData(req, res) {
        try {
            const { userId } = req.user;
            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                });
                return;
            }
            const dashboardData = await this._getAdminDashboardDataUseCase.execute();
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: dashboardData,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
DashboardController = __decorate([
    injectable(),
    __param(0, inject("IGetNearest3ShopsForClientUseCase")),
    __param(1, inject("IGetLastBookingByUserUseCase")),
    __param(2, inject("IGetBarberDashboardDataUseCase")),
    __param(3, inject("IGetAdminDashboardDataUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], DashboardController);
export { DashboardController };
