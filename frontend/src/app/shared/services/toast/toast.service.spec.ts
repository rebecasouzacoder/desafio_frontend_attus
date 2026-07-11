import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarSpy: jest.Mocked<Pick<MatSnackBar, 'open'>>;

  beforeEach(() => {
    snackBarSpy = { open: jest.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }],
    });

    service = TestBed.inject(ToastService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve exibir mensagem com valores padrão (tipo info e duração de 3000ms)', () => {
    service.show('Mensagem padrão');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Mensagem padrão', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-info'],
    });
  });

  it('deve exibir mensagem com tipo e duração customizados', () => {
    service.show('Mensagem customizada', 'warning', 5000);

    expect(snackBarSpy.open).toHaveBeenCalledWith('Mensagem customizada', 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-warning'],
    });
  });

  it('deve exibir mensagem de sucesso', () => {
    service.success('Operação concluída');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Operação concluída', 'Fechar', expect.objectContaining({
      panelClass: ['toast-success'],
    }));
  });

  it('deve exibir mensagem de erro', () => {
    service.error('Falha na operação');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Falha na operação', 'Fechar', expect.objectContaining({
      panelClass: ['toast-error'],
    }));
  });

  it('deve exibir mensagem de alerta', () => {
    service.warning('Atenção');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Atenção', 'Fechar', expect.objectContaining({
      panelClass: ['toast-warning'],
    }));
  });

  it('deve exibir mensagem informativa', () => {
    service.info('Informação');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Informação', 'Fechar', expect.objectContaining({
      panelClass: ['toast-info'],
    }));
  });
});
