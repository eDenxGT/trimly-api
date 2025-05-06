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
import { userSchemas } from "./validations/user-signup.validation.schema.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES, } from "../../../shared/constants.js";
import { handleErrorResponse } from "../../../shared/utils/error.handler.js";
import { otpMailValidationSchema } from "./validations/otp-mail.validation.schema.js";
import { clearAuthCookies, setAuthCookies, updateCookieWithAccessToken, } from "../../../shared/utils/cookie.helper.js";
import { loginSchema } from "./validations/user-login.validation.schema.js";
import { forgotPasswordValidationSchema } from "./validations/forgot-password.validation.schema.js";
import { resetPasswordValidationSchema } from "./validations/reset-password.validation.schema.js";
let AuthController = class AuthController {
    _registerUserUseCase;
    _verifyOtpUseCase;
    _sendOtpEmailUseCase;
    _loginUserUseCase;
    _refreshTokenUseCase;
    _blackListTokenUseCase;
    _revokeRefreshToken;
    _generateTokenUseCase;
    _forgotPasswordUseCase;
    _googleUseCase;
    _resetPasswordUseCase;
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
    async register(req, res) {
        try {
            const { role } = req.body;
            const schema = userSchemas[role];
            if (!schema) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_CREDENTIALS,
                });
                return;
            }
            const validatedData = schema.parse(req.body);
            await this._registerUserUseCase.execute(validatedData);
            if (role === "barber") {
                res.status(HTTP_STATUS.CREATED).json({
                    success: true,
                    message: SUCCESS_MESSAGES.LOGIN_AND_COMPLETE_YOUR_PROFILE,
                });
                return;
            }
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ User Login
    //* ─────────────────────────────────────────────────────────────
    async login(req, res) {
        try {
            const data = req.body;
            const validatedData = loginSchema.parse(data);
            if (!validatedData) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_CREDENTIALS,
                });
            }
            const user = await this._loginUserUseCase.execute(validatedData);
            if (!user.userId || !user.email || !user.role) {
                throw new Error("User ID, email, or role is missing");
            }
            const tokens = await this._generateTokenUseCase.execute(user.userId, user.email, user.role);
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            setAuthCookies(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
            const { password, ...userWithoutPassword } = user;
            if (userWithoutPassword.status === "pending" &&
                userWithoutPassword.role === "barber") {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: SUCCESS_MESSAGES.COMPLETE_YOUR_PROFILE_TO_GET_APPROVED,
                    user: {
                        ...userWithoutPassword,
                    },
                });
                return;
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: {
                    ...userWithoutPassword,
                },
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Google Authentication
    //* ─────────────────────────────────────────────────────────────
    async authenticateWithGoogle(req, res) {
        try {
            const { credential, client_id, role } = req.body;
            const user = await this._googleUseCase.execute(credential, client_id, role);
            if (!user.userId || !user.email || !user.role) {
                throw new Error("User ID, email, or role is missing");
            }
            const tokens = await this._generateTokenUseCase.execute(user.userId, user.email, user.role);
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            setAuthCookies(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: user,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ User Logout
    //* ─────────────────────────────────────────────────────────────
    async logout(req, res) {
        try {
            await this._blackListTokenUseCase.execute(req.user.access_token);
            await this._revokeRefreshToken.execute(req.user.refresh_token);
            const user = req.user;
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            clearAuthCookies(res, accessTokenName, refreshTokenName);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ User Forgot Password
    //* ─────────────────────────────────────────────────────────────
    async forgotPassword(req, res) {
        try {
            const validatedData = forgotPasswordValidationSchema.parse(req.body);
            if (!validatedData) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.VALIDATION_ERROR,
                });
                return;
            }
            await this._forgotPasswordUseCase.execute(validatedData);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ User Reset Password
    //* ─────────────────────────────────────────────────────────────
    async resetPassword(req, res) {
        try {
            const validatedData = resetPasswordValidationSchema.parse(req.body);
            if (!validatedData) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.VALIDATION_ERROR,
                });
            }
            await this._resetPasswordUseCase.execute(validatedData);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️ Token Refresh Handler
    //* ─────────────────────────────────────────────────────────────
    handleTokenRefresh(req, res) {
        try {
            const refreshToken = req.user.refresh_token;
            const newTokens = this._refreshTokenUseCase.execute(refreshToken);
            const accessTokenName = `${newTokens.role}_access_token`;
            updateCookieWithAccessToken(res, newTokens.accessToken, accessTokenName);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
            });
        }
        catch (error) {
            clearAuthCookies(res, `${req.user.role}_access_token`, `${req.user.role}_refresh_token`);
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.INVALID_TOKEN,
            });
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Sent Otp Email
    //* ─────────────────────────────────────────────────────────────
    async sendOtpEmail(req, res) {
        try {
            const { email } = req.body;
            await this._sendOtpEmailUseCase.execute(email);
            res.status(HTTP_STATUS.OK).json({
                message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                      🛠️ Verify Otp
    //* ─────────────────────────────────────────────────────────────
    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const validatedData = otpMailValidationSchema.parse({ email, otp });
            await this._verifyOtpUseCase.execute(validatedData);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
AuthController = __decorate([
    injectable(),
    __param(0, inject("IRegisterUserUseCase")),
    __param(1, inject("IVerifyOtpUseCase")),
    __param(2, inject("ISendOtpEmailUseCase")),
    __param(3, inject("ILoginUserUseCase")),
    __param(4, inject("IRefreshTokenUseCase")),
    __param(5, inject("IBlackListTokenUseCase")),
    __param(6, inject("IRevokeRefreshTokenUseCase")),
    __param(7, inject("IGenerateTokenUseCase")),
    __param(8, inject("IForgotPasswordUseCase")),
    __param(9, inject("IGoogleUseCase")),
    __param(10, inject("IResetPasswordUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthController);
export { AuthController };
