//* ====== Middleware Imports ====== *//;
import { authorizeRole, decodeToken, verifyAuth, } from "../../interfaceAdapters/middlewares/auth.middleware.js";
//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
//* ====== Controller Imports ====== *//
import { authController, blockStatusMiddleware, bookingController, chatController, feedController, financeController, meetingController, s3Controller, serviceController, userController, dashboardController, hairstyleDetectorController, notificationController, } from "../di/resolver.js";
export class BarberRoutes extends BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Details Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/details")
            .put(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.updateUserDetails(req, res);
        });
        this.router.put("/barber/update-password", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.changeUserPassword(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Dashboard Endpoint
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/dashboard", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            dashboardController.getBarberDashboardData(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                 🛠️ Notifications Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/notifications", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            notificationController.getNotificationsByUser(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                    🛠️ Booking Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/booking")
            .get(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.getAllBookings(req, res);
        })
            .patch(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.updateBookingComplete(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Hairstyle Detector Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/hairstyles")
            .get(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            hairstyleDetectorController.getHairstylesByFaceShape(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Post Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/posts")
            .get(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.getAllPostsForBarber(req, res);
        })
            .post(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.addPost(req, res);
        });
        this.router
            .route("/barber/posts/:postId")
            .get(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.getPostByPostId(req, res);
        })
            .put(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.editPost(req, res);
        })
            .patch(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.updatePostStatus(req, res);
        })
            .delete(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.deletePost(req, res);
        });
        this.router.post("/barber/posts/:postId/like", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.toggleLikePost(req, res);
        });
        this.router.post("/barber/posts/:postId/comment", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.addComment(req, res);
        });
        this.router.patch("/barber/posts/comment/:commentId/like", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            feedController.toggleCommentLike(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ S3 Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/s3/generate-presigned-url", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            s3Controller.generatePresignedUrl(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Chat Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/chat")
            .get(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            chatController.getChatById(req, res);
        });
        this.router.get("/barber/chats", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            chatController.getAllChatsByUserId(req, res);
        });
        this.router.get("/barber/communities", verifyAuth, authorizeRole(["barber"]), (req, res) => {
            chatController.getAllCommunitiesForBarberListing(req, res);
        });
        this.router.get("/barber/community-chats", verifyAuth, authorizeRole(["barber"]), (req, res) => {
            chatController.getAllCommunityChatsByBarberId(req, res);
        });
        this.router.get("/barber/community-chat", verifyAuth, authorizeRole(["barber"]), (req, res) => {
            chatController.getCommunityChatByChatIdForBarber(req, res);
        });
        this.router.put("/barber/community/join", verifyAuth, authorizeRole(["barber"]), (req, res) => {
            chatController.barberJoinCommunity(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Meeting Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/meeting", verifyAuth, authorizeRole(["barber"]), (req, res) => {
            meetingController.getMeetingByCommunityId(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Service Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/services")
            .get(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.getAllServicesByBarberId(req, res);
        })
            .post(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.addService(req, res);
        });
        this.router
            .route("/barber/services/:serviceId")
            .put(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.updateServiceById(req, res);
        })
            .delete(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.deleteServiceById(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Wallet Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/barber/wallet")
            .get(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.getWalletPageData(req, res);
        })
            .post(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.topUpWallet(req, res);
        })
            // handling payment verification
            .put(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.verifyTopUpPayment(req, res);
        })
            // handling payment failure
            .patch(verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.handleTopUpPaymentFailure(req, res);
        });
        this.router.post("/barber/wallet/withdraw", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            financeController.withdrawFromWallet(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Session Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/barber/refresh-session", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.refreshSession(req, res);
        });
        // logout
        this.router.post("/barber/logout", verifyAuth, authorizeRole(["barber"]), blockStatusMiddleware.checkStatus, (req, res) => {
            authController.logout(req, res);
        });
        this.router.post("/barber/refresh-token", decodeToken, (req, res) => {
            authController.handleTokenRefresh(req, res);
        });
    }
}
