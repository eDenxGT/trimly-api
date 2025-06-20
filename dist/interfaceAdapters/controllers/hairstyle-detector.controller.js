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
exports.HairstyleDetectorController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const custom_error_1 = require("../../entities/utils/custom.error");
const constants_1 = require("../../shared/constants");
let HairstyleDetectorController = class HairstyleDetectorController {
    constructor(_getHairstylesByFaceShapeUseCase, _addHairstyleUseCase, _getAllHairstylesUseCase, _updateHairstyleUseCase, _deleteHairstyleUseCase) {
        this._getHairstylesByFaceShapeUseCase = _getHairstylesByFaceShapeUseCase;
        this._addHairstyleUseCase = _addHairstyleUseCase;
        this._getAllHairstylesUseCase = _getAllHairstylesUseCase;
        this._updateHairstyleUseCase = _updateHairstyleUseCase;
        this._deleteHairstyleUseCase = _deleteHairstyleUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️  Get Hairstyles By Face Shape
    //* ─────────────────────────────────────────────────────────────
    getHairstylesByFaceShape(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faceShape, gender } = req.query;
                if (!faceShape || !gender) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const hairstyles = yield this._getHairstylesByFaceShapeUseCase.execute({
                    faceShape: String(faceShape),
                    gender: String(gender),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    hairstyles,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️  Get All Hairstyles
    //* ─────────────────────────────────────────────────────────────
    getAllHairstyles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, page, limit } = req.query;
                const { hairstyles, totalPages } = yield this._getAllHairstylesUseCase.execute({
                    search: String(search),
                    page: Number(page),
                    limit: Number(limit),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    hairstyles,
                    totalPages,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️  Add Hairstyle
    //* ─────────────────────────────────────────────────────────────
    addHairstyle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { faceShapes, gender, name, image } = req.body;
                if (!faceShapes || !gender || !name || !image) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                yield this._addHairstyleUseCase.execute({
                    faceShapes,
                    gender,
                    name,
                    image,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.ADDED,
                    success: true,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️  Update Hairstyle
    //* ─────────────────────────────────────────────────────────────
    updateHairstyle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hairstyleId } = req.params;
                const { faceShapes, gender, name, image } = req.body;
                if (!faceShapes || !gender || !name || !image || !hairstyleId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                yield this._updateHairstyleUseCase.execute({
                    hairstyleId,
                    faceShapes,
                    gender,
                    name,
                    image,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    success: true,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️  Delete Hairstyle
    //* ─────────────────────────────────────────────────────────────
    deleteHairstyle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hairstyleId } = req.params;
                if (!hairstyleId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                yield this._deleteHairstyleUseCase.execute({
                    hairstyleId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.DELETE_SUCCESS,
                    success: true,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.HairstyleDetectorController = HairstyleDetectorController;
exports.HairstyleDetectorController = HairstyleDetectorController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetHairstylesByFaceShapeUseCase")),
    __param(1, (0, tsyringe_1.inject)("IAddHairstyleUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetAllHairstylesUseCase")),
    __param(3, (0, tsyringe_1.inject)("IUpdateHairstyleUseCase")),
    __param(4, (0, tsyringe_1.inject)("IDeleteHairstyleUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], HairstyleDetectorController);
