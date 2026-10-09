# EDD-1362 — Refatorar tema e marca SP na base atualizada

Issue criada no tracker. **Só iniciar após a EDD-1355** ter a base na versão alvo (ou um marco estável do merge).

Relacionados: [estratégia-sequencia.md](./estrategia-sequencia.md) · [issue-edd-1361.md](./issue-edd-1361.md) · EDD-1355 · EDD-1356

---

## Título

Refatorar tema e marca SP na base atualizada para reduzir conflitos em futuros updates

## Descrição

Após o upgrade, utilizar os conflitos reais encontrados para reduzir o acoplamento das customizações visuais SP ao código core do Metabase.

### Escopo

- Analisar os conflitos/adapters encontrados na EDD-1355.
- Centralizar design tokens SP, incluindo `sp-colors` e correlatos.
- Centralizar defaults de marca, como fonte e logo.
- Criar ou reforçar um ponto de injeção de tema por Mantine theme, CSS variables ou settings.
- Substituir cores/fontes SP hardcoded por tokens/settings nos pontos priorizados.
- Reduzir modificações diretas em arquivos upstream.
- Atualizar manifesto, `restore-ours` e `dual-changed` da EDD-1356.
- Validar login, home, dashboards, charts e datagrid.

### Fora de escopo

Não contempla novas features de produto nem uma reescrita completa do Design System.

### Critérios de aceite

- Quantidade de arquivos `dual-changed` relacionados a tema/marca reduzida em relação ao inventário anterior.
- Métrica antes/depois registrada no manifesto.
- Tokens e defaults SP concentrados em arquivos claramente SP-owned.
- Pontos priorizados deixam de possuir valores SP hardcoded no core.
- EDD-1356 atualizada para refletir a nova classificação.
- Sem regressões visuais críticas nos fluxos priorizados do Trilhas.

### Dependências

- Depende de: EDD-1355.
- Alimenta: futuras execuções da EDD-1356.

---

## Texto sugerido de vínculo nas issues existentes

**EDD-1356**

> Após a 1355, incorporar o relatório de conflitos e, se aplicável, os resultados da EDD-1362 (refatoração de tema pós-update).
