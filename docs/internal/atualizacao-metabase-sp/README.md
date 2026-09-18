# Atualização do Metabase (fork SP)

Documentação interna do processo de atualizar o fork São Paulo / Trilhas do Metabase, preservando as customizações de código e reduzindo o custo das próximas releases.

**Público:** engenharia e produto que planejam ou executam upgrades do Metabase neste repositório.  
**Branch de referência atual:** `saopaulo` (base Metabase **0.60.x**).  
**Issues relacionadas:** EDD-1355, EDD-1356, EDD-1361, EDD-1362.

---

## Documentos

| Documento                                                  | Conteúdo                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| [INSTRUCOES-AGENTE.md](./INSTRUCOES-AGENTE.md)             | Bootstrap de contexto para o agente em conversas novas (não perder o fio) |
| [estratégia-sequencia.md](./estrategia-sequencia.md)       | Cenário atual, ordem correta de atuação e dependências entre as issues    |
| [issue-edd-1361.md](./issue-edd-1361.md)                   | EDD-1361 — inventário + isolamento mínimo (prep)                          |
| [issue-edd-1362.md](./issue-edd-1362.md)                   | EDD-1362 — refatoração de tema/marca pós-update                           |
| [issue-edd-1356.md](./issue-edd-1356.md)                   | EDD-1356 — processo semi-automático de merge                              |
| [manifesto-customizacoes.md](./manifesto-customizacoes.md) | Inventário classificado (SP-owned / Adapter / Behavior) + quick wins      |
| [runbook-atualizacao.md](./runbook-atualizacao.md)         | Como executar o merge (`bin/merge-upstream-preserve-sp.sh`)               |
| [lists/](./lists/)                                         | Listas canônicas restore-ours / dual-changed / behavior-manual            |

---

## Contexto rápido

- O Metabase deste projeto é um **fork** com customizações SP (tema, marca, datagrid, traduções, home, etc.).
- Atualizar a versão exige **identificar, transportar e adaptar** essas mudanças — não basta trocar o JAR/imagem.
- A estratégia oficial aqui é: **inventário → processo semi-automático → update como PoC → refatorar tema na base nova**.

Para o raciocínio completo e a sequência recomendada, comece por [estratégia-sequencia.md](./estrategia-sequencia.md).
