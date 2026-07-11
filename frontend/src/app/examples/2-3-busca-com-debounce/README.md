# 2.3 — RxJS: busca com debounce

`switchMap` é a peça chave aqui: se o usuário digitar de novo antes da requisição anterior voltar, ele cancela a antiga e só segue com a mais nova — sem isso dava pra uma resposta antiga chegar depois e sobrescrever um resultado mais recente (race condition clássica).

O loading liga no `tap` (antes da requisição sair) e desliga no `finalize` (depois que ela termina, com sucesso ou erro — por isso o `catchError` devolve uma lista vazia em vez de deixar o observable quebrar). E como o template usa `async` pipe, nem precisei mexer com unsubscribe manual nem takeUntilDestroyed — o pipe cuida disso sozinho.

`usuario-busca.service.ts` é o service, `busca-usuario.component.ts` o componente, e o `.html` tem o `@if` do loading e o `@for` consumindo o observable direto.

Pra dar pra testar na prática, o service aponta pro `/users` do json-server que já roda nesse projeto (`npm run api`), em vez de uma URL fictícia — dá pra digitar um nome de verdade na aba "Exemplos" e ver o resultado vindo da API.
