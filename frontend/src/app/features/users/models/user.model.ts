import { EPhoneType } from "./phone-type.enum";

/**
 * Representa um usuário da aplicação.
 *
 * Utilizada nas operações de listagem, cadastro e atualização de usuários.
 *
 * @export
 * @interface IUser
 */
export interface IUser {
  /** Identificador único do usuário. */
  id: number;

  /** Nome completo do usuário. */
  name: string;

  /** Endereço de e-mail. */
  email: string;

  /** CPF do usuário. */
  cpf: string;

  /** Número de telefone. */
  phone: string;

  /** Tipo do telefone informado. */
  typePhone: EPhoneType;
}