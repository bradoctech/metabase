# Dashboards SP na versão 64 do Metabase

**Defesa de produto · EDD-1355 e entregas complementares · 25/11/2026**

## Mensagem de abertura

> Atualizamos a base do Dashboards SP da linha 60 para a 64 do Metabase. Na nova base, reaplicamos a identidade visual e os fluxos que fazem parte do trabalho diário, como navegar pela home, explorar tabelas, consultar indicadores e compartilhar dashboards. O avanço fica demonstrável na interface, nos arquivos exportados e nos registros de validação.

A atualização partiu da base oficial da versão 64. A equipe usou a auditoria da migração anterior para selecionar e adaptar as customizações SP. Esse processo deixa explícito quais comportamentos são próprios do produto e quais precisam ser revisados em um próximo upgrade. [Plano de reaplicação](./reaplicacao-saopaulov64.md) · [Auditoria EDD-1523](./EDD-1523-auditoria.md)

## O que apresentar

| Frente | O que mudou para quem usa o produto | Evidência sugerida |
| --- | --- | --- |
| Identidade e navegação | A versão 64 mantém o brasão, a tipografia Rawline e os temas SP. A sidebar usa fundo cinza no hover e no item ativo do tema claro, com texto preto. | Login, home e sidebar em uso. Mostrar um item selecionado e outro sob o cursor. |
| Home e descoberta | Populares, Recentes e X-ray reaproveitam o visual SP. A correção de títulos mantém cards adjacentes alinhados, inclusive com identificadores longos sem espaços. O título completo pode ser consultado pelo tooltip. | Comparar o transbordamento reportado com o reteste em Recentes ou X-ray. |
| Exploração tabular | O datagrid permite congelar colunas e destacar a linha durante a leitura. Os filtros em cascata restringem as sugestões conforme o filtro anterior. | Mostrar a tabela com rolagem horizontal e o filtro State → City validado com o banco de amostra. |
| Dashboards e gráficos | Os cards preservam a identidade SP, com opção de texto sem fundo. Rótulos longos nos eixos são abreviados e podem ser lidos no tooltip. As paletas continuam disponíveis na pergunta e na configuração do card no dashboard. | Mostrar eixo abreviado com tooltip aberto e a paleta persistida após recarregar. |
| Indicadores | Nos cenários acordados de Número e Tendência, o produto exibe zero onde esperado e mantém “Sem resultados” quando a consulta não retorna linhas. Campos textuais vazios preservam seu significado. | Comparar o resultado zero com uma consulta sem linhas. A validação com os KPIs reais segue em homologação. |
| Administração | A revisão de português cobre telas e formulários de conexão, incluindo ajuda do PostgreSQL. Os nomes de bancos voltaram a ficar legíveis nas permissões de Todos os usuários e Administradores. Data Studio e Monitor receberam a identidade SP, com a navegação ajustada conforme os recursos e as permissões do perfil. | Mostrar um formulário traduzido e a listagem de permissões antes e depois. |
| Compartilhamento | Incorporação e exportações exibem o brasão e o nome **Dashboards SP** com prefixo localizado. A assinatura deixa o conteúdo em destaque e não abre um link comercial. A composição também foi implementada nos canais de notificação previstos. | Mostrar prévia incorporada, PNG e uma página de PDF. |

Os registros de aceite por cenário estão no [smoke da versão 64](./smoke-saopaulov64.md), no [smoke dos cards da home](../smoke-tests/EDD-1660-smoke.md), no [registro das correções de QA](./INSTRUCOES-AGENTE.md) e na [validação da assinatura](./pendencia-assinatura-dashboards-sp.md).

## Sequência para a apresentação

1. **Abra pela experiência.** Mostre a home e a navegação lateral. Use um título longo em Recentes ou X-ray para demonstrar como o card conserva a forma e dá acesso ao nome completo.
2. **Passe da exploração ao dashboard.** Mostre uma tabela com colunas congeladas, um filtro em cascata e um gráfico com rótulos longos. Se houver espaço, use um KPI para demonstrar a diferença entre zero e ausência de linhas.
3. **Mostre a consistência fora da tela principal.** Apresente um formulário administrativo em português, as permissões com nomes legíveis e um PNG ou PDF com a assinatura Dashboards SP.
4. **Feche com a evidência de entrega.** Explique quais cenários foram confirmados na aplicação e quais dependem da infraestrutura ou dos dados de homologação.

## Sustentação da entrega

| Registro | O que comprova |
| --- | --- |
| Base 64 e reaplicação SP | O fechamento local registrou **46 suítes e 545 testes de frontend**, **8 testes de backend**, checagem de tipos e build OSS. A auditoria do transporte cobriu **306 caminhos protegidos** na revisão consolidada. [Fechamento técnico](./fechamento-tecnico-saopaulov64.md) |
| Assinatura Dashboards SP | O build OSS `v0.64.1-SNAPSHOT (54ea165)` foi verificado com o conteúdo da assinatura. Foram exercitados na aplicação os fluxos registrados de incorporação, PNG, clipboard e PDFs, incluindo um PDF backend gerado pelo endpoint. [Validação e empacotamento](./pendencia-assinatura-dashboards-sp.md#fechamento-técnico-as-sm-15--19112026) |
| Correções do QA | **EDD-1658** e **EDD-1659** tiveram smoke aprovado pelo usuário. **EDD-1660** teve aceite local de Recentes e X-ray no escopo registrado, incluindo navegação e tooltip do X-ray. [Registro das correções](./INSTRUCOES-AGENTE.md) · [Smoke EDD-1660](../smoke-tests/EDD-1660-smoke.md) |

O histórico local da `saopaulov64` inclui os merges da assinatura e das correções de QA (**#149, #151, #152 e #153**). Os resultados de cada teste e build pertencem às revisões citadas nos relatórios. O status de publicação e o aceite no ambiente de destino devem ser registrados na rodada de homologação.

## O que fica para homologação

- **Base e integrações.** Conferir a instalação no ambiente de destino, os perfis, o banco real, os filtros de produção, a semântica dos KPIs, LDAP e SMTP conforme os cenários aplicáveis. [Checklist detalhado](./checklist-qa-homologacao-saopaulov64.md) · [Pendências por área](./pendencias-homologacao-saopaulov64.md)
- **Assinatura.** Conferir corpos de e-mail, entrega de PDF anexo e variações de papel e paginação com dashboard real. O envio real pelo Slack é opcional. [Roteiro da assinatura](./pendencia-assinatura-dashboards-sp.md)
- **Cards da home.** Completar o smoke de Populares e do card de dicas quando houver um perfil que o exiba. [HC-01 e HC-05](../smoke-tests/EDD-1660-smoke.md)

## Capturas para anexar

Inclua os prints a seguir ou selecione os que melhor sustentam a apresentação. Quando houver comparativo, use o mesmo cenário nas duas imagens. Na legenda, indique ambiente, data, caso de smoke ou issue e o detalhe que a imagem demonstra.

### 1. Identidade SP e navegação

**Inserir print aqui** — login ou home com o brasão e a sidebar. Identificar o item ativo e o item em hover, se a imagem cobrir a EDD-1658.

### 2. Home com títulos longos

**Inserir antes/depois aqui** — transbordamento reportado em Populares e reteste em Recentes ou X-ray. Identificar a seção em cada imagem e incluir o tooltip do título completo se disponível.

### 3. Datagrid e filtros em cascata

**Inserir prints aqui** — colunas congeladas ou linha destacada e a lista de cidades após filtrar pelo estado.

### 4. Dashboard, eixos e indicadores

**Inserir prints aqui** — rótulo truncado com tooltip completo, paleta persistida no dashboard ou comparação entre zero e “Sem resultados”.

### 5. Administração e permissões

**Inserir antes/depois aqui** — nomes de bancos legíveis em Todos os usuários e Administradores. Se desejar, complementar com um formulário de conexão traduzido.

### 6. Assinatura em incorporação e exportações

**Inserir prints aqui** — prévia incorporada, PNG ou PDF com prefixo localizado, brasão e nome Dashboards SP. Identificar se o PDF foi exportado pelo navegador ou gerado no servidor.
