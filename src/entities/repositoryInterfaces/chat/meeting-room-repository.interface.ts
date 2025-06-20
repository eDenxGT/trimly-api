import { IMeetingRoomEntity } from "../../models/chat/meeting-room.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IMeetingRoomRepository
  extends IBaseRepository<IMeetingRoomEntity> {
  findLastPlannedMeeting(
    communityId: string
  ): Promise<IMeetingRoomEntity | null>;

  getAllMeetingsForListing({
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
