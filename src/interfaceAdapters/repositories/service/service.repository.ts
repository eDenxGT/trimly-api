import { injectable } from "tsyringe";
import {
  IServiceModel,
  ServiceModel,
} from "../../../frameworks/database/mongoDb/models/service.model";
import { BaseRepository } from "../base.repository";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface";

@injectable()
export class ServiceRepository
  extends BaseRepository<IServiceModel>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel);
  }
}
