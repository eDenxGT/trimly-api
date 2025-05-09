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
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let FinanceController = class FinanceController {
    _getWalletOverviewUseCase;
    _topUpWalletUseCase;
    _verifyTopUpPaymentUseCase;
    _updateWalletBalanceUseCase;
    _withdrawFromWalletUseCase;
    _handleTopUpPaymentFailureUseCase;
    _getAllUserWithdrawalsUseCase;
    _rejectWithdrawalUseCase;
    _approveWithdrawalUseCase;
    constructor(_getWalletOverviewUseCase, _topUpWalletUseCase, _verifyTopUpPaymentUseCase, _updateWalletBalanceUseCase, _withdrawFromWalletUseCase, _handleTopUpPaymentFailureUseCase, _getAllUserWithdrawalsUseCase, _rejectWithdrawalUseCase, _approveWithdrawalUseCase) {
        this._getWalletOverviewUseCase = _getWalletOverviewUseCase;
        this._topUpWalletUseCase = _topUpWalletUseCase;
        this._verifyTopUpPaymentUseCase = _verifyTopUpPaymentUseCase;
        this._updateWalletBalanceUseCase = _updateWalletBalanceUseCase;
        this._withdrawFromWalletUseCase = _withdrawFromWalletUseCase;
        this._handleTopUpPaymentFailureUseCase = _handleTopUpPaymentFailureUseCase;
        this._getAllUserWithdrawalsUseCase = _getAllUserWithdrawalsUseCase;
        this._rejectWithdrawalUseCase = _rejectWithdrawalUseCase;
        this._approveWithdrawalUseCase = _approveWithdrawalUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Get Data for wallet page
    //* ─────────────────────────────────────────────────────────────
    async getWalletPageData(req, res) {
        try {
            const { userId, role } = req.user;
            if (!userId || !role) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const walletOverview = await this._getWalletOverviewUseCase.execute(userId, role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                balance: walletOverview?.balance || 0,
                transactions: walletOverview?.transactions || [],
                withdrawals: walletOverview?.withdrawals || [],
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️  TopUp Wallet
    //* ─────────────────────────────────────────────────────────────
    async topUpWallet(req, res) {
        try {
            const { userId, role } = req.user;
            const { amount } = req.body;
            const numericAmount = Number(amount);
            if (!userId || !numericAmount || isNaN(numericAmount)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const transactionId = generateUniqueId("transaction");
            const topUpInfo = await this._topUpWalletUseCase.execute(userId, role, transactionId, amount);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                orderId: topUpInfo.orderId,
                amount: topUpInfo.amount,
                currency: topUpInfo.currency,
                transactionId: transactionId,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Verify TopUp Payment
    //* ─────────────────────────────────────────────────────────────
    async verifyTopUpPayment(req, res) {
        try {
            const { transactionId, razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
            const { userId, role } = req.user;
            if (!transactionId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._verifyTopUpPaymentUseCase.execute(razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId);
            await this._updateWalletBalanceUseCase.execute(userId, role, transactionId);
            res.status(HTTP_STATUS.ACCEPTED).json({
                success: true,
                message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Handle TopUp Payment Failure
    //* ─────────────────────────────────────────────────────────────
    async handleTopUpPaymentFailure(req, res) {
        try {
            const { orderId } = req.body;
            if (!orderId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._handleTopUpPaymentFailureUseCase.execute(orderId, "failed");
            res.status(HTTP_STATUS.ACCEPTED).json({
                success: true,
                message: SUCCESS_MESSAGES.PAYMENT_FAILED,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Withdraw From Wallet
    //* ─────────────────────────────────────────────────────────────
    async withdrawFromWallet(req, res) {
        try {
            const { userId, role } = req.user;
            const { amount, method, ...accountDetails } = req.body;
            if (!userId || !amount || !method) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            await this._withdrawFromWalletUseCase.execute(userId, role, amount, method, accountDetails);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.WITHDRAWAL_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get All User Withdrawals (For Admin)
    //* ─────────────────────────────────────────────────────────────
    async getAllUserWithdrawals(req, res) {
        try {
            const { page = "1", limit = "10", status, method, search, sortField, sortDirection, } = req.query;
            const result = await this._getAllUserWithdrawalsUseCase.execute({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                status: status,
                method: method,
                search: search,
                sortField: sortField,
                sortDirection: sortDirection,
            });
            res.status(200).json(result);
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*             🛠️  Approve Withdrawal (For Admin)
    //* ─────────────────────────────────────────────────────────────
    async approveWithdrawal(req, res) {
        try {
            const { withdrawalId } = req.body;
            await this._approveWithdrawalUseCase.execute({ withdrawalId });
            res.status(HTTP_STATUS.ACCEPTED).json({
                success: true,
                message: SUCCESS_MESSAGES.WITHDRAWAL_APPROVED_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*             🛠️  Approve Withdrawal (For Admin)
    //* ─────────────────────────────────────────────────────────────
    async rejectWithdrawal(req, res) {
        try {
            const { withdrawalId, remarks } = req.body;
            await this._rejectWithdrawalUseCase.execute({
                withdrawalId,
                remarks,
            });
            res.status(HTTP_STATUS.ACCEPTED).json({
                success: true,
                message: SUCCESS_MESSAGES.WITHDRAWAL_REJECTED_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
FinanceController = __decorate([
    injectable(),
    __param(0, inject("IGetWalletOverviewUseCase")),
    __param(1, inject("ITopUpWalletUseCase")),
    __param(2, inject("IVerifyTopUpPaymentUseCase")),
    __param(3, inject("IUpdateWalletBalanceUseCase")),
    __param(4, inject("IWithdrawFromWalletUseCase")),
    __param(5, inject("IHandleTopUpPaymentFailureUseCase")),
    __param(6, inject("IGetAllUserWithdrawalsUseCase")),
    __param(7, inject("IRejectWithdrawalUseCase")),
    __param(8, inject("IApproveWithdrawalUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], FinanceController);
export { FinanceController };
