import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface";
import { IWithdrawFromWalletUseCase } from "../../../entities/useCaseInterfaces/finance/withdrawal/withdraw-from-wallet-usecase.interface";

@injectable()
export class WithdrawFromWalletUseCase implements IWithdrawFromWalletUseCase {
	constructor(
		@inject("IWalletRepository")
		private _walletRepository: IWalletRepository,
		@inject("IWithdrawalRepository")
		private _withdrawalRepository: IWithdrawalRepository,
		@inject("ITransactionRepository")
		private _transactionRepository: ITransactionRepository,
		@inject("IGetWalletByUserUseCase")
		private _getWalletByUserUseCase: IGetWalletByUserUseCase
	) {}
	async execute(
		userId: string,
		role: "client" | "barber",
		amount: number,
		method: "upi" | "bank",
		accountDetails: {
			upiId?: string;
			accountHolderName?: string;
			accountNumber?: string;
			ifscCode?: string;
			bankName?: string;
		}
	): Promise<void> {
		const wallet = await this._getWalletByUserUseCase.execute(userId, role);
		if (!wallet) {
			throw new CustomError(
				ERROR_MESSAGES.WALLET_NOT_FOUND,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		if (amount > wallet.balance) {
			throw new CustomError(
				ERROR_MESSAGES.INSUFFICIENT_BALANCE,
				HTTP_STATUS.BAD_REQUEST
			);
		}
		const withdrawalId = generateUniqueId("withdrawal");

		await this._withdrawalRepository.save({
			withdrawalId,
			walletId: wallet.walletId,
			userId,
			userType: role,
			amount,
			method,
			status: "pending",
			...accountDetails,
			requestedAt: new Date(),
		});

		await this._walletRepository.decrementBalance(userId, amount);

		await this._transactionRepository.save({
			transactionId: generateUniqueId("transaction"),
			userId,
			walletId: wallet.walletId,
			type: "debit",
			source: "withdrawal",
			amount,
			status: "pending",
			referenceId: withdrawalId,
		});
	}
}
