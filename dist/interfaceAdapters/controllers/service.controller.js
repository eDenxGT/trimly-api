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
let ServiceController = class ServiceController {
    _addServiceUseCase;
    _getAllServicesUseCase;
    _updateServiceUseCase;
    _deleteServiceUseCase;
    constructor(_addServiceUseCase, _getAllServicesUseCase, _updateServiceUseCase, _deleteServiceUseCase) {
        this._addServiceUseCase = _addServiceUseCase;
        this._getAllServicesUseCase = _getAllServicesUseCase;
        this._updateServiceUseCase = _updateServiceUseCase;
        this._deleteServiceUseCase = _deleteServiceUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Add Service
    //* ─────────────────────────────────────────────────────────────
    async addService(req, res) {
        try {
            const data = req.body;
            const { userId, role } = req.user;
            if (!userId || role !== "barber") {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._addServiceUseCase.execute({
                ...data,
                barberId: userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.ADDED,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Get All Services
    //* ─────────────────────────────────────────────────────────────
    async getAllServicesByBarberId(req, res) {
        try {
            const { userId } = req.user;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const services = await this._getAllServicesUseCase.execute({
                barberId: userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                services,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Update Service
    //* ─────────────────────────────────────────────────────────────
    async updateServiceById(req, res) {
        try {
            const { userId } = req.user;
            const data = req.body;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._updateServiceUseCase.execute({
                barberId: userId,
                serviceId: data.serviceId,
            }, data);
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
    //*                     🛠️ Delete Service
    //* ─────────────────────────────────────────────────────────────
    async deleteServiceById(req, res) {
        try {
            const { userId } = req.user;
            const { serviceId } = req.params;
            if (!userId || !serviceId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._deleteServiceUseCase.execute(serviceId, userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DELETE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
ServiceController = __decorate([
    injectable(),
    __param(0, inject("IAddServiceUseCase")),
    __param(1, inject("IGetAllServicesUseCase")),
    __param(2, inject("IUpdateServiceUseCase")),
    __param(3, inject("IDeleteServiceUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ServiceController);
export { ServiceController };
