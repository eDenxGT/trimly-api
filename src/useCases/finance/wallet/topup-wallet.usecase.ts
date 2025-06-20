import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface";
import { ITopUpWalletUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/topup-wallet-usecase.interface";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { IRazorpayService } from "../../../entities/serviceInterfaces/razorpay-service.interface";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface";

@injectable()
export class TopUpWalletUseCase implements ITopUpWalletUseCase {
	constructor(
		@inject("ITransactionRepository")
		private _transactionRepository: ITransactionRepository,
		@inject("IRazorpayService")
		private _razorpayService: IRazorpayService,
		@inject("IGetWalletByUserUseCase")
		private _getWalletByUserUseCase: IGetWalletByUserUseCase
	) {}

	async execute(
		userId: string,
		role: "client" | "barber",
		transactionId: string,
		amount: number
	): Promise<{
		orderId: string;
		amount: number;
		currency: string;
	}> {
		const razorpayOrder = await this._razorpayService.createOrder(
			amount,
			transactionId
		);

		await this._getWalletByUserUseCase.execute(userId, role);

		await this._transactionRepository.save({
			transactionId,
			userId,
			amount,
			orderId: razorpayOrder.id,
			type: "credit",
			source: "topup",
			status: "pending",
			referenceId: razorpayOrder.id,
		});

		return {
			orderId: razorpayOrder.id,
			amount,
			currency: razorpayOrder.currency,
		};
	}
}
