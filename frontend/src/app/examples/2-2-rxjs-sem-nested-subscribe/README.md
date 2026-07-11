# 2.2 — RxJS: eliminando subscriptions aninhadas

Usei `forkJoin` porque as duas chamadas não dependem uma da outra — `buscarQuantidadeFamiliares` não precisa de nada que venha de `buscarPorId`, as duas só precisam do `pessoaId` que já se tem de cara. Então dá pra disparar as duas ao mesmo tempo e esperar as duas voltarem, em vez de esperar a primeira terminar pra só então chamar a segunda (o que seria o caso de usar `switchMap`, se uma dependesse do resultado da outra).

`takeUntilDestroyed` resolve o cancelamento quando o componente morre, sem precisar guardar a subscription numa variável e dar unsubscribe no ngOnDestroy.
