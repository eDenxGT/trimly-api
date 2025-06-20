import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface IGetAllCommunitiesForAdminUseCase {
  execute({
    search,
    page,
    limit,
  }: {
    search: string;
    page: number;
    limit: number;
  }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }>;
}
