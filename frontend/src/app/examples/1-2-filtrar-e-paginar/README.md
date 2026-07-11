# 1.2 — Generics e tipos utilitários

`filtrarEPaginar<T>` funciona pra qualquer array porque é genérica em `T` — nada de `any`.

A ordem importa aqui: primeiro filtra tudo com o predicado e só depois faz o `slice` da página. Se fizesse o slice antes, o `total` ia dar o número errado (só contaria o que sobrou na página, não o total de registros que batem com o filtro).

Exemplo de uso com array de usuários filtrando por nome em `filtrar-e-paginar.example.ts`.
