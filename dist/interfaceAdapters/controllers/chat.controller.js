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
import { inject, injectable } from "tsyringe";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES, } from "../../shared/constants.js";
let ChatController = class ChatController {
    _getChatByUserUseCase;
    _getAllChatsByUserUseCase;
    _getChatByChatIdUseCase;
    _createCommunityUseCase;
    _updateCommunityStatusUseCase;
    _deleteCommunityUseCase;
    _editCommunityUseCase;
    _getAllCommunitiesForAdminUseCase;
    _barberJoinCommunityUseCase;
    _getCommunityForEditUseCase;
    _getAllCommunitiesForBarberUseCase;
    _getAllCommunityChatsByUserUseCase;
    _getCommunityChatUseCase;
    constructor(_getChatByUserUseCase, _getAllChatsByUserUseCase, _getChatByChatIdUseCase, _createCommunityUseCase, _updateCommunityStatusUseCase, _deleteCommunityUseCase, _editCommunityUseCase, _getAllCommunitiesForAdminUseCase, _barberJoinCommunityUseCase, _getCommunityForEditUseCase, _getAllCommunitiesForBarberUseCase, _getAllCommunityChatsByUserUseCase, _getCommunityChatUseCase) {
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
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get Chat By Id
    //* ─────────────────────────────────────────────────────────────
    async getChatById(req, res) {
        try {
            const { role, userId: currentUserId } = req.user;
            const { userId: opponentUserId, chatId } = req.query;
            if (chatId) {
                const chat = await this._getChatByChatIdUseCase.execute(String(chatId), role);
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    chat,
                });
                return;
            }
            if (!opponentUserId || !currentUserId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const chat = await this._getChatByUserUseCase.execute(String(opponentUserId), currentUserId, role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                chat,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get All Chats By User Id
    //* ─────────────────────────────────────────────────────────────
    async getAllChatsByUserId(req, res) {
        try {
            const { role, userId } = req.user;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const chats = await this._getAllChatsByUserUseCase.execute(userId, role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                chats,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️  Create Community (For Admin)
    //* ─────────────────────────────────────────────────────────────
    async createCommunity(req, res) {
        try {
            const { userId } = req.user;
            const { communityId, name, description, imageUrl, createdAt } = req.body;
            if (!userId ||
                !communityId ||
                !name ||
                !description ||
                !imageUrl ||
                !createdAt) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._createCommunityUseCase.execute({
                communityId,
                name,
                description,
                imageUrl,
                createdAt,
                createdBy: userId,
            });
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.COMMUNITY_CREATED,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*               🛠️  Get All Communities (For Admin)
    //* ─────────────────────────────────────────────────────────────
    async getAllCommunitiesForAdmin(req, res) {
        try {
            const { userId } = req.user;
            const { search, page, limit } = req.query;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const communitiesData = await this._getAllCommunitiesForAdminUseCase.execute({
                search: String(search),
                page: Number(page),
                limit: Number(limit),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                communities: communitiesData.communities,
                totalPages: communitiesData.totalPages,
                currentPage: communitiesData.currentPage,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*       🛠️  Get All Communities (For Barber ( LISTING ))
    //* ─────────────────────────────────────────────────────────────
    async getAllCommunitiesForBarberListing(req, res) {
        try {
            const { userId } = req.user;
            const { search, page, limit } = req.query;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const communitiesData = await this._getAllCommunitiesForBarberUseCase.execute({
                userId,
                search: String(search),
                page: Number(page),
                limit: Number(limit),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                communities: communitiesData.communities,
                totalPages: communitiesData.totalPages,
                currentPage: communitiesData.currentPage,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get Community For Edit (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    async getCommunityForEdit(req, res) {
        try {
            const { communityId } = req.query;
            if (!communityId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const community = await this._getCommunityForEditUseCase.execute(String(communityId));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                community,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Edit Community (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    async editCommunity(req, res) {
        try {
            const { userId } = req.user;
            const { communityId, name, description, imageUrl } = req.body;
            if (!userId || !communityId || !name || !description || !imageUrl) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._editCommunityUseCase.execute({
                communityId,
                name,
                description,
                imageUrl,
            });
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.COMMUNITY_CREATED,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Update Community Status (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    async updateCommunityStatus(req, res) {
        try {
            const { communityId } = req.body;
            if (!communityId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._updateCommunityStatusUseCase.execute(communityId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Delete Community (For ADMIN)
    //* ─────────────────────────────────────────────────────────────
    async deleteCommunity(req, res) {
        try {
            const { communityId } = req.query;
            if (!communityId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._deleteCommunityUseCase.execute(String(communityId));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DELETE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Join Community (For Barber)
    //* ─────────────────────────────────────────────────────────────
    async barberJoinCommunity(req, res) {
        try {
            const { userId } = req.user;
            const { communityId } = req.body;
            if (!communityId || !userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._barberJoinCommunityUseCase.execute({
                communityId,
                userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.JOIN_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get All Community Chats By Barber Id
    //* ─────────────────────────────────────────────────────────────
    async getAllCommunityChatsByBarberId(req, res) {
        try {
            const { userId } = req.user;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const communityChats = await this._getAllCommunityChatsByUserUseCase.execute({ userId });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                chats: communityChats,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get Community Chat By Chat Id For Barber
    //* ─────────────────────────────────────────────────────────────
    async getCommunityChatByChatIdForBarber(req, res) {
        try {
            const { userId } = req.user;
            const { chatId } = req.query;
            if (!chatId || !userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const chat = await this._getCommunityChatUseCase.execute({
                userId,
                chatId: String(chatId),
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                chat,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
ChatController = __decorate([
    injectable(),
    __param(0, inject("IGetChatByUserUseCase")),
    __param(1, inject("IGetAllChatsByUserUseCase")),
    __param(2, inject("IGetChatByChatIdUseCase")),
    __param(3, inject("ICreateCommunityUseCase")),
    __param(4, inject("IUpdateCommunityStatusUseCase")),
    __param(5, inject("IDeleteCommunityUseCase")),
    __param(6, inject("IEditCommunityUseCase")),
    __param(7, inject("IGetAllCommunitiesForAdminUseCase")),
    __param(8, inject("IBarberJoinCommunityUseCase")),
    __param(9, inject("IGetCommunityForEditUseCase")),
    __param(10, inject("IGetAllCommunitiesForBarberUseCase")),
    __param(11, inject("IGetAllCommunityChatsByUserUseCase")),
    __param(12, inject("IGetCommunityChatUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], ChatController);
export { ChatController };
