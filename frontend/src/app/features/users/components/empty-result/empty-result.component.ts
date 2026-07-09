import { Component, input } from '@angular/core';
import { MatCard } from '@angular/material/card';

/**
 * Componente responsável por exibir um estado vazio quando não existem
 * resultados disponíveis para apresentação.
 *
 * @export
 * @class EmptyResultComponent
 */
@Component({
  selector: 'app-empty-result',
  imports: [MatCard],
  templateUrl: './empty-result.component.html',
  styleUrl: './empty-result.component.scss'
})

export class EmptyResultComponent {
  /**
   * Mensagem exibida ao usuário quando não existem registros disponíveis.
   *
   * Possui um valor padrão para casos onde nenhuma mensagem personalizada
   * é informada.
   *
   * @memberof EmptyResultComponent
   */
  public message = input<string>('Nenhum resultado encontrado');
}
