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
let GenerateTokenUseCase = class GenerateTokenUseCase {
    _tokenService;
    _refreshTokenRepository;
    constructor(_tokenService, _refreshTokenRepository) {
        this._tokenService = _tokenService;
        this._refreshTokenRepository = _refreshTokenRepository;
    }
    async execute(userId, email, role) {
        const payload = { email, userId, role };
        const accessToken = this._tokenService.generateAccessToken(payload);
        const refreshToken = this._tokenService.generateRefreshToken(payload);
        await this._refreshTokenRepository.save({
            token: refreshToken,
            userType: role,
            user: userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return {
            accessToken,
            refreshToken,
        };
    }
};
GenerateTokenUseCase = __decorate([
    injectable(),
    __param(0, inject("ITokenService")),
    __param(1, inject("IRefreshTokenRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GenerateTokenUseCase);
export { GenerateTokenUseCase };
