# EDD-1355 — Notas da etapa 60 → 61

**Branch:** `EDD-1355`  
**Backup tag:** `saopaulo-pre-61x`  
**Upstream:** `upstream/release-x.61.x`

## O que foi feito

1. `snapshot` / `merge` / `restore` / `report` via `bin/merge-upstream-preserve-sp.sh`
2. `SP_REF=HEAD` (não `origin/saopaulo`) para preservar merges EDD-1361/1356 já na branch
3. Restore automático de ~763 paths SP-owned/seguros
4. Resolução manual dos arquivos que ainda tinham `<<<<<<<` após o restore

## Resolução dos marcadores

| Path | Decisão |
| ---- | ------- |
| `bun.lock`, `deps.edn`, transforms (`transform.clj`, `transform_run.clj`) | Upstream (`theirs`) |
| `Dockerfile`, `locales/pt-BR.po`, `light.ts`, HomeModel/Xray `.styled.tsx`, `RowChartView.tsx` | SP (`ours` / `saopaulo-pre-61x`) |
| `Text.tsx` | Upstream (path `lib`→`redux`/`utils`) |
| `dark.ts` | SP brand + chave nova `background-success-secondary` |
| `home/utils.ts` | Badge SP + import `metabase/utils/time-dayjs` |
| `AdminContentTable.tsx` | Highlight SP + `className` do upstream |
| `light.ts` | SP + chave `background-warning-secondary` |
| `RowChartView.tsx` | SP title-case + import `metabase/utils/measure-text` |

## Bug corrigido no script

`restore` não deve mais fazer `git add -A` (isso marcava conflitos manuais como “resolvidos” com marcadores ainda no arquivo).

## Pendências antes de ir para 62

- [ ] Concluir o merge com commit (se ainda aberto)
- [ ] Smoke local (Clojure + `build-hot:js`): login, home badges, datagrid, charts, um dashboard
- [ ] Revisar paths **DIFFERS** sem marcadores (auto-merge do git) em dual/behavior — especialmente datagrid, filtros, appearance
- [ ] Regenerar `bun.lock` com `bun install` se o frontend reclamar do lock vs `package.json`
- [ ] Atualizar listas se paths sumiram/renomearam na 61

## Próxima etapa

62: `BASE_REF=upstream/release-x.61.x`, `UPSTREAM_REF=upstream/release-x.62.x`, `SP_REF=HEAD`
