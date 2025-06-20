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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const user_signup_validation_schema_1 = require("./validations/user-signup.validation.schema");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error.handler");
const otp_mail_validation_schema_1 = require("./validations/otp-mail.validation.schema");
const cookie_helper_1 = require("../../../shared/utils/cookie.helper");
const user_login_validation_schema_1 = require("./validations/user-login.validation.schema");
const forgot_password_validation_schema_1 = require("./validations/forgot-password.validation.schema");
const reset_password_validation_schema_1 = require("./validations/reset-password.validation.schema");
let AuthController = class AuthController {
    constructor(_registerUserUseCase, _verifyOtpUseCase, _sendOtpEmailUseCase, _loginUserUseCase, _refreshTokenUseCase, _blackListTokenUseCase, _revokeRefreshToken, _generateTokenUseCase, _forgotPasswordUseCase, _googleUseCase, _resetPasswordUseCase) {
        this._registerUserUseCase = _registerUserUseCase;
        this._verifyOtpUseCase = _verifyOtpUseCase;
        this._sendOtpEmailUseCase = _sendOtpEmailUseCase;
        this._loginUserUseCase = _loginUserUseCase;
        this._refreshTokenUseCase = _refreshTokenUseCase;
        this._blackListTokenUseCase = _blackListTokenUseCase;
        this._revokeRefreshToken = _revokeRefreshToken;
        this._generateTokenUseCase = _generateTokenUseCase;
        this._forgotPasswordUseCase = _forgotPasswordUseCase;
        this._googleUseCase = _googleUseCase;
        this._resetPasswordUseCase = _resetPasswordUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ User Register
    //* ─────────────────────────────────────────────────────────────
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role } = req.body;
                const schema = user_signup_validation_schema_1.userSchemas[role];
                if (!schema) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    });
                    return;
                }
                const validatedData = schema.parse(req.body);
                yield this._registerUserUseCase.execute(validatedData);
                if (role === "barber") {
                    res.status(constants_1.HTTP_STATUS.CREATED).json({
                        success: true,
                        message: constants_1.SUCCESS_MESSAGES.LOGIN_AND_COMPLETE_YOUR_PROFILE,
                    });
                    return;
                }
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ User Login
    //* ─────────────────────────────────────────────────────────────
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const validatedData = user_login_validation_schema_1.loginSchema.parse(data);
                if (!validatedData) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    });
                }
                const user = yield this._loginUserUseCase.execute(validatedData);
                if (!user.userId || !user.email || !user.role) {
                    throw new Error("User ID, email, or role is missing");
                }
                const tokens = yield this._generateTokenUseCase.execute(user.userId, user.email, user.role);
                const accessTokenName = `${user.role}_access_token`;
                const refreshTokenName = `${user.role}_refresh_token`;
                (0, cookie_helper_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                if (userWithoutPassword.status === "pending" &&
                    userWithoutPassword.role === "barber") {
                    res.status(constants_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: constants_1.SUCCESS_MESSAGES.COMPLETE_YOUR_PROFILE_TO_GET_APPROVED,
                        user: Object.assign({}, userWithoutPassword),
                    });
                    return;
                }
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                    user: Object.assign({}, userWithoutPassword),
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Google Authentication
    //* ─────────────────────────────────────────────────────────────
    authenticateWithGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credential, client_id, role } = req.body;
                const user = yield this._googleUseCase.execute(credential, client_id, role);
                if (!user.userId || !user.email || !user.role) {
                    throw new Error("User ID, email, or role is missing");
                }
                const tokens = yield this._generateTokenUseCase.execute(user.userId, user.email, user.role);
                const accessTokenName = `${user.role}_access_token`;
                const refreshTokenName = `${user.role}_refresh_token`;
                (0, cookie_helper_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                    user: user,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ User Logout
    //* ─────────────────────────────────────────────────────────────
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._blackListTokenUseCase.execute(req.user.access_token);
                yield this._revokeRefreshToken.execute(req.user.refresh_token);
                const user = req.user;
                const accessTokenName = `${user.role}_access_token`;
                const refreshTokenName = `${user.role}_refresh_token`;
                (0, cookie_helper_1.clearAuthCookies)(res, accessTokenName, refreshTokenName);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ User Forgot Password
    //* ─────────────────────────────────────────────────────────────
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = forgot_password_validation_schema_1.forgotPasswordValidationSchema.parse(req.body);
                if (!validatedData) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
                    });
                    return;
                }
                yield this._forgotPasswordUseCase.execute(validatedData);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ User Reset Password
    //* ─────────────────────────────────────────────────────────────
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = reset_password_validation_schema_1.resetPasswordValidationSchema.parse(req.body);
                if (!validatedData) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
                    });
                }
                yield this._resetPasswordUseCase.execute(validatedData);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️ Token Refresh Handler
    //* ─────────────────────────────────────────────────────────────
    handleTokenRefresh(req, res) {
        try {
            const refreshToken = req.user.refresh_token;
            const newTokens = this._refreshTokenUseCase.execute(refreshToken);
            const accessTokenName = `${newTokens.role}_access_token`;
            (0, cookie_helper_1.updateCookieWithAccessToken)(res, newTokens.accessToken, accessTokenName);
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.OPERATION_SUCCESS,
            });
        }
        catch (error) {
            (0, cookie_helper_1.clearAuthCookies)(res, `${req.user.role}_access_token`, `${req.user.role}_refresh_token`);
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.INVALID_TOKEN,
            });
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Sent Otp Email
    //* ─────────────────────────────────────────────────────────────
    sendOtpEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this._sendOtpEmailUseCase.execute(email);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
                    success: true,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                      🛠️ Verify Otp
    //* ─────────────────────────────────────────────────────────────
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const validatedData = otp_mail_validation_schema_1.otpMailValidationSchema.parse({ email, otp });
                yield this._verifyOtpUseCase.execute(validatedData);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IRegisterUserUseCase")),
    __param(1, (0, tsyringe_1.inject)("IVerifyOtpUseCase")),
    __param(2, (0, tsyringe_1.inject)("ISendOtpEmailUseCase")),
    __param(3, (0, tsyringe_1.inject)("ILoginUserUseCase")),
    __param(4, (0, tsyringe_1.inject)("IRefreshTokenUseCase")),
    __param(5, (0, tsyringe_1.inject)("IBlackListTokenUseCase")),
    __param(6, (0, tsyringe_1.inject)("IRevokeRefreshTokenUseCase")),
    __param(7, (0, tsyringe_1.inject)("IGenerateTokenUseCase")),
    __param(8, (0, tsyringe_1.inject)("IForgotPasswordUseCase")),
    __param(9, (0, tsyringe_1.inject)("IGoogleUseCase")),
    __param(10, (0, tsyringe_1.inject)("IResetPasswordUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthController);
