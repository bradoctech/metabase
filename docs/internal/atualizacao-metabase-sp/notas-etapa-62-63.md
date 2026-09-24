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

| Item | Resultado | Ação |
| ---- | --------- | ---- |
| Pré-check (backend/FE) | OK | — |
| Login SP (EDD-577) | OK (após fix acima) | — |
| LogoIcon brasão | OK | — |
| SpLogo hide (EDD-791) | OK | — |
| Home cards/badges | OK | — |
| Dashcards DS (EDD-792) | OK | — |
| **Filtros cascata QB** | **FAIL** — erro ao criar um filtro numa question | Código (`chain-filter-constraints.ts`, `FilterValuePicker.tsx`, `field.clj`) bate 100% com a versão SP — não é stuck óbvio. **Falta reproduzir com erro exato (console/network) para localizar a causa.** |
| **Eixos 969** | Parcial — usuário não percebeu em todos os charts | Achado: `CartesianChart.tsx` tinha perdido o efeito de tooltip de hover (`axisLabelTooltip` + `getOriginalAxisLabel`) na leva de restore — upstream 63 trocou `chartDom` (state) por `chartInstance`. **Corrigido nesta sessão**, adaptado ao novo state. TitleCase/truncate no eixo em si já estava OK (fixup anterior). |
| **Paleta 1092 (Visualizer)** | Parcial — paleta default do Metabase no "Visualizar de outra maneira" | Investigado: a resolução de cor é a mesma para QB/Dashboard/Visualizer (`getColorsForValues` → `getMainAccentColors` → CSS var `--mb-color-accentN`); não há override hardcoded em `metabase/visualizer/`. **Não localizado ainda** — precisa inspeção via DevTools (comparar `--mb-color-accent0` computado dentro do Visualizer vs. card normal). |
| **Datagrid via "ver registros"** | FAIL — falha ao reproduzir (print enviado, mas sem detalhe de console) | **Falta reprodução com console/CSS aplicado** para confirmar se é o mesmo `DataGrid.module.css` sendo carregado nesse caminho. |
| **Admin LDAP i18n** | FAIL | Achado e corrigido nesta sessão: upstream 63 redesenhou a página de LDAP (#82389) com `title={"Server settings"}` etc. em string crua (upstream nunca usou `` t`` ``); o restore de stuck files trouxe essa versão por cima do fix SP. Reaplicado `` t`` `` nos 4 títulos (`Server settings`, `User schema`, `Attributes`, `Group schema`) — traduções já existem em `pt-BR.po` / `pt_BR.json`, não precisou rebuild. |
| E-mail typo "Adicionr" | OK | — |

## Correções aplicadas nesta sessão (pendente de commit do usuário)

- `frontend/src/metabase/visualizations/visualizations/CartesianChart/CartesianChart.tsx` — reaplicado tooltip de hover do eixo (EDD-969), adaptado a `chartInstance` (novo state pós-63).
- `frontend/src/metabase/admin/settings/components/SettingsLdapForm.tsx` — reaplicado `` t`` `` nos 4 títulos de seção LDAP.

## Pendências desta etapa

1. **Filtros cascata QB** — reproduzir e capturar erro exato (console + Network) para localizar a causa; código-fonte já bateu 100% com a versão SP, então suspeita é algo mais amplo do 63 (não específico de customização SP) ou uma dependência indireta.
2. **Paleta 1092 no Visualizer** — checar runtime (`--mb-color-accentN` computado) dentro do canvas do Visualizer; possível que o tema/CSS vars não estejam disponíveis nesse contexto specific, ou que o Visualizer renderize antes do tema global carregar.
3. **Datagrid via "ver registros"** — reproduzir com console aberto; confirmar se o container carrega `DataGrid.module.css` normalmente nesse fluxo.
4. Confirmar se `saopaulo-pre-63x` foi de fato criada como tag de backup (checar `git tag`).

## Próxima etapa

Fechar as 3 pendências acima antes de considerar o smoke da 63 "fechado". Depois, seguir a sequência oficial (EDD-1362 pós-update).
