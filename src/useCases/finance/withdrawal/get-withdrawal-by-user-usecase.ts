import { inject, injectable } from "tsyringe";
import { IWithdrawalEntity } from "../../../entities/models/withdrawal.entity";
import { IGetWithdrawalByUserUseCase } from "../../../entities/useCaseInterfaces/finance/withdrawal/get-withdrawal-by-user-usecase.interface";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface";

@injectable()
export class GetWithdrawalByUserUseCase implements IGetWithdrawalByUserUseCase {
  constructor(
    @inject("IWithdrawalRepository")
    private _withdrawalRepository: IWithdrawalRepository
  ) {}
  async execute(userId: string): Promise<IWithdrawalEntity[] | null> {
    return this._withdrawalRepository.find({ userId });
  }
}
