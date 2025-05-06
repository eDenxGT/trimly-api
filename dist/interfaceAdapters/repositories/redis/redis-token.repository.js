var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import { redisClient } from "../../../frameworks/cache/redis.client.js";
let RedisTokenRepository = class RedisTokenRepository {
    async blackListToken(token, expiresIn) {
        await redisClient.set(token, "blacklisted", { EX: expiresIn });
    }
    async isTokenBlackListed(token) {
        const result = await redisClient.get(token);
        return result === "blacklisted";
    }
    // Reset token
    async storeResetToken(userId, token) {
        const key = `reset_token:${userId}`;
        await redisClient.setEx(key, 300, token);
    }
    async verifyResetToken(userId, token) {
        const key = `reset_token:${userId}`;
        const storedToken = await redisClient.get(key);
        return storedToken === token;
    }
    async deleteResetToken(userId) {
        const key = `reset_token:${userId}`;
        await redisClient.del(key);
    }
};
RedisTokenRepository = __decorate([
    injectable()
], RedisTokenRepository);
export { RedisTokenRepository };
