var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { ClientModel, } from "../../../frameworks/database/mongoDb/models/client.model.js";
import { BaseRepository } from "../base.repository.js";
let ClientRepository = class ClientRepository extends BaseRepository {
    constructor() {
        super(ClientModel);
    }
    async updateWallet(userId, amount) {
        if (!amount || isNaN(amount))
            return;
        await ClientModel.updateOne({ userId }, { $inc: { walletBalance: amount } });
    }
    async getRecentClients() {
        const clients = await ClientModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select("userId fullName createdAt")
            .lean();
        return clients.map((client) => ({
            userId: client.userId || "",
            name: client.fullName || "",
            createdAt: client.createdAt || new Date(),
        }));
    }
};
ClientRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ClientRepository);
export { ClientRepository };
