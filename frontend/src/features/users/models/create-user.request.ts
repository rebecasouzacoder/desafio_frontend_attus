import { IUser } from "./user.model";

/**
 * Representa os dados necessários para o cadastro de um usuário.
 *
 */
export type ICreateUserRequest = Omit<IUser, 'id'>;