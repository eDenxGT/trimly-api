import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface IGetAllCommunitiesForBarberUseCase {
  execute({
    search,
    userId,
    page,
    limit,
  }: {
    search: string;
    userId: string;
    page: number;
    limit: number;
  }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }>;
}
