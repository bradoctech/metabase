# Checklist de smoke test — Metabase SP fork

**Uso:** rodar após qualquer merge de major e antes de fechar a etapa. Marcar **OK/FAIL** por item. Se algo regredir, anote o sintoma (console, Network, print) para localizar o path na próxima leva.

Esta checklist cobre os comportamentos SP reais (EDD-…), não só “a tela abre”.

**Validada em:** 63.x (primeira rodada completa). Salto **60→64** (`metabasev64`): em andamento — ver status abaixo. Diário: [notas-etapa-60-64.md](./notas-etapa-60-64.md) · PoC 63: [notas-etapa-62-63.md](./notas-etapa-62-63.md).

---

## Status 60→64 (`metabasev64`) — smoke

| Item | Status |
| ---- | ------ |
| Pré-check BE/FE | OK |
| Login SP + Entrar preto + hover “Esqueci minha senha” | OK |
| Logo brasão (login + AppBar) | OK |
| SpLogo oculto em headers | OK |
| NewItemButton (+ Novo) bg preto | OK |
| Home Recent / Popular (HomeModelCard + badges) | OK |
| Home Xray (card alto SP + bolt brand) | OK |
| RowChart 969 + pin/hover datagrid | OK |
| Eixos 969 (amostra bar/line/…) | OK (amostra) — cobertura de modelos abaixo |
| Dashcards DS | OK |
| Filtros cascata QB | OK |
| Paleta 1092 / charts + Visualizer | OK |
| i18n LDAP / strings novas 64 | parcial → caso à parte |
| Typo “Adicionr” no e-mail | OK (`Adicionar…`) |

---

## Pré-check

- [ ] Backend sobe (`clojure -M:run:dev:dev-start:…`)
- [ ] FE hot compila sem erros de módulo

## UI / marca

- [ ] **Login SP** — painel esquerdo + DS (EDD-577); botão **Entrar** preto (`button-primary`); link **Esqueci minha senha** texto escuro + hover vermelho — `AuthLayout*`, `LoginForm`, `AuthButton`
- [ ] **LogoIcon** = brasão no login e no AppBar (não diamante Metabase) — `common/components/LogoIcon/LogoIcon.tsx`
- [ ] **SpLogo oculto** nos headers de painel/dashboard (EDD-791) — `css/core/layout.module.css` (`.SpLogo`)
- [ ] **NewItemButton** (+ Novo) bg preto / texto branco (EDD-578) — `nav/components/NewItemButton` + `Button.module.css` (`filled`/`primary` → `button-primary`)
- [ ] **New question** (e demais triggers “novo” no DS) — mesmo preto SP, não brand Metabase
- [ ] **Metabot ausente na home** / margem da greeting (EDD-580) — `HomeGreeting` sem MetabotLogo; `show-metabot` respeitado
- [ ] **Tokens de tema** (EDD-793 / 1362) — brand vermelho SP, `button-primary` preto, `background-home`, etc. (`sp-theme.ts` injetado)

### Home — todos os modelos de card SP

A home só mostra **uma** seção (Popular → Recent → Xray). Validar o visual SP em cada modelo:

- [ ] **Recent** — `HomeModelCard` 215×315 + badge (`getItemBadge`) — seção “Continue de onde parou”
- [ ] **Popular** — mesmo `HomeModelCard` + badge
- [ ] **Xray** — card alto SP 215×315 (badge + bolt `core-brand` vermelho, não `accent4` verde / `HomeCard` horizontal 64) — `HomeXrayCard`
- [ ] **Help** (“tips”) — presente junto das seções quando aplicável; não quebra o layout dos cards altos

Como forçar Xray: ver [Como ver a seção Xray](#como-ver-a-seção-xray) abaixo.

## Dashboard / charts / grid

- [ ] **Dashcards DS** — shadow/legenda/padding (EDD-792) — `DashCard.*`, `LegendCaption`, `padding.ts`, `series.ts`, `Progress`
- [ ] **Filtros cascata no QB** — criar filtro em uma question, abrir dropdown de valores de um 2º filtro, checar `POST /api/field/:id/filtered-values` com `constraints`
- [ ] **Eixos 969** — TitleCase + truncate (**max 10 chars**) + tooltip de hover com label completo
  - Cobertura no código 64 (`viz-core`):
    - **Cartesianos** (compartilham `axis.ts` + tooltip em `CartesianChart.tsx`): **bar, line, area, combo, scatter, waterfall**
    - **RowChart**: `RowChartView.tsx` (TitleCase/truncate/tooltip)
    - **BoxPlot**: TitleCase/truncate via `buildCategoricalDimensionAxis`; tooltip de eixo no `BoxPlot.tsx` (mesmo padrão do CartesianChart)
  - Não basta RowChart sozinho — amostrar bar/line/combo no mínimo
- [ ] **Paleta 1092** nos charts — inclusive no **Visualizer** (“Visualizar de outra maneira”) — `accent-colors.ts`, `ChartSettingColorPicker.tsx`
- [ ] **Datagrid** — pin (EDD-944) + hover de linha (EDD-564; clique ≠ hover) — testar via **“ver registros”** — `DataGrid.module.css`, `css/admin.module.css`
- [ ] **Valores `null`** nas tabelas/formatters (EDD-999) — display coerente (`getNullDisplayValue` / empty placeholder)

## i18n (amostra)

- [ ] **Admin LDAP** com títulos em pt-BR (`` t` ` ``, não string crua) — `SettingsLdapForm.tsx`
- [ ] **E-mail** sem typo “Adicionr” — Admin → Settings → Email → rótulo **“Add Recipients as CC or BCC”** (`locales/pt-BR.po` ainda tem `msgstr "Adicionr destinatários…"` até corrigir)
- [ ] **Strings novas da 64** — amostra pontual; backlog à parte se faltar tradução
- [ ] **pt-BR ampliado** (EDD-1240) — amostra além de LDAP/e-mail

## Conteúdo demo (se existir no H2 / serdes)

- [ ] **Abono de Permanência** (EDD-1243) — dashboard/conteúdo, não só chrome
- [ ] **Detalhamentos por Situação** (EDD-1110) — aba, se o conteúdo demo estiver carregado

---

## Checklist estendida (PRs SP — amostrar se o tempo permitir)

Não bloqueia o fechamento da etapa, mas pega regressões que a lista curta não vê. Fonte: [PRs fechadas do oxymus](https://github.com/bradoctech/metabase/pulls?q=is%3Apr+state%3Aclosed+author%3Aoxymus).

| EDD / PR              | O que olhar                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| EDD-578 (#53)         | Home, sidebar, **NewItemButton** / New question no DS SP                 |
| EDD-580 (#52, #48)    | MetabotGreeting ausente / margem da Home; `getSubpathSafeUrl` em img src |
| EDD-793 (#62)         | Tokens de tema alinhados ao DS (não só charts)                           |
| EDD-999 (#69)         | Valores `null` nas tabelas/formatters                                    |
| EDD-1240 (#115, #120) | Amostra de strings novas em pt-BR (não só LDAP/e-mail)                   |
| EDD-1110 (#128)       | Aba Detalhamentos por Situação (se o conteúdo demo existir no H2)        |
| EDD-1243 (#114)       | Dashboard Abono de Permanência (conteúdo, não só chrome)                 |

---

## Como ver a seção Xray

A home escolhe **só uma** seção, nesta ordem: Popular → Recent → Xray (`HomeContent.tsx`).

Com Recent preenchido, Xray **não** aparece. Opções práticas:

1. **Conta / dados:** usar um usuário sem views recentes (ou limpar atividade), com X-rays ligados e DB sincronizado; **ou**
2. **Admin → Settings → General** — garantir **Enable X-ray** ligado; Recent ainda tem prioridade se `has_question_and_dashboard` e houver itens em `/api/activity/recents`.
3. **Dev rápido:** temporariamente esvaziar recentes (novo user installer sem histórico, ou filtrar recentes) até `isRecentSection` ser falso — aí cai em Xray se houver DB sync + xrays on.

Não há toggle admin “mostrar Xray em vez de Recent”; a prioridade é código.

---

## Onde costuma quebrar

| Item                         | Onde costuma quebrar                                                                                                                                                                     | Como confirmar                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Login SP                     | Restore de stuck files sobrescreve `AuthLayout*` / `Login.tsx` com upstream                                                                                                              | Layout de um painel + farol Metabase em vez de dois painéis “Dashboards SP”                                 |
| Home badges / cards          | `home/utils.ts` sem `getItemBadge`; Recent/Popular sem `badge=`; Xray ainda no `HomeCard` 64                                                                                             | Cards sem chip; Xray horizontal em vez de 215×315                                                           |
| Eixos 969                    | `CartesianChart.tsx` perde tooltip; `axis.ts` sem TitleCase/truncate; BoxPlot fora do path compartilh ado                                                                                | Hover no tick truncado sem tooltip; BoxPlot sem TitleCase                                                   |
| LDAP i18n                    | `SettingsLdapForm.tsx` volta a string crua                                                                                                                                               | Títulos em inglês                                                                                           |
| Paleta 1092 no Visualizer    | `DEFAULT_ACCENT_COLORS` Metabase; cards antigos mascaram com `series_settings.colors`                                                                                                    | Visualizer com azul `#509EE3`                                                                               |
| Filtro cascata QB            | 400/500 no endpoint ou crash no picker                                                                                                                                                   | Network + console                                                                                            |
| Datagrid via “ver registros” | Outro container sem CSS de hover/pin                                                                                                                                                     | Hover/pin só no QB direto                                                                                   |
| filled vs primary            | `Button.module.css`: `filled` cai no brand vermelho                                                                                                                                      | + Novo / Entrar vermelhos                                                                                   |

## Como validar localmente

- **Filtros cascata:** [filtros-cascata-datagrid.md](../filtros-cascata-datagrid.md) — Sample Database → People.
- **Datagrid pin/hover:** paths em `lists/behavior-manual.txt`.
- **Eixos 969 / Paleta 1092:** bar, line, area, combo, scatter, waterfall, row, boxplot — e o Visualizer.
- **Typo Adicionr:** Admin → Settings → **Email** → campo/título “Add Recipients as CC or BCC” (deve ler “Adicionar…”, não “Adicionr…”).
