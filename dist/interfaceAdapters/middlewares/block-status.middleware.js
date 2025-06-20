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
exports.BlockStatusMiddleware = void 0;
const tsyringe_1 = require("tsyringe");
const cookie_helper_1 = require("../../shared/utils/cookie.helper");
const constants_1 = require("../../shared/constants");
const custom_error_1 = require("../../entities/utils/custom.error");
let BlockStatusMiddleware = class BlockStatusMiddleware {
    constructor(_clientRepository, _barberRepository, _adminRepository, _blacklistTokenUseCase, _revokeRefreshTokenUseCase) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._adminRepository = _adminRepository;
        this._blacklistTokenUseCase = _blacklistTokenUseCase;
        this._revokeRefreshTokenUseCase = _revokeRefreshTokenUseCase;
        this.checkStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        status: "error",
                        message: "Unauthorized: No user found in request",
                    });
                }
                const { userId, role, access_token, refresh_token } = req.user;
                if (!["client", "barber", "admin"].includes(role)) {
                    return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_ROLE,
                    });
                }
                const status = yield this.getUserStatus(userId, role);
                if (!status) {
                    return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    });
                }
                if (status === "blocked") {
                    yield Promise.all([
                        this._blacklistTokenUseCase.execute(access_token),
                        this._revokeRefreshTokenUseCase.execute(refresh_token),
                    ]);
                    (0, cookie_helper_1.clearAuthCookies)(res, `${role}_access_token`, `${role}_refresh_token`);
                    return res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: "Access denied: Your account has been blocked",
                    });
                }
                next();
            }
            catch (error) {
                console.error("Block Status Middleware Error:", error);
                res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal server error while checking blocked status",
                });
            }
        });
    }
    getUserStatus(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = {
                client: this._clientRepository,
                barber: this._barberRepository,
                admin: this._adminRepository,
            }[role] || null;
            if (!repo) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const user = yield repo.findOne({ userId });
            return user === null || user === void 0 ? void 0 : user.status;
        });
    }
};
exports.BlockStatusMiddleware = BlockStatusMiddleware;
exports.BlockStatusMiddleware = BlockStatusMiddleware = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IClientRepository")),
    __param(1, (0, tsyringe_1.inject)("IBarberRepository")),
    __param(2, (0, tsyringe_1.inject)("IAdminRepository")),
    __param(3, (0, tsyringe_1.inject)("IBlackListTokenUseCase")),
    __param(4, (0, tsyringe_1.inject)("IRevokeRefreshTokenUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], BlockStatusMiddleware);
