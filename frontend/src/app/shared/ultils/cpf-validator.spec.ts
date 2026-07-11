import { FormControl } from '@angular/forms';
import { cpfValidator } from './cpf-validator';

describe('cpfValidator', () => {
  const validate = (value: string | null) =>
    cpfValidator()(new FormControl(value));

  it('deve retornar erro quando o valor é vazio', () => {
    expect(validate('')).toEqual({ cpfInvalid: true });
  });

  it('deve retornar erro quando o valor é nulo', () => {
    expect(validate(null)).toEqual({ cpfInvalid: true });
  });

  it('deve retornar erro quando o CPF possui menos de 11 dígitos', () => {
    expect(validate('123456789')).toEqual({ cpfInvalid: true });
  });

  it('deve retornar erro quando o CPF possui mais de 11 dígitos', () => {
    expect(validate('123456789012')).toEqual({ cpfInvalid: true });
  });

  it('deve retornar erro quando todos os dígitos são iguais', () => {
    expect(validate('111.111.111-11')).toEqual({ cpfInvalid: true });
  });

  it('deve retornar erro quando o primeiro dígito verificador é inválido', () => {
    expect(validate('529.982.247-35')).toEqual({ cpfInvalid: true });
  });

  it('deve retornar erro quando o segundo dígito verificador é inválido', () => {
    expect(validate('529.982.247-21')).toEqual({ cpfInvalid: true });
  });

  it('deve retornar null quando o CPF é válido (com máscara)', () => {
    expect(validate('529.982.247-25')).toBeNull();
  });

  it('deve retornar null quando o CPF é válido (somente números)', () => {
    expect(validate('52998224725')).toBeNull();
  });

  it('deve retornar null quando o primeiro dígito verificador calculado é 10 (ajustado para 0)', () => {
    expect(validate('000.000.006-04')).toBeNull();
  });

  it('deve retornar null quando o segundo dígito verificador calculado é 10 (ajustado para 0)', () => {
    expect(validate('000.000.018-30')).toBeNull();
  });
});
