# Fluent Journey

Plataforma pessoal de aprendizagem de inglês, construída incrementalmente.

## Requisitos

- Node.js LTS
- npm

## Desenvolvimento

```sh
npm install
npm run dev
```

## Validação

```sh
npm run build
npm run lint
```

## Dashboard atual

O dashboard permite registrar e atualizar perfil, nível de inglês, metas semanais,
aulas e atividades. Os indicadores, XP, sequência e conquistas são calculados a
partir desses registros, sem dados de demonstração.

As informações são armazenadas no `localStorage` do navegador. Não há
autenticação, sincronização entre dispositivos ou banco de dados. O acesso é
demonstrativo; os registros ficam neste navegador e podem ser removidos pelo
usuário nas configurações de armazenamento do navegador.

## Organização

- `src/components`: componentes compartilhados.
- `src/features`: páginas e componentes organizados por funcionalidade.
- `src/features/dashboard/dashboardStorage.ts`: persistência local versionada.
- `src/features/dashboard/dashboardTypes.ts`: tipos dos registros do dashboard.

O projeto usa React, TypeScript, Vite, React Router e Oxlint.
