import { EPhoneType } from '../../features/users/models/phone-type.enum';
import { maskCpf, maskPhone } from './mask.util';

describe('maskCpf', () => {
  it('deve aplicar a máscara completa de CPF', () => {
    expect(maskCpf('52998224725')).toBe('529.982.247-25');
  });

  it('deve remover caracteres não numéricos antes de aplicar a máscara', () => {
    expect(maskCpf('529.982.247-25')).toBe('529.982.247-25');
  });

  it('deve limitar a entrada a 11 dígitos', () => {
    expect(maskCpf('529982247251234')).toBe('529.982.247-25');
  });

  it('deve aplicar a máscara parcialmente para entradas incompletas', () => {
    expect(maskCpf('529')).toBe('529');
    expect(maskCpf('5299')).toBe('529.9');
    expect(maskCpf('529982')).toBe('529.982');
    expect(maskCpf('5299822')).toBe('529.982.2');
    expect(maskCpf('529982247')).toBe('529.982.247');
  });

  it('deve retornar vazio quando não há dígitos', () => {
    expect(maskCpf('')).toBe('');
  });
});

describe('maskPhone', () => {
  it('deve aplicar máscara de celular (11 dígitos)', () => {
    expect(maskPhone('11987654321', EPhoneType.Mobile)).toBe('(11) 98765-4321');
  });

  it('deve limitar o celular a 11 dígitos', () => {
    expect(maskPhone('119876543219999', EPhoneType.Mobile)).toBe('(11) 98765-4321');
  });

  it('deve aplicar máscara de telefone residencial (10 dígitos)', () => {
    expect(maskPhone('1132654321', EPhoneType.Home)).toBe('(11) 3265-4321');
  });

  it('deve limitar o telefone residencial a 10 dígitos', () => {
    expect(maskPhone('11326543219999', EPhoneType.Home)).toBe('(11) 3265-4321');
  });

  it('deve retornar apenas os dígitos quando não há tipo definido', () => {
    expect(maskPhone('(11) 98765-432', null)).toBe('1198765432');
  });

  it('deve limitar a 10 dígitos quando não há tipo definido', () => {
    expect(maskPhone('119876543219999', null)).toBe('1198765432');
  });
});
