import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { CustomRequest } from "../middlewares/auth.middleware";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	SUCCESS_MESSAGES,
	TRole,
} from "../../shared/constants";
import { IGetWalletOverviewUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-overview-usecase.interface";
import { ITopUpWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/topup-wallet-usecase.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { IVerifyTopUpPaymentUseCase } from "../../entities/useCaseInterfaces/finance/wallet/verify-topup-payment-usecase.interface";
import { IUpdateWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/update-wallet-balance-usecase.interface";
import { IHandleTopUpPaymentFailureUseCase } from "../../entities/useCaseInterfaces/finance/wallet/handle-topup-failure-payment-usecase.interface";
import { IFinanceController } from "./../../entities/controllerInterfaces/finance/finance-controller.interface";
import { IWithdrawFromWalletUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/withdraw-from-wallet-usecase.interface";
import { IGetAllUserWithdrawalsUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/get-all-user-withdrawals-usecase.interface";
import { IRejectWithdrawalUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/reject-withdrawal-usecase.interface";
import { IApproveWithdrawalUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/approve-withdrawal-usecase.interface";

@injectable()
export class FinanceController implements IFinanceController {
	constructor(
		@inject("IGetWalletOverviewUseCase")
		private _getWalletOverviewUseCase: IGetWalletOverviewUseCase,
		@inject("ITopUpWalletUseCase")
		private _topUpWalletUseCase: ITopUpWalletUseCase,
		@inject("IVerifyTopUpPaymentUseCase")
		private _verifyTopUpPaymentUseCase: IVerifyTopUpPaymentUseCase,
		@inject("IUpdateWalletBalanceUseCase")
		private _updateWalletBalanceUseCase: IUpdateWalletBalanceUseCase,
		@inject("IWithdrawFromWalletUseCase")
		private _withdrawFromWalletUseCase: IWithdrawFromWalletUseCase,
		@inject("IHandleTopUpPaymentFailureUseCase")
		private _handleTopUpPaymentFailureUseCase: IHandleTopUpPaymentFailureUseCase,
		@inject("IGetAllUserWithdrawalsUseCase")
		private _getAllUserWithdrawalsUseCase: IGetAllUserWithdrawalsUseCase,
		@inject("IRejectWithdrawalUseCase")
		private _rejectWithdrawalUseCase: IRejectWithdrawalUseCase,
		@inject("IApproveWithdrawalUseCase")
		private _approveWithdrawalUseCase: IApproveWithdrawalUseCase
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*                🛠️  Get Data for wallet page
	//* ─────────────────────────────────────────────────────────────
	async getWalletPageData(req: Request, res: Response): Promise<void> {
		try {
			const { userId, role } = (req as CustomRequest).user;
			if (!userId || !role) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}

			const walletOverview = await this._getWalletOverviewUseCase.execute(
				userId,
				role as "client" | "barber"
			);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				balance: walletOverview?.balance || 0,
				transactions: walletOverview?.transactions || [],
				withdrawals: walletOverview?.withdrawals || [],
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                   🛠️  TopUp Wallet
	//* ─────────────────────────────────────────────────────────────
	async topUpWallet(req: Request, res: Response): Promise<void> {
		try {
			const { userId, role } = (req as CustomRequest).user;
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

			const topUpInfo = await this._topUpWalletUseCase.execute(
				userId,
				role as "client" | "barber",
				transactionId,
				amount
			);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				orderId: topUpInfo.orderId,
				amount: topUpInfo.amount,
				currency: topUpInfo.currency,
				transactionId: transactionId,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                 🛠️  Verify TopUp Payment
	//* ─────────────────────────────────────────────────────────────
	async verifyTopUpPayment(req: Request, res: Response): Promise<void> {
		try {
			const {
				transactionId,
				razorpay_order_id,
				razorpay_payment_id,
				razorpay_signature,
			} = req.body;

			const { userId, role } = (req as CustomRequest).user;

			if (!transactionId) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}

			await this._verifyTopUpPaymentUseCase.execute(
				razorpay_order_id,
				razorpay_payment_id,
				razorpay_signature,
				transactionId
			);

			await this._updateWalletBalanceUseCase.execute(
				userId,
				role as "client" | "barber",
				transactionId
			);

			res.status(HTTP_STATUS.ACCEPTED).json({
				success: true,
				message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                🛠️  Handle TopUp Payment Failure
	//* ─────────────────────────────────────────────────────────────
	async handleTopUpPaymentFailure(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { orderId } = req.body;

			if (!orderId) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}

			await this._handleTopUpPaymentFailureUseCase.execute(
				orderId,
				"failed"
			);

			res.status(HTTP_STATUS.ACCEPTED).json({
				success: true,
				message: SUCCESS_MESSAGES.PAYMENT_FAILED,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                🛠️  Withdraw From Wallet
	//* ─────────────────────────────────────────────────────────────
	async withdrawFromWallet(req: Request, res: Response): Promise<void> {
		try {
			const { userId, role } = (req as CustomRequest).user;
			const { amount, method, ...accountDetails } = req.body;

			if (!userId || !amount || !method) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}

			await this._withdrawFromWalletUseCase.execute(
				userId,
				role as "client" | "barber",
				amount,
				method,
				accountDetails
			);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.WITHDRAWAL_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*            🛠️  Get All User Withdrawals (For Admin)
	//* ─────────────────────────────────────────────────────────────
	async getAllUserWithdrawals(req: Request, res: Response): Promise<void> {
		try {
			const {
				page = "1",
				limit = "10",
				status,
				method,
				search,
				sortField,
				sortDirection,
			} = req.query;

			const result = await this._getAllUserWithdrawalsUseCase.execute({
				page: parseInt(page as string, 10),
				limit: parseInt(limit as string, 10),
				status: status as string,
				method: method as string,
				search: search as string,
				sortField: sortField as string,
				sortDirection: sortDirection as "asc" | "desc",
			});

			res.status(200).json(result);
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*             🛠️  Approve Withdrawal (For Admin)
	//* ─────────────────────────────────────────────────────────────
	async approveWithdrawal(req: Request, res: Response): Promise<void> {
		try {
			const { withdrawalId } = req.body;
			await this._approveWithdrawalUseCase.execute({ withdrawalId });
			res.status(HTTP_STATUS.ACCEPTED).json({
				success: true,
				message: SUCCESS_MESSAGES.WITHDRAWAL_APPROVED_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*             🛠️  Approve Withdrawal (For Admin)
	//* ─────────────────────────────────────────────────────────────
	async rejectWithdrawal(req: Request, res: Response): Promise<void> {
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
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}
}
