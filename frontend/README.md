# Frontend

Projeto Angular 19 gerado com o Angular CLI. Instruções completas de instalação e execução estão no [README da raiz do repositório](../README.md) — aqui vai só um resumo rápido.

## Rodando local

Precisa de dois terminais, os dois aqui dentro de `frontend/`:

```bash
npm install

# terminal 1 — API mockada (porta 3000)
npm run api

# terminal 2 — app (porta 4200)
npm start
```

Abre [http://localhost:4200](http://localhost:4200).

## Testes

```bash
npm test              # roda a suíte com Jest + cobertura
npm run test:watch
```

## Build

```bash
npm run build
```

Artefatos em `dist/frontend`.
