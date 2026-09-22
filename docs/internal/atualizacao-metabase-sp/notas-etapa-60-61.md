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

## Pós-merge (smoke)

- [x] Commit do merge 61 (`--no-verify` por OOM nos hooks)
- [x] Fixups: restore largo desfeito (upstream nos não-curated), migrations, CLJS, home XrayCard SP
- [x] Script: restore só curated + assets/docs (não todo drift BASE…SP)
- [ ] Smoke Trilhas restante: dashboard, filtros cascata, chart, datagrid
- [ ] Commit dos adapters home ainda unstaged (se houver)
- [ ] Revisar dual/behavior DIFFERS restantes
- [ ] **Não** tratar logo SP oculto no header como regressão (commits recentes escondem de propósito)

## Próxima etapa

Só após smoke mínimo OK.  
62: `BASE_REF=upstream/release-x.61.x`, `UPSTREAM_REF=upstream/release-x.62.x`, `SP_REF=HEAD`  

Detalhe operacional para agentes: [INSTRUCOES-AGENTE.md](./INSTRUCOES-AGENTE.md) (lições 60→61).
