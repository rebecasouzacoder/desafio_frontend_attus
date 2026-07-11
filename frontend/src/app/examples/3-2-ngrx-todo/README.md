# 3.2 — Gerenciamento de Estado com NgRx (Feature To-do)

Segui a divisão padrão do NgRx, um arquivo por responsabilidade:

- `todo.model.ts` — o `Todo`, o formato do `TodoState` e o estado inicial.
- `todo.actions.ts` — as 4 ações pedidas: `loadTodos`, `loadTodosSuccess`, `loadTodosError`, `toggleTodoComplete`.
- `todo.reducer.ts` — um `on` pra cada ação, tudo imutável (spread + retorno de um state novo).
- `todo.selectors.ts` — `selectAllTodos` pega a lista inteira, e `selectPendingTodos` deriva dele filtrando as não concluídas.
- `todo.effects.ts` — `loadTodos$` escuta a ação `loadTodos`, faz o GET e despacha sucesso ou erro dependendo do que voltar, com `switchMap` + `catchError`. O enunciado libera URL fictícia, mas como o projeto já tem um json-server rodando (`npm run api`, endpoint `/todos` adicionado no `db.json`), apontei pra ele — assim dá pra ver o fluxo completo (loading → sucesso, ou loading → erro se a API estiver fora) rodando de verdade na aba "Exemplos".

Pra plugar isso num app de verdade seria só:

```ts
provideStore({ todos: todoReducer }),
provideEffects([TodoEffects]),
```

Isso já está feito em `app.config.ts` pra alimentar a rota de demonstração.
