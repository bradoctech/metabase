# EDD-1361 — Preparar inventário e isolamento mínimo das customizações SP

Issue criada no tracker. Branch de trabalho: `EDD-1361`.

Relacionados: [estratégia-sequencia.md](./estrategia-sequencia.md) · [issue-edd-1362.md](./issue-edd-1362.md) · EDD-1355 · EDD-1356

---

## Título

Preparar inventário e isolamento mínimo das customizações SP para updates do Metabase

## Descrição

Mapear as customizações existentes no fork `saopaulo` antes do upgrade e realizar apenas os ajustes de baixo risco que facilitem seu transporte para versões futuras.

### Escopo

- Mapear customizações por commits `feat[EDD-…]`, diff com `upstream/release-x.60.x` e histórico do fork.
- Classificar cada customização como:
  - **SP-owned:** pode ser restaurada automaticamente.
  - **Adapter:** exige merge entre upstream e SP.
  - **Behavior:** alteração funcional/comportamental.
- Criar manifesto contendo path → EDD de origem → bucket → risco.
- Identificar paths críticos de tema, assets, i18n e behavior.
- Aplicar quick wins seguros, como centralização de tokens em `sp-colors`, remoção de valores SP isolados e centralização de defaults simples de fonte/logo.
- Documentar em `docs/internal/atualizacao-metabase-sp/`.

### Fora de escopo

Não inclui upgrade para 63.x, automação completa do merge ou refatoração estrutural de tema/marca.

### Critérios de aceite

- Manifesto das customizações criado e versionado.
- Customizações classificadas nos três buckets.
- Paths críticos associados às EDDs de origem e ao risco de atualização.
- Quick wins aplicados ou adiados com justificativa.
- Documentação disponível para EDD-1355 e EDD-1356.

### Dependências

- Nenhuma.
- Alimenta: EDD-1355 e EDD-1356.

---

## Texto sugerido de vínculo nas issues existentes

**EDD-1355**

> Depende do inventário (EDD-1361) e do MVP do processo da EDD-1356. Esta issue é a prova de conceito (PoC) do processo de atualização documentado em `docs/internal/atualizacao-metabase-sp/`.

**EDD-1356**

> Pode iniciar em paralelo à EDD-1361. Usa o inventário como entrada. É validada pela execução da EDD-1355.
