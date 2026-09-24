# Checklist de Smoke Test — Metabase SP fork (referência canônica)

**Uso:** rodar após qualquer merge de major (`EDD-1355`) e antes de fechar a etapa. Marcar **OK/FAIL** por item; se algo regredir, anotar o sintoma aqui para localizar o path na próxima leva. Substitui checklists genéricas anteriores — esta cobre os comportamentos SP reais (EDD-…), não só telas.

**Validada em:** 63.x (primeira rodada completa, com achados). Ver [notas-etapa-62-63.md](./notas-etapa-62-63.md) para o diário desta etapa.

---

## Pré-check

- [ ] Backend sobe (`clojure -M:run:dev:dev-start:…`)
- [ ] FE hot compila sem erros de módulo

## UI / marca

- [ ] **Login SP** — painel esquerdo + DS (EDD-577) — `auth/components/Login*`, `AuthLayout*`
- [ ] **LogoIcon** = brasão no login e no AppBar (não diamante Metabase) — `common/components/LogoIcon/LogoIcon.tsx`
- [ ] **SpLogo oculto** nos headers de painel/dashboard (EDD-791) — logo-gov não aparece — `css/core/layout.module.css` (`.SpLogo`)
- [ ] **Home** — cards/badges SP; `XrayCard` sem crash — `HomeXrayCard.tsx` + styled

## Dashboard / charts / grid

- [ ] **Dashcards DS** — shadow/legenda/padding (EDD-792) — `DashCard.*`, `LegendCaption`, `padding.ts`, `series.ts`, `Progress`
- [ ] **Filtros cascata no QB** — criar filtro em uma question, abrir dropdown de valores de um 2º filtro, checar `POST /api/field/:id/filtered-values` com `constraints` — `querying/filters/utils/chain-filter-constraints.ts`
- [ ] **Eixos 969** — TitleCase + truncate nos cartesianos **e** tooltip de hover com o label completo — `echarts/cartesian/option/axis.ts` (+ `utils.ts`) **e** `CartesianChart.tsx` (`axisLabelTooltip`). RowChart isolado não é suficiente evidência — testar bar/line/combo também
- [ ] **Paleta 1092** nos charts — inclusive no **Visualizer** (ação "Visualizar de outra maneira") — `accent-colors.ts` (`SP_PALETTE_COLORS`), `ChartSettingColorPicker.tsx`
- [ ] **Datagrid** — pin (EDD-944) + hover de linha (EDD-564; cuidado: clique ≠ hover) — testar **via "ver registros" de uma question** (não só dashboard/QB direto) — `DataGrid.module.css`, `css/admin.module.css`

## i18n (amostra)

- [ ] **Admin LDAP** com títulos em pt-BR (usar `` t` ` ``, não string crua) — `admin/settings/components/SettingsLdapForm.tsx`
- [ ] **E-mail** sem typo "Adicionr" — `locales/pt-BR.po`

---

## Notas de investigação (achados recorrentes)

| Item | Onde costuma quebrar | Como confirmar |
| ---- | --------------------- | -------------- |
| Eixos 969 | `CartesianChart.tsx` perde o efeito de tooltip (`axisLabelTooltip` + `getOriginalAxisLabel`) quando upstream refatora o state do chart (`chartDom` → `chartInstance` na 63) | `git diff <último commit SP do EDD-969> -- CartesianChart.tsx`; se aparecer remoção do bloco `axisLabelTooltip`, reaplicar adaptando ao novo state |
| LDAP i18n | `SettingsLdapForm.tsx` volta a ter `title={"Server settings"}` (string crua) quando o upstream redesenha a página de LDAP (ex. PR #82389) e o restore de stuck files pega a versão upstream inteira | `git diff HEAD upstream/release-x.N.x -- SettingsLdapForm.tsx`; se vazio, o upstream nunca usou `t\`\`` aqui — reaplicar manualmente |
| Paleta 1092 no Visualizer | Ainda **não localizado** nesta rodada — a resolução de cor (`getColorsForValues` → `getMainAccentColors` → `color("accentN")`) é a mesma para QB/Dashboard/Visualizer; não há override hardcoded dentro de `metabase/visualizer/`. Suspeita: setting de `application-colors` (Admin → Aparência) não sendo lido no contexto do Visualizer, ou canvas do Visualizer renderizando antes do tema carregar | No DevTools, comparar `getComputedStyle(document.documentElement).getPropertyValue('--mb-color-accent0')` dentro do Visualizer vs. num card normal |
| Filtro cascata QB (erro ao criar filtro) | Código de `chain-filter-constraints.ts` / `FilterValuePicker.tsx` / endpoint `field.clj` bateu 100% com a versão SP nesta rodada — não é stuck/hybrid óbvio | Reproduzir e capturar o erro exato do console/network (ex. 400/500 no endpoint, ou erro JS no picker) antes de investigar mais |
| Datagrid via "ver registros" | Comportamento (pin/hover) testado até então só via QB/Dashboard direto; o caminho "ver registros" de uma question pode renderizar um `TableInteractive`/modal diferente sem o CSS de hover carregado | Reproduzir com print/console e checar se o container tem a classe/CSS module esperado (`DataGrid.module.css`) aplicado |

## Como validar localmente (detalhe por item)

- **Filtros cascata:** ver [filtros-cascata-datagrid.md](../filtros-cascata-datagrid.md) — passo a passo com Sample Database → People.
- **Datagrid pin/hover:** ver `lists/behavior-manual.txt` para os paths exatos.
- **Eixos 969 / Paleta 1092:** testar em pelo menos: bar, line, combo, row, boxplot — e no Visualizer.
