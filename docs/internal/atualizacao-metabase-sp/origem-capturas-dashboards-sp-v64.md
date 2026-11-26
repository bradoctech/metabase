# Origem das capturas da apresentação do Dashboards SP v64

Referência interna para a apresentação **Dashboards SP — Atualização da versão 60 para a 64**. A comparação parte da v60. As capturas com o banco de exemplo mostram o comportamento da aplicação atualizada e servem como evidência de demonstração.

## Origem e leitura das capturas

| Captura | Origem em relação à v60 | O que a imagem demonstra |
| --- | --- | --- |
| Comparação de indicadores no Explorador de Métricas | O Explorador já existia na v60. A v61 acrescentou cálculos entre métricas e filtros por série. [Metabase 60](https://www.metabase.com/releases/metabase-60) · [Metabase 61](https://www.metabase.com/releases/metabase-61) | Receita e total de pedidos lado a lado, com escalas próprias e eixo de tempo compartilhado. O print demonstra a comparação básica. |
| Filtro por código com rótulos legíveis | A v62 introduziu listas suspensas nos filtros de ID e a configuração de rótulos para listas alimentadas por perguntas. [Metabase 62](https://www.metabase.com/releases/metabase-62) | Seleção de um produto pelo nome, com aplicação do filtro pelo ID. |
| Mapa de árvore | Visualização nativa introduzida na v63. [Metabase 63](https://www.metabase.com/releases/metabase-63) | Volume de pedidos por categoria e fornecedor, representado pelo tamanho dos blocos. |
| Gráfico multissérie em painéis separados | A opção já estava disponível na v60. [Metabase 60](https://www.metabase.com/releases/metabase-60) | Contagem e subtotal por mês em painéis separados, com escalas próprias e eixo horizontal comum. |
| Página inicial e títulos longos | Adequação do consórcio nesta entrega. | Título contido no card de itens recentes e nome completo acessível ao passar o cursor. [Smoke de títulos na home](../smoke-tests/EDD-1660-smoke.md) |
| Monitor e acompanhamento de tarefas | A v64 criou a área Monitor para reunir ferramentas de acompanhamento. [Metabase 64](https://www.metabase.com/releases/metabase-64) | Tarefas em segundo plano na nova área, acessada com perfil autorizado. |
| Guia do Data Studio | A área foi introduzida na v59 e já existia na v60. [Metabase 59](https://www.metabase.com/releases/metabase-59) | Área disponível na base atualizada com a identidade visual SP. |
| PDF com a assinatura Dashboards SP | A exportação pelo menu já existia na v60. A assinatura institucional é uma adequação do consórcio. | Conteúdo do painel e assinatura com o brasão no PDF exportado pelo menu. [Smoke da assinatura](./pendencia-assinatura-dashboards-sp.md) |
| Prévia de painel incorporado | A incorporação é um recurso da plataforma. A composição da assinatura na prévia é uma adequação do consórcio. | Rodapé da prévia com o brasão e o nome Dashboards SP. [Smoke da assinatura](./pendencia-assinatura-dashboards-sp.md) |
| Tabela dinâmica exportada em PDF | A tabela dinâmica e o PDF pelo menu já existiam na v60. A v63 acrescentou PDF no servidor e ampliou a renderização estática para tabelas dinâmicas, mapas e detalhes. [Metabase 63](https://www.metabase.com/releases/metabase-63) | Categorias, anos, valores e totais legíveis no PDF pelo menu do painel. A validação do PDF do servidor consta em um cenário separado. [Validação por fluxo](./pendencia-assinatura-dashboards-sp.md#consolidação-dos-cenários-as-sm) |

As capturas de **menu lateral no tema claro** e de **tabelas e filtros em cascata** ficam fora da apresentação desta medição. Remova também as referências a esses ajustes no texto, nas legendas e no sumário. A classificação de escopo se aplica à apresentação desta entrega.

## Evidências para o fechamento da medição

Na revisão interna do Confluence, marque em **vermelho** cada campo que aguarda confirmação e use o prefixo **PENDENTE —** para que o status também seja legível sem a cor. Substitua o marcador pelo resultado e pela evidência assim que houver confirmação. Preserve o status **Em homologação** no documento.

| Campo pendente | Evidência esperada |
| --- | --- |
| Versão exata e data da publicação em homologação | Identificação exibida em **Ajuda → Sobre o Metabase** na instância de homologação. Obtenha a data de publicação no registro de implantação. |
| Painel real, recortes e perfil | Nome do painel verificado, filtros de competência e unidade, perfil utilizado, resultado esperado, resultado obtido, ambiente e data. |
| Integrações e conexões | Identifique as integrações e fontes verificadas e informe o resultado. Se houve ajuste, registre o que mudou e o resultado do reteste. |

### Como identificar a versão em homologação

1. Abra a instância de **homologação**. No canto superior direito, clique no ícone de quatro quadrados e abra **Ajuda → Sobre o Metabase**. O último item pode usar o nome exibido da aplicação.
2. Anote o identificador completo da versão e o identificador da revisão, caso seja exibido. A **v64** identifica a linha do Metabase. O identificador completo distingue o pacote instalado de outros builds da mesma linha.
3. Confira a data de publicação no registro de implantação. **Compilado em** na tela Sobre informa a data do build. Quando a apresentação incluir um print, use uma legenda que identifique homologação e a data da conferência.

Os identificadores dos pacotes verificados localmente estão no [fechamento técnico](./fechamento-tecnico-saopaulov64.md) e no [fechamento da assinatura](./pendencia-assinatura-dashboards-sp.md). Use a identificação mostrada na instância para registrar o pacote instalado em homologação.
