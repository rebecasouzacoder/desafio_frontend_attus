import { EPhoneType } from '../../features/users/models/phone-type.enum';

/**
 * Aplica máscara de CPF.
 *
 * @param {string} value
 * @returns {string}
 */
export function maskCpf(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

/**
 * Aplica máscara de telefone conforme o tipo informado.
 *
 * @param {string} value
 * @param {EPhoneType | null} type
 * @returns {string}
 */
export function maskPhone(value: string, type: EPhoneType | null): string {
  const limit = type === EPhoneType.Mobile ? 11 : 10;

  let phone = value.replace(/\D/g, '').slice(0, limit);

  if (!type) {
    return phone;
  }

  if (type === EPhoneType.Mobile) {
    return phone
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  return phone
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}
