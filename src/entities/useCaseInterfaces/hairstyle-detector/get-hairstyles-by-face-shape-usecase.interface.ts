import { IHairstyleEntity } from "../../models/hairstyle.entity";

export interface IGetHairstylesByFaceShapeUseCase {
  execute({
    faceShape,
    gender,
  }: {
    faceShape: string;
    gender: string;
  }): Promise<IHairstyleEntity[]>;
}
