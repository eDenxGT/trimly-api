import { IHairstyleEntity } from "../../entities/models/hairstyle.entity";
import { IGetHairstylesByFaceShapeUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-hairstyles-by-face-shape-usecase.interface";
import { injectable, inject } from "tsyringe";
import { IHairstyleRepository } from "../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetHairstylesByFaceShapeUseCase
  implements IGetHairstylesByFaceShapeUseCase
{
  constructor(
    @inject("IHairstyleRepository")
    private _hairstyleRepository: IHairstyleRepository
  ) {}

  async execute({
    faceShape,
    gender,
  }: {
    faceShape: string;
    gender: string;
  }): Promise<IHairstyleEntity[]> {
    const normalizedFaceShape = faceShape.toLowerCase();

    const hairstyles = await this._hairstyleRepository.find({
      faceShapes: { $in: [normalizedFaceShape] },
      gender,
    });

    if (!hairstyles.length) {
      throw new CustomError(
        ERROR_MESSAGES.HAIRSTYLE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return hairstyles;
  }
}
