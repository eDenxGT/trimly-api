//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
//* ====== Controller Imports ====== *//
import { authController } from "../di/resolver.js";
export class AuthRoutes extends BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Authentication Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.post("/signup", (req, res) => {
            authController.register(req, res);
        });
        this.router.post("/signin", (req, res) => {
            authController.login(req, res);
        });
        this.router.post("/google-auth", (req, res) => {
            authController.authenticateWithGoogle(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                      🛠️ OTP Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.post("/send-otp", (req, res) => {
            authController.sendOtpEmail(req, res);
        });
        this.router.post("/verify-otp", (req, res) => {
            authController.verifyOtp(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Password Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.post("/forgot-password", (req, res) => {
            authController.forgotPassword(req, res);
        });
        this.router.post("/reset-password", (req, res) => {
            authController.resetPassword(req, res);
        });
    }
}
