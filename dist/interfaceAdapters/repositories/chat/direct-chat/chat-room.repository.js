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
exports.ChatRoomRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../../base.repository");
const chat_room_model_1 = require("../../../../frameworks/database/mongoDb/models/chat/chat-room.model");
let ChatRoomRepository = class ChatRoomRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(chat_room_model_1.ChatRoomModel);
    }
    getChatRoomByChatId(chatId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const otherRole = role === "client" ? "barber" : "client";
            const participantCollection = otherRole === "barber" ? "barbers" : "clients";
            const chat = yield chat_room_model_1.ChatRoomModel.aggregate([
                { $match: { chatRoomId: chatId } },
                {
                    $lookup: {
                        from: participantCollection,
                        localField: `${otherRole}Id`,
                        foreignField: "userId",
                        as: "participantUser",
                    },
                },
                { $unwind: "$participantUser" },
                {
                    $lookup: {
                        from: "directmessages",
                        localField: "chatRoomId",
                        foreignField: "chatRoomId",
                        as: "messages",
                    },
                },
                {
                    $addFields: {
                        messages: {
                            $sortArray: {
                                input: "$messages",
                                sortBy: { timestamp: 1 },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        chatRoomId: 1,
                        participant: {
                            userId: "$participantUser.userId",
                            name: {
                                $ifNull: [
                                    "$participantUser.fullName",
                                    "$participantUser.shopName",
                                ],
                            },
                            profileImageUrl: "$participantUser.avatar",
                            role: otherRole,
                        },
                        messages: {
                            $map: {
                                input: "$messages",
                                as: "msg",
                                in: {
                                    messageId: "$$msg.messageId",
                                    chatRoomId: "$$msg.chatRoomId",
                                    senderId: "$$msg.senderId",
                                    receiverId: "$$msg.receiverId",
                                    messageType: "$$msg.messageType",
                                    content: "$$msg.content",
                                    mediaUrl: "$$msg.mediaUrl",
                                    timestamp: "$$msg.timestamp",
                                    status: "$$msg.status",
                                },
                            },
                        },
                    },
                },
            ]);
            return chat[0] || null;
        });
    }
    getChatRoomByUserId(currentUserId, opponentUserId, currentUserRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchQuery = currentUserRole === "client"
                ? { clientId: currentUserId, barberId: opponentUserId }
                : { clientId: opponentUserId, barberId: currentUserId };
            const otherRole = currentUserRole === "client" ? "barber" : "client";
            const participantCollection = otherRole === "barber" ? "barbers" : "clients";
            const chat = yield chat_room_model_1.ChatRoomModel.aggregate([
                { $match: matchQuery },
                {
                    $lookup: {
                        from: participantCollection,
                        localField: `${otherRole}Id`,
                        foreignField: "userId",
                        as: "participantUser",
                    },
                },
                { $unwind: "$participantUser" },
                {
                    $lookup: {
                        from: "directmessages",
                        localField: "chatRoomId",
                        foreignField: "chatRoomId",
                        as: "messages",
                    },
                },
                {
                    $addFields: {
                        messages: {
                            $sortArray: {
                                input: "$messages",
                                sortBy: { timestamp: 1 },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        chatRoomId: 1,
                        participant: {
                            userId: "$participantUser.userId",
                            name: {
                                $ifNull: [
                                    "$participantUser.fullName",
                                    "$participantUser.shopName",
                                ],
                            },
                            profileImageUrl: "$participantUser.avatar",
                            role: otherRole,
                        },
                        messages: {
                            $map: {
                                input: "$messages",
                                as: "msg",
                                in: {
                                    messageId: "$$msg.messageId",
                                    chatRoomId: "$$msg.chatRoomId",
                                    senderId: "$$msg.senderId",
                                    receiverId: "$$msg.receiverId",
                                    messageType: "$$msg.messageType",
                                    content: "$$msg.content",
                                    mediaUrl: "$$msg.mediaUrl",
                                    timestamp: "$$msg.timestamp",
                                    status: "$$msg.status",
                                },
                            },
                        },
                    },
                },
            ]);
            return chat[0] || null;
        });
    }
    getAllChatsByUserId(userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchField = userRole === "client" ? "clientId" : "barberId";
            const otherRole = userRole === "client" ? "barber" : "client";
            const participantCollection = otherRole === "barber" ? "barbers" : "clients";
            const chats = yield chat_room_model_1.ChatRoomModel.aggregate([
                {
                    $match: {
                        [matchField]: userId,
                    },
                },
                {
                    $lookup: {
                        from: participantCollection,
                        localField: `${otherRole}Id`,
                        foreignField: "userId",
                        as: "participantUser",
                    },
                },
                { $unwind: "$participantUser" },
                {
                    $lookup: {
                        from: "directmessages",
                        let: { roomId: "$chatRoomId", userId: userId },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$chatRoomId", "$$roomId"] } } },
                            { $sort: { timestamp: -1 } },
                            { $limit: 1 },
                        ],
                        as: "lastMessage",
                    },
                },
                {
                    $lookup: {
                        from: "directmessages",
                        let: { roomId: "$chatRoomId", userId: userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$chatRoomId", "$$roomId"] },
                                            { $eq: ["$receiverId", "$$userId"] },
                                            { $eq: ["$status", "sent"] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "unreadMessages",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        chatRoomId: 1,
                        user: {
                            userId: "$participantUser.userId",
                            name: {
                                $ifNull: [
                                    "$participantUser.fullName",
                                    "$participantUser.shopName",
                                ],
                            },
                            profileImageUrl: "$participantUser.avatar",
                            role: otherRole,
                        },
                        lastMessage: {
                            $cond: [
                                { $gt: [{ $size: "$lastMessage" }, 0] },
                                {
                                    content: { $arrayElemAt: ["$lastMessage.content", 0] },
                                    mediaUrl: { $arrayElemAt: ["$lastMessage.mediaUrl", 0] },
                                    messageType: { $arrayElemAt: ["$lastMessage.messageType", 0] },
                                    timestamp: { $arrayElemAt: ["$lastMessage.timestamp", 0] },
                                    senderId: { $arrayElemAt: ["$lastMessage.senderId", 0] },
                                },
                                {
                                    content: null,
                                    mediaUrl: null,
                                    messageType: "text",
                                    timestamp: null,
                                    senderId: null,
                                },
                            ],
                        },
                        unreadCount: { $size: "$unreadMessages" },
                    },
                },
                { $sort: { "lastMessage.timestamp": -1 } },
            ]);
            return chats;
        });
    }
};
exports.ChatRoomRepository = ChatRoomRepository;
exports.ChatRoomRepository = ChatRoomRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ChatRoomRepository);
