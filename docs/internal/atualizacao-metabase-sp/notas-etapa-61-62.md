# EDD-1355 — Notas da etapa 61 → 62

**Branch:** `EDD-1355`  
**Backup tag:** `saopaulo-pre-62x`  
**Upstream:** `upstream/release-x.62.x`

## O que foi feito

1. `snapshot` / `merge` / `restore` / `report` / `verify` via `bin/merge-upstream-preserve-sp.sh`
2. `SP_REF=HEAD`, `BASE_REF=upstream/release-x.61.x`, `UPSTREAM_REF=upstream/release-x.62.x`
3. Restore estreito (~113 paths); ~30 conflitos manuais resolvidos
4. Fixups pós-merge: stuck upstream (src/test/enterprise/modules/FE), órfãos pré-62, `package.json`/`bun.lock`/patches alinhados ao 62, cljs rebuild
5. Smoke Trilhas **OK**

## Resolução dos conflitos manuais

| Path / grupo | Decisão |
| ---- | ------- |
| Dockerfile, bun.lock, CI/clj-kondo, Metabot AI, formatting/*, click-behavior, llm_shape | Upstream (`theirs`) |
| `utils/formatting/url.tsx` | Removido (DD — ambos apagaram) |
| HomeModelCard*, RowChartView, pt-BR.po | SP (`ours`) |
| AdminContentTable | SP ActiveRow no path novo `admin/components/...` (renome 62) |
| DashboardHeaderView | SpLogo + `DashboardTitle` (API 62) |
| light.ts / dark.ts | Cores SP + chaves novas 62 (`background-success-secondary`) |
| ChartSettingColorPicker | `SP_PALETTE_COLORS` |
| yaml_checks com marcadores órfãos + `formatting/url.ts` | Upstream 62 |

## Lista atualizada

- `behavior-manual.txt`: path AdminContentTable → `admin/components/...`

## Lições desta etapa (resumo)

- Stuck pré-N também em **enterprise/** e **modules/** (ex. `semantic-search/settings.clj`).
- `package.json` stuck na major anterior + patches 62 → `patch-package` / SWC quebrados; restaurar trio `package.json` + `bun.lock` + `patches/`.
- Restore stuck FE não pode sobrescrever pares SP (ex. `HomeXrayCard.tsx`); órfãos (`entities/*`, `utils/formatting/ui.tsx`) precisam sair.
- CLJS stale em `target/cljs_dev` (ex. `analytics.impl.js`, `DEFAULT_CARD_SIZE_JSON`) → `build-pure:cljs`.
- `--no-verify` ok em leva de restore stuck/infra; não em ajustes com risco de lint.

## Pós-merge

- [x] Commit do merge 62
- [x] Fixups boot/FE (`fix[EDD-1355] - Destravar boot/FE pós-62…`)
- [x] `bun install` + cljs quando necessário
- [x] Smoke Trilhas 62 (login/DS, home, cascata, datagrid pin+hover, dashcards, eixos 969, paleta 1092, i18n amostra, LogoIcon brasão, SpLogo hide)

## Próxima etapa

**62→63.**  
`BASE_REF=upstream/release-x.62.x`, `UPSTREAM_REF=upstream/release-x.63.x`, `SP_REF=HEAD`, tag `saopaulo-pre-63x`
