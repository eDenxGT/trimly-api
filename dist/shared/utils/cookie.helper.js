import { config } from "../config.js";
export const setAuthCookies = (res, accessToken, refreshToken, accessTokenName, refreshTokenName) => {
    const isProduction = config.server.NODE_ENV === "production";
    res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
    });
    res.cookie(refreshTokenName, refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
    });
};
export const updateCookieWithAccessToken = (res, accessToken, accessTokenName) => {
    const isProduction = config.server.NODE_ENV === "production";
    res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
    });
};
export const clearAuthCookies = (res, accessTokenName, refreshTokenName) => {
    res.clearCookie(accessTokenName);
    res.clearCookie(refreshTokenName);
};
