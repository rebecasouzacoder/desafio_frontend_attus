import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';

import { Verdureira } from '../1-1-refatoracao-produto/verdureira';
import { filtrarEPaginar } from '../1-2-filtrar-e-paginar/filtrar-e-paginar';
import { PessoaOnPushDemoComponent } from '../2-1-change-detection-onpush/pessoa-onpush-demo.component';
import { PessoaDetalheComponent } from '../2-2-rxjs-sem-nested-subscribe/pessoa-detalhe.component';
import { BuscaUsuarioComponent } from '../2-3-busca-com-debounce/busca-usuario.component';
import { ItemLista } from '../2-4-trackby-onpush-performance/item-lista.model';
import { ListaPerformanceComponent } from '../2-4-trackby-onpush-performance/lista-performance.component';
import { loadTodos, toggleTodoComplete } from '../3-2-ngrx-todo/todo.actions';
import { Todo } from '../3-2-ngrx-todo/todo.model';
import { selectAllTodos, selectPendingTodos, selectTodoState } from '../3-2-ngrx-todo/todo.selectors';

interface UsuarioDemo {
  id: number;
  nome: string;
}

const USUARIOS_DEMO: UsuarioDemo[] = [
  { id: 1, nome: 'Ana Souza' },
  { id: 2, nome: 'Bruno Lima' },
  { id: 3, nome: 'Ana Paula Costa' },
  { id: 4, nome: 'Carlos Eduardo' },
  { id: 5, nome: 'Ana Beatriz' },
  { id: 6, nome: 'Diego Fernandes' },
  { id: 7, nome: 'Marina Alves' },
  { id: 8, nome: 'Ana Clara Reis' },
];

function gerarItens(quantidade: number, offset = 0): ItemLista[] {
  return Array.from({ length: quantidade }, (_, i) => ({
    id: offset + i + 1,
    nome: `Item ${offset + i + 1}`,
  }));
}

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

@Component({
  selector: 'app-examples-demo',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    PessoaOnPushDemoComponent,
    PessoaDetalheComponent,
    BuscaUsuarioComponent,
    ListaPerformanceComponent,
  ],
  templateUrl: './examples-demo.component.html',
  styleUrl: './examples-demo.component.scss',
})
export class ExamplesDemoComponent implements OnInit {
  private readonly store = inject(Store);

  // ---- 1.1 ----
  private readonly verdureira = new Verdureira();
  readonly produtosDemo = [1, 2, 3].map((id) => ({
    id,
    descricao: this.verdureira.getDescricaoProduto(id),
    emEstoque: this.verdureira.hasEstoqueProduto(id),
  }));

  // ---- 1.2 ----
  readonly filtroNome = new FormControl('', { nonNullable: true });
  private readonly filtro = signal('');
  readonly pagina = signal(1);
  readonly tamanhoPagina = 3;

  readonly resultadoPaginado = computed(() =>
    filtrarEPaginar(
      USUARIOS_DEMO,
      (usuario) => usuario.nome.toLowerCase().includes(this.filtro().toLowerCase()),
      { pagina: this.pagina(), tamanho: this.tamanhoPagina },
    ),
  );

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.resultadoPaginado().total / this.tamanhoPagina)),
  );

  // ---- 2.2 ----
  readonly mostrarDetalhe = signal(true);

  // ---- 2.4 ----
  readonly itensLista = signal<ItemLista[]>(gerarItens(200));
  private proximoIdItem = 201;

  // ---- 3.2 ----
  readonly todoState$ = this.store.select(selectTodoState);
  readonly todos$ = this.store.select(selectAllTodos);
  readonly pendentes$ = this.store.select(selectPendingTodos);

  constructor() {
    this.filtroNome.valueChanges.subscribe((valor) => {
      this.filtro.set(valor);
      this.pagina.set(1);
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadTodos());
  }

  paginaAnterior(): void {
    this.pagina.update((p) => Math.max(1, p - 1));
  }

  proximaPagina(): void {
    this.pagina.update((p) => Math.min(this.totalPaginas(), p + 1));
  }

  recarregarDetalhe(): void {
    this.mostrarDetalhe.set(false);
    setTimeout(() => this.mostrarDetalhe.set(true));
  }

  adicionarItem(): void {
    const novoItem: ItemLista = { id: this.proximoIdItem, nome: `Item ${this.proximoIdItem}` };
    this.proximoIdItem++;
    this.itensLista.update((itens) => [novoItem, ...itens]);
  }

  removerItem(): void {
    this.itensLista.update((itens) => itens.slice(1));
  }

  embaralharItens(): void {
    this.itensLista.update((itens) => embaralhar(itens));
  }

  recarregarTodos(): void {
    this.store.dispatch(loadTodos());
  }

  alternarTodo(todo: Todo): void {
    this.store.dispatch(toggleTodoComplete({ id: todo.id }));
  }
}
