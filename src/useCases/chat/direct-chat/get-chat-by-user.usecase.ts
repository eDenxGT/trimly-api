import { inject, injectable } from "tsyringe";
import { IGetChatByUserUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-user-usecase.interface";
import { IChatRoomEntity } from "../../../entities/models/chat/chat-room.entity";
import { IChatRoomRepository } from "../../../entities/repositoryInterfaces/chat/direct-chat/chat-room-repository.interface";
import { ICreateChatRoomUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/create-chat-room-usecase.interface";

@injectable()
export class GetChatByUserUseCase implements IGetChatByUserUseCase {
  constructor(
    @inject("IChatRoomRepository")
    private readonly _chatRoomRepository: IChatRoomRepository,
    @inject("ICreateChatRoomUseCase")
    private readonly _createChatRoomUseCase: ICreateChatRoomUseCase
  ) {}

  async execute(
    opponentUserId: string,
    currentUserId: string,
    currentUserRole: "client" | "barber"
  ): Promise<IChatRoomEntity | null> {
    const isClient = currentUserRole === "client";

    const isChatRoomExists = await this._chatRoomRepository.findOne({
      clientId: isClient ? currentUserId : opponentUserId,
      barberId: isClient ? opponentUserId : currentUserId,
    });

    if (!isChatRoomExists) {
      await this._createChatRoomUseCase.execute({
        clientId: isClient ? currentUserId : opponentUserId,
        barberId: isClient ? opponentUserId : currentUserId,
      });
    }
    const chat = await this._chatRoomRepository.getChatRoomByUserId(
      currentUserId,
      opponentUserId,
      currentUserRole
    );

    return chat;
  }
}
