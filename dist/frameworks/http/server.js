"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
//* ====== Module Imports ====== *//
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//* ====== Config Import ====== *//
const config_1 = require("../../shared/config");
//* ====== Middleware Imports ====== *//
const not_found_middleware_1 = require("../../interfaceAdapters/middlewares/not-found.middleware");
//* ====== Route Imports ====== *//
const auth_route_1 = require("../routes/auth.route");
const private_route_1 = require("../routes/private/private.route");
const morgan_logger_1 = __importDefault(require("../../shared/utils/morgan.logger"));
//* ====== Express App ====== *//
class ExpressServer {
    constructor() {
        this._app = (0, express_1.default)();
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    //* ====== Middlewares Configurations ====== *//
    configureMiddlewares() {
        // this._app.use(morgan(config.loggerStatus));
        this._app.use(morgan_logger_1.default);
        this._app.use((0, helmet_1.default)());
        this._app.use((0, cors_1.default)({
            origin: config_1.config.cors.ALLOWED_ORIGIN,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Authorization", "Content-Type"],
            credentials: true,
        }));
        // this._app.use(express.json());
        this._app.use((req, res, next) => {
            express_1.default.json()(req, res, next);
        });
        this._app.use((0, cookie_parser_1.default)());
        this._app.use((0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 1000,
        }));
    }
    //* ====== Routes Configurations ====== *//
    configureRoutes() {
        this._app.use("/api/v1/auth", new auth_route_1.AuthRoutes().router);
        this._app.use("/api/v1/pvt", new private_route_1.PrivateRoutes().router);
        this._app.use("*", not_found_middleware_1.notFound);
    }
    //* ====== Error Configurations ====== *//
    configureErrorHandling() {
        // this._app.use(errorHandler);
    }
    //* ====== Get App ====== *//
    getApp() {
        return this._app;
    }
}
exports.ExpressServer = ExpressServer;
