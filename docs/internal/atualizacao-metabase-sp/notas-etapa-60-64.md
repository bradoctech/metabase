# Notas — salto `saopaulo` 0.60 → Metabase 0.64

**Branch:** `metabasev64`  
**Estratégia:** [estrategia-salto-60-64.md](./estrategia-salto-60-64.md)  
**Referência de processo (não base do merge):** `EDD-1359` (PoC 63 + tema 1362 + 1356-v2)  
**Backup tag:** `saopaulo-pre-64x`  
**Upstream:** `upstream/release-x.64.x`

---

## Status desta leva (após `scan --apply`)

| Passo | Resultado |
| ----- | --------- |
| Bootstrap (docs + script + lists da 1359) | commit na branch |
| `snapshot` + `merge` 60→64 + `restore` + resolução dos 43 unmerged | merge commit |
| `scan` | stale=9 · missing=0 · orphan=34 · hybrid=71 · protegidos=193 |
| `scan --apply` | stale/orphan aplicados; re-scan: stale=0 orphan=0 hybrid=71 |
| Híbridos | **feito** — 53 restaurados ao upstream; SP mantidos + porte EDD-969; **re-scan: hybrid=0** protected=215 |
| `verify` | **ok** |
| `build-check` | **ok** (BE 2199 ns · static-viz · tsc 0 · FE EE) — ver lições abaixo |
| smoke | **pendente** |

---

## Orphans apagados no `scan --apply` (34)

Paths que existiam no fork e **não** existem mais em `upstream/release-x.64.x`. O apply **removeu** do working tree para alinhar à 64.

### CI / docs (sem customização SP de produto)

| Path | Nota |
| ---- | ---- |
| `.github/workflows/resolve-backport-conflicts.yml` | workflow upstream removido na 64 |
| `docs/ai/file-based-development.md` | docs |
| `docs/ai/metabot-slack.png` | docs |
| `docs/data-modeling/images/metric-*.png` (4 imagens) | docs |
| `docs/data-studio/segments.md` | docs |

### Security center / metrics-viewer / EntityMenu (feature upstream removida ou movida)

| Path | Nota |
| ---- | ---- |
| `e2e/test/scenarios/admin/security-center-snowplow.cy.spec.ts` | e2e |
| `enterprise/backend/.../security_center/schema.clj` | EE |
| `enterprise/frontend/.../security_center/.../AdvisoryCard.module.css` | EE |
| `frontend/src/metabase/api/security-center.ts` | API |
| `frontend/src/metabase/common/components/EntityMenu/EntityMenu.tsx` | componente removido na 64 |
| `frontend/src/metabase/metrics-viewer/.../ChartLayoutPicker/*` (3) | UI removida |
| `frontend/src/metabase/metrics-viewer/utils/geo-dimensions.unit.spec.ts` | spec |

### Metabot / MCP (prompts e util removidos ou reorganizados na 64)

| Path | Nota |
| ---- | ---- |
| `enterprise/frontend/.../MetabaseAIProviderSetup.unit.spec.ts` | spec |
| `frontend/src/metabase/metabot/.../MetabotChatMessage.unit.spec.tsx` | spec |
| `resources/metabot/prompts/shared/*.selmer` (7) | prompts shared |
| `resources/metabot/prompts/tools/edit_chart.md` | tool prompt |
| `resources/metabot/prompts/tools/write_transform_*.md` (2) | tool prompts |
| `src/metabase/metabot/provider_util.clj` | BE util |
| `test/metabase/mcp/tools_test.clj` | test |
| `test/metabase/metabot/provider_util_test.clj` | test |

### Serialization baseline

| Path | Nota |
| ---- | ---- |
| `test_resources/serialization_baseline/.../total___fieldusersettings.yaml` | baseline |

**Avaliação SP:** nenhum destes orphans era entrada canônica de customização visual/comportamento SP nas listas (login, home badges, eixos 969, paleta, datagrid). Risco SP baixo; alinhar à 64 é o correto.

---

## Customizações SP sob risco / já deslocadas (não são “orphan do scan”, mas perda ou migração)

Estas mudanças **não** aparecem como orphan no `scan --apply` (ou já tinham sido apagadas no merge), mas importam para o smoke e para atualizar `lists/`.

### EDD-969 — TitleCase + truncate + tooltip de eixos

**Na 60/63 (listas `behavior-manual`):**

- `frontend/src/metabase/visualizations/echarts/cartesian/option/axis.ts`
- `frontend/src/metabase/visualizations/echarts/cartesian/option/utils.ts` (`AXIS_LABEL_MAX_CHARS`, `getOriginalAxisLabel`, …)
- `frontend/src/metabase/visualizations/visualizations/CartesianChart/CartesianChart.tsx` (tooltip hover)

**Na 64:** o pacote antigo `visualizations/echarts/cartesian/option/` foi **removido** no merge (delete upstream). A lógica vive agora sob:

- `frontend/src/metabase/viz-core/echarts/cartesian/option/` (`axis.ts`, `utils.ts`, …)
- `CartesianChart.tsx` na árvore nova

No **hybrid** atual aparecem, entre outros:

- `frontend/src/metabase/viz-core/echarts/cartesian/option/utils.ts`
- paths de RowChart em `viz-core/shared/components/RowChart/…`

**Ação:** reaplicar o comportamento 969 na API `viz-core` (não restaurar os paths mortos). Atualizar `behavior-manual.txt` para os paths 64. Smoke: bar/line/combo + tooltip de label truncado.

### RowChart / RowChartView (adjacente ao 969)

**Na 63 (`behavior-manual`):**

- `.../shared/components/RowChartView/RowChartView.tsx` — truncate/tooltip no eixo do row chart
- `.../shared/components/RowChart/RowChart.unit.spec.tsx`

**Na 64:**

- `RowChartView/` foi **apagado no merge** (delete upstream; não entrou na lista de 34 orphans do scan porque já não existia no tip pós-merge).
- RowChart passou a `frontend/src/metabase/viz-core/shared/components/RowChart/` (híbridos: `RowChart.unit.spec.tsx`, `theme.ts`, `utils/layout.ts`).
- Também há `static-viz/.../RowChart.tsx` e `visualizations/visualizations/RowChart/utils/theme.ts` como hybrid.

**Ação:** portar truncate/tooltip/TitleCase do RowChartView antigo para o RowChart/`viz-core` da 64; atualizar listas; smoke row chart.

### `padding.ts` (CartesianChart)

Esteve **stale** (blob = pré-merge) e foi **restaurado do upstream** no `--apply`. Se havia ajuste SP de padding (EDD-792 / dashcards), revalidar no smoke e, se necessário, reaplicar sobre a versão 64 (está em listas / dual-changed histórico).

### Outros stale restaurados (9) — não SP tipicamente

`FormLabel.styled.tsx`, `AppearanceSettingsPage.tsx`, `browse/metrics/analytics.ts`, `ClickMappings/utils.ts`, `GitSyncSectionLayout.tsx`, `SdkIframeError.tsx`, `static-viz/.../Text.tsx`, `theme-from-color-scheme.ts`, `CartesianChart/padding.ts`.

Restaurados à 64 de propósito (conteúdo stuck no tip pré-merge).

### Tema SP (EDD-1362) — status neste salto

Levamos `sp-theme.ts` / `sp-color-keys.ts` / accent da 1359 e injeção em `light.ts`/`dark.ts`/`color-keys.ts` na resolução manual. **Não** está na lista de orphans. Validar no smoke (login, home, charts/Visualizer).

### `pt-BR.po`

No merge, ficou a versão **64**. Strings SP específicas podem ter se perdido; amostrar LDAP/e-mail no smoke e, se preciso, repor msgstr da 1359/`saopaulo`.

---

## Listas desatualizadas (débito)

`lists/behavior-manual.txt` (e possivelmente dual-changed) ainda citam paths **60/63** que a 64 removeu, por exemplo:

- `visualizations/echarts/cartesian/option/axis.ts`
- `visualizations/echarts/cartesian/option/utils.ts`
- `visualizations/shared/components/RowChartView/RowChartView.tsx`
- `visualizations/shared/components/RowChart/RowChart.unit.spec.tsx` (path antigo)

Atualizar para os equivalentes em `viz-core/` **depois** de portar o comportamento, no mesmo PR/commit de fix.

---

## Híbridos — resolução

Classificação por sinais SP no diff vs `upstream/release-x.64.x` (Rawline, AXIS_LABEL/*, São Paulo, etc.):

| Ação | Qtde | Exemplos |
| ---- | ---- | -------- |
| Restaurar do upstream | ~53 | mage/bot, AppBanner stuck, e2e, Progress, SmartScalar compute, … |
| Manter SP (Rawline / logo / TreeNode) | ~15 | static-viz/*, `AutomaticDashboardApp.tsx`, `TreeNode.styled.tsx`, `png_test.clj`, … |
| Porte EDD-969 | 3 paths + util já híbrido | ver abaixo |

### Porte EDD-969 (feito nesta leva)

| Path 64 | O que foi feito |
| ------- | --------------- |
| `viz-core/.../option/utils.ts` | Já tinha helpers SP (híbrido); mantido + lista |
| `viz-core/.../option/axis.ts` | Formatters passam a `toTitleCase` + `truncateAxisLabel` + `registerAxisLabel` |
| `viz-core/.../RowChartView/RowChartView.tsx` | TitleCase/truncate + tooltip hover (ex-RowChartView 63) |
| `visualizations/.../CartesianChart/CartesianChart.tsx` | Tooltip de eixo via `getOriginalAxisLabel` |

Listas `behavior-manual` / `dual-changed` atualizadas (paths mortos 60/63 removidos; `viz-core` + Rawline adicionados). `sp-theme*` permanece em `restore-ours`.

---

## Lições do `build-check` (60→64)

1. **Adapters SP na API 63** quebram o bundle: `metabase/lib/urls` → `metabase/urls`; `selectors/user` → `current-user`; `useSetting` em `metabase/settings`; `NULL_DISPLAY_VALUE` → `getNullDisplayValue()`; `EmbeddingHubHomePage` → `SetupGuideHomePage`; LoginForm sem `buttons.module.css` / `size` no checkbox.
2. **Paleta SP** em ChartSetting*: manter `SP_PALETTE_COLORS`, mas portar `forwardColorName` / tipos da 64 (`ChartSettingSeriesOrder` via `viz-core`).
3. **`tsc` precisa de CLJS fresco:** após merge, `bun run build-pure:cljs` (ou o `static-viz` do script) antes do `tsc` — senão `metabase-lib` aponta para stubs velhos (`with_page`, `projectDimension`, …).
4. **prosemirror duplicado no Bun** (`1.25.4` + `1.25.11`, view `1.40.1` + `1.42.3`) gera dezenas de erros TS; dedupe local (symlink das cópias aninhadas para a versão do `resolutions`) zera o `tsc`. Reaparece após `bun install` limpo — não commitamos `node_modules`.
5. **FE OOM no WSL (~8 GiB):** `NODE_OPTIONS=--max-old-space-size=6144` (4096 mata o rspack).

---

## Próximos comandos

```bash
# smoke: checklist-smoke-test.md (eixos 969 + row + home + login + logo)
# commit dos adapters FE quando fizer sentido
```

---

## Como orientar a IA nesta etapa

> Leia `INSTRUCOES-AGENTE.md`, `estrategia-salto-60-64.md` e `notas-etapa-60-64.md`. Branch `metabasev64`. Merge/híbridos/`verify`/`build-check` ok. Próximo: smoke canónico; não reabrir paths mortos de `visualizations/echarts/cartesian/option/`.
