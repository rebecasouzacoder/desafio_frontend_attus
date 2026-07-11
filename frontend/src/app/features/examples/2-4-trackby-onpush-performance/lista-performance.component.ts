import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ItemLista } from './item-lista.model';

// track item.id + OnPush — ver README pra explicação de cada parte
@Component({
  selector: 'app-lista-performance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-performance.component.html',
})
export class ListaPerformanceComponent {
  readonly itens = input.required<ItemLista[]>();
}
