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
exports.PostRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base.repository");
const post_model_1 = require("../../../frameworks/database/mongoDb/models/post.model");
let PostRepository = class PostRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(post_model_1.PostModel);
    }
    findAllPosts(filter, skip, limit, userId, isForClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchStage = {
                $match: Object.assign(Object.assign({}, (filter.barberId ? { barberId: filter.barberId } : {})), (filter.status ? { status: filter.status } : {})),
            };
            const aggregationPipeline = [matchStage];
            // if (!isForClient) {
            aggregationPipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });
            // } else {
            //   aggregationPipeline.push({ $sample: { size: limit } });
            // }
            aggregationPipeline.push({
                $lookup: {
                    from: "barbers",
                    localField: "barberId",
                    foreignField: "userId",
                    as: "barberDetails",
                },
            }, {
                $lookup: {
                    from: "comments",
                    localField: "postId",
                    foreignField: "postId",
                    as: "commentsList",
                },
            }, {
                $addFields: {
                    userDetails: {
                        $cond: [
                            { $gt: [{ $size: "$barberDetails" }, 0] },
                            {
                                fullName: { $arrayElemAt: ["$barberDetails.shopName", 0] },
                                avatar: { $arrayElemAt: ["$barberDetails.avatar", 0] },
                            },
                            null,
                        ],
                    },
                    likesCount: {
                        $size: { $ifNull: ["$likes", []] },
                    },
                    totalComments: {
                        $size: { $ifNull: ["$commentsList", []] },
                    },
                    isLiked: {
                        $cond: [
                            { $in: [userId, { $ifNull: ["$likes", []] }] },
                            true,
                            false,
                        ],
                    },
                },
            }, {
                $project: {
                    barberDetails: 0,
                    commentsList: 0,
                    likes: 0,
                },
            });
            const [items, total] = yield Promise.all([
                post_model_1.PostModel.aggregate(aggregationPipeline),
                post_model_1.PostModel.countDocuments(filter),
            ]);
            return { items, total };
        });
    }
    getSinglePostByPostId(filter, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const aggregationPipeline = [
                { $match: filter },
                {
                    $lookup: {
                        from: "barbers",
                        localField: "barberId",
                        foreignField: "userId",
                        as: "barberDetails",
                    },
                },
                {
                    $addFields: {
                        userDetails: {
                            $cond: [
                                { $gt: [{ $size: "$barberDetails" }, 0] },
                                {
                                    fullName: { $arrayElemAt: ["$barberDetails.shopName", 0] },
                                    avatar: { $arrayElemAt: ["$barberDetails.avatar", 0] },
                                },
                                null,
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "postId",
                        foreignField: "postId",
                        as: "comments",
                    },
                },
                {
                    $unwind: {
                        path: "$comments",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "clients",
                        localField: "comments.userId",
                        foreignField: "userId",
                        as: "clientCommentUser",
                    },
                },
                {
                    $lookup: {
                        from: "barbers",
                        localField: "comments.userId",
                        foreignField: "userId",
                        as: "barberCommentUser",
                    },
                },
                {
                    $addFields: {
                        "comments.userDetails": {
                            $cond: [
                                { $gt: [{ $size: "$clientCommentUser" }, 0] },
                                {
                                    fullName: { $arrayElemAt: ["$clientCommentUser.fullName", 0] },
                                    avatar: { $arrayElemAt: ["$clientCommentUser.avatar", 0] },
                                },
                                {
                                    $cond: [
                                        { $gt: [{ $size: "$barberCommentUser" }, 0] },
                                        {
                                            fullName: {
                                                $arrayElemAt: ["$barberCommentUser.shopName", 0],
                                            },
                                            avatar: { $arrayElemAt: ["$barberCommentUser.avatar", 0] },
                                        },
                                        null,
                                    ],
                                },
                            ],
                        },
                        "comments.isCommentLiked": {
                            $cond: [
                                { $in: [userId, { $ifNull: ["$comments.likes", []] }] },
                                true,
                                false,
                            ],
                        },
                        "comments.likesCount": {
                            $size: {
                                $ifNull: ["$comments.likes", []],
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$postId",
                        postId: { $first: "$postId" },
                        caption: { $first: "$caption" },
                        description: { $first: "$description" },
                        image: { $first: "$image" },
                        barberId: { $first: "$barberId" },
                        userDetails: { $first: "$userDetails" },
                        status: { $first: "$status" },
                        likes: { $first: "$likes" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        comments: {
                            $push: {
                                $cond: [
                                    { $ifNull: ["$comments.commentId", false] },
                                    "$comments",
                                    "$$REMOVE",
                                ],
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        comments: {
                            $cond: [{ $eq: [{ $size: "$comments" }, 0] }, [], "$comments"],
                        },
                        isLiked: {
                            $cond: [
                                { $in: [userId, { $ifNull: ["$likes", []] }] },
                                true,
                                false,
                            ],
                        },
                        likesCount: {
                            $size: {
                                $ifNull: ["$likes", []],
                            },
                        },
                    },
                },
                { $limit: 1 },
            ];
            const result = yield post_model_1.PostModel.aggregate(aggregationPipeline);
            return result[0] || null;
        });
    }
    addLike(_a) {
        return __awaiter(this, arguments, void 0, function* ({ postId, userId, }) {
            return yield post_model_1.PostModel.findOneAndUpdate({ postId }, { $addToSet: { likes: userId } }, { new: true });
        });
    }
    removeLike(_a) {
        return __awaiter(this, arguments, void 0, function* ({ postId, userId, }) {
            return yield post_model_1.PostModel.findOneAndUpdate({ postId }, { $pull: { likes: userId } }, { new: true });
        });
    }
    getLikedUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ postId, }) {
            const likedUsers = yield post_model_1.PostModel.aggregate([
                { $match: { postId } },
                { $unwind: "$likes" },
                {
                    $lookup: {
                        from: "clients",
                        localField: "likes",
                        foreignField: "userId",
                        as: "clientUser",
                    },
                },
                { $unwind: { path: "$clientUser", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "barbers",
                        localField: "likes",
                        foreignField: "userId",
                        as: "barberUser",
                    },
                },
                { $unwind: { path: "$barberUser", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        userId: "$likes",
                        fullName: {
                            $cond: [
                                { $ifNull: ["$clientUser.fullName", false] },
                                "$clientUser.fullName",
                                "$barberUser.shopName",
                            ],
                        },
                        avatar: {
                            $cond: [
                                { $ifNull: ["$clientUser.avatar", false] },
                                "$clientUser.avatar",
                                "$barberUser.avatar",
                            ],
                        },
                    },
                },
            ]);
            return likedUsers;
        });
    }
};
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], PostRepository);
