# Smoke da EDD-1660 — títulos nos cards da home

**Branch** `EDD-1660` · **Aceite visual** parcial em localhost, tema claro

Use uma instância com a branch em execução e abra a home padrão. O objetivo é conferir que títulos com várias palavras e identificadores sem espaços permanecem dentro do card, com o ícone e o identificador superior legíveis. O limite proposto de quatro linhas com reticências e a consulta do nome completo pelo tooltip fazem parte do aceite visual.

Prepare uma pergunta ou painel de teste para cada tipo de título. Para o identificador sem espaços, use um nome salvo em Recentes ou Populares e, se disponível, uma tabela de teste com nome equivalente no X-ray.

| Tipo | Título de teste |
| --- | --- |
| Curto | `Retroativos` |
| Médio | `Estatísticas de meses até primeira resolução` |
| Longo com espaços | `FILTRO CRIADO PARA TESTAR O CARD QUANDO O NOME É EXTENSO. TESTE CRIADO PARA VALIDAR SE O TEXTO QUEBRA SE O USUÁRIO CRIAR UM NOME EXTENSO IGUAL A ESSE` |
| Longo sem espaços | `nome_extremamente_comprido_para_validar_o_transbordamento_do_titulo_do_card_na_pagina_inicial` |

Os cards exibidos dependem da conta e da atividade da instância. Use um perfil que já mostre a seção desejada ou consulte [o roteiro de reprodução de Populares e X-ray](../atualizacao-metabase-sp/smoke-saopaulov64.md#reprodução-local-de-hd-03-e-navegação-de-hd-04). Se a seção ou o item de teste não aparecer, registre a limitação por cenário.

| ID | Cenário | Estado |
| --- | --- | --- |
| HC-01 | Populares com títulos curtos, médios e extensos | PENDENTE PARA HOMOLOGAÇÃO — cenário indisponível no teste local |
| HC-02 | Recentes com identificador sem espaços e tela estreita | OK — confirmado pelo usuário em localhost, tema claro |
| HC-03 | X-ray com nome extenso | OK em localhost, tema claro — identificador sem espaços contido em quatro linhas, com reticências. Navegação confirmada pelo usuário na configuração testada |
| HC-04 | Consulta do título completo no card | OK em localhost, tema claro — mouse e teclado em Recentes e tooltip confirmado no X-ray |
| HC-05 | Card de dicas quando disponível | PENDENTE PARA HOMOLOGAÇÃO — card indisponível no cenário local |

Populares e o card de dicas ficam para homologação. HC-05 depende de um perfil que exiba o card de dicas. O perfil SP da branch o oculta pela política de links externos.

No reteste local do X-ray, o usuário simulou o título `nome_extremamente_comprido_para_validar_o_transbordamento_do_titulo_do_card_na_pagina_inicial`. A captura mostra o título contido no card e os ícones, identificadores superiores e cards adjacentes legíveis. O usuário também confirmou a abertura da exploração e o funcionamento do tooltip. O registro de X-ray cobre a largura apresentada e o tooltip conferido na aplicação.

### Diagnóstico da conta local

A home padrão escolhe automaticamente entre Populares, Recentes e X-ray. Uma conta comum com primeiro login na última semana pode ver Populares mesmo com histórico, desde que tenha acesso a uma pergunta e a um dashboard e a API retorne itens populares. Para chegar ao X-ray, use uma conta de teste com acesso a um banco sincronizado e sem acesso efetivo a pelo menos um dos dois tipos de conteúdo salvo. Confira `has_question_and_dashboard: false` em `GET /api/user/current` e mantenha raios-X habilitados.

Em uma tentativa posterior com conta comum, a home exibiu o erro `Permission checks are running one query per entity` para a tabela 7. O erro é lançado pela checagem de cache de permissões do backend. Em DevTools → Network, recarregue a home e identifique a requisição que devolve essa mensagem. Comece por `/api/activity/popular_items`, `/api/activity/recents?context=views` e `/api/database`, carregadas antes de selecionar os cards. Registre a rota e o status da resposta. O primeiro aceite de Recentes permanece válido e o erro impede confirmar a seção nessa tentativa.

## HC-01 — Populares e cards adjacentes

1. Abra a seção **Veja alguns itens populares** e localize os itens com título curto, médio e longo. Sempre que possível, use uma janela larga o suficiente para exibir cards lado a lado.
2. Compare o card longo com os vizinhos. Confira o título, o ícone e o identificador de coleção ou banco, quando exibido.
3. Abra um dos cards e confirme que ele leva ao item correto.

**Esperado** — títulos que cabem são exibidos por inteiro. Quando o conteúdo passa de quatro linhas, aparecem reticências. O título fica dentro das bordas, o identificador superior continua legível e os cards adjacentes permanecem alinhados.

## HC-02 — Recentes, identificador sem espaços e responsividade

1. Abra o item salvo com o identificador longo sem espaços e volte à home com uma conta que mostre **Continue de onde parou**.
2. Confira o card em janela larga. Depois reduza a largura até os cards passarem para a linha seguinte e, por fim, até ficar um card por linha.
3. Em cada largura, confira a borda direita e a inferior, o ícone e o identificador superior. Observe se o título cria rolagem horizontal.

**Esperado** — a palavra quebra quando necessário, fica contida e recebe reticências se exceder o limite de quatro linhas. A seção reorganiza os cards conforme o espaço disponível.

## HC-03 — X-ray com nome de tabela longo

1. Abra a home de uma conta que mostre sugestões de raios-X com um banco sincronizado e raios-X habilitados.
2. Localize o card de uma tabela com nome longo, de preferência um identificador sem espaços. Compare com um card vizinho de nome curto e reduza a largura da janela.
3. Confira o nome da tabela no identificador superior, o ícone de raio e a frase da exploração. Abra o card e confirme que a exploração corresponde à tabela.

**Esperado** — o identificador ocupa uma linha e usa reticências se ficar estreito. O ícone e a frase ficam legíveis, dentro do card. Se só houver tabelas com nomes curtos, registre quais partes conseguiu validar.

## HC-04 — Título completo por hover e foco

1. Passe o mouse sobre um card truncado de Populares ou Recentes. Compare o tooltip com o nome salvo, incluindo o trecho após as reticências.
2. Retire o mouse e use `Tab` para focar o mesmo card. Confira se o nome completo reaparece e se `Enter` abre o item esperado.
3. Repita no X-ray disponível, conferindo se o tooltip inclui o nome completo da tabela. Em janela estreita, observe se o identificador longo quebra também no tooltip.

**Esperado** — o título ou nome de tabela completo fica legível por mouse e teclado. O foco e a navegação do link permanecem utilizáveis.

## HC-05 — Card de dicas

1. Se o card de dicas já aparecer no ambiente de teste, reduza a largura da home até os cards ficarem em uma coluna.
2. Confira o texto e o ícone. Se houver uma instância de teste com nome de aplicação extenso, repita nesse cenário.

**Esperado** — o texto quebra e permanece dentro do card, com o nome completo legível. Se o perfil SP ocultar o card, mantenha o cenário pendente para uma instância em que ele esteja disponível.

## Retorno do smoke

Envie `OK`, `FALHA`, `PARCIAL`, `PENDENTE` ou `NÃO APLICÁVEL` por ID. `OK` indica aprovação de todas as etapas aplicáveis daquele caso. Em resultados parciais, indique o que passou e o que ficou em aberto. Em falhas, informe a seção, o título, a largura aproximada e o que apareceu. Anexe uma captura se estiver disponível.

```text
Ambiente/tema: …
HC-01 — …
HC-02 — …
HC-03 — …
HC-04 — …
HC-05 — …
```

**Verificação técnica já realizada** — 28 testes direcionados aprovados, com cobertura do tooltip por teclado. ESLint, Stylelint e 36 combinações de card, largura e título em uma prévia isolada no Chromium aprovados. O aceite na aplicação se limita aos cenários confirmados na tabela acima.
