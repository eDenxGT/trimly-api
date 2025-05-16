//* ====== Middleware Imports ====== *//
//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
import { authorizeRole, decodeToken, verifyAuth, } from "../../interfaceAdapters/middlewares/auth.middleware.js";
import { authController, blockStatusMiddleware, bookingController, chatController, dashboardController, feedController, financeController, notificationController, reviewController, s3Controller, shopController, userController, } from "../di/resolver.js";
export class ClientRoutes extends BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Details Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/details")
            .put(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.updateUserDetails(req, res);
        });
        this.router.put("/client/update-password", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.changeUserPassword(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Home Page Endpoint
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/home-data", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            dashboardController.getClientHomePageData(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Booking Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/booking")
            .get(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.getAllBookings(req, res);
        })
            // handling booking creation
            .post(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.createBooking(req, res);
        })
            // handling booking cancellation
            .patch(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.cancelBooking(req, res);
        });
        this.router
            .route("/client/payment")
            // handling payment verification
            .post(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.verifyPayment(req, res);
        })
            // handling payment failure
            .put(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.handlePaymentFailure(req, res);
        });
        this.router.post("/client/booking/wallet", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.handleBookWithWallet(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Wallet Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/wallet")
            .get(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.getWalletPageData(req, res);
        })
            .post(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.topUpWallet(req, res);
        })
            // handling payment verification
            .put(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.verifyTopUpPayment(req, res);
        })
            // handling payment failure
            .patch(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.handleTopUpPaymentFailure(req, res);
        });
        this.router.post("/client/wallet/withdraw", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.withdrawFromWallet(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ S3 Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/notifications", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            notificationController.getNotificationsByUser(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ S3 Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/s3/generate-presigned-url", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            s3Controller.generatePresignedUrl(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Chat Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/client/chat")
            .get(verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            chatController.getChatById(req, res);
        });
        this.router.get("/client/chats", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            chatController.getAllChatsByUserId(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Shop Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/barber-shops", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            shopController.getAllNearestShopsForClient(req, res);
        });
        this.router.get("/client/barber-shop/details", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            shopController.getShopDetailsById(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Post Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/posts", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.getAllPostsForClient(req, res);
        });
        this.router.get("/client/posts/:postId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.getPostByPostId(req, res);
        });
        this.router.post("/client/posts/:postId/like", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.toggleLikePost(req, res);
        });
        this.router.get("/client/posts/liked-users/:postId", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.getPostLikedUsers(req, res);
        });
        this.router.post("/client/posts/:postId/comment", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.addComment(req, res);
        });
        this.router.patch("/client/posts/comment/:commentId/like", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.toggleCommentLike(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Review Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.post("/client/review", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            reviewController.addReview(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Session Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/client/refresh-session", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.refreshSession(req, res);
        });
        // logout
        this.router.post("/client/logout", verifyAuth, authorizeRole(["client"]), blockStatusMiddleware.checkStatus, (req, res) => {
            authController.logout(req, res);
        });
        this.router.post("/client/refresh-token", decodeToken, (req, res) => {
            authController.handleTokenRefresh(req, res);
        });
    }
}
