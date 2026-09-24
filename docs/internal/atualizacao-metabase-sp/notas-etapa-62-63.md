# EDD-1355 — Notas da etapa 62 → 63

**Branch:** `EDD-1355`
**Backup tag:** `saopaulo-pre-63x` (a confirmar se foi criada nesta rodada)
**Upstream:** `upstream/release-x.63.x`

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
4. Smoke test detalhado rodado (ver [checklist-smoke-test.md](./checklist-smoke-test.md)) — resultado abaixo.

## Resultado do smoke test detalhado (primeira rodada)

| Item                             | Resultado                                                              | Ação                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pré-check (backend/FE)           | OK                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                               |
| Login SP (EDD-577)               | OK (após fix acima)                                                    | —                                                                                                                                                                                                                                                                                                                                                                                                               |
| LogoIcon brasão                  | OK                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                               |
| SpLogo hide (EDD-791)            | OK                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                               |
| Home cards/badges                | OK                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                               |
| Dashcards DS (EDD-792)           | OK                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Filtros cascata QB**           | **FAIL** — erro ao criar um filtro numa question                       | Código (`chain-filter-constraints.ts`, `FilterValuePicker.tsx`, `field.clj`) bate 100% com a versão SP — não é stuck óbvio. **Falta reproduzir com erro exato (console/network) para localizar a causa.**                                                                                                                                                                                                       |
| **Eixos 969**                    | Parcial — usuário não percebeu em todos os charts                      | Achado: `CartesianChart.tsx` tinha perdido o efeito de tooltip de hover (`axisLabelTooltip` + `getOriginalAxisLabel`) na leva de restore — upstream 63 trocou `chartDom` (state) por `chartInstance`. **Corrigido nesta sessão**, adaptado ao novo state. TitleCase/truncate no eixo em si já estava OK (fixup anterior).                                                                                       |
| **Paleta 1092 (Visualizer)**     | Parcial — paleta default do Metabase no "Visualizar de outra maneira"  | Investigado: a resolução de cor é a mesma para QB/Dashboard/Visualizer (`getColorsForValues` → `getMainAccentColors` → CSS var `--mb-color-accentN`); não há override hardcoded em `metabase/visualizer/`. **Não localizado ainda** — precisa inspeção via DevTools (comparar `--mb-color-accent0` computado dentro do Visualizer vs. card normal).                                                             |
| **Datagrid via "ver registros"** | FAIL — falha ao reproduzir (print enviado, mas sem detalhe de console) | **Falta reprodução com console/CSS aplicado** para confirmar se é o mesmo `DataGrid.module.css` sendo carregado nesse caminho.                                                                                                                                                                                                                                                                                  |
| **Admin LDAP i18n**              | FAIL                                                                   | Achado e corrigido nesta sessão: upstream 63 redesenhou a página de LDAP (#82389) com `title={"Server settings"}` etc. em string crua (upstream nunca usou ` t` `); o restore de stuck files trouxe essa versão por cima do fix SP. Reaplicado ` t` ` nos 4 títulos (`Server settings`, `User schema`, `Attributes`, `Group schema`) — traduções já existem em `pt-BR.po` / `pt_BR.json`, não precisou rebuild. |
| E-mail typo "Adicionr"           | OK                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                               |

## Correções aplicadas nesta sessão (pendente de commit do usuário)

- `frontend/src/metabase/visualizations/visualizations/CartesianChart/CartesianChart.tsx` — reaplicado tooltip de hover do eixo (EDD-969), adaptado a `chartInstance` (novo state pós-63).
- `frontend/src/metabase/admin/settings/components/SettingsLdapForm.tsx` — reaplicado ` t` `` nos 4 títulos de seção LDAP.

## Segunda rodada de smoke (feedback do usuário)

| Item                                                 | Resultado     | Nota                                                                                                                             |
| ---------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Pré-check                                            | OK            | BE sobe sem a linha “Initialization COMPLETE”; jobs de sync/index no log são suficientes se a UI navega                          |
| Login / Auth                                         | OK            | Só há user admin no H2 local — não-admin não testado                                                                             |
| Login SP / LogoIcon / SpLogo hide / Home / Dashcards | OK            | —                                                                                                                                |
| Filtros cascata QB                                   | FAIL          | Erro ao **criar** um filtro numa question (não só o 2º dropdown). Falta o texto do erro (console/Network)                        |
| Eixos 969                                            | Parcial       | TitleCase/truncate não percebido em todos os cartesianos. Tooltip de hover reaplicado em `CartesianChart.tsx` (ainda sem commit) |
| Paleta 1092                                          | Parcial       | Visualizer (“Visualizar de outra maneira”) usava `DEFAULT_ACCENT_COLORS` Metabase. Corrigido nesta sessão (ainda sem commit)     |
| Datagrid “ver registros”                             | FAIL          | Falha ao abrir a question por essa opção. Falta console/print detalhado                                                          |
| LDAP i18n                                            | FAIL no teste | `` t` ` `` já reaplicado em `SettingsLdapForm.tsx` (ainda sem commit) — retestar após reload                                     |
| E-mail “Adicionr”                                    | OK            | —                                                                                                                                |

## Correções aplicadas nesta sessão (pendente de commit)

- `CartesianChart.tsx` — tooltip de hover do eixo (EDD-969), adaptado a `chartInstance`.
- `SettingsLdapForm.tsx` — `` t` ` `` nos 4 títulos LDAP.
- `home/utils.ts` + `HomePopularSection` / `HomeRecentSection` — `getItemBadge` de volta, import 63 (`metabase/common/collections/constants`).
- `accent-colors.ts` — `DEFAULT_ACCENT_COLORS` passou a usar a paleta SP (Visualizer e charts novos).

## Pendências desta etapa

1. **Filtros cascata QB** — precisa do erro exato (console + Network, status HTTP e body). O código de constraints está presente; o crash ao _criar_ o filtro pode ser outro path (picker/coluna/API).
2. **Datagrid via “ver registros”** — precisa do erro exato (console). Confirmar se o container aplica `DataGrid.module.css`.
3. Retestar LDAP + eixos 969 + paleta Visualizer + badges da Home depois do commit/reload.
4. Tag `saopaulo-pre-63x` existe.

## Próxima etapa

Fechar as 2 FAILs que ainda precisam de reprodução (cascata + datagrid) e retestar os itens já corrigidos. Depois, sequência oficial (EDD-1362 pós-update).
