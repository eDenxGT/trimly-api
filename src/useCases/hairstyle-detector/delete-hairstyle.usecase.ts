import { inject, injectable } from "tsyringe";
import { IDeleteHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/delete-hairstyle-usecase.interface";
import { IHairstyleRepository } from "../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface";

@injectable()
export class DeleteHairstyleUseCase implements IDeleteHairstyleUseCase {
  constructor(
    @inject("IHairstyleRepository")
    private _hairstyleRepository: IHairstyleRepository
  ) {}

  async execute({ hairstyleId }: { hairstyleId: string }): Promise<void> {
    await this._hairstyleRepository.delete({
      hairstyleId,
    });
  }
}
