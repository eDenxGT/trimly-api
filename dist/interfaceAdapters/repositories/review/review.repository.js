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
import { ReviewModel, } from "../../../frameworks/database/mongoDb/models/review.model.js";
import { BaseRepository } from "../base.repository.js";
let ReviewRepository = class ReviewRepository extends BaseRepository {
    constructor() {
        super(ReviewModel);
    }
    async getReviewStatsByShopId({ shopId, }) {
        const result = await ReviewModel.aggregate([
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
            averageRating: Number(result[0]?.averageRating?.toFixed(1) || 0),
            totalReviews: result[0]?.totalReviews || 0,
        };
    }
    async getLatestReviews(shopId) {
        return ReviewModel.aggregate([
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
    }
};
ReviewRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ReviewRepository);
export { ReviewRepository };
