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
exports.ReviewRepository = void 0;
const tsyringe_1 = require("tsyringe");
const review_model_1 = require("../../../frameworks/database/mongoDb/models/review.model");
const base_repository_1 = require("../base.repository");
let ReviewRepository = class ReviewRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(review_model_1.ReviewModel);
    }
    getReviewStatsByShopId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ shopId, }) {
            var _b, _c, _d;
            const result = yield review_model_1.ReviewModel.aggregate([
                {
                    $match: { shopId },
                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: "$rating" },
                        totalReviews: { $sum: 1 },
                    },
                },
            ]);
            return {
                averageRating: Number(((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.averageRating) === null || _c === void 0 ? void 0 : _c.toFixed(1)) || 0),
                totalReviews: ((_d = result[0]) === null || _d === void 0 ? void 0 : _d.totalReviews) || 0,
            };
        });
    }
    getLatestReviews(shopId) {
        return __awaiter(this, void 0, void 0, function* () {
            return review_model_1.ReviewModel.aggregate([
                { $match: { shopId } },
                { $sort: { createdAt: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "clients",
                        localField: "reviewerId",
                        foreignField: "userId",
                        as: "client",
                    },
                },
                { $unwind: "$client" },
                {
                    $project: {
                        reviewId: 1,
                        rating: 1,
                        comment: "$reviewText",
                        createdAt: 1,
                        clientName: "$client.fullName",
                        clientAvatar: "$client.avatar",
                    },
                },
            ]);
        });
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ReviewRepository);
