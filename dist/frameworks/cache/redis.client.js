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
exports.redisClient = void 0;
const redis_1 = require("redis");
const config_1 = require("../../shared/config");
const chalk_1 = __importDefault(require("chalk"));
exports.redisClient = (0, redis_1.createClient)({
    // url: config.redis.REDIS_URL,
    username: config_1.config.redis.REDIS_USERNAME,
    password: config_1.config.redis.REDIS_PASS,
    socket: {
        host: config_1.config.redis.REDIS_HOST,
        port: parseInt(config_1.config.redis.REDIS_PORT),
    },
});
exports.redisClient.on("error", (err) => console.log("Redis Client Error", err));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.redisClient.connect();
    console.log(chalk_1.default.yellowBright.bold("\t|         " +
        chalk_1.default.blueBright.bold("📦 Redis connected successfully!") +
        "            |"));
    //    console.log("Redis connected successfully!📦")
}))();
