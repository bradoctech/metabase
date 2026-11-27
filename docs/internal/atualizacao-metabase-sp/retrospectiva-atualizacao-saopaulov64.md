# Atualização do Dashboards SP para o Metabase 64

**Retrospectiva técnica e material de apoio à apresentação · 25/11/2026**

O salto da linha 60 para a 64 entregou uma base com suporte de longo prazo, novas possibilidades de análise e compartilhamento e a continuidade da experiência Dashboards SP. A equipe também passou a ter um inventário das customizações, um processo para confrontá-las com o Metabase oficial e registros de teste que podem ser reaproveitados na próxima atualização. Este documento detalha os dois resultados e serve de apoio às perguntas que podem surgir durante a apresentação.

## Como o trabalho chegou à versão 64

| Issue | Entrega e contribuição |
| --- | --- |
| **EDD-1361 — inventário e isolamento inicial** | Identificou quais arquivos são próprios de SP, quais adaptam componentes do Metabase e quais preservam regras de comportamento. A classificação distingue o que pode ser recuperado em bloco do que precisa ser reimplementado na nova API. O inventário registra origem, caminhos críticos e critérios de reaplicação. |
| **EDD-1356 — automação do transporte** | Criou o script de atualização com snapshot, merge, restore seletivo, relatório e verificação. A experiência da atualização acrescentou o scan, as listas de proteção e o build-check, que identifica problemas fora do que é carregado em desenvolvimento. |
| **EDD-1355 — atualização do Metabase** | Exercitou a passagem 60 → 61 → 62 → 63 e o salto 60 → 64. A experiência de conflitos e regressões orientou a adoção posterior de uma base oficial 64, com reaplicação seletiva das mudanças SP em `saopaulov64`. |
| **EDD-1362 — refatoração de tema e marca** | Centralizou a paleta, os tokens e valores padrão de SP e reduziu as intervenções nos arquivos de tema compartilhados com o Metabase. Atualizou a classificação dos arquivos para o script preservar a estrutura após o refactor. |
| **EDD-1523 — auditoria pós-update** | Percorreu as telas após a atualização e encontrou lacunas de contraste, localização, identidade, navegação e ofertas comerciais. Transformou o levantamento em patches selecionados, roteiros de smoke e limitações de homologação. A etapa posterior EDD-1523v64 estendeu a assinatura Dashboards SP às superfícies de compartilhamento e exportação. |

### O inventário virou uma regra de decisão

O [manifesto de customizações](./manifesto-customizacoes.md) e as [listas canônicas](./lists/README.md) classificam o trabalho em quatro grupos. `restore-ours` reúne código e recursos próprios de SP. `dual-changed` identifica pontos de contato que precisam conciliar alterações dos dois lados. `behavior-manual` conserva os comportamentos que exigem entender o fluxo no código novo. `sp-extra` protege infraestrutura e recursos do fork no scan, sem incluí-los na restauração automática.

Isso permite revisar o que o produto precisa preservar, como um teste de congelamento de colunas ou um ajuste de login, em vez de tomar qualquer arquivo tocado por uma issue como propriedade do fork. O [inventário da reaplicação](./inventario-saopaulov64.tsv) cruza as listas com as referências da versão 64. Uma entrada desse inventário é um candidato à revisão e pode aparecer em mais de uma categoria. [Escopo da EDD-1361](./issue-edd-1361.md)

### A automação ficou mais precisa após os primeiros merges

Na passagem 60 → 61, a resolução de conflitos mostrou a necessidade de restringir o restore ao conjunto conhecido de arquivos SP. Na 61 → 62, foi preciso alinhar arquivos de dependências, tratar renomes e descartar componentes removidos pelo Metabase. A PoC até a 63 mostrou que o ambiente de desenvolvimento podia abrir com partes antigas da árvore, enquanto o build de produção falhava em drivers e imports que não eram carregados naquele fluxo. [Notas 60 → 61](./notas-etapa-60-61.md) · [Notas 61 → 62](./notas-etapa-61-62.md) · [Notas 62 → 63](./notas-etapa-62-63.md)

A EDD-1356 v2 adicionou o `scan` para identificar código antigo, arquivos faltantes, órfãos e conteúdo híbrido. O `verify` passou a detectar categorias que ainda exigem tratamento. O `build-check` inclui backend e drivers, visualizações estáticas, tipos e bundle de produção. Um teste negativo com o driver Starburst da 62 recolocado na base 63 demonstrou as duas detecções: o scan apontou o conteúdo antigo e a compilação acusou uma função removida na versão nova. [MVP da EDD-1356](./issue-edd-1356.md) · [Evolução e teste negativo](./edd-1356-v2.md)

Na reaplicação final, `saopaulov64` começou em `metabase-64-oficial` e usou a auditoria como referência para transportar mudanças específicas. O scan somente de leitura ajudou a conferir o inventário dessa branch. O procedimento de merge com restore se aplica ao caminho descrito no runbook. A escolha da estratégia depende da base de partida. [Notas do salto 60 → 64](./notas-etapa-60-64.md) · [Reaplicação seletiva](./reaplicacao-saopaulov64.md) · [Runbook](./runbook-atualizacao.md)

### A marca ganhou um ponto de manutenção

A EDD-1362 concentrou os valores SP em um módulo de tema e ligou esse módulo aos temas claro e escuro por pontos pequenos e explícitos. Os grupos de cores voltaram ao comportamento do Metabase, enquanto os acentos de gráficos e as paletas SP passaram a ter uma fonte própria. A revisão também moveu **20 arquivos frontend** da proteção genérica para as categorias de adaptação e comportamento manual.

Na medição da refatoração em 0.63, o conjunto de arquivos de tema avaliado passou de **720 para 29 linhas de diferença** em relação ao upstream, somando inserções e remoções. A medida mostra a redução na área de convivência entre os dois códigos. Ela se refere àquela comparação de tema, com a base oficial 63, e não quantifica a redução de conflitos de todo o fork. [Medição da EDD-1362](./edd-1362.md) · [PDF das métricas](./edd-1362-metricas.pdf)

## O que a plataforma acrescentou no percurso

| Versão | Recursos e valor | Demonstração possível |
| --- | --- | --- |
| **60 — referência** | O Explorador de Métricas introduziu a comparação lado a lado. Recursos de IA assistida e integração MCP passaram a fazer parte da oferta aberta da plataforma. | Mostrar a evolução do Explorador em uma métrica já cadastrada. Usar os recursos de IA apenas em ambiente preparado para a demonstração. |
| **61** | Aritmética entre métricas, comparação da mesma métrica com filtros próprios e visão de totais. Isso ajuda a responder perguntas como custo médio por atendimento ou diferença entre recortes. | Menu lateral → Métricas → abrir uma métrica no Explorador → adicionar uma segunda métrica ou recorte. |
| **62** | Listas para filtros de ID e rótulos legíveis em filtros alimentados por uma pergunta. A versão também introduziu a CLI para fluxos de automação. | Abrir um dashboard com filtro configurado para exibir o nome da unidade. Mostrar que a lista permite escolher pelo rótulo. |
| **63** | Mapa de árvore para análises parte-todo. PDF gerado no servidor e opção de anexo em assinaturas ampliam as formas de distribuição. | Abrir uma consulta agrupada por categoria → Visualização → Mapa de árvore. Para PDF, mostrar um arquivo de demonstração. |
| **64** | Suporte de longo prazo, verificações de acesso ao longo das dependências e novas opções de proteção de sessões e credenciais. Monitor reúne ferramentas de acompanhamento. Metabot e MCP ampliam opções de integração com assistentes. | Menu de troca de áreas → Monitor → Tarefas, com acesso autorizado. Apresentar IA, transformações e outras integrações como possibilidades a avaliar conforme a instalação. |

As linhas acima descrevem o que foi publicado pelo Metabase. Para uma demonstração, confirme a disponibilidade das telas, dos dados e do perfil no ambiente escolhido. As notas públicas descrevem separadamente o alcance por plano e a configuração dos recursos. [Metabase 60](https://www.metabase.com/releases/metabase-60) · [61](https://www.metabase.com/releases/metabase-61) · [62](https://www.metabase.com/releases/metabase-62) · [63](https://www.metabase.com/releases/metabase-63) · [64](https://www.metabase.com/releases/metabase-64) · [Suporte de longo prazo](https://www.metabase.com/version-support)

## O que foi adaptado no Dashboards SP

| Área | Entrega e evidência |
| --- | --- |
| **Primeiro acesso e navegação** | Identidade SP em login, brasão, temas e tipografia. A EDD-1658 alinhou hover e item ativo da sidebar ao cinza do tema claro, com texto preto. |
| **Home** | Cards do tema SP em Populares, Recentes e X-ray. A EDD-1660 contém títulos longos, preserva o espaço do ícone e permite consultar o nome completo. Recentes e X-ray tiveram aceite local no escopo registrado. |
| **Datagrid e filtros** | Congelamento de colunas e destaque de linha nas áreas fixa e rolável. Filtros em cascata com validação local de State → City e troca de campo. Cenários dependentes de dados e relacionamentos seguem para homologação. |
| **Gráficos e indicadores** | Abreviação de eixos e tooltip com rótulo completo, inclusive no gráfico horizontal. Paletas SP com verificação da persistência da configuração no dashboard. Nos casos de KPI aceitos, zero e ausência de linhas têm apresentações distintas. |
| **Administração** | Revisão de pt-BR em configurações, LDAP e metadados de conexão. Ajuda de PostgreSQL em português. A EDD-1659 corrigiu a legibilidade dos nomes de bancos nos grupos de permissões. |
| **Data Studio e Monitor** | Identidade SP nas duas áreas, navegação de acordo com as permissões e recursos disponíveis e remoção de grupos promocionais vazios. Em Monitor, o cenário administrativo de entrada em Tarefas foi validado localmente. |
| **Incorporação e distribuição** | A assinatura Dashboards SP usa prefixo localizado e brasão em incorporação, PNG, clipboard e PDF. O texto também foi implementado nos modelos HTML de e-mail e na mensagem de dashboard pelo Slack. A geração de PDF pelo servidor foi exercitada no ambiente local. |

[Plano de reaplicação](./reaplicacao-saopaulov64.md) · [Smokes por área](./smoke-saopaulov64.md) · [Auditoria](./EDD-1523-auditoria.md) · [Correções de QA](./INSTRUCOES-AGENTE.md) · [Smoke da EDD-1660](../smoke-tests/EDD-1660-smoke.md) · [Assinatura Dashboards SP](./pendencia-assinatura-dashboards-sp.md)

## Aprendizados que mudam o próximo upgrade

1. **Começar pelo comportamento e pela versão alvo.** Confirmar em que módulo está a funcionalidade e usar a API disponível na nova versão. Na passagem para a 64, o gráfico horizontal e as configurações de séries passaram a depender de componentes e tipos compartilhados de visualização. Preservar a intenção do patch exige adaptar seu ponto de integração. [Notas 60 → 64](./notas-etapa-60-64.md)
2. **Tratar dependências e código gerado em conjunto.** `package.json`, lockfile e patches precisam corresponder entre si. Regenerar ClojureScript antes do TypeScript quando os contratos vierem desse bundle. Em máquina com memória limitada, executar o build pesado e a checagem de tipos em sequência. [Notas 61 → 62](./notas-etapa-61-62.md) · [Fechamento da assinatura](./pendencia-assinatura-dashboards-sp.md)
3. **Revisar cada destino de uma alteração visual.** PNG e PDF do navegador compartilham um caminho. PDF do servidor, e-mail e Slack têm outros renderizadores. No PDF vetorial, a leitura do brasão precisou considerar retângulos, polilinhas e cores herdadas. Na prévia SDK, o rodapé cabia dentro do iframe, mas a altura mínima do iframe excedia o espaço externo. Medir os dois contêineres permitiu concentrar a correção na prévia. [Registro da assinatura](./pendencia-assinatura-dashboards-sp.md)
4. **Regenerar recursos de idioma e retestar os caminhos atingidos.** Mesclar traduções por chave, regenerar os catálogos consumidos pelo frontend e backend e reiniciar os processos pertinentes. Nos formulários de driver, traduzir o texto apresentado e manter os valores técnicos usados na conexão. [Auditoria](./EDD-1523-auditoria.md) · [Traduções reaplicadas](./reaplicacao-saopaulov64.md)
5. **Separar dado, interpretação e apresentação.** A investigação dos nulos mostrou que o tipo retornado pelo driver, a existência de uma linha agregada e a existência de registros de origem são evidências diferentes. Validar o significado com a equipe dona do KPI evita tratar uma resposta vazia como um zero real. [Cenários NU](./smoke-saopaulov64.md) · [Homologação de KPIs](./pendencias-homologacao-saopaulov64.md)
6. **Registrar o aceite com o perfil e o cenário testados.** Uma captura de Recentes ou X-ray ajuda a provar a contenção do título, mas a escolha de Populares depende de elegibilidade e atividade. Da mesma forma, conferir uma área como administrador não cobre um perfil de monitoramento delegado. Roteiros com IDs preservam tanto os acertos quanto o que ainda precisa de um ambiente específico. [Smokes da versão 64](./smoke-saopaulov64.md) · [Roteiro EDD-1660](../smoke-tests/EDD-1660-smoke.md)
7. **Verificar o artefato e devolver o checkout ao estado de desenvolvimento.** O JAR deve conter versão, recursos, bundles e o código esperado. Inspecionar o pacote e executar uma prova usando-o ajuda a identificar divergências. Ao voltar ao checkout, restaurar o estado de `resources/version.properties` para não misturar uma build versionada com o banco local migrado em `vLOCAL_DEV`. [Fechamento técnico](./fechamento-tecnico-saopaulov64.md) · [Procedimento no runbook](./runbook-atualizacao.md)

## Evidência de conclusão e limites da rodada

O fechamento local da base reaplicada registrou **545 testes de frontend em 46 suítes**, **8 testes de backend** e build OSS aprovado. O scan da revisão consolidada cobriu **306 caminhos protegidos**, com zero ocorrências nas quatro categorias classificadas. Na etapa da assinatura, o pacote **`v0.64.1-SNAPSHOT (54ea165)`** teve versão, bundles, templates e renderização de prova verificados. Os merges posteriores de QA têm evidência própria de smoke. Cada relatório identifica a revisão a que seus resultados se aplicam. [Fechamento da base](./fechamento-tecnico-saopaulov64.md) · [Fechamento da assinatura](./pendencia-assinatura-dashboards-sp.md)

O fechamento técnico local, o aceite visual por cenário e a homologação são marcos distintos. O checklist de destino conserva os casos que dependem de dados reais, perfis, integrações ou telas disponíveis naquele ambiente. O uso de cada nova capacidade deve ser avaliado com os responsáveis pelo produto e pelo ambiente. [Checklist da equipe](./checklist-qa-homologacao-saopaulov64.md) · [Pendências por área](./pendencias-homologacao-saopaulov64.md)

## Como usar este material na apresentação

Comece com três demonstrações curtas: **comparar indicadores**, **explorar uma tabela com filtros** e **gerar uma saída com a assinatura SP**. Use Monitor e Data Studio para mostrar a evolução das áreas administrativas quando o perfil de apresentação tiver acesso.

Se perguntarem como a equipe preserva as customizações, mostre a classificação do inventário, a redução medida no diff do tema e um caso concreto que o build detectou. Se perguntarem o que já foi validado, indique o cenário e seu registro de aceite. Para a narrativa resumida e a seleção de prints, use a [apresentação de avanço de produto](./apresentacao-avanco-produto-saopaulov64.md).
