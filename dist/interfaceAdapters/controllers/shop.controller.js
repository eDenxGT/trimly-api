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
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES, } from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
let ShopController = class ShopController {
    _getAllShopsUseCase;
    _getShopDetailsByShopIdUseCase;
    _updateShopStatusUseCase;
    _getAllNearestShopsUseCase;
    constructor(_getAllShopsUseCase, _getShopDetailsByShopIdUseCase, _updateShopStatusUseCase, _getAllNearestShopsUseCase) {
        this._getAllShopsUseCase = _getAllShopsUseCase;
        this._getShopDetailsByShopIdUseCase = _getShopDetailsByShopIdUseCase;
        this._updateShopStatusUseCase = _updateShopStatusUseCase;
        this._getAllNearestShopsUseCase = _getAllNearestShopsUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Get All Shops
    //* ─────────────────────────────────────────────────────────────
    async getAllShops(req, res) {
        try {
            const { page = 1, limit = 10, search = "", forType } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const forTypeString = typeof forType === "string" ? forType : "non-active";
            const searchTermString = typeof search === "string" ? search : "";
            const { shops, total } = await this._getAllShopsUseCase.execute(forTypeString, pageNumber, pageSize, searchTermString);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                shops,
                totalPages: total,
                currentPage: pageNumber,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*             🛠️ Get All Nearest Shops For Client
    //* ─────────────────────────────────────────────────────────────
    async getAllNearestShopsForClient(req, res) {
        try {
            const { search, amenities, userLocation, sortBy, sortOrder, page, limit, } = req.query;
            const shops = await this._getAllNearestShopsUseCase.execute(search, amenities, Array.isArray(userLocation)
                ? userLocation.map((loc) => Number(loc))
                : [], sortBy, sortOrder, page ? Number(page) : 1, limit ? Number(limit) : 9);
            // console.log(shops);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                shops,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Get Shop Details By Id
    //* ─────────────────────────────────────────────────────────────
    async getShopDetailsById(req, res) {
        try {
            const { shopId, forType } = req.query;
            const shop = await this._getShopDetailsByShopIdUseCase.execute(String(shopId), String(forType));
            console.log(shop);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                user: shop,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Update Shop Status
    //* ─────────────────────────────────────────────────────────────
    async updateShopStatus(req, res) {
        try {
            const { shopId } = req.params;
            const { status, message } = req.body;
            if (!shopId || !status) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                    success: false,
                });
                return;
            }
            const barberShop = await this._updateShopStatusUseCase.execute(shopId, status, message || "");
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
ShopController = __decorate([
    injectable(),
    __param(0, inject("IGetAllShopsUseCase")),
    __param(1, inject("IGetShopDetailsByShopIdUseCase")),
    __param(2, inject("IUpdateShopStatusUseCase")),
    __param(3, inject("IGetAllNearestShopsUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ShopController);
export { ShopController };
