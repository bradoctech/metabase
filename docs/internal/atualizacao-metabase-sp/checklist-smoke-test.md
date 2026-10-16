# Checklist de smoke test — Metabase SP fork

**Uso:** rodar após qualquer merge de major (`EDD-1355`) e antes de fechar a etapa. Marcar **OK/FAIL** por item. Se algo regredir, anote o sintoma (console, Network, print) para localizar o path na próxima leva.

Esta checklist cobre os comportamentos SP reais (EDD-…), não só “a tela abre”. Substitui checklists genéricas de login/home/admin.

**Validada em:** 63.x (primeira rodada completa). Diário: [notas-etapa-62-63.md](./notas-etapa-62-63.md).

---

## Pré-check

- [ ] Backend sobe (`clojure -M:run:dev:dev-start:…`)
- [ ] FE hot compila sem erros de módulo

## UI / marca

- [ ] **Login SP** — painel esquerdo + DS (EDD-577) — `auth/components/Login*`, `AuthLayout*`
- [ ] **LogoIcon** = brasão no login e no AppBar (não diamante Metabase) — `common/components/LogoIcon/LogoIcon.tsx`
- [ ] **SpLogo oculto** nos headers de painel/dashboard (EDD-791) — logo-gov não aparece — `css/core/layout.module.css` (`.SpLogo`)
- [ ] **Home** — cards/badges SP; `XrayCard` sem crash — `HomeXrayCard.tsx` + styled; badges em `home/utils.ts` (`getItemBadge`)

## Dashboard / charts / grid

- [ ] **Dashcards DS** — shadow/legenda/padding (EDD-792) — `DashCard.*`, `LegendCaption`, `padding.ts`, `series.ts`, `Progress`
- [ ] **Filtros cascata no QB** — criar filtro em uma question, abrir dropdown de valores de um 2º filtro, checar `POST /api/field/:id/filtered-values` com `constraints` — `querying/filters/utils/chain-filter-constraints.ts`
- [ ] **Eixos 969** — TitleCase + truncate nos cartesianos **e** tooltip de hover com o label completo — `echarts/cartesian/option/axis.ts` (+ `utils.ts`) **e** `CartesianChart.tsx` (`axisLabelTooltip`). RowChart isolado não basta — testar bar/line/combo também
- [ ] **Paleta 1092** nos charts — inclusive no **Visualizer** (ação “Visualizar de outra maneira”) — `accent-colors.ts` (`DEFAULT_ACCENT_COLORS` + `SP_PALETTE_COLORS`), `ChartSettingColorPicker.tsx`
- [ ] **Datagrid** — pin (EDD-944) + hover de linha (EDD-564; cuidado: clique ≠ hover) — testar **via “ver registros” de uma question** (não só dashboard/QB direto) — `DataGrid.module.css`, `css/admin.module.css`

## i18n (amostra)

- [ ] **Admin LDAP** com títulos em pt-BR (usar `` t` ` ``, não string crua) — `admin/settings/components/SettingsLdapForm.tsx`
- [ ] **E-mail** sem typo “Adicionr” — `locales/pt-BR.po`

---

## Checklist estendida (PRs SP — amostrar se o tempo permitir)

Não bloqueia o fechamento da etapa, mas pega regressões que a lista curta não vê. Fonte: [PRs fechadas do oxymus](https://github.com/bradoctech/metabase/pulls?q=is%3Apr+state%3Aclosed+author%3Aoxymus).

| EDD / PR              | O que olhar                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| EDD-578 (#53)         | Home, sidebar, **NewItemButton** no DS SP                                |
| EDD-580 (#52, #48)    | MetabotGreeting ausente / margem da Home; `getSubpathSafeUrl` em img src |
| EDD-793 (#62)         | Tokens de tema alinhados ao DS (não só charts)                           |
| EDD-999 (#69)         | Valores `null` nas tabelas/formatters                                    |
| EDD-1240 (#115, #120) | Amostra de strings novas em pt-BR (não só LDAP/e-mail)                   |
| EDD-1110 (#128)       | Aba Detalhamentos por Situação (se o conteúdo demo existir no H2)        |
| EDD-1243 (#114)       | Dashboard Abono de Permanência (conteúdo, não só chrome)                 |

---

## Onde costuma quebrar

| Item                         | Onde costuma quebrar                                                                                                                                                                     | Como confirmar                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Login SP                     | Restore de stuck files sobrescreve `AuthLayout*` / `Login.tsx` com upstream                                                                                                              | Layout de um painel + farol Metabase em vez de dois painéis “Dashboards SP”                                 |
| Home badges                  | `home/utils.ts` restaurado do upstream perde `getItemBadge`; `HomePopularSection` / `HomeRecentSection` param de passar `badge=`                                                         | Cards Popular/Recent sem chip de collection/database                                                        |
| Eixos 969                    | `CartesianChart.tsx` perde o efeito de tooltip (`axisLabelTooltip` + `getOriginalAxisLabel`) quando o upstream refatora o state do chart (`chartDom` → `chartInstance` na 63)            | `git diff` vs último commit SP do EDD-969; se o bloco sumiu, reaplicar adaptando ao novo state              |
| LDAP i18n                    | `SettingsLdapForm.tsx` volta a `title={"Server settings"}` (string crua) quando o upstream redesenha LDAP e o restore pega a versão inteira                                              | Reaplicar `` t` ` `` nos 4 títulos; as msgstr já existem no `.po`                                           |
| Paleta 1092 no Visualizer    | `DEFAULT_ACCENT_COLORS` continua a paleta Metabase (`#509EE3`…). Cards antigos têm `series_settings.colors` gravado (parecem SP); o Visualizer abre com settings vazios e cai no default | Comparar `accent0` no DevTools dentro do Visualizer vs. um card normal; `DEFAULT_ACCENT_COLORS` deve ser SP |
| Filtro cascata QB            | Código de `chain-filter-constraints.ts` / `FilterValuePicker.tsx` pode estar OK e o erro ser 400/500 no endpoint ou crash JS no picker                                                   | Reproduzir e capturar o erro exato (console + Network) antes de investigar                                  |
| Datagrid via “ver registros” | Pin/hover testados no QB/Dashboard direto; “ver registros” pode renderizar outro container sem o CSS de hover                                                                            | Confirmar se o container aplica `DataGrid.module.css`                                                       |

## Como validar localmente

- **Filtros cascata:** [filtros-cascata-datagrid.md](../filtros-cascata-datagrid.md) — Sample Database → People.
- **Datagrid pin/hover:** paths em `lists/behavior-manual.txt`.
- **Eixos 969 / Paleta 1092:** testar bar, line, combo, row, boxplot — e o Visualizer.
