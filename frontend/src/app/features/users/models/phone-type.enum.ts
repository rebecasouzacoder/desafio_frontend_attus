/**
 * Define os tipos de telefone disponivés para um usuário.
 *
 * @export
 * @enum {number}
 */
export enum EPhoneType {
  Mobile = 'MOBILE',
  Home = 'HOME',
}

export const PhoneTypeLabel = {
  [EPhoneType.Mobile]: 'Celular',
  [EPhoneType.Home]: 'Residencial',
};