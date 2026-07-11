import { Component, input, output } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Componente responsável por exibir um estado vazio quando não existem
 * resultados disponíveis para apresentação, ou um estado de erro quando
 * a busca dos dados falha.
 *
 * @export
 * @class EmptyResultComponent
 */
@Component({
  selector: 'app-empty-result',
  imports: [MatCard, MatIconModule, MatButtonModule],
  templateUrl: './empty-result.component.html',
  styleUrl: './empty-result.component.scss'
})

export class EmptyResultComponent {
  /**
   * Mensagem exibida ao usuário quando não existem registros disponíveis
   * ou quando ocorre uma falha no carregamento.
   *
   * Possui um valor padrão para casos onde nenhuma mensagem personalizada
   * é informada.
   *
   * @memberof EmptyResultComponent
   */
  public message = input<string>('Nenhum resultado encontrado');

  /**
   * Ícone exibido junto à mensagem.
   *
   * @memberof EmptyResultComponent
   */
  public icon = input<string>('search_off');

  /**
   * Define a variante de exibição do componente.
   * - empty: estado vazio (sem resultados);
   * - error: estado de falha no carregamento.
   *
   * @memberof EmptyResultComponent
   */
  public variant = input<'empty' | 'error'>('empty');

  /**
   * Evento emitido quando o usuário solicita uma nova tentativa
   * de carregamento. Só é exibido o botão correspondente na
   * variante de erro.
   *
   * @memberof EmptyResultComponent
   */
  public retry = output<void>();
}
