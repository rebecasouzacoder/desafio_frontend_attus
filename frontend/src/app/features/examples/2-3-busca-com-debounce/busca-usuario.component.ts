import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { Usuario } from './usuario.model';
import { UsuarioBuscaService } from './usuario-busca.service';

// detalhes no README — resumo rápido: switchMap cancela a busca anterior,
// tap/finalize controlam o loading, e o async pipe no template já cuida do
// unsubscribe sozinho
@Component({
  selector: 'app-busca-usuario',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './busca-usuario.component.html',
  styleUrl: './busca-usuario.component.scss',
})
export class BuscaUsuarioComponent {
  private readonly usuarioService = inject(UsuarioBuscaService);

  readonly buscaControl = new FormControl('', { nonNullable: true });
  readonly loading = signal(false);

  readonly usuarios$ = this.buscaControl.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap((termo) =>
      this.usuarioService.buscar(termo).pipe(
        catchError(() => of<Usuario[]>([])),
        finalize(() => this.loading.set(false)),
      ),
    ),
  );
}
