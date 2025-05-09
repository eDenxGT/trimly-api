//* ====== Middleware Imports ====== *//
//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
import { authorizeRole, decodeToken, verifyAuth, } from "../../interfaceAdapters/middlewares/auth.middleware.js";
import { authController, blockStatusMiddleware, chatController, dashboardController, financeController, hairstyleDetectorController, meetingController, shopController, userController, } from "../di/resolver.js";
//* ====== Controller Imports ====== *//
export class AdminRoutes extends BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        //* ─────────────────────────────────────────────────────────────
        //*                    🛠️ Details Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/details")
            .put(verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.updateUserDetails(req, res);
        });
        this.router.put("/admin/update-password", verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.changeUserPassword(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Dashboard Endpoint
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/admin/dashboard", verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            dashboardController.getAdminDashboardData(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Hairstyle Detector Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/hairstyle")
            .post(verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            hairstyleDetectorController.addHairstyle(req, res);
        });
        this.router
            .route("/admin/hairstyle/:hairstyleId")
            .put(verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            hairstyleDetectorController.updateHairstyle(req, res);
        })
            .delete(verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            hairstyleDetectorController.deleteHairstyle(req, res);
        });
        this.router.get("/admin/all-hairstyles", verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            hairstyleDetectorController.getAllHairstyles(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Shops Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/shops")
            .get(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            shopController.getAllShops(req, res);
        });
        this.router
            .route("/admin/shop/:shopId")
            .put(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            shopController.updateShopStatus(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Withdrawals Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/withdrawals")
            .get(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            financeController.getAllUserWithdrawals(req, res);
        })
            .patch(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            financeController.approveWithdrawal(req, res);
        })
            .put(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            financeController.rejectWithdrawal(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Chat Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/community")
            .get(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            chatController.getCommunityForEdit(req, res);
        })
            .put(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            chatController.editCommunity(req, res);
        })
            .patch(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            chatController.updateCommunityStatus(req, res);
        })
            .delete(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            chatController.deleteCommunity(req, res);
        })
            .post(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            chatController.createCommunity(req, res);
        });
        this.router.get("/admin/communities", verifyAuth, authorizeRole(["admin"]), (req, res) => {
            chatController.getAllCommunitiesForAdmin(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Meeting Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/meeting")
            .post(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            meetingController.scheduleMeet(req, res);
        })
            .put(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            meetingController.updateMeetingDetails(req, res);
        })
            .patch(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            meetingController.completeMeeting(req, res);
        })
            .delete(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            meetingController.cancelMeeting(req, res);
        });
        this.router.get("/admin/all-meetings", verifyAuth, authorizeRole(["admin"]), (req, res) => {
            meetingController.getAllMeetingsForListing(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Users Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/users")
            .get(verifyAuth, authorizeRole(["admin"]), (req, res) => {
            userController.getAllUsers(req, res);
        });
        this.router.patch("/admin/user-status", verifyAuth, authorizeRole(["admin"]), (req, res) => {
            userController.updateUserStatus(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Session Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/admin/refresh-session", verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            userController.refreshSession(req, res);
        });
        // logout
        this.router.post("/admin/logout", verifyAuth, authorizeRole(["admin"]), blockStatusMiddleware.checkStatus, (req, res) => {
            authController.logout(req, res);
        });
        this.router.post("/admin/refresh-token", decodeToken, (req, res) => {
            authController.handleTokenRefresh(req, res);
        });
    }
}
