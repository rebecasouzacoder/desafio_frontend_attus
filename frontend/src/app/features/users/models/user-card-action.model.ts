import { IUser } from "./user.model";

export type UserCardActionType = 'edit' | 'view' | 'create';

export interface IUserCardAction {
  type: UserCardActionType;
  user?: IUser;
}