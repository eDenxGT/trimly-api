"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberRoutes = void 0;
//* ====== Middleware Imports ====== *//;
const auth_middleware_1 = require("../../interfaceAdapters/middlewares/auth.middleware");
//* ====== BaseRoute Import ====== *//
const base_route_1 = require("./base.route");
//* ====== Controller Imports ====== *//
const resolver_1 = require("../di/resolver");
class BarberRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Details Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/details")
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.updateUserDetails(req, res);
        });
        this.router.put("/barber/update-password", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.changeUserPassword(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Dashboard Endpoint
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/dashboard", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.dashboardController.getBarberDashboardData(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                 🛠️ Notifications Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/notifications", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.getNotificationsByUser(req, res);
        });
        this.router.patch("/barber/notifications/read", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.markAllNotificationsAsReadByUser(req, res);
        });
        this.router.patch("/barber/notifications/:notificationId/read", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.markSingleNotificationAsReadByUser(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                    🛠️ Booking Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/booking")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.getAllBookings(req, res);
        })
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.updateBookingComplete(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Hairstyle Detector Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/hairstyles")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.hairstyleDetectorController.getHairstylesByFaceShape(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Post Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/posts")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.getAllPostsForBarber(req, res);
        })
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.addPost(req, res);
        });
        this.router
            .route("/barber/posts/:postId")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.getPostByPostId(req, res);
        })
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.editPost(req, res);
        })
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.updatePostStatus(req, res);
        })
            .delete(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.deletePost(req, res);
        });
        this.router.post("/barber/posts/:postId/like", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.toggleLikePost(req, res);
        });
        this.router.post("/barber/posts/:postId/comment", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.addComment(req, res);
        });
        this.router.patch("/barber/posts/comment/:commentId/like", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.feedController.toggleCommentLike(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ S3 Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/s3/generate-presigned-url", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.s3Controller.generatePresignedUrl(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Chat Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/chat")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.chatController.getChatById(req, res);
        });
        this.router.get("/barber/chats", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.chatController.getAllChatsByUserId(req, res);
        });
        this.router.get("/barber/communities", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), (req, res) => {
            resolver_1.chatController.getAllCommunitiesForBarberListing(req, res);
        });
        this.router.get("/barber/community-chats", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), (req, res) => {
            resolver_1.chatController.getAllCommunityChatsByBarberId(req, res);
        });
        this.router.get("/barber/community-chat", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), (req, res) => {
            resolver_1.chatController.getCommunityChatByChatIdForBarber(req, res);
        });
        this.router.put("/barber/community/join", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), (req, res) => {
            resolver_1.chatController.barberJoinCommunity(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Meeting Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/meeting", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), (req, res) => {
            resolver_1.meetingController.getMeetingByCommunityId(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Service Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/services")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.getAllServicesByBarberId(req, res);
        })
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.addService(req, res);
        });
        this.router
            .route("/barber/services/:serviceId")
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.updateServiceById(req, res);
        })
            .delete(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.deleteServiceById(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Wallet Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/wallet")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.getWalletPageData(req, res);
        })
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.topUpWallet(req, res);
        })
            // handling payment verification
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.verifyTopUpPayment(req, res);
        })
            // handling payment failure
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.handleTopUpPaymentFailure(req, res);
        });
        this.router.post("/barber/wallet/withdraw", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.financeController.withdrawFromWallet(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Session Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/refresh-session", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.refreshSession(req, res);
        });
        // logout
        this.router.post("/barber/logout", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["barber"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
        this.router.post("/barber/refresh-token", auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
    }
}
exports.BarberRoutes = BarberRoutes;
