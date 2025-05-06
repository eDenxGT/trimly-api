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
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES, } from "../../shared/constants.js";
let HairstyleDetectorController = class HairstyleDetectorController {
    _getHairstylesByFaceShapeUseCase;
    _addHairstyleUseCase;
    _getAllHairstylesUseCase;
    _updateHairstyleUseCase;
    _deleteHairstyleUseCase;
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
    async getHairstylesByFaceShape(req, res) {
        try {
            const { faceShape, gender } = req.query;
            if (!faceShape || !gender) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            const hairstyles = await this._getHairstylesByFaceShapeUseCase.execute({
                faceShape: String(faceShape),
                gender: String(gender),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                hairstyles,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️  Get All Hairstyles
    //* ─────────────────────────────────────────────────────────────
    async getAllHairstyles(req, res) {
        try {
            const { search, page, limit } = req.query;
            const { hairstyles, totalPages } = await this._getAllHairstylesUseCase.execute({
                search: String(search),
                page: Number(page),
                limit: Number(limit),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                hairstyles,
                totalPages,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️  Add Hairstyle
    //* ─────────────────────────────────────────────────────────────
    async addHairstyle(req, res) {
        try {
            const { faceShapes, gender, name, image } = req.body;
            if (!faceShapes || !gender || !name || !image) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            await this._addHairstyleUseCase.execute({
                faceShapes,
                gender,
                name,
                image,
            });
            res.status(HTTP_STATUS.OK).json({
                message: SUCCESS_MESSAGES.ADDED,
                success: true,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️  Update Hairstyle
    //* ─────────────────────────────────────────────────────────────
    async updateHairstyle(req, res) {
        try {
            const { hairstyleId } = req.params;
            const { faceShapes, gender, name, image } = req.body;
            if (!faceShapes || !gender || !name || !image || !hairstyleId) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            await this._updateHairstyleUseCase.execute({
                hairstyleId,
                faceShapes,
                gender,
                name,
                image,
            });
            res.status(HTTP_STATUS.OK).json({
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️  Delete Hairstyle
    //* ─────────────────────────────────────────────────────────────
    async deleteHairstyle(req, res) {
        try {
            const { hairstyleId } = req.params;
            if (!hairstyleId) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            await this._deleteHairstyleUseCase.execute({
                hairstyleId,
            });
            res.status(HTTP_STATUS.OK).json({
                message: SUCCESS_MESSAGES.DELETE_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
HairstyleDetectorController = __decorate([
    injectable(),
    __param(0, inject("IGetHairstylesByFaceShapeUseCase")),
    __param(1, inject("IAddHairstyleUseCase")),
    __param(2, inject("IGetAllHairstylesUseCase")),
    __param(3, inject("IUpdateHairstyleUseCase")),
    __param(4, inject("IDeleteHairstyleUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], HairstyleDetectorController);
export { HairstyleDetectorController };
