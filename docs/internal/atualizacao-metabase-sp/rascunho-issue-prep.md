# Rascunho de issue — Preparar o fork para updates

Texto pronto para abrir no tracker. Substituir `EDD-PREP` pelo ID real ao criar a issue.

Relacionados: [estratégia-sequencia.md](./estrategia-sequencia.md) · [rascunho-issue-tema.md](./rascunho-issue-tema.md) · EDD-1355 · EDD-1356

---

## Título

Preparar inventário e isolamento mínimo das customizações SP para updates do Metabase

## Descrição

O fork `saopaulo` possui dezenas de customizações sobre o Metabase 0.60.x. Antes de automatizar o transporte (EDD-1356) e executar o upgrade (EDD-1355), é necessário **mapear** essas mudanças e aplicar apenas **quick wins de isolamento** que reduzam atrito sem redesenhar o tema na base antiga.

Esta issue **não** inclui a refatoração completa de tema/marca (isso fica para depois do update, na base 63.x).

### Escopo

- Mapear customizações via commits `feat[EDD-…]`, diff contra `upstream/release-x.60.x` e histórico do fork.
- Classificar cada item nos buckets:
  - **SP-owned** — restaurável automaticamente no merge;
  - **Adapter** — merge 3-way (upstream + SP);
  - **Behavior** — patch de comportamento / feature.
- Publicar um manifesto versionado (path → EDD de origem → bucket → risco no merge).
- Aplicar quick wins seguros na 0.60 (ex.: consolidar referências a tokens em `sp-colors`, evitar hex SP solto, centralizar defaults óbvios de font/logo **sem** reescrever home/dashboard/datagrid).
- Documentar o inventário em `docs/internal/atualizacao-metabase-sp/`.

### Fora de escopo

- Merge da release 63.x (EDD-1355).
- Automação completa do fluxo de merge (EDD-1356) — apenas alimenta essa issue.
- Refatoração ampla de tema/marca / ponto único de injeção (issue pós-update).

### Critérios de aceite

- Existe um manifesto das customizações SP classificadas nos 3 buckets.
- Paths críticos (tema, assets, i18n, behavior) estão listados com EDD de origem e risco.
- Quick wins de isolamento acordados foram aplicados **ou** explicitamente adiados com justificativa.
- O inventário está disponível em `docs/internal/atualizacao-metabase-sp/` para uso pela EDD-1356 e EDD-1355.

### Dependências

- Alimenta: EDD-1356, EDD-1355
- Bloqueia: nenhuma (pode rodar em paralelo com o MVP da 1356)

---

## Texto sugerido de vínculo nas issues existentes

**EDD-1355**

> Depende do inventário (issue de prep) e do MVP do processo da EDD-1356. Esta issue é a prova de conceito (PoC) do processo de atualização documentado em `docs/internal/atualizacao-metabase-sp/`.

**EDD-1356**

> Pode iniciar em paralelo ao prep. Usa o inventário como entrada. É validada pela execução da EDD-1355.
