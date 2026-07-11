import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Pessoa {
  id: number;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class PessoaService {
  buscarPorId(id: number) {
    return of<Pessoa>({ id, nome: 'João' }).pipe(delay(300));
  }

  buscarQuantidadeFamiliares(id: number) {
    return of<number>(3).pipe(delay(300));
  }
}
