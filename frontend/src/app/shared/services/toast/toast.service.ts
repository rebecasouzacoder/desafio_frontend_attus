import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private snackBar = inject(MatSnackBar);

  /**
   * Exibe uma mensagem toast para o usuário.
   *
   * @param message Mensagem exibida.
   * @param type Tipo visual do toast.
   * @param duration Tempo em milissegundos.
   */
  public show(
    message: string,
    type: ToastType = 'info',
    duration = 3000
  ): void {

    this.snackBar.open(message, 'Fechar', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`toast-${type}`]
    });
  }


  /**
   * Exibe mensagem de sucesso.
   */
  public success(message: string): void {
    this.show(message, 'success');
  }


  /**
   * Exibe mensagem de erro.
   */
  public error(message: string): void {
    this.show(message, 'error');
  }


  /**
   * Exibe mensagem de alerta.
   */
  public warning(message: string): void {
    this.show(message, 'warning');
  }


  /**
   * Exibe mensagem informativa.
   */
  public info(message: string): void {
    this.show(message, 'info');
  }
}