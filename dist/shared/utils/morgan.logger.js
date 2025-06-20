"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("../../shared/config");
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const logDirectory = path_1.default.resolve(__dirname, "../../../logs");
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory, { recursive: true });
}
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(logDirectory, "requests.log"), { flags: "a" });
morgan_1.default.token("date", () => new Date().toISOString());
morgan_1.default.token("custom-status", (req, res) => `\x1b${res.statusCode}\x1b[0m`);
morgan_1.default.token("customDate", () => {
    return new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    });
});
const customFormat = `:remote-addr - :method :url :status :response-time ms - :res[content-length] bytes [:customDate]`;
const logFormat = config_1.config.loggerStatus || "combined";
const morganLogger = (req, res, next) => {
    if (logFormat) {
        (0, morgan_1.default)(customFormat, { stream: accessLogStream })(req, res, () => { });
        (0, morgan_1.default)(logFormat)(req, res, next);
    }
    else {
        next();
    }
};
exports.default = morganLogger;
