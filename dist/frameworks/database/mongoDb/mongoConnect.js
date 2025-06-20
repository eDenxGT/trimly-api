"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../../shared/config");
const chalk_1 = __importDefault(require("chalk"));
class MongoConnect {
    constructor() {
        this._dbUrl = config_1.config.database.URI;
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(this._dbUrl);
                console.log(chalk_1.default.yellowBright.bold("\t|              " +
                    chalk_1.default.greenBright.bold("Connected to MongoDB😊") +
                    "                 |"));
                console.log(chalk_1.default.yellowBright.bold(`\t|                                                     |`));
                console.log(chalk_1.default.yellowBright.bold(`\t-------------------------------------------------------`));
                // console.log(
                // 	"\t|         " +
                // 		"📦 Database connected successfully" +
                // 		"          |"
                // );
                // console.log(
                // 	`\t|                                                     |`
                // );
                // console.log(
                // 	`\t-------------------------------------------------------`
                // );
                // console.log("Database connected successfully. 📦");
                mongoose_1.default.connection.on("error", (error) => {
                    const errorMessage = chalk_1.default.redBright.bold("MongoDB connection error: " + error);
                    console.log(errorMessage);
                });
                mongoose_1.default.connection.on("disconnected", () => {
                    console.log("MongoDB disconnected");
                });
            }
            catch (error) {
                console.error("Failed to connect to MongoDB:", error);
                throw new Error("Database connection failed");
            }
        });
    }
    disconnectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connection.close();
                console.log("✅ MongoDB Disconnected");
            }
            catch (err) {
                console.error("❌ Error Disconnecting MongoDB:", err);
            }
        });
    }
}
exports.MongoConnect = MongoConnect;
