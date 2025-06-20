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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
let DashboardController = class DashboardController {
    constructor(_getNearest3ShopsForClientUseCase, _getLastBookingByUserUseCase, _getBarberDashboardDataUseCase, _getAdminDashboardDataUseCase) {
        this._getNearest3ShopsForClientUseCase = _getNearest3ShopsForClientUseCase;
        this._getLastBookingByUserUseCase = _getLastBookingByUserUseCase;
        this._getBarberDashboardDataUseCase = _getBarberDashboardDataUseCase;
        this._getAdminDashboardDataUseCase = _getAdminDashboardDataUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️ Get Client Home Page Data
    //* ─────────────────────────────────────────────────────────────
    getClientHomePageData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { latitude, longitude } = req.query;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                const shops = yield this._getNearest3ShopsForClientUseCase.execute({
                    userId,
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                });
                const lastBooking = yield this._getLastBookingByUserUseCase.execute({
                    userId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    shops,
                    lastBooking,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Get Barber Dashboard Data
    //* ─────────────────────────────────────────────────────────────
    getBarberDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                const dashboardData = yield this._getBarberDashboardDataUseCase.execute({
                    userId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    data: dashboardData,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Get Admin Dashboard Data
    //* ─────────────────────────────────────────────────────────────
    getAdminDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                const dashboardData = yield this._getAdminDashboardDataUseCase.execute();
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    data: dashboardData,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.DashboardController = DashboardController;
exports.DashboardController = DashboardController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetNearest3ShopsForClientUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetLastBookingByUserUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetBarberDashboardDataUseCase")),
    __param(3, (0, tsyringe_1.inject)("IGetAdminDashboardDataUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], DashboardController);
