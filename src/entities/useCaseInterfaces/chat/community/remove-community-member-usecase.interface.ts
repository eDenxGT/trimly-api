export interface IRemoveCommunityMemberUseCase {
  execute(communityId: string, userId: string): Promise<void>;
}
