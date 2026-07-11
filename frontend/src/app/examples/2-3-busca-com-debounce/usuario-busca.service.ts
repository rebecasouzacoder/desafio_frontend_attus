import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environments';
import { Usuario } from './usuario.model';

// aponta pro json-server do próprio projeto (npm run api) — dá pra testar
// o debounce/switchMap na prática em vez de só descrever numa URL fictícia
@Injectable({ providedIn: 'root' })
export class UsuarioBuscaService {
  private readonly http = inject(HttpClient);

  buscar(nome: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/users`, {
      params: { name_like: nome },
    });
  }
}
