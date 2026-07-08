import { ICreateUserRequest } from "./create-user.request";

/**
 * Representa os dados necessários para a atualização de um usuário.
 *
 */
export type IUpdateUserRequest = Partial<ICreateUserRequest>;