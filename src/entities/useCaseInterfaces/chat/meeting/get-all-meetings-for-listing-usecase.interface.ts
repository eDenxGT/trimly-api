import { IMeetingRoomEntity } from "../../../models/chat/meeting-room.entity";

export interface IGetAllMeetingsForListingUseCase {
  execute({
    search,
    status,
    date,
    page,
    limit
  }: {
    search: string;
    status: string;
    date: string;
    page: number;
    limit: number;
  }): Promise<{ meetings: IMeetingRoomEntity[]; totalPages: number }>;
}
