# Manual — como orientar a IA nos upgrades do Metabase SP

**Para quem:** quem abre uma conversa nova (Cursor/Claude/etc.) sobre atualização do fork SP.  
**Objetivo:** dar contexto certo sem colar o histórico inteiro e sem a IA reinventar a estratégia.

A pasta canónica é `docs/internal/atualizacao-metabase-sp/`.

---

## 1. Arquivo de entrada (sempre)

Peça para a IA ler **primeiro**:

`docs/internal/atualizacao-metabase-sp/INSTRUCOES-AGENTE.md`

Esse arquivo é o bootstrap: objetivo, issues, lições 60→63, regras do script, o que não sugerir de novo e o estado atual (1362 / 1356-v2).

Não peça para “ler a pasta toda” de uma vez — carrega detalhe sob demanda (secção 3).

---

## 2. Prompt curto (copiar e colar)

> Leia `docs/internal/atualizacao-metabase-sp/INSTRUCOES-AGENTE.md` e continue a partir do contexto das issues EDD-1361 / EDD-1355 / EDD-1356 / EDD-1362. Não reinvente a estratégia já decidida. Para o fluxo: `runbook-atualizacao.md` + `bin/merge-upstream-preserve-sp.sh`; listas em `lists/`; inventário em `manifesto-customizacoes.md`; smoke em `checklist-smoke-test.md`.

Variações úteis (acrescentar uma linha ao prompt):

| Situação | Acrescentar |
| -------- | ----------- |
| Nova major / etapa de merge | “Siga o runbook: snapshot → merge → restore → report → dual/behavior → scan → verify → build-check → smoke.” |
| Só tema / tokens | “Base já em 63; EDD-1362 concluída; renomeação semântica `--mb-color-sp-*` está adiada.” |
| Só script / listas | “Contrato em `edd-1356-v2.md`; SP = 3 listas + `sp-extra.txt`.” |
| Smoke / regressão visual | “Use `checklist-smoke-test.md`; H2 local ≠ prod.” |

---

## 3. Detalhe sob demanda

| Precisa de… | Arquivo |
| ----------- | ------- |
| Índice humano da pasta | [README.md](./README.md) |
| Bootstrap do agente (entrada) | [INSTRUCOES-AGENTE.md](./INSTRUCOES-AGENTE.md) |
| Salto 60→64 (`metabasev64`) | [estrategia-salto-60-64.md](./estrategia-salto-60-64.md) |
| Fluxo passo a passo do merge | [runbook-atualizacao.md](./runbook-atualizacao.md) |
| Script v2 (`scan` / `build-check` / `sp-extra`) | [edd-1356-v2.md](./edd-1356-v2.md) |
| Tema / marca (resumo + métricas) | [edd-1362.md](./edd-1362.md) · [edd-1362-metricas.pdf](./edd-1362-metricas.pdf) |
| Inventário path → EDD → bucket | [manifesto-customizacoes.md](./manifesto-customizacoes.md) |
| Smoke canónico | [checklist-smoke-test.md](./checklist-smoke-test.md) |
| Lições da PoC 62→63 | [notas-etapa-62-63.md](./notas-etapa-62-63.md) |
| Etapas anteriores | [notas-etapa-60-61.md](./notas-etapa-60-61.md) · [notas-etapa-61-62.md](./notas-etapa-61-62.md) |
| Sequência das issues | [estratégia-sequencia.md](./estratégia-sequencia.md) |
| Listas SP protegido | [lists/](./lists/) (`restore-ours`, `dual-changed`, `behavior-manual`, `sp-extra`) |
| Script em si | `bin/merge-upstream-preserve-sp.sh` |

---

## 4. Regras rápidas para a IA (e para quem pede)

1. **Não reinventar** a ordem inventário → processo → PoC de update → refatorar tema na base nova.
2. **SP protegido** = `restore-ours` + `dual-changed` + `behavior-manual` + `sp-extra`. Customização nova → lista no mesmo PR.
3. Etapa de major **só fecha** com `verify` + `build-check` ok (dev “passar” não basta). `build-check` com BE/FE dev parados.
4. Commits: propor mensagem; **só commitar se o usuário pedir**. Push costuma ser do usuário.
5. H2 local ≠ produção. Smoke canónico cobre comportamento SP real, não só “a tela abre”.
6. O que já está decidido e não precisa reabrir sem pedido: renomeação semântica agressiva de `--mb-color-sp-*`; `.github/` alinhado ao upstream; `.gitignore` em `dual-changed` (linha `.merge-sp/`).

---

## 5. Estado recente (referência)

Atualizar esta secção quando fechar uma etapa grande.

| Item | Estado |
| ---- | ------ |
| Fork `saopaulo` | 0.60.x (base do salto) |
| PoC processo | `EDD-1359` em 0.63.x — **referência**, não base do publish 64 |
| Salto 60→64 | Branch `metabasev64` — [estrategia-salto-60-64.md](./estrategia-salto-60-64.md) |
| EDD-1362 / 1356-v2 | Concluídas na PoC 63; reaplicar/adaptar o necessário na 64 |
| Gate operacional | `build-check` completo (com frontend) + smoke antes do PR |

---

## 6. Manter este manual

Atualizar quando:

- `INSTRUCOES-AGENTE.md` mudar de contrato (novas issues, novas regras de restore/scan)
- Fechar major ou revisita (ajustar a secção 5)
- Surgir um documento novo que a IA precise conhecer sob demanda (secção 3)
