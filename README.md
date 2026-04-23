# Central Carreira — documentação (Docusaurus)

Site estático com a documentação do **Módulo de Carreira** (Hunter). Repositório: [equipe3pontos/Central_carreira](https://github.com/equipe3pontos/Central_carreira).

## Requisitos

- Node.js 20+

## Instalação

```bash
npm ci
```

## Desenvolvimento

```bash
npm run dev
```

O `baseUrl` em `docusaurus.config.ts` está definido para GitHub Pages (`/Central_carreira/`). Em desenvolvimento o site abre em `http://localhost:3000/Central_carreira/`.

## Build

```bash
npm run build
```

Saída em `build/` (não versionar — está no `.gitignore`).

## Contexto para agentes e contribuição

Ver [`AGENTS.md`](./AGENTS.md) na raiz do repositório.
