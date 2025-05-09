//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../interfaceAdapters/middlewares/auth.middleware.js";
import {
  authController,
  blockStatusMiddleware,
  chatController,
  dashboardController,
  financeController,
  hairstyleDetectorController,
  meetingController,
  shopController,
  userController,
} from "../di/resolver.js";

//* ====== Controller Imports ====== *//

export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Details Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/details")
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          userController.updateUserDetails(req, res);
        }
      );

    this.router.put(
      "/admin/update-password",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.changeUserPassword(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Dashboard Endpoint
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/admin/dashboard",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        dashboardController.getAdminDashboardData(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Hairstyle Detector Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/hairstyle")
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          hairstyleDetectorController.addHairstyle(req, res);
        }
      );

    this.router
      .route("/admin/hairstyle/:hairstyleId")
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          hairstyleDetectorController.updateHairstyle(req, res);
        }
      )
      .delete(
        verifyAuth,
        authorizeRole(["admin"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          hairstyleDetectorController.deleteHairstyle(req, res);
        }
      );

    this.router.get(
      "/admin/all-hairstyles",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        hairstyleDetectorController.getAllHairstyles(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Shops Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/shops")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          shopController.getAllShops(req, res);
        }
      );

    this.router
      .route("/admin/shop/:shopId")
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          shopController.updateShopStatus(req, res);
        }
      );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Withdrawals Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/withdrawals")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          financeController.getAllUserWithdrawals(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          financeController.approveWithdrawal(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          financeController.rejectWithdrawal(req, res);
        }
      );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Chat Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/community")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.getCommunityForEdit(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.editCommunity(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.updateCommunityStatus(req, res);
        }
      )
      .delete(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.deleteCommunity(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.createCommunity(req, res);
        }
      );

    this.router.get(
      "/admin/communities",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        chatController.getAllCommunitiesForAdmin(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Meeting Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/meeting")
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          meetingController.scheduleMeet(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          meetingController.updateMeetingDetails(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          meetingController.completeMeeting(req, res);
        }
      )
      .delete(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          meetingController.cancelMeeting(req, res);
        }
      );

    this.router.get(
      "/admin/all-meetings",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        meetingController.getAllMeetingsForListing(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Users Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/users")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          userController.getAllUsers(req, res);
        }
      );

    this.router.patch(
      "/admin/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.updateUserStatus(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Session Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/admin/refresh-session",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.refreshSession(req, res);
      }
    );

    // logout
    this.router.post(
      "/admin/logout",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );
    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        authController.handleTokenRefresh(req, res);
      }
    );
  }
}
