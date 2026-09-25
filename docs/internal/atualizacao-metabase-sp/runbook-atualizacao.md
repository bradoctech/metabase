# Runbook — atualização do Metabase preservando customizações SP

**Issue do processo:** EDD-1356  
**Issue que executa o upgrade (PoC):** EDD-1355  
**Inventário:** [manifesto-customizacoes.md](./manifesto-customizacoes.md)

---

## Pré-requisitos

1. Remote `upstream` apontando para o Metabase oficial:
   ```bash
   git remote add upstream https://github.com/metabase/metabase.git   # uma vez
   ```
2. Histórico suficiente (clone shallow):
   ```bash
   git fetch upstream release-x.60.x
   git fetch --deepen=2000 upstream release-x.60.x   # se der "no merge base"
   git fetch upstream release-x.61.x
   git fetch upstream release-x.62.x
   git fetch upstream release-x.63.x                 # alvo final
   # se "no merge base" em alguma major: git fetch --deepen=2000 upstream release-x.N.x
   ```
3. Listas canônicas em `lists/` (`restore-ours`, `dual-changed`, `behavior-manual`).
4. Branch de trabalho limpa a partir de `saopaulo` (ou da branch que contém o inventário).

---

## Escolher o caminho: etapas vs salto direto

O **alvo final** da EDD-1355 é a linha **63.x**. Isso não obriga um único merge 60→63.

| Abordagem                                       | Quando usar                                                          | Risco de conflito                        |
| ----------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------- |
| **Etapas 60→61→62→63** (recomendado neste fork) | Muitos adapters/behavior SP; quer estabilizar e validar entre majors | Menor por etapa; mais ciclos             |
| **Salto direto 60→63**                          | Time aceita um “big bang” de conflitos em troca de velocidade        | Maior e mais difícil de atribuir à major |

**Recomendação SP/Trilhas:** preferir **etapas**. Já existe tentativa parcial em `origin/update_with_upstream_61` (desatualizada vs `saopaulo`) — o aprendizado da 61 ainda ajuda, mas a base de trabalho deve ser o tip atual do fork.

O script aceita qualquer `UPSTREAM_REF` / `BASE_REF`; só mude as variáveis a cada major.

---

## Fluxo recomendado — upgrade em etapas (61 → 62 → 63)

Em cada etapa: `snapshot` → `merge` → `restore` → `report` → intervenção manual → `verify` → smoke Trilhas (login, home, dashboards, charts, datagrid).

### Etapa 1 — 60 → 61

```bash
export SP_REF=origin/saopaulo          # tip SP a preservar na 1ª etapa
export BASE_REF=upstream/release-x.60.x
export UPSTREAM_REF=upstream/release-x.61.x
export WORK_BRANCH=EDD-1355            # ou EDD-1355-61
export BACKUP_TAG=saopaulo-pre-61x

./bin/merge-upstream-preserve-sp.sh snapshot
./bin/merge-upstream-preserve-sp.sh merge
./bin/merge-upstream-preserve-sp.sh restore
./bin/merge-upstream-preserve-sp.sh report
# resolver dual-changed + behavior-manual
./bin/merge-upstream-preserve-sp.sh verify
# commit do merge + smoke test
```

### Etapa 2 — 61 → 62

Na branch já estabilizada na 61 (mesmo `WORK_BRANCH` ou continuação):

```bash
export SP_REF=HEAD                     # tip atual já é o fork em 61
export BASE_REF=upstream/release-x.61.x
export UPSTREAM_REF=upstream/release-x.62.x
export BACKUP_TAG=saopaulo-pre-62x

./bin/merge-upstream-preserve-sp.sh snapshot
./bin/merge-upstream-preserve-sp.sh merge
./bin/merge-upstream-preserve-sp.sh restore
./bin/merge-upstream-preserve-sp.sh report
# manuais + verify + smoke
```

### Etapa 3 — 62 → 63 (alvo)

```bash
export SP_REF=HEAD
export BASE_REF=upstream/release-x.62.x
export UPSTREAM_REF=upstream/release-x.63.x   # ou tag v0.63.18
export BACKUP_TAG=saopaulo-pre-63x

./bin/merge-upstream-preserve-sp.sh snapshot
./bin/merge-upstream-preserve-sp.sh merge
./bin/merge-upstream-preserve-sp.sh restore
./bin/merge-upstream-preserve-sp.sh report
# manuais + verify + validação completa Trilhas
```

Notas:

- Em cada etapa, `BASE_REF` é a major **de onde você sai**; `UPSTREAM_REF` é a major **para onde vai**.
- As listas em `lists/` se reutilizam; ajuste se paths sumirem/renomearem no upstream.
- Após cada major, anote conflitos recorrentes no manifesto (alimenta EDD-1362 / 1356 v2).
- Opcional: pin por tag (`v0.61.21`, `v0.62.19`, `v0.63.18`) em vez da branch `release-x.N.x` se quiser reproducibilidade máxima.

---

## Fluxo alternativo — salto direto 60 → 63

Só se o time optar explicitamente por um único merge:

```bash
export SP_REF=origin/saopaulo
export BASE_REF=upstream/release-x.60.x
export UPSTREAM_REF=upstream/release-x.63.x   # ou tag v0.63.18
export WORK_BRANCH=EDD-1355
export BACKUP_TAG=saopaulo-pre-63x

./bin/merge-upstream-preserve-sp.sh snapshot
./bin/merge-upstream-preserve-sp.sh merge
./bin/merge-upstream-preserve-sp.sh restore
./bin/merge-upstream-preserve-sp.sh report
```

Ou de uma vez (para no report):

```bash
./bin/merge-upstream-preserve-sp.sh all
```

Espere conflitos maiores e um relatório manual mais longo.

---

## Arquivos gerados

Arquivos gerados (gitignored) em `.merge-sp/`:

| Arquivo               | Conteúdo                               |
| --------------------- | -------------------------------------- |
| `sp-files.txt`        | Paths divergentes do fork + listas     |
| `restore-ours.txt`    | Cópia de trabalho da lista SP-owned    |
| `dual-changed.txt`    | Adapters (merge 3-way)                 |
| `behavior-manual.txt` | Features SP (reaplicar)                |
| `manual-report.md`    | Relatório de conflitos / filas manuais |

Script: `bin/merge-upstream-preserve-sp.sh`

---

## O que cada etapa do script faz

| Etapa        | Automático? | Efeito                                                        |
| ------------ | ----------- | ------------------------------------------------------------- |
| **snapshot** | Sim         | Diff fork vs base + carrega listas canônicas                  |
| **merge**    | Semi        | Tag de backup + `git merge` do upstream (espera conflitos)    |
| **restore**  | Sim         | Restaura SP-owned e paths seguros; **não** toca dual/behavior |
| **report**   | Sim         | Lista o que falta resolver à mão                              |
| **verify**   | Sim         | Garante restore-ours intacto e zero unmerged                  |

---

## Intervenção manual (esperado)

1. Abrir `.merge-sp/manual-report.md`.
2. **dual-changed:** merge 3-way — lógica/estrutura upstream + tokens/estilo SP (`spColors`, Rawline via settings quando possível).
3. **behavior-manual:** reaplicar feature SP na API da nova versão (datagrid pin, title-case, badges, filtros cascata, etc.).
4. `git add` dos arquivos resolvidos e concluir o merge (`git commit` se o merge ainda estiver aberto).
5. `./bin/merge-upstream-preserve-sp.sh verify`
6. **Pós-verify (lição 63):** varrer stuck (WT == tip pré-merge ≠ upstream, fora das listas) e órfãos (sumiu no upstream, fora das listas). Não restaurar curated.
7. Validar Trilhas com [checklist-smoke-test.md](./checklist-smoke-test.md).
8. Atualizar o manifesto com conflitos reais (entrada da EDD-1362 e da 1356 v2).

---

## Buckets (lembrete)

| Bucket   | Lista                       | No merge           |
| -------- | --------------------------- | ------------------ |
| SP-owned | `lists/restore-ours.txt`    | Restore automático |
| Adapter  | `lists/dual-changed.txt`    | Manual 3-way       |
| Behavior | `lists/behavior-manual.txt` | Manual (reaplicar) |

---

## Checklist de aceite (EDD-1356 MVP)

- [ ] Script genérico versionado em `bin/merge-upstream-preserve-sp.sh`
- [ ] Listas `restore-ours` / `dual-changed` / `behavior-manual` versionadas
- [ ] Este runbook documenta execução e validação (incluindo upgrade em etapas)
- [ ] `snapshot` roda sem erro na branch atual
- [ ] Relatório (`report`) identifica o que exige intervenção manual
- [ ] PoC de uso real fica para a **EDD-1355** (não mergear 63.x nesta issue só para “testar o script” sem plano)

---

## Atualizar as listas

Quando o inventário mudar (pós-1362 ou pós-1355):

1. Editar os `.txt` em `lists/`.
2. Rodar `snapshot` de novo antes do próximo merge.
3. Registrar no manifesto a métrica antes/depois de `dual-changed`.
