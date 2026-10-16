# EDD-1356 — Automatizar customizações para futuras atualizações do Metabase

Issue de processo. Branch de trabalho: `EDD-1356`.  
PoC de execução do upgrade: **EDD-1355**.

Relacionados: [runbook-atualizacao.md](./runbook-atualizacao.md) · [manifesto-customizacoes.md](./manifesto-customizacoes.md) · EDD-1361 · EDD-1362 · EDD-1355

---

## Título

Automatizar customizações para futuras atualizações do Metabase

## Entrega do MVP (esta branch)

| Artefato               | Path                                                           |
| ---------------------- | -------------------------------------------------------------- |
| Script semi-automático | `bin/merge-upstream-preserve-sp.sh`                            |
| Listas canônicas       | `docs/internal/atualizacao-metabase-sp/lists/`                 |
| Runbook                | `docs/internal/atualizacao-metabase-sp/runbook-atualizacao.md` |

### Comandos do script

`snapshot` → `merge` → `restore` → `report` → `verify`

### O que a automação faz vs. o que reporta como manual

- **Automático:** restaurar SP-owned e assets/docs internos seguros a partir de `SP_REF`.
- **Manual (reportado):** `dual-changed` (adapters) e `behavior-manual` (features).

### Fora do MVP

- Executar o merge completo para 63.x (isso é a EDD-1355).
- Refatoração de tema/marca (EDD-1362).

---

## Critérios de aceite (MVP)

- Processo definido para identificar customizações (manifesto EDD-1361 + snapshot).
- Solução reaplica automaticamente SP-owned e auxilia (report) na reaplicação do restante.
- Incompatibilidades manuais identificadas e reportadas (`report` → `.merge-sp/manual-report.md`).
- Processo reproduzível documentado no runbook.
- Validação com atualização real de versão = **EDD-1355** (PoC).
