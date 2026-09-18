# Listas canônicas — merge SP (EDD-1356)

Usadas por `bin/merge-upstream-preserve-sp.sh`. Editar estes arquivos (não só as cópias em `.merge-sp/`).

| Arquivo                                      | Bucket   | Uso no merge                             |
| -------------------------------------------- | -------- | ---------------------------------------- |
| [restore-ours.txt](./restore-ours.txt)       | SP-owned | Restore automático a partir de `SP_REF`  |
| [dual-changed.txt](./dual-changed.txt)       | Adapter  | Não restaurar; merge 3-way manual        |
| [behavior-manual.txt](./behavior-manual.txt) | Behavior | Não restaurar; reaplicar/adaptar feature |

Origem: inventário [manifesto-customizacoes.md](../manifesto-customizacoes.md).  
Fluxo: [runbook-atualizacao.md](../runbook-atualizacao.md).
