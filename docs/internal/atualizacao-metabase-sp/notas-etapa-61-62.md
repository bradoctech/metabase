# EDD-1355 — Notas da etapa 61 → 62

**Branch:** `EDD-1355`  
**Backup tag:** `saopaulo-pre-62x`  
**Upstream:** `upstream/release-x.62.x`

## O que foi feito

1. `snapshot` / `merge` / `restore` / `report` / `verify` via `bin/merge-upstream-preserve-sp.sh`
2. `SP_REF=HEAD`, `BASE_REF=upstream/release-x.61.x`, `UPSTREAM_REF=upstream/release-x.62.x`
3. Restore estreito (~113 paths); ~30 conflitos manuais resolvidos

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

## Pós-merge

- [ ] Commit do merge 62
- [ ] `bun install` se necessário; `bun run build:cljs` se CLJS novo
- [ ] Smoke Trilhas (ver INSTRUCOES — checklist do que o merge 61 comeu)
- [ ] Possível reset H2 local se migrations 062 exigirem

## Próxima etapa

Só após smoke 62 OK → **62→63**.  
`BASE_REF=upstream/release-x.62.x`, `UPSTREAM_REF=upstream/release-x.63.x`, `SP_REF=HEAD`, tag `saopaulo-pre-63x`
