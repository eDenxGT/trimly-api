import { IDirectMessageEntity } from "../../../models/chat/direct-message.entity";

export interface ISendDirectMessageUseCase {
  execute(data: Partial<IDirectMessageEntity>): Promise<IDirectMessageEntity>;
}
