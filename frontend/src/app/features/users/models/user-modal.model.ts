import { IUser } from "./user.model";

export type UserModalMode = 'create' | 'edit' | 'view';

export interface IUserModalData {
  mode: UserModalMode;
  user?: IUser;
}