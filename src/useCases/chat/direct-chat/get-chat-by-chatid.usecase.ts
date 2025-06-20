import { inject, injectable } from "tsyringe";
import { IGetChatByChatIdUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-chatid.usecase";
import { IChatRoomEntity } from "../../../entities/models/chat/chat-room.entity";
import { IChatRoomRepository } from "../../../entities/repositoryInterfaces/chat/direct-chat/chat-room-repository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class GetChatByChatIdUseCase implements IGetChatByChatIdUseCase {
  constructor(
    @inject("IChatRoomRepository")
    private _chatRoomRepository: IChatRoomRepository
  ) {}
  async execute(
    chatId: string,
    role: "client" | "barber"
  ): Promise<IChatRoomEntity> {
    const chat = await this._chatRoomRepository.getChatRoomByChatId(
      chatId,
      role
    );

    if (!chat) {
      throw new CustomError(
        ERROR_MESSAGES.CHAT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return chat;
  }
}
