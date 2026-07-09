import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

/**
 * Componente responsável por exibir um estado de carregamento.
 * Utilizado para indicar ao usuário que uma operação assíncrona
 * está em andamento.
 * 
 * A mensagem exibida pode ser personalizada através do input `message`.
 *
 * @export
 * @class LoadingComponent
 */
@Component({
  selector: 'app-loading',
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  public message = input<string>('Carregando...');
}
