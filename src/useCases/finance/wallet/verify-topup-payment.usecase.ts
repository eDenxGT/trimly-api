import { inject, injectable } from "tsyringe";
import { IVerifyTopUpPaymentUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/verify-topup-payment-usecase.interface";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { IRazorpayService } from "../../../entities/serviceInterfaces/razorpay-service.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../../shared/constants";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface";

@injectable()
export class VerifyTopUpPaymentUseCase implements IVerifyTopUpPaymentUseCase {
  constructor(
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository,
    @inject("IRazorpayService")
    private _razorpayService: IRazorpayService,
  ) {}

  async execute(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    transactionId: string,
  ): Promise<void> {
    const isVerified = await this._razorpayService.verifySignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
    });
    if (!isVerified) {
      throw new CustomError(
        "Invalid signature. Payment verification failed.",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    await this._transactionRepository.update(
      { transactionId },
      { status: "success" }
    );
  }
}
