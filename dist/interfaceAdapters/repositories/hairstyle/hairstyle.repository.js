"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairstyleRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base.repository");
const hairstyle_model_1 = require("../../../frameworks/database/mongoDb/models/hairstyle.model");
let HairstyleRepository = class HairstyleRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(hairstyle_model_1.HairstyleModel);
    }
    searchHairstylesWithPagination(params) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const [hairstyles, total] = yield Promise.all([
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
        });
    }
};
exports.HairstyleRepository = HairstyleRepository;
exports.HairstyleRepository = HairstyleRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], HairstyleRepository);
