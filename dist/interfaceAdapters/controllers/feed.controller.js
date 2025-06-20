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
exports.FeedController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
let FeedController = class FeedController {
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
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { caption, description, image } = req.body;
                if (!userId || !caption || !description || !image) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._addPostUseCase.execute(userId, caption, description, image);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.POST_ADDED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Get All Posts For Barbers
    //* ─────────────────────────────────────────────────────────────
    getAllPostsForBarber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { page, limit } = req.query;
                if (!userId || !page || !limit) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const { items, total } = yield this._getAllPostsByBarberUseCase.execute(userId, Number(page), Number(limit));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    items,
                    total,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                  🛠️ Get All Posts For Clients
    //* ─────────────────────────────────────────────────────────────
    getAllPostsForClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { page, limit } = req.query;
                if (!userId || !page || !limit) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const { items, total } = yield this._getAllPostsForClientUseCase.execute(userId, Number(page), Number(limit));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    items,
                    total,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️ Get Post By PostId
    //* ─────────────────────────────────────────────────────────────
    getPostByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.user;
                const { postId } = req.params;
                const { forType } = req.query;
                if (!userId || !postId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const post = yield this._getSinglePostByPostIdUseCase.execute(userId, role, postId, String(forType));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    post,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                      🛠️ Edit Post
    //* ─────────────────────────────────────────────────────────────
    editPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { postId } = req.params;
                const { caption, description, image } = req.body;
                if (!postId || !caption || !description || !image || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._updatePostUseCase.execute({
                    userId,
                    postId,
                    caption,
                    description,
                    image,
                });
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
    //*                   🛠️ Update Post Status
    //* ─────────────────────────────────────────────────────────────
    updatePostStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { userId } = req.user;
                if (!postId || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._updatePostStatusUseCase.execute(postId, userId);
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
    //*                       🛠️ Delete Post
    //* ─────────────────────────────────────────────────────────────
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { userId } = req.user;
                if (!postId || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._deletePostUseCase.execute({
                    postId,
                    userId,
                });
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
    //*                     🛠️ Toggle Like Post
    //* ─────────────────────────────────────────────────────────────
    toggleLikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { userId } = req.user;
                if (!postId || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const liked = yield this._toggleLikePostUseCase.execute({
                    postId,
                    userId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    liked: liked,
                    message: constants_1.SUCCESS_MESSAGES.TOGGLE_LIKE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //? ✨=========================================================✨
    //?                     📝 COMMENT SECTION
    //? ✨=========================================================✨
    //* ─────────────────────────────────────────────────────────────
    //*                       🛠️ Post Comment
    //* ─────────────────────────────────────────────────────────────
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { userId } = req.user;
                const { comment } = req.body;
                if (!postId || !userId || !comment) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._addCommentUseCase.execute({
                    postId,
                    userId,
                    comment,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.COMMENT_ADDED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                       🛠️ Toggle Like Comment
    //* ─────────────────────────────────────────────────────────────
    toggleCommentLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId } = req.params;
                const { userId } = req.user;
                if (!commentId || !userId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._toggleCommentLikeUseCase.execute({
                    commentId,
                    userId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.TOGGLE_LIKE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Get Post Liked Users
    //* ─────────────────────────────────────────────────────────────
    getPostLikedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                if (!postId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const users = yield this._getPostLikedUsersUseCase.execute({
                    postId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    users,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.FeedController = FeedController;
exports.FeedController = FeedController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAddPostUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetAllPostsByBarberUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetSinglePostByPostIdUseCase")),
    __param(3, (0, tsyringe_1.inject)("IUpdatePostUseCase")),
    __param(4, (0, tsyringe_1.inject)("IDeletePostUseCase")),
    __param(5, (0, tsyringe_1.inject)("IUpdatePostStatusUseCase")),
    __param(6, (0, tsyringe_1.inject)("IToggleLikePostUseCase")),
    __param(7, (0, tsyringe_1.inject)("IAddCommentUseCase")),
    __param(8, (0, tsyringe_1.inject)("IToggleCommentLikeUseCase")),
    __param(9, (0, tsyringe_1.inject)("IGetAllPostsForClientUseCase")),
    __param(10, (0, tsyringe_1.inject)("IGetPostLikedUsersUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], FeedController);
