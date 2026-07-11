import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { PessoaService } from './pessoa.service';

// explicação completa no README da pasta — resumo: OnPush + subscribe manual
// não reavalia a view sozinho, precisa do markForCheck lá embaixo
@Component({
  selector: 'app-pessoa-onpush-demo',
  standalone: true,
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ texto }}</h1>`,
})
export class PessoaOnPushDemoComponent implements OnInit, OnDestroy {
  texto: string | undefined;
  contador = 0;
  subscriptionBuscarPessoa: Subscription | undefined;

  constructor(
    private readonly pessoaService: PessoaService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subscriptionBuscarPessoa = this.pessoaService
      .buscarPorId(1)
      .subscribe((pessoa) => {
        this.texto = `Nome: ${pessoa.nome}`;
        this.cdr.markForCheck(); // sem isso o OnPush ignora essa mudança
      });

    setInterval(() => this.contador++, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptionBuscarPessoa?.unsubscribe();
  }
}
