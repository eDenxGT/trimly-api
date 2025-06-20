import { injectable } from "tsyringe";
import {
  DirectMessageModel,
  IDirectMessageModel,
} from "../../../../frameworks/database/mongoDb/models/chat/direct-message.model";
import { BaseRepository } from "../../base.repository";
import { IDirectMessageRepository } from "../../../../entities/repositoryInterfaces/chat/direct-chat/direct-message.repository";

@injectable()
export class DirectMessageRepository
  extends BaseRepository<IDirectMessageModel>
  implements IDirectMessageRepository
{
  constructor() {
    super(DirectMessageModel);
  }

  async markMessagesAsRead({
    chatRoomId,
    userId,
  }: {
    chatRoomId: string;
    userId: string;
  }): Promise<void> {
    await this.model.updateMany(
      {
        chatRoomId,
        receiverId: userId,
        status: "sent",
      },
      {
        $set: { status: "read" },
      }
    );
  }
}
