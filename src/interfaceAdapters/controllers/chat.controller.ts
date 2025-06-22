import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IChatController } from "../../entities/controllerInterfaces/chat/chat-controller.interface";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { IGetChatByUserUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-user-usecase.interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IGetAllChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-all-chats-by-user.usecase.interface";
import { IGetChatByChatIdUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-chatid.usecase";
import { ICreateCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/create-community-usecase.interface";
import { IGetAllCommunitiesForAdminUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-communities-for-admin-usecase.interface";
import { IGetCommunityForEditUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-for-edit-usecase.interface";
import { IEditCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/edit-community-usecase.interface";
import { IUpdateCommunityStatusUseCase } from "../../entities/useCaseInterfaces/chat/community/update-community-status-usecase.interface";
import { IDeleteCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/delete-community-usecase.interface";
import { IGetAllCommunitiesForBarberUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-communities-for-barber-usecase.interface";
import { IBarberJoinCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/barber-join-community-usecase.interface";
import { IGetAllCommunityChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-community-chats-by-user-usecase.interface";
import { IGetCommunityChatUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-chat-usecase.interface";
import { IGetCommunityMembersUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-members-usecase.interface";
import { IRemoveCommunityMemberUseCase } from "../../entities/useCaseInterfaces/chat/community/remove-community-member-usecase.interface";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject("IGetChatByUserUseCase")
    private _getChatByUserUseCase: IGetChatByUserUseCase,
    @inject("IGetAllChatsByUserUseCase")
    private _getAllChatsByUserUseCase: IGetAllChatsByUserUseCase,
    @inject("IGetChatByChatIdUseCase")
    private _getChatByChatIdUseCase: IGetChatByChatIdUseCase,
    @inject("ICreateCommunityUseCase")
    private _createCommunityUseCase: ICreateCommunityUseCase,
    @inject("IUpdateCommunityStatusUseCase")
    private _updateCommunityStatusUseCase: IUpdateCommunityStatusUseCase,
    @inject("IDeleteCommunityUseCase")
    private _deleteCommunityUseCase: IDeleteCommunityUseCase,
    @inject("IEditCommunityUseCase")
    private _editCommunityUseCase: IEditCommunityUseCase,
    @inject("IGetAllCommunitiesForAdminUseCase")
    private _getAllCommunitiesForAdminUseCase: IGetAllCommunitiesForAdminUseCase,
    @inject("IBarberJoinCommunityUseCase")
    private _barberJoinCommunityUseCase: IBarberJoinCommunityUseCase,
    @inject("IGetCommunityForEditUseCase")
    private _getCommunityForEditUseCase: IGetCommunityForEditUseCase,
    @inject("IGetAllCommunitiesForBarberUseCase")
    private _getAllCommunitiesForBarberUseCase: IGetAllCommunitiesForBarberUseCase,
    @inject("IGetAllCommunityChatsByUserUseCase")
    private _getAllCommunityChatsByUserUseCase: IGetAllCommunityChatsByUserUseCase,
    @inject("IGetCommunityChatUseCase")
    private _getCommunityChatUseCase: IGetCommunityChatUseCase,
    @inject("IGetCommunityMembersUseCase")
    private _getCommunityMembersUseCase: IGetCommunityMembersUseCase,
    @inject("IRemoveCommunityMemberUseCase")
    private _removeCommunityMemberUseCase: IRemoveCommunityMemberUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                🛠️  Get Chat By Id
  //* ─────────────────────────────────────────────────────────────
  async getChatById(req: Request, res: Response) {
    try {
      const { role, userId: currentUserId } = (req as CustomRequest).user;
      const { userId: opponentUserId, chatId } = req.query;

      if (chatId) {
        const chat = await this._getChatByChatIdUseCase.execute(
          String(chatId),
          role as "client" | "barber"
        );
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

      const chat = await this._getChatByUserUseCase.execute(
        String(opponentUserId),
        currentUserId,
        role
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        chat,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                🛠️  Get All Chats By User Id
  //* ─────────────────────────────────────────────────────────────
  async getAllChatsByUserId(req: Request, res: Response) {
    try {
      const { role, userId } = (req as CustomRequest).user;

      if (!userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const chats = await this._getAllChatsByUserUseCase.execute(
        userId,
        role as "client" | "barber"
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        chats,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*               🛠️  Create Community (For Admin)
  //* ─────────────────────────────────────────────────────────────
  async createCommunity(req: Request, res: Response) {
    try {
      const { userId } = (req as CustomRequest).user;
      const { communityId, name, description, imageUrl, createdAt } = req.body;

      if (
        !userId ||
        !communityId ||
        !name ||
        !description ||
        !imageUrl ||
        !createdAt
      ) {
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*               🛠️  Get All Communities (For Admin)
  //* ─────────────────────────────────────────────────────────────
  async getAllCommunitiesForAdmin(req: Request, res: Response) {
    try {
      const { userId } = (req as CustomRequest).user;

      const { search, page, limit } = req.query;

      if (!userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const communitiesData =
        await this._getAllCommunitiesForAdminUseCase.execute({
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*       🛠️  Get All Communities (For Barber ( LISTING ))
  //* ─────────────────────────────────────────────────────────────
  async getAllCommunitiesForBarberListing(req: Request, res: Response) {
    try {
      const { userId } = (req as CustomRequest).user;

      const { search, page, limit } = req.query;

      if (!userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const communitiesData =
        await this._getAllCommunitiesForBarberUseCase.execute({
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Get Community For Edit (For ADMIN)
  //* ─────────────────────────────────────────────────────────────
  async getCommunityForEdit(req: Request, res: Response) {
    try {
      const { communityId } = req.query;

      if (!communityId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const community = await this._getCommunityForEditUseCase.execute(
        String(communityId)
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        community,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Edit Community (For ADMIN)
  //* ─────────────────────────────────────────────────────────────
  async editCommunity(req: Request, res: Response) {
    try {
      const { userId } = (req as CustomRequest).user;
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Update Community Status (For ADMIN)
  //* ─────────────────────────────────────────────────────────────
  async updateCommunityStatus(req: Request, res: Response) {
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Delete Community (For ADMIN)
  //* ─────────────────────────────────────────────────────────────
  async deleteCommunity(req: Request, res: Response) {
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Join Community (For Barber)
  //* ─────────────────────────────────────────────────────────────
  async barberJoinCommunity(req: Request, res: Response) {
    try {
      const { userId } = (req as CustomRequest).user;
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Get All Community Chats By Barber Id
  //* ─────────────────────────────────────────────────────────────
  async getAllCommunityChatsByBarberId(req: Request, res: Response) {
    try {
      const { userId } = (req as CustomRequest).user;

      if (!userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const communityChats =
        await this._getAllCommunityChatsByUserUseCase.execute({ userId });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        chats: communityChats,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Get Community Members By Community Id
  //* ─────────────────────────────────────────────────────────────
  async getCommunityMembers(req: Request, res: Response) {
    try {
      const { communityId } = req.params;

      if (!communityId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      const communityMembers = await this._getCommunityMembersUseCase.execute(
        communityId
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        members: communityMembers,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Remove Community Member
  //* ─────────────────────────────────────────────────────────────
  async removeCommunityMember(req: Request, res: Response) {
    try {
      const { communityId, userId } = req.params;

      if (!communityId || !userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }

      await this._removeCommunityMemberUseCase.execute(communityId, userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.REMOVE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*            🛠️  Get Community Chat By Chat Id For Barber
  //* ─────────────────────────────────────────────────────────────
  async getCommunityChatByChatIdForBarber(req: Request, res: Response) {
    try {
      const { userId } = (req as CustomRequest).user;
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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
