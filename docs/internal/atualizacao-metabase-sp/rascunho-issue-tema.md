# Rascunho de issue — Refatorar tema e marca SP pós-update

Texto pronto para abrir no tracker. Substituir `EDD-TEMA` pelo ID real ao criar a issue.

**Só iniciar após a EDD-1355** ter a base na versão alvo (ou um marco estável do merge).

Relacionados: [estratégia-sequencia.md](./estrategia-sequencia.md) · [rascunho-issue-prep.md](./rascunho-issue-prep.md) · EDD-1355 · EDD-1356

---

## Título

Refatorar tema e marca SP na base atualizada para reduzir conflitos em futuros updates

## Descrição

Após o upgrade do Metabase (EDD-1355), usar o mapa real de conflitos e a estrutura da nova versão para **encolher a lista dual-changed** de tema/marca.

Hoje parte do visual SP está espalhada em arquivos core (`light.ts`, CSS modules, styled components, `"Rawline"` hardcoded em viz, etc.). O objetivo é isolar tokens e branding de forma que updates futuros restaurem arquivos SP-owned automaticamente e toquem o upstream o mínimo possível.

### Escopo

- Analisar conflitos/adapters de tema registrados na EDD-1355.
- Centralizar design tokens SP (`sp-colors` e correlatos) e defaults de marca (font, logo).
- Introduzir (ou reforçar) um ponto de injeção de tema (Mantine theme / CSS variables / settings), reduzindo edições espalhadas no core.
- Migrar referências hardcoded de cor/font para tokens ou settings, onde couber sem regressão visual.
- Atualizar o manifesto e as listas `restore-ours` / `dual-changed` do processo EDD-1356.
- Validar visualmente fluxos SP/Trilhas (login, home, dashboard, charts, datagrid).

### Fora de escopo

- Novas features de produto (datagrid, badges, filtros QB) — apenas o necessário para não quebrar o visual.
- Reescrita completa do Design System fora do que impacta conflitos de merge.

### Critérios de aceite

- Lista `dual-changed` de arquivos de tema/marca reduzida em relação ao inventário pré-refatoração (métrica registrada no manifesto).
- Tokens e defaults de marca SP ficam em arquivos claramente SP-owned.
- Componentes upstream de visual passam a consumir tokens/settings em vez de valores SP hardcoded, nos casos priorizados.
- Manifesto e script/processo da EDD-1356 atualizados com a nova classificação.
- Sem regressões críticas de visual nos fluxos validados do Trilhas.

### Dependências

- Depende de: EDD-1355 (base atualizada + aprendizados de conflito)
- Alimenta: próximas execuções da EDD-1356 / próximos upgrades

---

## Texto sugerido de vínculo nas issues existentes

**EDD-1356**

> Após a 1355, incorporar o relatório de conflitos e, se aplicável, os resultados da refatoração de tema pós-update.
