import { injectable } from "tsyringe";
import { BaseRepository } from "../../base.repository";
import { ICommunityMessageRepository } from "../../../../entities/repositoryInterfaces/chat/community/community-message-respository.interface";
import {
  CommunityMessageModel,
  ICommunityMessageModel,
} from "../../../../frameworks/database/mongoDb/models/chat/community-message.model";
import { ICommunityMessageEntity } from "../../../../entities/models/chat/community-message.entity";

@injectable()
export class CommunityMessageRepository
  extends BaseRepository<ICommunityMessageModel>
  implements ICommunityMessageRepository
{
  constructor() {
    super(CommunityMessageModel);
  }

  async saveCommunityMessage(
    data: Partial<ICommunityMessageEntity>
  ): Promise<ICommunityMessageEntity> {
    const createdMessage = await CommunityMessageModel.create(data);
    return createdMessage.toObject();
  }
}
