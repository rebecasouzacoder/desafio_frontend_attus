import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { PessoaService } from './pessoa.service';

// buscarPorId e buscarQuantidadeFamiliares não dependem uma da outra, então
// forkJoin (paralelo) em vez de encadear com switchMap — ver README
@Component({
  selector: 'app-pessoa-detalhe',
  standalone: true,
  template: `<p>{{ texto }}</p>`,
})
export class PessoaDetalheComponent implements OnInit {
  texto = '';

  private readonly pessoaService = inject(PessoaService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const pessoaId = 1;

    forkJoin({
      pessoa: this.pessoaService.buscarPorId(pessoaId),
      qtd: this.pessoaService.buscarQuantidadeFamiliares(pessoaId),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ pessoa, qtd }) => {
        this.texto = `Nome: ${pessoa.nome} | familiares: ${qtd}`;
      });
  }
}
