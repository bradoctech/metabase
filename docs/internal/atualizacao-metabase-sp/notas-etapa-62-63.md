# EDD-1355 — Notas da etapa 62 → 63

**Branch:** `EDD-1355` (tip publicado em `origin/EDD-1355`)  
**Worktree temporária:** `update_with_upstream` (mesmo tip; não publicar — só local)  
**Backup tag:** `saopaulo-pre-63x`  
**Upstream:** `upstream/release-x.63.x`  
**Status:** merge + fixups + **smoke canônico OK**

## O que foi feito

1. Merge `upstream/release-x.63.x` na branch `EDD-1355`.
2. Fixups pós-merge em várias levas (`src/`, `test/`, `enterprise/`, `frontend/src/`, `resources/`), cobrindo:
   - `package.json` + `bun.lock` + patches realinhados ao 63 (typescript `^6.0.3`, echarts `6.1.0`, bun `1.3.14`, etc.)
   - 130 arquivos stuck em `src/` (ex. `lib/schema/template_tag.cljc` — `normalize-template-tag-map`)
   - 84 arquivos stuck em `test/`
   - `body.clj` (hybrid) — `ns` require de `metabase.channel.render.js.color` perdido
   - 3 arquivos FE hybrid com imports quebrados (`home/utils.ts`, `NotificationsTable.tsx`, `HeaderBreadcrumbs.tsx`) + cascata (`HomePopularSection`/`HomeRecentSection` usando `getItemBadge`)
   - 124 arquivos stuck em `resources/` — destaque: `058_update_migrations.yaml` sem colunas SAML (`saml_name_id`, `saml_name_id_format`, `saml_session_index`) no `core_session`, causando erro de login
3. **Login SP perdido e recuperado**: o fixup de 121 stuck files (`629559ed79b`) tinha sobrescrito `Login.tsx`, `AuthLayout.tsx`, `AuthLayout.styled.tsx` com a versão upstream 63, perdendo o layout de dois painéis do EDD-577. Restaurado do commit SP `8e35a8b2637`, com um ajuste: `var(--mb-color-background)` (token que nunca existiu, nem no 62) trocado por `var(--mb-color-background_page-primary)`.
   - `LoginForm.tsx` **não** precisou de restore — a mudança de import (`LoginData`: `../../types` → `metabase/redux/auth`) é refactor legítimo do upstream (tipo foi movido).
4. Smoke canônico (ver [checklist-smoke-test.md](./checklist-smoke-test.md)) — fechado após 3 rodadas (tabela abaixo).

## Smoke canônico — resultado final

| Item | Resultado | Nota |
| ---- | --------- | ---- |
| Pré-check (BE/FE) | OK | No WSL, rspack com heap 3–4 GB + `RSPACK_WORKER_THREADS=1`; exit 137 = OOM, não erro de compile |
| Login SP (EDD-577) / LogoIcon / SpLogo hide | OK | |
| Home cards/badges + Recent | OK | X-ray some só com `has_question_and_dashboard` (question **e** dashboard não-internos) + F5; installer não vê Popular |
| Dashcards DS (EDD-792) | OK | |
| Filtros cascata QB | OK | |
| Clique no título / “ver registros” | OK | Crash era `table.hasSchema is not a function` — API 63 usa `hasMultipleSchemas` + `schema_name` + `HeadBreadcrumbs.Breadcrumb` |
| Eixos 969 | OK | Tooltip de hover em `CartesianChart` adaptado a `chartInstance` |
| Paleta 1092 (Visualizer) | OK | Pickers de série: `SP_PALETTE_COLORS`; defaults: `DEFAULT_ACCENT_COLORS` SP |
| Datagrid pin + hover | OK | |
| Admin LDAP i18n | OK | `t\`\`` nos títulos (upstream #82389 tinha strings cruas) |
| E-mail typo “Adicionr” | OK | |
| Salvar question (header QB) | OK | Endurecido `getDataSourceParts` / `shouldRender` / `LastEditInfoLabel` / ViewOnly |

## Histórico das rodadas (resumo)

- **1ª rodada:** FAIL cascata, eixos/paleta parciais, datagrid “ver registros”, LDAP i18n.
- **2ª rodada:** LDAP/eixos/Visualizer/getItemBadge corrigidos; crash do título/`hasSchema` identificado.
- **3ª rodada:** breadcrumbs 63 + save header + Recent na home → smoke canônico fechado.

## Entrada para EDD-1356 v2 (script)

Prioridade alta no próximo endurecimento do `bin/merge-upstream-preserve-sp.sh`:

1. **Detectar stuck pós-merge:** WT == tip pré-merge e ≠ upstream, fora das listas curated → restaurar do upstream (não só `src/`: incluir `test/`, `enterprise/`, `modules/`, `resources/`).
2. **Detectar órfãos:** path existe no HEAD, sumiu no upstream, não está em restore/dual/behavior → apagar.
3. **Restore stuck não pode pisar curated:** excluir paths em `dual-changed` / `behavior-manual` / `restore-ours` (lição do login EDD-577 sobrescrito).
4. **Híbridos:** `ns`/API SP com body upstream (ou o inverso) → ClassNotFound / import quebrado; sinalizar no `report`.
5. **Trio FE sempre junto:** `package.json` + `bun.lock` + `patches/` da major alvo.
6. Smoke canônico = [checklist-smoke-test.md](./checklist-smoke-test.md), não só “login + home”.

## Entrada para EDD-1362 (tema/marca)

Conflitos / adapters que mais doeram na 63 (candidatos a isolar):

| Área | Paths / tema | Dica |
| ---- | ------------ | ---- |
| Tokens 63 vs SP | `background_page-*`, `core-*`, `feedback-*`, `text-disabled` vs `sp-black` / `sp-red` / … | Mapear aliases; evitar hex espalhado |
| Tema wiring | `themes/light.ts`, `dark.ts`, `accent-colors.ts`, `groups.ts` | Concentrar defaults SP (`DEFAULT_ACCENT_COLORS`, paleta charts) |
| Login / DS | `AuthLayout*`, `Login*`, botões/inputs | Manter em dual-changed até injeção de tema |
| SpLogo hide | `layout.module.css` `.SpLogo` | Continuar hide via CSS, não remover JSX |
| Charts / Visualizer | `SP_PALETTE_COLORS`, series color pickers | Um ponto de verdade para accent |

## Próxima etapa

1. PR / review da `EDD-1355` (smoke canônico OK).
2. **EDD-1362** — refatorar tema/marca na base 63.
3. **EDD-1356 v2** — automatizar stuck/órfãos/exclusões curated com as lições acima.
