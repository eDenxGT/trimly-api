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
import { BaseRepository } from "../base.repository.js";
import { HairstyleModel, } from "../../../frameworks/database/mongoDb/models/hairstyle.model.js";
let HairstyleRepository = class HairstyleRepository extends BaseRepository {
    constructor() {
        super(HairstyleModel);
    }
    async searchHairstylesWithPagination(params) {
        const { search = "", skip = 0, limit = 10 } = params;
        const query = {};
        if (search.trim()) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { name: { $regex: regex } },
                { faceShapes: { $in: [regex] } },
                { hairstyleId: { $regex: regex } },
            ];
        }
        const [hairstyles, total] = await Promise.all([
            this.model
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            this.model.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            hairstyles,
            totalPages,
        };
    }
};
HairstyleRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], HairstyleRepository);
export { HairstyleRepository };
