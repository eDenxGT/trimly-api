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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.ChatController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
let ChatController = class ChatController {
    constructor(_getChatByUserUseCase, _getAllChatsByUserUseCase, _getChatByChatIdUseCase, _createCommunityUseCase, _updateCommunityStatusUseCase, _deleteCommunityUseCase, _editCommunityUseCase, _getAllCommunitiesForAdminUseCase, _barberJoinCommunityUseCase, _getCommunityForEditUseCase, _getAllCommunitiesForBarberUseCase, _getAllCommunityChatsByUserUseCase, _getCommunityChatUseCase, _getCommunityMembersUseCase, _removeCommunityMemberUseCase) {
        this._getChatByUserUseCase = _getChatByUserUseCase;
        this._getAllChatsByUserUseCase = _getAllChatsByUserUseCase;
        this._getChatByChatIdUseCase = _getChatByChatIdUseCase;
        this._createCommunityUseCase = _createCommunityUseCase;
        this._updateCommunityStatusUseCase = _updateCommunityStatusUseCase;
        this._deleteCommunityUseCase = _deleteCommunityUseCase;
        this._editCommunityUseCase = _editCommunityUseCase;
        this._getAllCommunitiesForAdminUseCase = _getAllCommunitiesForAdminUseCase;
        this._barberJoinCommunityUseCase = _barberJoinCommunityUseCase;
        this._getCommunityForEditUseCase = _getCommunityForEditUseCase;
        this._getAllCommunitiesForBarberUseCase = _getAllCommunitiesForBarberUseCase;
        this._getAllCommunityChatsByUserUseCase = _getAllCommunityChatsByUserUseCase;
        this._getCommunityChatUseCase = _getCommunityChatUseCase;
        this._getCommunityMembersUseCase = _getCommunityMembersUseCase;
        this._removeCommunityMemberUseCase = _removeCommunityMemberUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get Chat By Id
    //* ─────────────────────────────────────────────────────────────
    getChatById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, userId: currentUserId } = req.user;
                const { userId: opponentUserId, chatId } = req.query;
                if (chatId) {
                    const chat = yield this._getChatByChatIdUseCase.execute(String(chatId), role);
                    res.status(constants_1.HTTP_STATUS.OK).json({
                        success: true,
                        chat,
                    });
                    return;
                }
                if (!opponentUserId || !currentUserId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const chat = yield this._getChatByUserUseCase.execute(String(opponentUserId), currentUserId, role);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    chat,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get All Chats By User Id
    //* ─────────────────────────────────────────────────────────────
    getAllChatsByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, userId } = req.user;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const chats = yield this._getAllChatsByUserUseCase.execute(userId, role);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    chats,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️  Create Community (For Admin)
    //* ─────────────────────────────────────────────────────────────
    createCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { communityId, name, description, imageUrl, createdAt } = req.body;
                if (!userId ||
                    !communityId ||
                    !name ||
                    !description ||
                    !imageUrl ||
                    !createdAt) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._createCommunityUseCase.execute({
                    communityId,
                    name,
                    description,
                    imageUrl,
                    createdAt,
                    createdBy: userId,
                });
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.COMMUNITY_CREATED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️  Get All Communities (For Admin)
    //* ─────────────────────────────────────────────────────────────
    getAllCommunitiesForAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { search, page, limit } = req.query;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const communitiesData = yield this._getAllCommunitiesForAdminUseCase.execute({
                    search: String(search),
                    page: Number(page),
                    limit: Number(limit),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    communities: communitiesData.communities,
                    totalPages: communitiesData.totalPages,
                    currentPage: communitiesData.currentPage,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*       🛠️  Get All Communities (For Barber ( LISTING ))
    //* ─────────────────────────────────────────────────────────────
    getAllCommunitiesForBarberListing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { search, page, limit } = req.query;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const communitiesData = yield this._getAllCommunitiesForBarberUseCase.execute({
                    userId,
                    search: String(search),
                    page: Number(page),
                    limit: Number(limit),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    communities: communitiesData.communities,
                    totalPages: communitiesData.totalPages,
                    currentPage: communitiesData.currentPage,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get Community For Edit (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    getCommunityForEdit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId } = req.query;
                if (!communityId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const community = yield this._getCommunityForEditUseCase.execute(String(communityId));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    community,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Edit Community (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    editCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { communityId, name, description, imageUrl } = req.body;
                if (!userId || !communityId || !name || !description || !imageUrl) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._editCommunityUseCase.execute({
                    communityId,
                    name,
                    description,
                    imageUrl,
                });
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.COMMUNITY_CREATED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Update Community Status (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    updateCommunityStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId } = req.body;
                if (!communityId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._updateCommunityStatusUseCase.execute(communityId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Delete Community (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    deleteCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId } = req.query;
                if (!communityId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._deleteCommunityUseCase.execute(String(communityId));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.DELETE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Join Community (For Barber)
    //* ─────────────────────────────────────────────────────────────
    barberJoinCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { communityId } = req.body;
                if (!communityId || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._barberJoinCommunityUseCase.execute({
                    communityId,
                    userId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.JOIN_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get All Community Chats By Barber Id
    //* ─────────────────────────────────────────────────────────────
    getAllCommunityChatsByBarberId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const communityChats = yield this._getAllCommunityChatsByUserUseCase.execute({ userId });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    chats: communityChats,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get Community Members By Community Id
    //* ─────────────────────────────────────────────────────────────
    getCommunityMembers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId } = req.params;
                if (!communityId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const communityMembers = yield this._getCommunityMembersUseCase.execute(communityId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    members: communityMembers,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Remove Community Member
    //* ─────────────────────────────────────────────────────────────
    removeCommunityMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId, userId } = req.params;
                if (!communityId || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._removeCommunityMemberUseCase.execute(communityId, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.REMOVE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get Community Chat By Chat Id For Barber
    //* ─────────────────────────────────────────────────────────────
    getCommunityChatByChatIdForBarber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { chatId } = req.query;
                if (!chatId || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const chat = yield this._getCommunityChatUseCase.execute({
                    userId,
                    chatId: String(chatId),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    chat,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetChatByUserUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetAllChatsByUserUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetChatByChatIdUseCase")),
    __param(3, (0, tsyringe_1.inject)("ICreateCommunityUseCase")),
    __param(4, (0, tsyringe_1.inject)("IUpdateCommunityStatusUseCase")),
    __param(5, (0, tsyringe_1.inject)("IDeleteCommunityUseCase")),
    __param(6, (0, tsyringe_1.inject)("IEditCommunityUseCase")),
    __param(7, (0, tsyringe_1.inject)("IGetAllCommunitiesForAdminUseCase")),
    __param(8, (0, tsyringe_1.inject)("IBarberJoinCommunityUseCase")),
    __param(9, (0, tsyringe_1.inject)("IGetCommunityForEditUseCase")),
    __param(10, (0, tsyringe_1.inject)("IGetAllCommunitiesForBarberUseCase")),
    __param(11, (0, tsyringe_1.inject)("IGetAllCommunityChatsByUserUseCase")),
    __param(12, (0, tsyringe_1.inject)("IGetCommunityChatUseCase")),
    __param(13, (0, tsyringe_1.inject)("IGetCommunityMembersUseCase")),
    __param(14, (0, tsyringe_1.inject)("IRemoveCommunityMemberUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], ChatController);
