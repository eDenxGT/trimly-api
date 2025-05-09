import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { JWTService } from "../services/jwt.service.js";
import { redisClient } from "./../../frameworks/cache/redis.client.js";
const tokenService = new JWTService();
//* ─────────────────────────────────────────────────────────────
//*                  🛠️ VerifyAuth Middleware
//* ─────────────────────────────────────────────────────────────
export const verifyAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
            });
            return;
        }
        if (await isBlacklisted(token.access_token)) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: ERROR_MESSAGES.TOKEN_BLACKLISTED,
            });
            return;
        }
        const user = tokenService.verifyAccessToken(token.access_token);
        if (!user || !user.userId) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.TOKEN_EXPIRED,
            });
            return;
        }
        req.user = {
            ...user,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
        };
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            console.log(error.name);
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.TOKEN_EXPIRED,
            });
            return;
        }
        console.log("Invalid token response sent");
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: ERROR_MESSAGES.INVALID_TOKEN,
        });
        return;
    }
};
//* ─────────────────────────────────────────────────────────────
//*                 🛠️ Extract Token Helper Fn
//* ─────────────────────────────────────────────────────────────
const extractToken = (req) => {
    const userType = req.path.split("/")[1];
    if (!userType)
        return null;
    return {
        access_token: req.cookies?.[`${userType}_access_token`] ?? null,
        refresh_token: req.cookies?.[`${userType}_refresh_token`] ?? null,
    };
};
//* ─────────────────────────────────────────────────────────────
//*                  🛠️ Blacklist checker Fn
//* ─────────────────────────────────────────────────────────────
const isBlacklisted = async (token) => {
    try {
        const result = await redisClient.get(token);
        return result !== null;
    }
    catch (error) {
        console.error("Redis error:", error);
        return false;
    }
};
//* ─────────────────────────────────────────────────────────────
//*                 🛠️ Authorize Role Middleware
//* ─────────────────────────────────────────────────────────────
export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: ERROR_MESSAGES.NOT_ALLOWED,
                userRole: user ? user.role : "none",
            });
            return;
        }
        next();
    };
};
//* ─────────────────────────────────────────────────────────────
//*                 🛠️ Decode Token Middleware
//* ─────────────────────────────────────────────────────────────
export const decodeToken = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
            });
            return;
        }
        if (await isBlacklisted(token.access_token)) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                message: ERROR_MESSAGES.TOKEN_BLACKLISTED,
            });
            return;
        }
        const user = tokenService.decodeAccessToken(token?.access_token);
        // console.log(`Decoded`, user);
        req.user = {
            userId: user?.userId,
            email: user?.email,
            role: user?.role,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
        };
        next();
    }
    catch (error) { }
};
