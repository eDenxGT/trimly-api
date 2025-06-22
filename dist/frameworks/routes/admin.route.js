"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
//* ====== Middleware Imports ====== *//
//* ====== BaseRoute Import ====== *//
const base_route_1 = require("./base.route");
const auth_middleware_1 = require("../../interfaceAdapters/middlewares/auth.middleware");
const resolver_1 = require("../di/resolver");
//* ====== Controller Imports ====== *//
class AdminRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        //* ─────────────────────────────────────────────────────────────
        //*                    🛠️ Details Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/details")
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.updateUserDetails(req, res);
        });
        this.router.put("/admin/update-password", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.changeUserPassword(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Dashboard Endpoint
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/admin/dashboard", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.dashboardController.getAdminDashboardData(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                🛠️ Hairstyle Detector Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/hairstyle")
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.hairstyleDetectorController.addHairstyle(req, res);
        });
        this.router
            .route("/admin/hairstyle/:hairstyleId")
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.hairstyleDetectorController.updateHairstyle(req, res);
        })
            .delete(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.hairstyleDetectorController.deleteHairstyle(req, res);
        });
        this.router.get("/admin/all-hairstyles", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.hairstyleDetectorController.getAllHairstyles(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Shops Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/shops")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.shopController.getAllShops(req, res);
        });
        this.router
            .route("/admin/shop/:shopId")
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.shopController.updateShopStatus(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Withdrawals Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/withdrawals")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.financeController.getAllUserWithdrawals(req, res);
        })
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.financeController.approveWithdrawal(req, res);
        })
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.financeController.rejectWithdrawal(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Chat Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/community")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.getCommunityForEdit(req, res);
        })
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.editCommunity(req, res);
        })
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.updateCommunityStatus(req, res);
        })
            .delete(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.deleteCommunity(req, res);
        })
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.createCommunity(req, res);
        });
        this.router.delete("/admin/community/:communityId/members/:userId", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.removeCommunityMember(req, res);
        });
        this.router.get("/admin/community/:communityId/members", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.getCommunityMembers(req, res);
        });
        this.router.get("/admin/communities", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.chatController.getAllCommunitiesForAdmin(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Meeting Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/meeting")
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.meetingController.scheduleMeet(req, res);
        })
            .put(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.meetingController.updateMeetingDetails(req, res);
        })
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.meetingController.completeMeeting(req, res);
        })
            .delete(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.meetingController.cancelMeeting(req, res);
        });
        this.router.get("/admin/all-meetings", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.meetingController.getAllMeetingsForListing(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                     🛠️ Users Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router
            .route("/admin/users")
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.userController.getAllUsers(req, res);
        });
        this.router.patch("/admin/user-status", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), (req, res) => {
            resolver_1.userController.updateUserStatus(req, res);
        });
        //* ─────────────────────────────────────────────────────────────
        //*                   🛠️ Session Endpoints
        //* ─────────────────────────────────────────────────────────────
        this.router.get("/admin/refresh-session", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.refreshSession(req, res);
        });
        // logout
        this.router.post("/admin/logout", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(["admin"]), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
        this.router.post("/admin/refresh-token", auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
    }
}
exports.AdminRoutes = AdminRoutes;
