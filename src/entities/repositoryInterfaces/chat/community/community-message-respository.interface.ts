import { ICommunityMessageEntity } from "../../../models/chat/community-message.entity";
import { IBaseRepository } from "../../base-repository.interface";

export interface ICommunityMessageRepository
  extends IBaseRepository<ICommunityMessageEntity> {
  saveCommunityMessage(
    data: Partial<ICommunityMessageEntity>
  ): Promise<ICommunityMessageEntity>;
}
