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
let BlackListTokenUseCase = class BlackListTokenUseCase {
    _redisTokenRepository;
    _tokenService;
    constructor(_redisTokenRepository, _tokenService) {
        this._redisTokenRepository = _redisTokenRepository;
        this._tokenService = _tokenService;
    }
    async execute(token) {
        const decoded = this._tokenService.verifyAccessToken(token);
        if (!decoded || typeof decoded === "string" || !decoded.exp) {
            throw new Error("Invalid Token: Missing expiration time");
        }
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
            await this._redisTokenRepository.blackListToken(token, expiresIn);
        }
    }
};
BlackListTokenUseCase = __decorate([
    injectable(),
    __param(0, inject("IRedisTokenRepository")),
    __param(1, inject("ITokenService")),
    __metadata("design:paramtypes", [Object, Object])
], BlackListTokenUseCase);
export { BlackListTokenUseCase };
