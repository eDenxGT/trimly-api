import { ICommunityMessageEntity } from "../../../models/chat/community-message.entity";

export interface ISendCommunityMessageUseCase {
  execute(data: Partial<ICommunityMessageEntity>): Promise<ICommunityMessageEntity>;
}
