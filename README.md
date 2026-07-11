# Desafio Frontend — Attus

Aplicação Angular para a avaliação técnica de Desenvolvedor Front End. O projeto inteiro (app + respostas das questões teóricas) fica dentro da pasta [`frontend/`](frontend).

## Stack

- Angular 19 (standalone components)
- Angular Material
- RxJS
- NgRx (`@ngrx/store` + `@ngrx/effects`)
- Jest (testes unitários)
- json-server (API mockada)

## Pré-requisitos

- Node.js 20.x (testado com `v20.19.0`) e npm 10+
- Duas portas livres na máquina: `3000` (API mockada) e `4200` (app)

## Instalação

```bash
cd frontend
npm install
```

## Como rodar

O app depende da API mockada, então precisa de **dois terminais abertos ao mesmo tempo**, os dois dentro de `frontend/`.

**Terminal 1 — API mockada (json-server, porta 3000):**

```bash
npm run api
```

**Terminal 2 — aplicação Angular (porta 4200):**

```bash
npm start
```

Depois é só abrir [http://localhost:4200](http://localhost:4200).

> Se a API não estiver rodando, a listagem de usuários fica em estado de erro (é o comportamento esperado — dá pra testar clicando em "Tentar novamente" depois de subir o `npm run api`).

## Testes

```bash
npm test              # roda a suíte inteira com cobertura
npm run test:watch    # modo watch, útil durante o desenvolvimento
npm run test:coverage # igual ao npm test, nome mais explícito
```

A suíte cobre 100% (statements/branches/functions/lines) do código da listagem de usuários (item 4 da avaliação) — services, validators, componentes e fluxos de sucesso/erro.

## Build de produção

```bash
npm run build
```

Os artefatos ficam em `frontend/dist/frontend`.

## Estrutura do projeto

```
frontend/src/app/
├── features/users/    # desafio prático (item 4): listagem, filtro, modal de criação/edição
├── layout/             # header, menu lateral, footer
├── shared/              # validators (cpf), máscaras, toast service
└── examples/            # respostas em código das questões teóricas (itens 1, 2 e 3.2)
```

## Respostas das questões teóricas

As respostas dos itens 1.1, 1.2, 2.1, 2.2, 2.3, 2.4 e 3.2 estão implementadas como código em `frontend/src/app/examples/`, uma pasta por item, cada uma com um `README.md` explicando a resposta.

Com o projeto rodando, dá pra ver cada uma funcionando de verdade: entra no menu lateral em **Exemplos** (ou acessa direto `/exemplos`) — é uma aba por item. As abas 2.3 e 3.2 puxam dado real da API mockada, então precisam do `npm run api` rodando.
