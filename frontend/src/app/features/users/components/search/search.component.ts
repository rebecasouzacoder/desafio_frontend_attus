import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  /**
   * Evento emitido quando o usuário altera o filtro.
   *
   * @memberof SearchComponent
   */
  public searchChange = output<string>();

  /**
   * Controle responsável pelo campo de busca.
   *
   * @memberof SearchComponent
   */
  public searchControl = new FormControl('', { nonNullable: true});

  /**
   * Referência utilizada pelo Angular para controlar
   * o ciclo de vida da subscription.
   *
   * @private
   * @memberof SearchComponent
   */
  private destroyRef = inject(DestroyRef);

  /**
   * Inicializa a configuração do formulário de busca.
   *
   * Responsável por registrar a escuta das alterações
   * realizadas no campo de pesquisa.
   *
   * @memberof SearchComponent
   */
  public ngOnInit(): void {
    this.changeForm();
  }

  /**
   * Configura a observação das alterações realizadas
   * no campo de busca.
   * O fluxo aplica:
   * - debounceTime para aguardar 300ms antes de emitir;
   * - distinctUntilChanged para evitar emissões duplicadas;
   * - takeUntilDestroyed para encerrar a subscription
   *   automaticamente durante a destruição do componente.
   * 
   * Após o processamento, o valor informado pelo usuário
   * é emitido para o componente pai através do searchChange.
   *
   * @private
   * @memberof SearchComponent
   */
  private changeForm(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.searchChange.emit(value.trim());
      });
  }
}
