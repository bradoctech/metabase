# Listas canônicas — merge SP (EDD-1356)

Usadas por `bin/merge-upstream-preserve-sp.sh`. Editar estes arquivos (não só as cópias em `.merge-sp/`).

| Arquivo                                      | Bucket   | Uso no merge                             |
| -------------------------------------------- | -------- | ---------------------------------------- |
| [restore-ours.txt](./restore-ours.txt)       | SP-owned | Restore automático a partir de `SP_REF`  |
| [dual-changed.txt](./dual-changed.txt)       | Adapter  | Não restaurar; merge 3-way manual        |
| [behavior-manual.txt](./behavior-manual.txt) | Behavior | Não restaurar; reaplicar/adaptar feature |
| [sp-extra.txt](./sp-extra.txt)               | SP extra | Não restaurar; só protege do `scan` (aceita glob) — infra do fork, assets de marca, código SP ainda fora dos 3 buckets |

Tudo que não está nestas 4 listas é tratado como **upstream** pelo `scan` (v2). Customização SP nova → adicionar aqui no mesmo PR.

Origem: inventário [manifesto-customizacoes.md](../manifesto-customizacoes.md).  
Fluxo: [runbook-atualizacao.md](../runbook-atualizacao.md).
