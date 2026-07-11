# 2.4 — Performance: OnPush e trackBy

Sem `track`, o Angular identifica os itens da lista pela posição no array. Se o array trocar de referência (mesmo com o mesmo conteúdo dentro), ele recria todo mundo do zero — pra centenas de itens isso é bastante DOM sendo destruído e recriado à toa, além de perder coisas como foco e posição de scroll. Com `track item.id` o Angular passa a reconhecer cada item pela chave e só mexe no que realmente mudou. É só isso em `lista-performance.component.html`.

`OnPush` entra numa outra ponta: sem ele, qualquer evento assíncrono em qualquer lugar do app (um timer, um clique num componente vizinho, etc.) faz o Angular rechecar essa lista inteira de novo, mesmo sem relação nenhuma com ela. Com `OnPush`, o componente só é reavaliado quando o `@Input` muda de referência, algo dispara no próprio template, ou alguém chama `markForCheck`/usa `async` pipe.

Na prática, com a estratégia `Default` numa lista grande, o custo do dirty-checking cresce junto com o tamanho da lista e a frequência de eventos do app — é o tipo de coisa que não trava nada num teste rápido mas fica visível quando a lista é grande de verdade.
