"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const logDirectory = path_1.default.resolve(__dirname, "../../../logs");
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory, { recursive: true });
}
const socketLogFormat = winston_1.default.format.printf(({ timestamp, level, message, socketId, event, userId }) => {
    const formattedTimestamp = new Date(timestamp).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    return `[${formattedTimestamp}] [${level}] [Socket ID: ${socketId || "N/A"}] [Event: ${event || "N/A"}] [User ID: ${userId || "N/A"}] - ${message}`;
});
const socketLogger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), socketLogFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDirectory, "socket-events.log"),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 3,
        }),
    ],
});
exports.default = socketLogger;
