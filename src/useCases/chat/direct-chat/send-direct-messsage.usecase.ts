import { inject, injectable } from "tsyringe";
import { IDirectMessageEntity } from "../../../entities/models/chat/direct-message.entity";
import { ISendDirectMessageUseCase } from "../../../entities/useCaseInterfaces/chat/direct-chat/send-direct-messsage-usecase.interface";
import { IDirectMessageRepository } from "../../../entities/repositoryInterfaces/chat/direct-chat/direct-message.repository";

@injectable()
export class SendDirectMessageUseCase implements ISendDirectMessageUseCase {
  constructor(
    @inject("IDirectMessageRepository")
    private _directMessageRepository: IDirectMessageRepository
  ) {}

  async execute(
    data: Partial<IDirectMessageEntity>
  ): Promise<IDirectMessageEntity> {
    const message = await this._directMessageRepository.save(data);
    return message;
  }
}
