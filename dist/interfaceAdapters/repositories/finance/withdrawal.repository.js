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
exports.WithdrawalRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base.repository");
const withdrawal_model_1 = require("../../../frameworks/database/mongoDb/models/withdrawal.model");
let WithdrawalRepository = class WithdrawalRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(withdrawal_model_1.WithdrawalModel);
    }
    findUserWithdrawals(filters, pagination, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchStage = {};
            if (filters.status && filters.status !== "all") {
                matchStage.status = filters.status;
            }
            if (filters.method && filters.method !== "all") {
                matchStage.method = filters.method;
            }
            const aggregationPipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: "clients",
                        let: { userId: "$userId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                            { $project: { fullName: 1, avatar: 1, _id: 0 } },
                        ],
                        as: "clientDetails",
                    },
                },
                {
                    $lookup: {
                        from: "barbers",
                        let: { userId: "$userId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                            { $project: { shopName: 1, avatar: 1, _id: 0 } },
                        ],
                        as: "barberDetails",
                    },
                },
                {
                    $addFields: {
                        userDetails: {
                            $cond: {
                                if: { $gt: [{ $size: "$clientDetails" }, 0] },
                                then: {
                                    $mergeObjects: [
                                        { $arrayElemAt: ["$clientDetails", 0] },
                                    ],
                                },
                                else: {
                                    $mergeObjects: [
                                        {
                                            fullName: {
                                                $arrayElemAt: [
                                                    "$barberDetails.shopName",
                                                    0,
                                                ],
                                            },
                                            avatar: {
                                                $arrayElemAt: [
                                                    "$barberDetails.avatar",
                                                    0,
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        clientDetails: 0,
                        barberDetails: 0,
                    },
                },
                ...(filters.search
                    ? [
                        {
                            $match: {
                                $or: [
                                    {
                                        withdrawalId: {
                                            $regex: filters.search,
                                            $options: "i",
                                        },
                                    },
                                    {
                                        referenceId: {
                                            $regex: filters.search,
                                            $options: "i",
                                        },
                                    },
                                    {
                                        "userDetails.fullName": {
                                            $regex: filters.search,
                                            $options: "i",
                                        },
                                    },
                                ],
                            },
                        },
                    ]
                    : []),
                {
                    $facet: {
                        data: [
                            {
                                $sort: {
                                    [sort.field]: sort.direction === "asc" ? 1 : -1,
                                },
                            },
                            { $skip: pagination.offset },
                            { $limit: pagination.limit },
                        ],
                        totalCount: [{ $count: "count" }],
                    },
                },
                {
                    $unwind: {
                        path: "$totalCount",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        data: 1,
                        total: "$totalCount.count",
                    },
                },
            ];
            const result = yield withdrawal_model_1.WithdrawalModel.aggregate(aggregationPipeline);
            const finalResult = result[0] || { data: [], total: 0 };
            return {
                withdrawals: finalResult.data,
                total: finalResult.total || 0,
            };
        });
    }
};
exports.WithdrawalRepository = WithdrawalRepository;
exports.WithdrawalRepository = WithdrawalRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], WithdrawalRepository);
