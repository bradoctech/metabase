# Instruções para o agente — atualização Metabase SP

**Como usar:** no início de uma nova conversa sobre EDD-1355, EDD-1356, prep, tema SP ou upgrade do fork, peça ao agente para ler este arquivo (e, se precisar de detalhe, os outros `.md` desta pasta) antes de planejar ou editar código.

**Pasta:** `docs/internal/atualizacao-metabase-sp/`  
**Última consolidação de contexto:** conversa de planejamento (set/2026) — issues EDD-1355 e EDD-1356.

---

## Objetivo do trabalho

Atualizar o fork Metabase São Paulo / Trilhas para uma versão mais recente **preservando customizações SP**, e criar um processo **reproduzível / semi-automatizado** para próximos upgrades — sem depender de “baixar a release e recolocar tudo na mão”.

---

## Fatos já verificados no repositório

Trate isto como verdade até alguém atualizar este arquivo após nova verificação:

| Fato                        | Detalhe                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Remote do fork              | `origin` → `git@github.com:bradoctech/metabase.git`                                   |
| Branch principal            | `saopaulo`                                                                            |
| Base atual                  | **Metabase 0.60.x** (não 61, não 63)                                                  |
| Evidência da base 0.60      | Commit `78190d89ae` — _“Atualizado SP com o upstream da v0.60”_                       |
| Tentativa 0.61              | Branch `origin/update_with_upstream_61` — merge _não_ entrou em `saopaulo`            |
| Script legado de merge      | `bin/merge-upstream-61-preserve-sp.sh` (existe na branch 61; padrão a generalizar)    |
| Alvo discutido para upgrade | Linha **63.x**, ex. tag [`v0.63.18`](https://github.com/metabase/metabase/releases)   |
| Customizações               | Muitos commits `feat[EDD-…]` em cima da 0.60; ~150 arquivos tocados por esses commits |
| Isolamento atual            | Fraco — pouquíssimos arquivos “SP-named”; maioria é edição no core                    |

### Arquivos SP / críticos (amostra)

- Tokens: `frontend/src/metabase/ui/colors/constants/sp-colors.ts`
- Tema adapter: `frontend/src/metabase/ui/colors/constants/themes/light.ts` (e correlatos dark/accent)
- Fontes: `frontend/src/metabase/css/core/fonts.saopaulo.styled.ts`; `"Rawline"` hardcoded em vários viz/static-viz
- Assets: `resources/frontend_client/app/assets/img/logo-sp-gov.*`
- i18n: `locales/pt-BR.po`
- Behavior: datagrid (pin), eixos (`toTitleCase` / `AXIS_LABEL_MAX_CHARS`), home badges, filtros QB, stubs de upsell (vistos no trabalho 61)

### Buckets acordados para classificar customizações

1. **SP-owned** — restaurar com `ours` no merge (tokens, logos, docs internas).
2. **Adapter** — merge 3-way (tema wiring, headers, home styled, `.po`).
3. **Behavior** — patch/feature (datagrid, title-case, badges, upsells, filtros).

---

## Decisões de estratégia (não reabrir sem motivo)

1. **Não** usar como fluxo principal: baixar `v0.63.18` numa branch limpa e só diffar com `saopaulo`.
2. **Sim** usar: remote `upstream` (`metabase/metabase`) + **merge** de `release-x.N.x` / tag, com restore assistido.
3. Diff útil para inventário SP: `upstream/release-x.60.x...saopaulo` (não `saopaulo` vs 63).
4. Isolar 100% das customizações como “config” **não é realista**; isolar tema/marca **sim** (parcial).
5. Refatoração **grande** de tema/marca **depois** do update (na base 63), não como pré-requisito rígido do salto 60→63.
6. EDD-1355 é a **PoC** do processo da EDD-1356.
7. `update_with_upstream_61` está **desatualizada** vs `saopaulo` — não usar sozinha como base sem reintegrar EDDs posteriores.

### Sequência oficial

```text
Prep (issue nova, escopo fino)
  → EDD-1356 MVP (pode paralelizar com Prep)
  → EDD-1355 (update = PoC da 1356)
  → Tema/marca pós-update (issue nova)
  → EDD-1356 v2 (endurecer com aprendizados)
```

Detalhe narrativo: [estrategia-sequencia.md](./estrategia-sequencia.md).  
Textos das issues novas: [rascunho-issue-prep.md](./rascunho-issue-prep.md) e [rascunho-issue-tema.md](./rascunho-issue-tema.md).

---

## Issues

| ID                      | Papel                                                      | Estado na conversa                |
| ----------------------- | ---------------------------------------------------------- | --------------------------------- |
| **EDD-1355**            | Atualizar Metabase + reaplicar customizações               | Planejada; PoC da 1356            |
| **EDD-1356**            | Automatizar / semi-automatizar transporte de customizações | Planejada; MVP antes/durante 1355 |
| **EDD-PREP** (rascunho) | Inventário + quick wins de isolamento                      | Ainda sem ID real no tracker      |
| **EDD-TEMA** (rascunho) | Refatorar tema/marca na base já atualizada                 | Ainda sem ID real; **após** 1355  |

Se os IDs prep/tema forem criados no tracker, **atualize esta tabela**.

---

## Como o agente deve agir em conversas novas

### Ao começar

1. Ler este arquivo.
2. Se for executar upgrade ou inventário: confirmar com `git` se a base ainda é 0.60 (`saopaulo`) e se `update_with_upstream_61` / remotes mudaram.
3. Seguir a sequência oficial; não inverter para “refatorar tema grande → depois update” sem o usuário pedir.

### Ao inventariar customizações

- Preferir: commits `feat[EDD-…]`, `git diff --name-only` vs `upstream/release-x.60.x`, listas do script 61.
- Classificar em SP-owned / adapter / behavior.
- Documentar progresso nesta pasta (ex.: novo `manifesto-customizacoes.md` quando existir).

### Ao atualizar versão (1355)

- Criar branch a partir de `saopaulo`.
- Merge do upstream (63.x ou caminho intermediário 61→62→63 se combinado).
- Restore automático do SP-owned; reportar dual-changed / manuais.
- **Não** concluir sem registrar conflitos reais (entrada da 1356 v2 e da issue de tema).

### Ao automatizar (1356)

- Generalizar o padrão de `merge-upstream-61-preserve-sp.sh` (snapshot / merge / restore / report / verify).
- Manter listas versionadas (`restore-ours`, `dual-changed`).
- Aceitar intervenção manual nos adapters/behavior; automatizar o resto.

### Ao refatorar tema (pós-1355)

- Trabalhar na árvore já atualizada.
- Objetivo: encolher `dual-changed` de visual; tokens SP-owned; menos `"Rawline"`/hex espalhados.

### O que evitar sugerir de novo (já descartado)

- Substituir o tree pela tag e reaplicar na mão como método principal.
- Diff `saopaulo` vs 63 limpo como lista canônica de customizações.
- Refatoração completa de DS na 0.60 como gate obrigatório da 1355.
- Prometer zero conflitos em todo update.

---

## Documentos desta pasta

| Arquivo                                              | Uso                                              |
| ---------------------------------------------------- | ------------------------------------------------ |
| [README.md](./README.md)                             | Índice humano                                    |
| [estrategia-sequencia.md](./estrategia-sequencia.md) | Cenário + sequência + dependências               |
| [rascunho-issue-prep.md](./rascunho-issue-prep.md)   | Copy-paste da issue de prep                      |
| [rascunho-issue-tema.md](./rascunho-issue-tema.md)   | Copy-paste da issue de tema pós-update           |
| **Este arquivo**                                     | Bootstrap de contexto para o agente em chat novo |

---

## Como o usuário pode acionar isto numa conversa nova

Sugestão de prompt:

> Leia `docs/internal/atualizacao-metabase-sp/INSTRUCOES-AGENTE.md` e continue a partir do contexto das issues EDD-1355 / EDD-1356. Não reinvente a estratégia já decidida.

---

## Atualizar este arquivo quando

- A base de `saopaulo` deixar de ser 0.60.x
- Issues prep/tema ganharem IDs reais
- O script genérico de merge for criado/renomeado
- A 1355 terminar (registrar versão alvo alcançada + lições)
- Decisões da sequência oficial mudarem
