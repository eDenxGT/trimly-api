var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { config } from "../../shared/config.js";
let JWTService = class JWTService {
    _accessSecret;
    _accessExpiresIn;
    _refreshSecret;
    _refreshExpiresIn;
    _resetSecret;
    _resetExpiresIn;
    constructor() {
        this._accessSecret = config.jwt.ACCESS_SECRET_KEY;
        this._accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN;
        this._refreshSecret = config.jwt.REFRESH_SECRET_KEY;
        this._refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN;
        this._resetSecret = config.jwt.RESET_SECRET_KEY;
        this._resetExpiresIn = config.jwt.RESET_EXPIRES_IN;
    }
    generateAccessToken(payload) {
        return jwt.sign(payload, this._accessSecret, {
            expiresIn: this._accessExpiresIn,
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, this._refreshSecret, {
            expiresIn: this._refreshExpiresIn,
        });
    }
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this._accessSecret);
        }
        catch (error) {
            console.error("Access token verification failed:", error);
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this._refreshSecret);
        }
        catch (error) {
            console.error("Access token verification failed:", error);
            return null;
        }
    }
    decodeAccessToken(token) {
        try {
            return jwt.decode(token);
        }
        catch (error) {
            console.error("Access token decoding failed", error);
            return null;
        }
    }
    generateResetToken(email) {
        return jwt.sign({ email }, this._resetSecret, {
            expiresIn: this._resetExpiresIn,
        });
    }
    verifyResetToken(token) {
        try {
            return jwt.verify(token, this._resetSecret);
        }
        catch (error) {
            console.error("Reset token verification failed:", error);
            return null;
        }
    }
    decodeResetToken(token) {
        try {
            return jwt.decode(token);
        }
        catch (error) {
            console.error("Reset token decoding failed", error);
            return null;
        }
    }
};
JWTService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], JWTService);
export { JWTService };
