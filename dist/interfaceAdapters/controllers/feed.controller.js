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
let FeedController = class FeedController {
    _addPostUseCase;
    _getAllPostsByBarberUseCase;
    _getSinglePostByPostIdUseCase;
    _updatePostUseCase;
    _deletePostUseCase;
    _updatePostStatusUseCase;
    _toggleLikePostUseCase;
    _addCommentUseCase;
    _toggleCommentLikeUseCase;
    _getAllPostsForClientUseCase;
    _getPostLikedUsersUseCase;
    constructor(_addPostUseCase, _getAllPostsByBarberUseCase, _getSinglePostByPostIdUseCase, _updatePostUseCase, _deletePostUseCase, _updatePostStatusUseCase, _toggleLikePostUseCase, _addCommentUseCase, _toggleCommentLikeUseCase, _getAllPostsForClientUseCase, _getPostLikedUsersUseCase) {
        this._addPostUseCase = _addPostUseCase;
        this._getAllPostsByBarberUseCase = _getAllPostsByBarberUseCase;
        this._getSinglePostByPostIdUseCase = _getSinglePostByPostIdUseCase;
        this._updatePostUseCase = _updatePostUseCase;
        this._deletePostUseCase = _deletePostUseCase;
        this._updatePostStatusUseCase = _updatePostStatusUseCase;
        this._toggleLikePostUseCase = _toggleLikePostUseCase;
        this._addCommentUseCase = _addCommentUseCase;
        this._toggleCommentLikeUseCase = _toggleCommentLikeUseCase;
        this._getAllPostsForClientUseCase = _getAllPostsForClientUseCase;
        this._getPostLikedUsersUseCase = _getPostLikedUsersUseCase;
    }
    //? ✨=========================================================✨
    //?                     📝 POST SECTION
    //? ✨=========================================================✨
    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Add Post
    //* ─────────────────────────────────────────────────────────────
    async addPost(req, res) {
        try {
            const { userId } = req.user;
            const { caption, description, image } = req.body;
            if (!userId || !caption || !description || !image) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._addPostUseCase.execute(userId, caption, description, image);
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.POST_ADDED,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Get All Posts For Barbers
    //* ─────────────────────────────────────────────────────────────
    async getAllPostsForBarber(req, res) {
        try {
            const { userId } = req.user;
            const { page, limit } = req.query;
            if (!userId || !page || !limit) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const { items, total } = await this._getAllPostsByBarberUseCase.execute(userId, Number(page), Number(limit));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                items,
                total,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Get All Posts For Clients
    //* ─────────────────────────────────────────────────────────────
    async getAllPostsForClient(req, res) {
        try {
            const { userId } = req.user;
            const { page, limit } = req.query;
            if (!userId || !page || !limit) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const { items, total } = await this._getAllPostsForClientUseCase.execute(userId, Number(page), Number(limit));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                items,
                total,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️ Get Post By PostId
    //* ─────────────────────────────────────────────────────────────
    async getPostByPostId(req, res) {
        try {
            const { userId, role } = req.user;
            const { postId } = req.params;
            const { forType } = req.query;
            if (!userId || !postId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const post = await this._getSinglePostByPostIdUseCase.execute(userId, role, postId, String(forType));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                post,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                      🛠️ Edit Post
    //* ─────────────────────────────────────────────────────────────
    async editPost(req, res) {
        try {
            const { userId } = req.user;
            const { postId } = req.params;
            const { caption, description, image } = req.body;
            if (!postId || !caption || !description || !image || !userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._updatePostUseCase.execute({
                userId,
                postId,
                caption,
                description,
                image,
            });
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
    //*                   🛠️ Update Post Status
    //* ─────────────────────────────────────────────────────────────
    async updatePostStatus(req, res) {
        try {
            const { postId } = req.params;
            const { userId } = req.user;
            if (!postId || !userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._updatePostStatusUseCase.execute(postId, userId);
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
    //*                       🛠️ Delete Post
    //* ─────────────────────────────────────────────────────────────
    async deletePost(req, res) {
        try {
            const { postId } = req.params;
            const { userId } = req.user;
            if (!postId || !userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._deletePostUseCase.execute({
                postId,
                userId,
            });
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
    //*                     🛠️ Toggle Like Post
    //* ─────────────────────────────────────────────────────────────
    async toggleLikePost(req, res) {
        try {
            const { postId } = req.params;
            const { userId } = req.user;
            if (!postId || !userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const liked = await this._toggleLikePostUseCase.execute({
                postId,
                userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                liked: liked,
                message: SUCCESS_MESSAGES.TOGGLE_LIKE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //? ✨=========================================================✨
    //?                     📝 COMMENT SECTION
    //? ✨=========================================================✨
    //* ─────────────────────────────────────────────────────────────
    //*                       🛠️ Post Comment
    //* ─────────────────────────────────────────────────────────────
    async addComment(req, res) {
        try {
            const { postId } = req.params;
            const { userId } = req.user;
            const { comment } = req.body;
            if (!postId || !userId || !comment) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._addCommentUseCase.execute({
                postId,
                userId,
                comment,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.COMMENT_ADDED,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                       🛠️ Toggle Like Comment
    //* ─────────────────────────────────────────────────────────────
    async toggleCommentLike(req, res) {
        try {
            const { commentId } = req.params;
            const { userId } = req.user;
            if (!commentId || !userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._toggleCommentLikeUseCase.execute({
                commentId,
                userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TOGGLE_LIKE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Get Post Liked Users
    //* ─────────────────────────────────────────────────────────────
    async getPostLikedUsers(req, res) {
        try {
            const { postId } = req.params;
            if (!postId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const users = await this._getPostLikedUsersUseCase.execute({
                postId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                users,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
FeedController = __decorate([
    injectable(),
    __param(0, inject("IAddPostUseCase")),
    __param(1, inject("IGetAllPostsByBarberUseCase")),
    __param(2, inject("IGetSinglePostByPostIdUseCase")),
    __param(3, inject("IUpdatePostUseCase")),
    __param(4, inject("IDeletePostUseCase")),
    __param(5, inject("IUpdatePostStatusUseCase")),
    __param(6, inject("IToggleLikePostUseCase")),
    __param(7, inject("IAddCommentUseCase")),
    __param(8, inject("IToggleCommentLikeUseCase")),
    __param(9, inject("IGetAllPostsForClientUseCase")),
    __param(10, inject("IGetPostLikedUsersUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], FeedController);
export { FeedController };
