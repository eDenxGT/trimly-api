import { IWalletEntity } from "../../../entities/models/wallet.entity";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface";
import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ICreateWalletUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface";

@injectable()
export class GetWalletByUserUseCase implements IGetWalletByUserUseCase {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,
    @inject("ICreateWalletUseCase")
    private _createWalletUseCase: ICreateWalletUseCase
  ) {}
  async execute(
    ownerId: string,
    role: "client" | "barber"
  ): Promise<IWalletEntity> {
    let wallet = await this._walletRepository.findOne({ ownerId });

    if (!wallet) {
      wallet = await this._createWalletUseCase.execute({
        ownerId,
        ownerType: role,
      });
      if (!wallet) {
        throw new CustomError(
          ERROR_MESSAGES.WALLET_NOT_FOUND,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
    }
    return wallet;
  }
}
