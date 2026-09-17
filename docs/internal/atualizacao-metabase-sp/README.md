# Atualização do Metabase (fork SP)

Documentação interna do processo de atualizar o fork São Paulo / Trilhas do Metabase, preservando as customizações de código e reduzindo o custo das próximas releases.

**Público:** engenharia e produto que planejam ou executam upgrades do Metabase neste repositório.  
**Branch de referência atual:** `saopaulo` (base Metabase **0.60.x**).  
**Issues relacionadas:** EDD-1355, EDD-1356 (+ issues novas propostas nesta pasta).

---

## Documentos

| Documento                                            | Conteúdo                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| [INSTRUCOES-AGENTE.md](./INSTRUCOES-AGENTE.md)       | Bootstrap de contexto para o agente em conversas novas (não perder o fio) |
| [estratégia-sequencia.md](./estrategia-sequencia.md) | Cenário atual, ordem correta de atuação e dependências entre as issues    |
| [rascunho-issue-prep.md](./rascunho-issue-prep.md)   | Rascunho da issue de inventário + isolamento mínimo (prep)                |
| [rascunho-issue-tema.md](./rascunho-issue-tema.md)   | Rascunho da issue de refatoração de tema/marca pós-update                 |

---

## Contexto rápido

- O Metabase deste projeto é um **fork** com customizações SP (tema, marca, datagrid, traduções, home, etc.).
- Atualizar a versão exige **identificar, transportar e adaptar** essas mudanças — não basta trocar o JAR/imagem.
- A estratégia oficial aqui é: **inventário → processo semi-automático → update como PoC → refatorar tema na base nova**.

Para o raciocínio completo e a sequência recomendada, comece por [estratégia-sequencia.md](./estrategia-sequencia.md).
