"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
//* ====== Middleware Imports ====== *//
//* ====== BaseRoute Import ====== *//
const base_route_1 = require("./base.route");
const auth_middleware_1 = require("../../interfaceAdapters/middlewares/auth.middleware");
const resolver_1 = require("../di/resolver");
class ClientRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Details Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/details")
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.updateUserDetails(req, res);
        });
        this.router.put("/client/update-password", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.changeUserPassword(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Home Page Endpoint
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/home-data", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.dashboardController.getClientHomePageData(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Booking Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/booking")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.getAllBookings(req, res);
        })
            // handling booking creation
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.createBooking(req, res);
        })
            // handling booking cancellation
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.cancelBooking(req, res);
        });
        this.router
            .route("/client/payment")
            // handling payment verification
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.verifyPayment(req, res);
        })
            // handling payment failure
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.handlePaymentFailure(req, res);
        });
        this.router.post("/client/booking/wallet", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.handleBookWithWallet(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Wallet Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/wallet")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.getWalletPageData(req, res);
        })
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.topUpWallet(req, res);
        })
            // handling payment verification
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.verifyTopUpPayment(req, res);
        })
            // handling payment failure
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.handleTopUpPaymentFailure(req, res);
        });
        this.router.post("/client/wallet/withdraw", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.withdrawFromWallet(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                 🛠️ Notifications Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/notifications", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.getNotificationsByUser(req, res);
        });
        this.router.patch("/client/notifications/read", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.markAllNotificationsAsReadByUser(req, res);
        });
        this.router.patch("/client/notifications/:notificationId/read", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.markSingleNotificationAsReadByUser(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ S3 Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/s3/generate-presigned-url", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.s3Controller.generatePresignedUrl(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Chat Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/chat")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.chatController.getChatById(req, res);
        });
        this.router.get("/client/chats", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.chatController.getAllChatsByUserId(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Shop Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/barber-shops", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.shopController.getAllNearestShopsForClient(req, res);
        });
        this.router.get("/client/barber-shop/details", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.shopController.getShopDetailsById(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Post Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/posts", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.getAllPostsForClient(req, res);
        });
        this.router.get("/client/posts/:postId", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.getPostByPostId(req, res);
        });
        this.router.post("/client/posts/:postId/like", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.toggleLikePost(req, res);
        });
        this.router.get("/client/posts/liked-users/:postId", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.getPostLikedUsers(req, res);
        });
        this.router.post("/client/posts/:postId/comment", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.addComment(req, res);
        });
        this.router.patch("/client/posts/comment/:commentId/like", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.toggleCommentLike(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Review Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.post("/client/review", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.reviewController.addReview(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Session Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/refresh-session", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.refreshSession(req, res);
        });
        // logout
        this.router.post("/client/logout", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["client"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
        this.router.post("/client/refresh-token", auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
    }
}
exports.ClientRoutes = ClientRoutes;
