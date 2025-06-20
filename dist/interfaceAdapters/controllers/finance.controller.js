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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
let FinanceController = class FinanceController {
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
    getWalletPageData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.user;
                if (!userId || !role) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const walletOverview = yield this._getWalletOverviewUseCase.execute(userId, role);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    balance: (walletOverview === null || walletOverview === void 0 ? void 0 : walletOverview.balance) || 0,
                    transactions: (walletOverview === null || walletOverview === void 0 ? void 0 : walletOverview.transactions) || [],
                    withdrawals: (walletOverview === null || walletOverview === void 0 ? void 0 : walletOverview.withdrawals) || [],
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️  TopUp Wallet
    //* ─────────────────────────────────────────────────────────────
    topUpWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.user;
                const { amount } = req.body;
                const numericAmount = Number(amount);
                if (!userId || !numericAmount || isNaN(numericAmount)) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const transactionId = (0, unique_uuid_helper_1.generateUniqueId)("transaction");
                const topUpInfo = yield this._topUpWalletUseCase.execute(userId, role, transactionId, amount);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    orderId: topUpInfo.orderId,
                    amount: topUpInfo.amount,
                    currency: topUpInfo.currency,
                    transactionId: transactionId,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Verify TopUp Payment
    //* ─────────────────────────────────────────────────────────────
    verifyTopUpPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId, razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
                const { userId, role } = req.user;
                if (!transactionId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._verifyTopUpPaymentUseCase.execute(razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId);
                yield this._updateWalletBalanceUseCase.execute(userId, role, transactionId);
                res.status(constants_1.HTTP_STATUS.ACCEPTED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PAYMENT_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Handle TopUp Payment Failure
    //* ─────────────────────────────────────────────────────────────
    handleTopUpPaymentFailure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                if (!orderId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._handleTopUpPaymentFailureUseCase.execute(orderId, "failed");
                res.status(constants_1.HTTP_STATUS.ACCEPTED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PAYMENT_FAILED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️  Withdraw From Wallet
    //* ─────────────────────────────────────────────────────────────
    withdrawFromWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.user;
                const _a = req.body, { amount, method } = _a, accountDetails = __rest(_a, ["amount", "method"]);
                if (!userId || !amount || !method) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._withdrawFromWalletUseCase.execute(userId, role, amount, method, accountDetails);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.WITHDRAWAL_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*            🛠️  Get All User Withdrawals (For Admin)
    //* ─────────────────────────────────────────────────────────────
    getAllUserWithdrawals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = "1", limit = "10", status, method, search, sortField, sortDirection, } = req.query;
                const result = yield this._getAllUserWithdrawalsUseCase.execute({
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
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*             🛠️  Approve Withdrawal (For Admin)
    //* ─────────────────────────────────────────────────────────────
    approveWithdrawal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { withdrawalId } = req.body;
                yield this._approveWithdrawalUseCase.execute({ withdrawalId });
                res.status(constants_1.HTTP_STATUS.ACCEPTED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.WITHDRAWAL_APPROVED_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*             🛠️  Approve Withdrawal (For Admin)
    //* ─────────────────────────────────────────────────────────────
    rejectWithdrawal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { withdrawalId, remarks } = req.body;
                yield this._rejectWithdrawalUseCase.execute({
                    withdrawalId,
                    remarks,
                });
                res.status(constants_1.HTTP_STATUS.ACCEPTED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.WITHDRAWAL_REJECTED_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.FinanceController = FinanceController;
exports.FinanceController = FinanceController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetWalletOverviewUseCase")),
    __param(1, (0, tsyringe_1.inject)("ITopUpWalletUseCase")),
    __param(2, (0, tsyringe_1.inject)("IVerifyTopUpPaymentUseCase")),
    __param(3, (0, tsyringe_1.inject)("IUpdateWalletBalanceUseCase")),
    __param(4, (0, tsyringe_1.inject)("IWithdrawFromWalletUseCase")),
    __param(5, (0, tsyringe_1.inject)("IHandleTopUpPaymentFailureUseCase")),
    __param(6, (0, tsyringe_1.inject)("IGetAllUserWithdrawalsUseCase")),
    __param(7, (0, tsyringe_1.inject)("IRejectWithdrawalUseCase")),
    __param(8, (0, tsyringe_1.inject)("IApproveWithdrawalUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], FinanceController);
