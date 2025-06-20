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
exports.BarberRepository = void 0;
const tsyringe_1 = require("tsyringe");
const barber_model_1 = require("../../../frameworks/database/mongoDb/models/barber.model");
const base_repository_1 = require("../base.repository");
let BarberRepository = class BarberRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(barber_model_1.BarberModel);
    }
    updateRevenue(shopId, revenue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!revenue || isNaN(revenue))
                return;
            yield barber_model_1.BarberModel.updateOne({ userId: shopId }, { $inc: { totalRevenue: revenue, walletBalance: revenue } });
        });
    }
    findAllNearbyShopsWithFilters(filters, sorting, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = pagination;
            const { sortBy, sortOrder } = sorting;
            const skip = (page - 1) * limit;
            const pipeline = [];
            if (filters.location) {
                pipeline.push(filters.location);
            }
            pipeline.push({
                $match: {
                    status: "active",
                },
            });
            if (filters.search) {
                pipeline.push({
                    $lookup: {
                        from: "services",
                        localField: "userId",
                        foreignField: "barberId",
                        as: "services",
                    },
                });
                pipeline.push({
                    $match: {
                        $or: [
                            {
                                "location.displayName": { $regex: filters.search, $options: "i" },
                            },
                            { "location.name": { $regex: filters.search, $options: "i" } },
                            { shopName: { $regex: filters.search, $options: "i" } },
                            { "services.name": { $regex: filters.search, $options: "i" } },
                        ],
                    },
                });
            }
            else {
                pipeline.push({
                    $lookup: {
                        from: "services",
                        localField: "userId",
                        foreignField: "barberId",
                        as: "services",
                    },
                });
            }
            const validAmenities = filters.amenities.filter(Boolean);
            if (validAmenities.length > 0) {
                const amenitiesFilter = {};
                validAmenities.forEach((amenity) => {
                    amenitiesFilter[`amenities.${amenity}`] = true;
                });
                pipeline.push({ $match: amenitiesFilter });
            }
            pipeline.push({
                $lookup: {
                    from: "reviews",
                    localField: "userId",
                    foreignField: "shopId",
                    as: "reviews",
                },
            }, {
                $addFields: {
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviews" }, 0] },
                            then: { $avg: "$reviews.rating" },
                            else: null,
                        },
                    },
                },
            }, {
                $unset: "reviews",
            });
            if (sortBy) {
                pipeline.push({
                    $sort: {
                        [sortBy]: sortOrder === "asc" ? 1 : -1,
                    },
                });
            }
            pipeline.push({ $skip: skip }, { $limit: limit });
            const shops = yield barber_model_1.BarberModel.aggregate(pipeline);
            return shops;
        });
    }
    getBarberShopWithAllDetails(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                { $match: filter },
                {
                    $lookup: {
                        from: "services",
                        let: { barberUserId: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$barberId", "$$barberUserId"],
                                    },
                                },
                            },
                            ...(filter.status === "active"
                                ? [
                                    {
                                        $match: {
                                            status: "active",
                                        },
                                    },
                                ]
                                : []),
                        ],
                        as: "services",
                    },
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: { shopUserId: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$shopId", "$$shopUserId"],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: "clients",
                                    localField: "reviewerId",
                                    foreignField: "userId",
                                    as: "reviewer",
                                },
                            },
                            { $unwind: "$reviewer" },
                            {
                                $project: {
                                    rating: 1,
                                    reviewText: 1,
                                    createdAt: 1,
                                    reviewerId: 1,
                                    "reviewer.fullName": 1,
                                    "reviewer.avatar": 1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        averageRating: { $avg: "$reviews.rating" },
                        totalReviewCount: { $size: "$reviews" },
                    },
                },
            ];
            if (filter.status === "active") {
                pipeline.push({
                    $lookup: {
                        from: "bookings",
                        let: { shopUserId: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$shopId", "$$shopUserId"] },
                                            { $eq: ["$status", "confirmed"] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "bookings",
                    },
                });
            }
            else {
                pipeline.push({
                    $lookup: {
                        from: "bookings",
                        localField: "userId",
                        foreignField: "shopId",
                        as: "bookings",
                    },
                });
            }
            pipeline.push({
                $unwind: {
                    path: "$bookings",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "clients",
                    localField: "bookings.clientId",
                    foreignField: "userId",
                    as: "bookings.client",
                },
            }, {
                $unwind: {
                    path: "$bookings.client",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $group: {
                    _id: "$_id",
                    shopData: { $first: "$$ROOT" },
                    bookings: { $push: "$bookings" },
                },
            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$shopData", { bookings: "$bookings" }],
                    },
                },
            });
            const data = yield barber_model_1.BarberModel.aggregate(pipeline).exec();
            return data[0];
        });
    }
    findNearest3Shops(_a) {
        return __awaiter(this, arguments, void 0, function* ({ latitude, longitude, }) {
            const pipeline = [];
            pipeline.push({
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    distanceField: "distance",
                    spherical: true,
                    query: { status: "active" },
                },
            });
            pipeline.push({
                $lookup: {
                    from: "reviews",
                    localField: "userId",
                    foreignField: "shopId",
                    as: "reviews",
                },
            }, {
                $addFields: {
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviews" }, 0] },
                            then: { $avg: "$reviews.rating" },
                            else: null,
                        },
                    },
                },
            }, {
                $unset: "reviews",
            });
            pipeline.push({
                $sort: {
                    averageRating: -1,
                },
            });
            pipeline.push({
                $limit: 3,
            });
            const shops = yield barber_model_1.BarberModel.aggregate(pipeline);
            return shops;
        });
    }
    getRecentShops() {
        return __awaiter(this, void 0, void 0, function* () {
            const recentShops = yield barber_model_1.BarberModel.aggregate([
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $limit: 5,
                },
                {
                    $project: {
                        userId: 1,
                        name: "$shopName",
                        ownerName: "$ownerName",
                        createdAt: 1,
                        status: 1,
                    },
                },
            ]);
            return recentShops;
        });
    }
};
exports.BarberRepository = BarberRepository;
exports.BarberRepository = BarberRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BarberRepository);
