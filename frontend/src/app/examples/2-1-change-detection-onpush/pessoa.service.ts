import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Pessoa {
  id: number;
  nome: string;
}

@Injectable()
export class PessoaService {
  /** Mock de uma busca em API com retorno em 0.5 segundos */
  buscarPorId(id: number) {
    return of<Pessoa>({ id, nome: 'João' }).pipe(delay(500));
  }
}
