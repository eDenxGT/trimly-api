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
exports.ServiceController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
let ServiceController = class ServiceController {
    constructor(_addServiceUseCase, _getAllServicesUseCase, _updateServiceUseCase, _deleteServiceUseCase) {
        this._addServiceUseCase = _addServiceUseCase;
        this._getAllServicesUseCase = _getAllServicesUseCase;
        this._updateServiceUseCase = _updateServiceUseCase;
        this._deleteServiceUseCase = _deleteServiceUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Add Service
    //* ─────────────────────────────────────────────────────────────
    addService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { userId, role } = req.user;
                if (!userId || role !== "barber") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._addServiceUseCase.execute(Object.assign(Object.assign({}, data), { barberId: userId }));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.ADDED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Get All Services
    //* ─────────────────────────────────────────────────────────────
    getAllServicesByBarberId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const services = yield this._getAllServicesUseCase.execute({
                    barberId: userId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    services,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Update Service
    //* ─────────────────────────────────────────────────────────────
    updateServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const data = req.body;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._updateServiceUseCase.execute({
                    barberId: userId,
                    serviceId: data.serviceId,
                }, data);
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
    //*                     🛠️ Delete Service
    //* ─────────────────────────────────────────────────────────────
    deleteServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { serviceId } = req.params;
                if (!userId || !serviceId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._deleteServiceUseCase.execute(serviceId, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.DELETE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.ServiceController = ServiceController;
exports.ServiceController = ServiceController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAddServiceUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetAllServicesUseCase")),
    __param(2, (0, tsyringe_1.inject)("IUpdateServiceUseCase")),
    __param(3, (0, tsyringe_1.inject)("IDeleteServiceUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ServiceController);
