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
exports.ShopController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error.handler");
let ShopController = class ShopController {
    constructor(_getAllShopsUseCase, _getShopDetailsByShopIdUseCase, _updateShopStatusUseCase, _getAllNearestShopsUseCase) {
        this._getAllShopsUseCase = _getAllShopsUseCase;
        this._getShopDetailsByShopIdUseCase = _getShopDetailsByShopIdUseCase;
        this._updateShopStatusUseCase = _updateShopStatusUseCase;
        this._getAllNearestShopsUseCase = _getAllNearestShopsUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Get All Shops
    //* ─────────────────────────────────────────────────────────────
    getAllShops(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "", forType } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const forTypeString = typeof forType === "string" ? forType : "non-active";
                const searchTermString = typeof search === "string" ? search : "";
                const { shops, total } = yield this._getAllShopsUseCase.execute(forTypeString, pageNumber, pageSize, searchTermString);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    shops,
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
    //*             🛠️ Get All Nearest Shops For Client
    //* ─────────────────────────────────────────────────────────────
    getAllNearestShopsForClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, amenities, userLocation, sortBy, sortOrder, page, limit, } = req.query;
                const shops = yield this._getAllNearestShopsUseCase.execute(search, amenities, Array.isArray(userLocation)
                    ? userLocation.map((loc) => Number(loc))
                    : [], sortBy, sortOrder, page ? Number(page) : 1, limit ? Number(limit) : 9);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    shops,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Get Shop Details By Id
    //* ─────────────────────────────────────────────────────────────
    getShopDetailsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { shopId, forType } = req.query;
                const shop = yield this._getShopDetailsByShopIdUseCase.execute(String(shopId), String(forType));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    user: shop,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Update Shop Status
    //* ─────────────────────────────────────────────────────────────
    updateShopStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { shopId } = req.params;
                const { status, message } = req.body;
                if (!shopId || !status) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                        success: false,
                    });
                    return;
                }
                const barberShop = yield this._updateShopStatusUseCase.execute(shopId, status, message || "");
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
};
exports.ShopController = ShopController;
exports.ShopController = ShopController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetAllShopsUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetShopDetailsByShopIdUseCase")),
    __param(2, (0, tsyringe_1.inject)("IUpdateShopStatusUseCase")),
    __param(3, (0, tsyringe_1.inject)("IGetAllNearestShopsUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ShopController);
