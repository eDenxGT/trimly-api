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
import { clearAuthCookies } from "../../shared/utils/cookie.helper.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";
let BlockStatusMiddleware = class BlockStatusMiddleware {
    _clientRepository;
    _barberRepository;
    _adminRepository;
    _blacklistTokenUseCase;
    _revokeRefreshTokenUseCase;
    constructor(_clientRepository, _barberRepository, _adminRepository, _blacklistTokenUseCase, _revokeRefreshTokenUseCase) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._adminRepository = _adminRepository;
        this._blacklistTokenUseCase = _blacklistTokenUseCase;
        this._revokeRefreshTokenUseCase = _revokeRefreshTokenUseCase;
    }
    async getUserStatus(userId, role) {
        const repo = {
            client: this._clientRepository,
            barber: this._barberRepository,
            admin: this._adminRepository,
        }[role] || null;
        if (!repo) {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const user = await repo.findOne({ userId });
        return user?.status;
    }
    checkStatus = async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    status: "error",
                    message: "Unauthorized: No user found in request",
                });
            }
            const { userId, role, access_token, refresh_token } = req.user;
            if (!["client", "barber", "admin"].includes(role)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ROLE,
                });
            }
            const status = await this.getUserStatus(userId, role);
            if (!status) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: ERROR_MESSAGES.USER_NOT_FOUND,
                });
            }
            if (status === "blocked") {
                await Promise.all([
                    this._blacklistTokenUseCase.execute(access_token),
                    this._revokeRefreshTokenUseCase.execute(refresh_token),
                ]);
                clearAuthCookies(res, `${role}_access_token`, `${role}_refresh_token`);
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: "Access denied: Your account has been blocked",
                });
            }
            next();
        }
        catch (error) {
            console.error("Block Status Middleware Error:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error while checking blocked status",
            });
        }
    };
};
BlockStatusMiddleware = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IBarberRepository")),
    __param(2, inject("IAdminRepository")),
    __param(3, inject("IBlackListTokenUseCase")),
    __param(4, inject("IRevokeRefreshTokenUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], BlockStatusMiddleware);
export { BlockStatusMiddleware };
