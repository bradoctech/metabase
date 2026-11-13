# Smoke da saopaulov64

**Rodada própria da nova branch — aberta em 09/11/2026.** Base oficial `bb612fac416`; referência de customizações `EDD-1523`. Usar a [checklist canônica](./checklist-smoke-test.md) como roteiro e registrar os resultados desta branch aqui. Os OK históricos de `metabasev64` não são evidência desta rodada.

## Evidências já recebidas

- 08/11/2026: usuário confirmou sidebar carregada com o item Lixeira após a correção de schema. Não inclui teste de arquivar/restaurar/excluir.
- 08/11/2026: usuário confirmou o perfil visual SP da etapa marca/tema. Aceite geral; sem evidência discriminada de cada cenário em tela estreita, escuro ou subdiretório.
- Ilustrações genéricas: usuário decidiu manter as cores oficiais; igualdade dos 24 PNGs com a base oficial verificada por arquivo.
- 09/11/2026: usuário relatou ausência dos ajustes SP na home/dashboard antes desta leva. Novo teste visual requerido após a aplicação.

- 09/11/2026, retorno seguinte: HD-09 aprovado. HD-10 aprovado para o card de texto sem fundo; print mostra “Teste fundo transparente” sobre o dashboard, sem bloco/sombra próprios, ao lado de um gráfico com fundo e sombra. Não amplia cobertura para ações, filtros ou embedding.
- 09/11/2026: usuário autorizou adiar HD-05 e HD-06 para homologação e HD-12 para homologação se houver publicação em subdiretório. Motivos: banco local Sample Database, home em “Continue de onde parou” sem card de ajuda e instalação local na raiz. Adiamento não significa aprovação desses cenários.

- 09/11/2026, aceite posterior: usuário confirmou que “Metabase dicas” desapareceu. Conseguiu reproduzir a home Xray e clicar em um card, abrindo a exploração correspondente; enviou prints da home e do dashboard automático de Accounts. HD-04 e HD-06 aprovados no escopo relatado. HD-05 (múltiplos schemas) e HD-12 (subdiretório, se aplicável) continuam adiados para homologação.

## Home e dashboard — roteiro desta leva

**Retorno do usuário em 09/11/2026 registrado abaixo.** O aceite vale para os cenários relatados; itens não exercitados continuam discriminados. Os testes automatizados são registrados no documento de reaplicação (leva inicial: 26 suítes, 162 testes aprovados; após o gate de dicas SP: 21 suítes da home, 100 testes aprovados; tipos e lint aprovados) e não marcam automaticamente estes itens como OK.

| ID | Cenário / como exercitar | Resultado esperado | Estado |
| --- | --- | --- | --- |
| HD-01 | Abrir a home com usuário que tenha saudação habilitada | Saudação com nome destacado, sem o logo Metabot; nenhum erro de console | OK — usuário |
| HD-02 | Home com itens recentes | Cards SP 215×315, título/ícone e badge do banco, dashboard ou coleção; clicar abre o item correto | OK — usuário |
| HD-03 | Home com itens populares | Mesmo padrão de card SP e badge; links corretos | OK — usuário confirmou Popular e interação com os cards, com print |
| HD-04 | Home no fallback Xray com banco sincronizado e X-rays habilitados | Cards altos, badge do nome da tabela, texto da exploração e raio vermelho SP; clicar abre a exploração | OK — usuário confirmou home Xray e clique com abertura da exploração, com dois prints |
| HD-05 | Trocar o schema das sugestões Xray quando houver mais de um | Cards atualizam sem crash, preservando o schema selecionado | ADIADO PARA HOMOLOG — usuário confirmou uso de Sample Database; testar com múltiplos schemas elegíveis |
| HD-06 | Perfil SP: não renderizar o card Metabase dicas na home | Nenhum card/link para metabase.com/learn em Recent, Popular ou Xray no perfil SP | OK — usuário confirmou a remoção do card de dicas; print de Xray também sem o card |
| HD-07 | Home em tela estreita e nos temas claro/escuro | Cards quebram em linhas e títulos/badges continuam legíveis; ilustrações genéricas permanecem coloridas | OK — usuário |
| HD-08 | Abrir dashboard salvo com várias visualizações | Dashcards com raio de 8 px (0.5rem), sombra SP e sem borda; legenda com peso 600, espaçamento compacto e gráficos sem cortes | OK — usuário aprovou também o raio de 8 px no retorno seguinte |
| HD-09 | Hover e navegação por teclado nos dashcards; entrar no modo de edição | Menus e ações atuais continuam acessíveis; descrição de escalar aparece no hover | OK — usuário |
| HD-10 | Ocultar o fundo de um card e testar texto/ações/embedding, quando disponíveis | Cards sem fundo não recebem sombra indevida; ações e filtros continuam funcionando | OK — texto sem fundo, confirmado pelo usuário com print; ações/embedding sem evidência específica |
| HD-11 | Abrir cabeçalho de dashboard salvo e dashboard automático/Xray | Logo-gov SpLogo continua oculto; brasão da AppBar permanece correto | OK — usuário |
| HD-12 | Instância servida em subdiretório, se disponível | Assets do cabeçalho resolvem o prefixo da instância sem 404 | ADIADO PARA HOMOLOG SE APLICÁVEL — somente se a instalação usar prefixo de subdiretório |

### Detalhes para reproduzir os itens em aberto

**HD-03 — Popular:** aprovado pelo usuário após seguir o roteiro local, com print e confirmação de interação com os cards. O trecho a seguir descreve os pré-requisitos para futuras reproduções. A seção depende dos critérios oficiais de seleção e de itens populares elegíveis; a ausência dela na conta usada não é, por si só, uma falha visual dos cards. Os testes automatizados cobrem a seção; o smoke visual desta seção foi aprovado pelo usuário.

### Reprodução local de HD-03 e navegação de HD-04

Os dois cenários podem ser exercitados com o Sample Database. O impeditivo costuma ser a seleção da seção por usuário/conteúdo, e não o banco de amostra. Não alterar o código nem limpar o histórico para forçar o teste.

**HD-03 — Popular:**

1. Com a conta administrativa atual, garantir que exista ao menos uma pergunta salva e um dashboard criados manualmente (os objetos automaticamente carregados não bastam), com acesso para uma conta de teste comum. Os exemplos podem consultar o Sample Database.
2. Criar/usar uma conta comum de teste recém-criada, diferente do usuário instalador. Entrar numa janela anônima e abrir a pergunta e o dashboard para gerar histórico elegível nessa conta; não os adicionar aos favoritos para esse teste.
3. Voltar à home. Para um usuário não instalador, com primeiro login há menos de uma semana, acesso a pergunta e dashboard e resposta Popular não vazia, Popular tem prioridade sobre Recent.
4. Conferir o visual dos cards, os badges e clicar em um item. Se Popular não aparecer, inspecionar na aba Network a resposta de `GET /api/user/current` (`is_installer: false`, `has_question_and_dashboard: true`, `first_login` recente) e `GET /api/activity/popular_items` (lista `popular_items` não vazia). Dados/permissões/atividade podem impedir o cenário; não considerar a seção aprovada apenas por ter seguido os passos.

**HD-04 — clique real no card Xray:**

1. Usar uma conta de teste com acesso aos dados do Sample Database, mas sem acesso a pelo menos um dos dois tipos de objeto salvo (pergunta e dashboard). O objetivo é `has_question_and_dashboard: false`; usuários/grupos podem herdar permissões de coleção, então confirmar o valor em `GET /api/user/current` em vez de presumir que toda conta nova terá esse estado.
2. Com X-rays habilitados e banco sincronizado, abrir a home padrão (sem dashboard personalizado como página inicial). Com essa flag falsa, as seções Popular/Recent não são selecionadas e Xray pode permanecer disponível.
3. Clicar no próprio card de uma tabela, como Orders ou People. Confirmar que a URL muda para a exploração indicada pelo link e que o dashboard automático abre sem erro; depois voltar à home.
4. Abrir diretamente uma URL de exploração testa o destino, mas não substitui o clique no card da home. Se o ambiente/permissões não permitir manter Xray visível, o cenário continua parcial até outro ambiente; não classificar o breve aparecimento como navegação aprovada.

### Como ajustar a conta de teste atual para Xray

Não existe um campo editável no cadastro do usuário para escolher Popular/Recent/Xray. `has_question_and_dashboard` é calculado pelo backend a partir das coleções que a conta pode ler. Remover a condição de Popular por si só pode levar a Recent, em vez de Xray.

Para a conta atual, um administrador precisa remover o acesso efetivo a perguntas salvas **ou** dashboards salvos, mantendo acesso aos dados do Sample Database. Caminho: Admin → Permissões → Coleções (ou cadeado da coleção → editar permissões). Verificar as coleções acessíveis que contêm esses objetos, inclusive Nossas análises, Examples, Teste Coleção e a coleção pessoal, se tiver conteúdo próprio.

As permissões são por grupo e aditivas: se “Todos os usuários” ou outro grupo ainda concede Visualizar/Organizar, colocar “Sem acesso” em um grupo de teste não cancela a concessão. Alterar “Todos os usuários” afeta outras contas; não há bloqueio individual que prevaleça sobre um grupo permissivo. Não mudar esses grupos amplos sem considerar as outras contas do ambiente; se o acesso não puder ser isolado para teste, é preferível outra instância de teste/homologação.

Depois do ajuste, sair/entrar novamente e confirmar `has_question_and_dashboard: false` na resposta de `GET /api/user/current`. Com X-rays habilitados, banco sincronizado e home padrão, a conta pode permanecer em Xray e clicar no card. A conta não deve ser administradora, pois administradores mantêm acesso ao conteúdo. O agente não alterou usuários, grupos ou permissões.

**HD-04 — evolução do aceite:** o primeiro retorno cobria apenas a aparência durante um intervalo breve. No retorno posterior de 09/11/2026, o usuário conseguiu manter a seção Xray, clicou em um card e confirmou que a exploração correspondente abriu. Dois prints mostram os cards SP na home e o dashboard automático de Accounts. HD-04 aprovado para o fluxo relatado, sem inferir testes de salvar a exploração, cada filtro ou todas as tabelas.

**HD-05 — seletor de schema do Xray (adiado para homologação pelo usuário):**

1. Usar um banco que não seja o Sample Database, com pelo menos dois schemas com sugestões de exploração. A conexão ter dois schemas sem sugestões elegíveis não garante que o seletor apareça.
2. Na home, alcançar a seção Xray. No título acima dos cards, procurar o nome clicável do schema, por exemplo `public`, acompanhado da seta. Esse é o seletor; não é o filtro de um dashboard.
3. Abrir o seletor e escolher outro schema. Conferir que o nome exibido e os cards mudam para o novo schema sem erro de console.
4. Voltar ao schema inicial e conferir a troca novamente. A seleção deve permanecer enquanto a seção está montada; não há promessa de persistência após recarregar a página.

Se o banco só tem um schema elegível, é Sample Database, ou Xray não fica disponível, registrar **não exercitado por ausência de cenário**. O teste automatizado de `HomeXraySection` já cobre a troca de schemas; ele não substitui um aceite visual.

**HD-06 — card de ajuda da home (decisão posterior: ocultar no perfil SP):**

O usuário conseguiu visualizar o card na seção Popular e identificou o link para `https://www.metabase.com/learn`. Solicitou não renderizá-lo para o cliente SP. Esse retorno substitui o adiamento anterior deste cenário: o card foi visto e a exigência agora é sua ausência no perfil SP.

Aplicado o gate `SP_COMMERCIAL_POLICY.showExternalHelpLinks` no componente compartilhado `HomeHelpCard`, abrangendo Recent, Popular e Xray. A política da distribuição SP nesta branch fica desabilitada por padrão; não depende do usuário instalador nem de permissões de coleção. Não foi criada detecção de cliente pelo nome da aplicação. Esta mudança cobre somente esse card; os demais links comerciais/ajuda permanecem na etapa de política SP.

**Reconferência:** recarregar a home Popular e confirmar que os cards de conteúdo continuam presentes e navegáveis e que “Metabase dicas” desapareceu, sem deixar um card vazio. Repetir nas seções Recent/Xray quando disponíveis. A regra antiga de exibição é mantida no código e nos testes com a política explicitamente habilitada. Validação automatizada do gate SP: 100 testes da home, tipos e lint aprovados; validação visual da ausência aprovada pelo usuário, com home Xray sem o card também documentada em print. A confirmação não estende a supressão aos outros links de ajuda da aplicação.

Condições anteriores, úteis para reproduzir o comportamento upstream fora do perfil SP:

O item de ajuda do menu dropdown não corresponde a este teste. Procurar um card com ícone de livro/referência e texto equivalente a “Dicas do Metabase” (o nome pode acompanhar o nome da aplicação) ao lado dos cards da própria home.

- Em Popular e Xray, ele é incluído pela seção quando os links Metabase estão habilitados.
- Em Recent, também exige o usuário instalador e primeiro login há menos de duas semanas. Portanto, pode não aparecer para o usuário usado no smoke.
- Quando aparecer, conferir se não sobrepõe os demais cards e se o hover usa fundo neutro. Não é necessário aprovar esse item a partir do dropdown. Se as condições não forem atendidas, registrar a ausência de cenário.

**HD-08 — raio dos dashcards:**

Usuário aprovou os demais aspectos e pediu 8 px em vez de 12 px. `.DashCardRoot` foi ajustado para `border-radius: 0.5rem`. O usuário confirmou posteriormente que o raio está correto; HD-08 aprovado. Para futuras regressões, conferir os quatro cantos e o estilo computado `border-radius: 8px` no DevTools. Esta alteração se aplica aos dashcards; não muda os cards altos da home.

**HD-09 — hover, menu, teclado e edição (aprovado pelo usuário):**

1. Abrir um dashboard salvo com uma pergunta/gráfico, com usuário que possa editá-lo. Em modo de leitura, passar o mouse no card e abrir o menu de reticências quando disponível. Conferir que o botão aparece, recebe clique e o menu fica legível; fechar com Esc.
2. Usar Tab para navegar até os controles do card (Shift+Tab volta). Conferir que o controle focado continua visível e que Enter/Espaço abre seu menu; Esc deve fechá-lo. O ponto é detectar ações escondidas pelo novo CSS.
3. Entrar em editar dashboard. Passar o mouse no card e conferir os controles de visualização, mover/redimensionar e remover quando disponíveis. Abrir e fechar uma opção de visualização sem erro. Cancelar a edição se não houver mudança que se queira manter.
4. Se houver card numérico com descrição configurada e tamanho que a exiba, conferir a descrição ao passar o mouse. Sem esse tipo de card, registrar esse subcenário como não exercitado; os outros passos continuam válidos.

**HD-10 — card com fundo oculto (texto aprovado com print; outros subcenários sem evidência específica):**

1. Editar um dashboard de teste e adicionar um card de texto. Digitar um texto curto e sair da edição do texto para visualizar o card.
2. Nos controles desse card, abrir o ícone de paleta/opções de visualização. Na seção de exibição, localizar **Mostrar fundo** (`Show background`) e desligar.
3. Conferir que o bloco fica transparente sobre o dashboard, sem a sombra SP nem uma borda residual. Ligar novamente e conferir o retorno do fundo/sombra. Se essa opção não existir no tipo escolhido, usar o card de texto, que a oferece explicitamente.
4. Com o card sem fundo, conferir que o menu/edição continua acessível. Se o dashboard tem filtros ligados a uma pergunta, alterar um filtro e verificar que essa pergunta atualiza normalmente.
5. Card de ação e embedding são subcenários adicionais, apenas se já estiverem disponíveis no ambiente: conferir que o botão de ação segue clicável e que o dashboard incorporado não ganha sombra nos cards cujo fundo está oculto. Não considerar esses subcenários aprovados a partir do teste de texto.

**HD-12 — servir em subdiretório (adiado para homologação, se necessário):**

Este teste trata do prefixo da instalação. `http://localhost:3002/` é uma instalação na raiz. Um exemplo de subdiretório seria `https://servidor.exemplo/metabase/`, com a aplicação publicada sob `/metabase/`. Não se trata de uma rota interna como `/dashboard/1`.

No ambiente com esse prefixo já configurado, abrir o dashboard e a exploração Xray; na aba Network, conferir que os assets resolvem como `/metabase/app/assets/img/...`, sem 404 nem perda do prefixo. Apenas acrescentar `/metabase` na URL local não configura esse ambiente. No ambiente local conhecido, manter **não exercitado**; validar quando houver uma instalação com prefixo. A mudança de código usa o helper de URL da instância, mas isso não equivale a smoke nesse tipo de deploy.

### Como alcançar cada seção da home

A home escolhe uma seção por vez. Popular depende de conteúdo elegível (perguntas e dashboards não internos), das regras do usuário e da resposta da API; Recent depende de recentes elegíveis. Xray é fallback e precisa de banco sincronizado, X-rays habilitados e ausência das seções anteriores. Usar usuários/cenários numa instância de teste para cobrir os três estados; não inferir que Xray está correto apenas porque Recent abriu. O teste automatizado de `HomeContent` também cobre a seleção das seções.

## Demais grupos da checklist canônica

| Grupo | Estado nesta branch |
| --- | --- |
| Backend/FE e marca/login | Aceite anterior geral; detalhar cenários ainda não exercitados antes do fechamento |
| Home e dashboard | HD-01/02/03/04/06/07/08/09/11 e texto sem fundo de HD-10 aprovados; HD-05/12 adiados conforme usuário; ações/embedding sem evidência específica |
| Datagrid pin/hover | Reaplicados; DG-01 a DG-08 aprovados pelo usuário, com observação de largura em DG-06 |
| Filtros cascata QB | Reaplicados; 290 testes frontend, 3 testes HTTP H2 (14 asserções), tipos/lint aprovados; FC-01 a FC-04 aprovados pelo usuário; FC-05 a FC-08 pendentes para homologação com a equipe |
| Valores null | NU-01/02/03/04 aceitos no escopo relatado; NU-05 confirmado para último valor null; NU-06/07 aprovados em pergunta/dashboard e NU-09 nas consultas; NU-08/10 aprovados após correção (0 no Número, vazio na Tabela); demais cenários/aceites pendentes |
| Eixos/tooltip e paletas nos charts/Visualizer | Eixos/tooltip reaplicados; AX-01 a AX-09 aprovados; AX-10 validado para exportações e PDF/static-viz, com assinaturas/build pendentes. Tipos da revisão do tooltip pendentes por recursos; paletas ainda não transportadas |
| i18n, ajuda de drivers e política comercial | Transporte e smoke pendentes |
| Data Studio e Monitor, inclusive usuário comum | Transporte e smoke pendentes |
| Conteúdo demo Abono/Detalhamentos | Aplicabilidade depende da presença do conteúdo; não validado |
| Build de produção (backend/drivers, static-viz, tipos, FE) | Pendente para fechamento do transporte |

Ao registrar retorno, informar ID, OK/FAIL, cenário/usuário, tema e evidência ou sintoma. Um cenário não executável deve ficar como PENDENTE com o motivo; não marcar como aprovado pelo aceite de outra tela.


## Datagrid — leva de 09/11/2026

**Estado:** código reaplicado; 11 suítes, 72 testes aprovados, tipos/lint/formatação aprovados e catálogo pt-BR local regenerado. DG-01 a DG-08 aprovados explicitamente pelo usuário em 09/11/2026. A aprovação decorre desta rodada específica, incluindo “ver registros”, e não do smoke da home/dashboard. Não foi discriminado se houve teste em dispositivo de toque.

Preparação: no Sample Database, abrir uma pergunta em modo tabela com várias colunas, como People ou Orders. Usar largura suficiente para congelar duas colunas sem atingir o limite de 90%; para testar a rolagem, deixar mais colunas que a largura disponível. Os botões ficam no canto direito dos cabeçalhos, visíveis no hover ou foco por teclado. “Congelar até esta coluna” fixa a coluna alvo e as anteriores; “Descongelar colunas” remove o pin das colunas de dados. O pin é local à sessão do componente.

| ID | Passos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| DG-01 | Na pergunta em tabela, passar o mouse no header da 2ª/3ª coluna e clicar em Congelar até esta coluna; rolar horizontalmente | A coluna escolhida e as anteriores permanecem à esquerda; demais colunas rolam; não abre menu de ordenação ao clicar no pin | OK — usuário |
| DG-02 | Clicar em Descongelar colunas num header fixado | Colunas de dados voltam a rolar; índice/seleção auxiliares permanecem conforme o comportamento original | OK — usuário |
| DG-03 | Sem clicar, passar o mouse por uma linha, cruzando as partes fixada e rolável, e depois sair da tabela | Toda a linha recebe hover neutro; sem seleção por clique/popover; ao sair, o hover desaparece | OK — usuário |
| DG-04 | Clicar numa célula, depois clicar na mesma linha na outra parte da tabela; repetir noutra linha | Marcação persistente alterna ou muda de linha; menus e ações de célula continuam funcionando | OK — usuário |
| DG-05 | Abrir uma pergunta agregada, clicar num resultado e escolher Ver registros (ou opção equivalente); repetir pin e hover na tabela aberta | Mesmas ações disponíveis nesse fluxo; nenhum CSS administrativo necessário para o destaque | OK — usuário |
| DG-06 | Arrastar/reordenar coluna, congelar até a posição resultante e redimensionar uma coluna; selecionar/copiar células | Pin segue a ordem mostrada; redimensionamento, arraste e cópia preservados | OK — usuário; redução das colunas efetivamente fixadas em viewport menor aceita (limite de largura) |
| DG-07 | Exibir uma tabela em dashboard, conferir footer/paginação, pouco espaço e temas claro/escuro | Footer de 50 px sem cortes; sem barra extra causada por padding; pin respeita limite de largura e texto/ícones legíveis | OK — usuário |
| DG-08 | Navegar por Tab até um pin e acionar com Enter/Espaço; testar toque se disponível | Botão aparece no foco, congela/descongela sem abrir menu nem submeter formulários; não habilita edição de dados | OK — usuário |

Se o congelamento parar antes da coluna escolhida em viewport estreito, conferir o limite oficial de 90% antes de classificar como falha. O teste visual de DG-05 é obrigatório nesta rodada: aprovar a tabela principal não comprova o fluxo “ver registros”. Traduções novas foram adicionadas ao catálogo pt-BR; reiniciar/recarregar o ambiente se ainda usar os recursos antigos.


### Aceite do datagrid — 09/11/2026

Usuário aprovou DG-01 a DG-08, incluindo pin/descongelamento, hover, marcação por clique, “ver registros”, reordenação/resize, tabela em dashboard e navegação por teclado. O subcenário de toque não foi discriminado no retorno.

**Observação DG-06:** ao congelar até a terceira coluna em resolução maior e reduzir a largura até ela não caber por completo, a segunda coluna passou a ser a última efetivamente fixada. Usuário percebeu a mudança, considerou que preserva a possibilidade de descongelar e aprovou o comportamento.

**Correspondência no código:** o hook oficial `useColumnPinningByCount` limita a soma das larguras fixadas a 90% da largura do grid. A quantidade efetivamente fixada pode, portanto, ser menor que a solicitada; a contagem solicitada na sessão não é apagada por esse cálculo. A justificativa de manter o descongelamento acessível foi a interpretação aceita pelo usuário, sem alteração do algoritmo nesta rodada. Em futuras regressões, distinguir esse limite de uma falha de pin/reordenação.


## Filtros em cascata do Query Builder — leva de 09/11/2026

**Estado:** implementação reaplicada com testes/tipos/lint aprovados; FC-01 a FC-04 aprovados pelo usuário em 10/11/2026 com State → City e troca para Address; FC-05 a FC-08 pendentes para homologação com a equipe. Reiniciar o backend para garantir o carregamento da rota nova e recarregar o frontend antes do smoke. A aprovação do datagrid não aprova as opções de valores dos filtros. O Query Builder usa cascata automática de filtros irmãos suportados no mesmo estágio; filtros vinculados de dashboard continuam exigindo configuração explícita e não foram modificados nesta leva.

**Preparação local:** abrir Nova → Pergunta usando o Sample Database, com acesso a consultar os dados. O exemplo clássico é People: State → City, se esses campos existirem. Em outro conjunto de exemplo, escolher campos correlacionados existentes, como Category → Vendor em Products. Para um teste determinístico sem depender dessas colunas, aplicar `ID = um ID existente` numa tabela e abrir as opções de outro campo textual dessa mesma linha; elas devem corresponder ao registro escolhido. A existência de campos e sua configuração de busca/lista dependem do metadata do seu banco.

No DevTools → Network, procurar `POST /api/field/<campo-alvo>/filtered-values`. O corpo contém `constraints` com `field_id`, `op`, `value` e eventualmente `options`; busca digitada também inclui `query` e `limit`. O retorno deve ter `field_id`, `values` e `has_more_values`.

| ID | Passos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| FC-01 | Sem filtro aplicado, abrir o seletor de valores de um campo | Comportamento oficial preservado; GET de valores/busca conforme configuração do campo, sem POST de cascata desnecessário | OK — usuário, 10/11/2026 |
| FC-02 | Aplicar filtro A e abrir valores do campo B no mesmo estágio, com relação confirmada nos dados | POST 200 com A em constraints; opções de B compatíveis com A, não apenas o resultado final da tabela filtrado | OK — usuário, 10/11/2026 |
| FC-03 | Trocar o valor de A; reabrir B; depois remover A e abrir B novamente | Opções acompanham A; após remover o último filtro irmão suportado, volta ao fluxo sem restrições | OK — usuário, 10/11/2026 |
| FC-04 | Editar o filtro B existente; usar Voltar para trocar a coluna desse filtro | O filtro sendo editado/substituído não restringe a si nem a nova coluna; demais filtros irmãos continuam como contexto | OK — usuário, Network, 10/11/2026 |
| FC-05 | Aplicar dois filtros irmãos suportados e abrir um terceiro campo; testar igualdade com múltiplos valores | Constraints contêm os filtros irmãos; array de valores preservado; não aparece erro 400/500 | PENDENTE — homologação com a equipe |
| FC-06 | Num campo configurado para busca, digitar texto tendo A aplicado; selecionar um valor e limpar a busca | POST preserva constraints e inclui query; só valores compatíveis são sugeridos e podem ser selecionados; sem falha ao limpar | PENDENTE — homologação com a equipe |
| FC-07 | Na tabela resultante, abrir o drill Filtrar por esta coluna numa coluna diferente de A, quando disponível | Mesmo contexto em cascata no picker do drill; seleção aplica o filtro e a pergunta continua funcionando | PENDENTE — homologação com a equipe |
| FC-08 | Usar filtro numérico com valor/faixa como A e abrir B; quando houver FK reconhecida, repetir entre campos relacionados | Constraints numéricas preservadas; relação entre tabelas depende do metadata; confirmar opções no dado real | PENDENTE — homologação com a equipe |

**Limitações herdadas da referência SP:** só são convertidos filtros suportados de texto/número/booleano com valores. Filtros vazios, de nulo/sem valor, data/hora, coordenadas e expressões/combinações não suportadas ficam fora da conversão desta versão. O alvo não se restringe por filtros do próprio campo. Não inferir que o endpoint representa toda a query: relações dependem de mesma tabela/FK; joins arbitrários, SQL nativo, modelos e estágios anteriores não têm equivalência garantida. Parâmetros de pergunta e dashboards sem filtros vinculados não ganham cascata por este patch.

Se o dropdown não reduzir o número de opções porque todos os valores de B coexistem com A nos dados, conferir a correspondência dos valores e o corpo da requisição antes de classificar como falha. Nenhum usuário, permissão ou banco de aplicação foi alterado pelo agente para montar esse roteiro.

### Retorno manual — 10/11/2026

Teste local com A = State e B = City. Usuário aprovou FC-01, FC-02 e FC-03. Em FC-03, observou que, com City preenchida, as opções de State ficam restritas pela cidade, comportamento esperado de cascata entre filtros irmãos. Não foi relatada inspeção das requisições no Network; o aceite registra o funcionamento visual informado.

Em FC-04, com State = CO e City = Aguilar, editou City, voltou à escolha de coluna e selecionou Address. Ao digitar `a`, o autocomplete exibiu endereços. Na sequência, o usuário confirmou a validação no Network e aprovou o cenário. A captura adicional mostra o Preview de `filtered-values` com `field_id: 51`, endereços em `values` e `has_more_values: false`; o payload de constraints não está visível nessa captura. Aceite registrado conforme a verificação relatada pelo usuário. FC-05 a FC-08 ficam pendentes por decisão do usuário para teste com a equipe em homologação.


## Valores nulos — EDD-999 — 10/11/2026

**Estado após retorno do usuário:** NU-01 aprovado no cenário relatado (null numérico exibido como 0, texto vazio, controle e API preservados). NU-02 aprovado quanto à cópia relatada, sem zero; menu não discriminado. NU-03 aprovado como Número na pergunta, exibindo 0 para uma linha numérica null; dashboard não confirmado nesse retorno. NU-04 aprovado com zero linhas e “Sem resultados”. NU-05 confirmado na segunda execução: último valor null na API, exibido como 0 no ponto mais recente e −100% contra 70.08. A apresentação +∞% foi posteriormente aceita no retorno de NU-15.

**Critério confirmado para estes cenários:** na tabela de NU-01, null numérico deve ser exibido como 0 e null textual permanece vazio. Em NU-03, uma linha com valor numérico null deve aparecer como 0 no Número. Em NU-04, nenhuma linha deve aparecer como “Sem resultados”. O agente havia alterado essas expectativas por interpretação da descrição da issue sem confirmar com o usuário; este retorno corrige o roteiro. Não tratar NU-01/03 como falha por exibirem 0.

**Decisão adicional do usuário em NU-08/10:** na visualização Número, uma linha agregada com SUM null deve aparecer como 0 tanto sem registros de origem quanto com registros cujos valores são todos null. Uma consulta que devolve zero linhas continua como Sem resultados. Esta orientação explícita resolve esses dois exemplos; não estender automaticamente a outros componentes, a todas as comparações da Tendência ou a tipos conhecidos de texto/booleano. O mapeamento dos demais casos permanece pendente. Testes automatizados aprovados verificam a implementação, sem substituir o aceite de negócio.

**Levantamento obrigatório antes da implementação definitiva:** para cada KPI candidato, registrar ID/URL do card e pergunta, consulta/definição da métrica, driver, filtros/período, existência de registros de origem, quantidade de valores não nulos, resposta da API, significado do null, apresentação esperada e responsável pelo aceite. A lista de KPIs e a condição explícita que autoriza qualquer tratamento especial permanecem pendentes. Ter uma linha agregada no resultado não comprova que havia registros de origem.

NU-01 a NU-04 refletem o retorno explícito do usuário. Os itens seguintes têm o estado detalhado na tabela; não reinterpretar os aceites de NU-01/03 como aprovação geral dos demais casos.

**Preparação local:** o Sample Database atual usa SQLite por padrão. A consulta de tabela abaixo é aceita nele; as expressões nulas exigem a correção de metadata registrada no plano. As consultas com literal `DATE` adiante são exemplos para H2 e precisam de adaptação no SQLite; não marcar falha de sintaxe ou tipo da fixture como falha da Tendência. Em outro driver, adaptar os casts/literais à sintaxe suportada.

Tabela com nulo numérico e textual:

```sql
SELECT CAST(NULL AS DOUBLE PRECISION) AS valor,
       CAST(NULL AS VARCHAR) AS rotulo
UNION ALL
SELECT 12.5, 'Controle'
```

Número simples no SQLite: usar uma coluna de tipo numérico declarado para produzir uma linha nula sem perder a informação de tipo. No Sample Database com Products/Price:

```sql
SELECT p.price AS valor
FROM (SELECT 1) AS x
LEFT JOIN products AS p ON 1 = 0
```

Selecionar Número, campo `valor`. Para resultado sem linhas, acrescentar `WHERE 1 = 0` ao final. Uma expressão `CAST(NULL AS DOUBLE PRECISION)` isolada no SQLite não garante tipo numérico no metadata e não serve como fixture determinística de NU-03.

Tendência: executar a consulta abaixo, selecionar Tendência e usar `valor` como métrica e `mes` como data. Se a opção não estiver disponível, conferir os tipos reconhecidos no resultado e a configuração da visualização.

```sql
SELECT DATE '2026-09-01' AS mes, CAST(100 AS DOUBLE PRECISION) AS valor
UNION ALL
SELECT DATE '2026-10-01', CAST(NULL AS DOUBLE PRECISION)
UNION ALL
SELECT DATE '2026-11-01', CAST(100 AS DOUBLE PRECISION)
```

| ID | Passos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| NU-01 | Abrir a tabela de nulos numérico/textual com a linha Controle; conferir tipos na API | Null numérico exibido como 0; texto null vazio; 12.5 e Controle preservados; API mantém null | OK — usuário, cenário local relatado |
| NU-02 | Selecionar/copiar a célula numérica nula; comparar com a célula 12.5 e conferir ações disponíveis | Registrar o conteúdo de cópia sem presumir que a representação visual e a cópia sejam iguais | OK — cópia aceita pelo usuário: apenas cabeçalho valor para a célula nula, cabeçalho e 12.5 para a preenchida; menu não discriminado |
| NU-03 | Exibir como Número a linha numérica null produzida pelo LEFT JOIN acima; repetir em dashboard quando possível | Exibe 0 na pergunta, conforme aceite explícito deste exemplo; não exibe null/nulo | OK — pergunta aprovada pelo usuário; dashboard pendente |
| NU-04 | Exibir como Número uma consulta que retorna zero linhas, acrescentando WHERE 1 = 0 ao exemplo | Exibe Sem resultados, sem inventar zero | OK — usuário, com captura |
| NU-05 | Na consulta com três pontos, executar CASE WHEN pos = 2 THEN NULL ELSE valor END; depois trocar somente pos = 2 por pos = 1 e reexecutar | Conferir valor atual, data e comparação em cada execução; validar com o usuário se null como 0 e a variação resultante são desejados na Tendência | OK no cenário de último valor null — API preservada, 0 atual na data mais recente e −100% contra 70.08; apresentação +∞% aceita em NU-15 |
| NU-06 | Remover o ponto intermediário da consulta e conferir Tendência e dashboard | Comparação usa os dois pontos reais, sem criar um zero para o ponto removido | OK — usuário, pergunta e dashboard; 53.41 contra 74.95, −28.74% |
| NU-07 | Retornar SELECT 0 AS valor e conferir Número e dashboard | Zero explícito exibido como 0 | OK — usuário, pergunta e dashboard |
| NU-08 | Executar SUM(price) com WHERE 1 = 0, conferindo controles de contagem | Número deve exibir 0 para a linha agregada null, conforme orientação explícita do usuário; tabela pode manter célula vazia; sem linhas continua distinto | OK — reteste do usuário: Número exibe 0 e Tabela mantém célula vazia |
| NU-09 | Consultar COUNT(*) com WHERE 1 = 0 | Zero calculado aparece como 0 | OK — usuário, consultas relatadas |
| NU-10 | Agregar duas linhas com todos os valores null, conferindo contagens e SUM | Número deve exibir 0 para a soma null, conforme orientação explícita do usuário; não alterar o resultado da API | OK — reteste do usuário: Número exibe 0 e Tabela mantém célula vazia |
| NU-11 | Consultar métrica cuja apuração válida resulte em 0 com registros e valores preenchidos; comparar com NU-08/10 | Zero real aparece como 0; API distingue esse zero dos nulls de NU-08/10, ainda que o Número exiba 0 nos três casos aceitos | OK — usuário: API retornou 0.0; Tabela e Número exibiram 0 |
| NU-12 | Testar valor positivo, negativo e valor pequeno que arredonde visualmente para 0; conferir precisão e tooltip | Valores e formatação preservados; arredondamento não altera dado original nem classifica null como zero | OK — usuário aprovou os cenários de sinal e precisão |
| NU-13 | Conferir métricas/colunas tipadas como texto e booleano, incluindo null, string "0", string vazia e false | Tipos e significado preservados; não aplicar fallback numérico. Confirmar metadata, pois SQLite pode representar booleanos como inteiros | OK — usuário confirmou também metadata type/Boolean em 11/11/2026 |
| NU-14 | Repetir pergunta em tabela, cópia, exportação e visualizações além dos cenários já aceitos | Respeitar os aceites específicos de NU-01/02; mapear e validar os demais componentes sem estender automaticamente a regra numérica | OK no escopo mostrado — Tabela, CSV e JSON exportados; demais visualizações não discriminadas |
| NU-15 | Na Tendência, comparar zero real e null/ausência no período anterior e no atual | Conferir +∞% para anterior realmente zero e −100% para atual realmente zero; comparar com null como 0 nos cenários aceitos de NU-05. Não fabricar linhas ausentes. Validar apresentação de +∞% com o usuário | OK — usuário aprovou o lote, incluindo apresentação +∞% e −100% |
| NU-16 | No dashboard, alternar filtros entre resultado positivo, zero real e ausência; recarregar e repetir com usuário comum | Estado e apresentação acompanham o resultado atual, sem reter zero/valor anterior quando o novo resultado é ausente; permissões preservadas | OK — todos os valores confirmados; recarga e usuário comum adiados para equipe em homologação com banco real |
| NU-17 | Confrontar KPIs mapeados com cards não elegíveis e com a condição explícita aprovada | Só os KPIs definidos recebem tratamento especial; nenhum fallback baseado apenas em tipo numérico, presença de linha ou formato de card | PENDENTE — levantamento/escopo com equipe em homologação no banco real |
| NU-18 | Repetir casos relevantes com a equipe em homologação, nos drivers, métricas e filtros reais do cliente | Evidência por KPI comprova distinção entre zero e ausência; exceções e padrão visual de ausência têm aceite do produto | PENDENTE — homologação |

**Consultas de controle no SQLite do Sample Database:** executar somente leitura. Os counts auxiliares servem para identificar a origem do resultado; não devem virar um critério global de conversão de null no frontend.

NU-07 — zero explícito, sem depender da inferência de um null:

```sql
SELECT 0 AS valor
```

NU-08/09 — nenhuma linha de origem, mas uma linha de agregação:

```sql
SELECT COUNT(*) AS registros,
       COUNT(price) AS valores_preenchidos,
       SUM(price) AS soma
FROM products
WHERE 1 = 0
```

Esperado na API: uma linha equivalente a `[0, 0, null]`. Para testar o KPI, usar a métrica `soma` em NU-08 e `registros` em NU-09, ou executar cada agregação em uma pergunta separada.

NU-10 — duas linhas existentes, mas nenhum valor preenchido na métrica de teste:

```sql
WITH dados AS (
  SELECT p.price AS valor
  FROM (SELECT 1 UNION ALL SELECT 2) AS x
  LEFT JOIN products AS p ON 1 = 0
)
SELECT COUNT(*) AS registros,
       COUNT(valor) AS valores_preenchidos,
       SUM(valor) AS soma
FROM dados
```

Esperado: `[2, 0, null]`. É uma fixture sintética para distinguir presença de linha de presença de valor.

NU-11 — registros com valor preenchido e cálculo realmente zerado:

```sql
SELECT COUNT(*) AS registros,
       COUNT(price) AS valores_preenchidos,
       SUM(price - price) AS valor
FROM products
WHERE price IS NOT NULL
```

Com Products populada, os dois counts são positivos e `valor` é 0. Se não houver dados, a fixture não atende ao cenário; não aprovar NU-11.

**Retorno NU-01 — 10/11/2026:** após correção do metadata SQLite, o usuário confirmou que rotulo passou de 0 para vazio. Aceite restrito ao subcenário textual. A revisão da issue mostrou que o fallback numérico genérico da leva atual não atende ao escopo e à distinção exigidos; NU-01 numérico e demais itens continuam pendentes conforme a tabela. Registrar por cenário: KPI/consulta, usuário, driver, filtros, resposta da API, evidência de registros/valores de origem e apresentação observada. Casos sem definição do produto permanecem pendentes, sem inventar uma regra de conversão.


**Retorno posterior do primeiro lote:** usuário confirmou NU-01 com valor numérico 0, rotulo vazio e controle/API OK; NU-02 com cópia sem zero; NU-03 com Número exibindo 0 (aceito explicitamente); NU-04 com “Sem resultados” para zero linhas. Esses aceites substituem as expectativas anteriores conflitantes do agente, sem alterar o código. Em NU-05, o print da consulta com pos = 2 mostra 53.41 no ponto mais recente e +∞% na comparação contra o ponto nulo normalizado para 0. Os outros dois prints são opções de formatação de data e número, não evidência da execução com pos = 1. Para concluir, basta alterar pos = 2 para pos = 1 no CASE, executar e conferir o valor/data e a comparação; não é necessário mexer na formatação. Não há aceite de NU-05 neste retorno.


**Retorno da segunda execução de NU-05:** usuário enviou a consulta com `pos = 1` e a resposta de três linhas: 74.94550296436165, 70.07989613071763 e null, em ordem cronológica. A Tendência mostra 0 em 15/04/2028 e −100% contra 70.08 em 11/04/2028. Confirmada a apresentação da última linha nula como zero sem recuar a data, com null preservado na API. A apresentação +∞% da primeira execução continua sem confirmação específica; não considerar essa pendência resolvida pelo aceite da segunda execução. Próximo lote: NU-06 a NU-10.


**Retorno NU-06 a NU-10:** NU-06 aprovado em pergunta e dashboard (53.41 contra 74.95, −28.74%); NU-07 aprovado com 0 na pergunta e dashboard; NU-09 aprovado nas consultas relatadas. NU-08 e NU-10 exibiram “nulo” no Número e o usuário definiu explicitamente que ambos devem exibir 0. O metadata desconhecido de uma agregação SQLite composta só de null não acionava a normalização numérica. Correção aplicada somente no Scalar/Número: null de tipo desconhecido passa a 0 quando existe uma linha; texto e booleano com tipo conhecido são preservados. A tabela mantém a regra anterior e a API mantém null. NU-08/10 aguardam reteste após recarregar o frontend; nenhuma mudança adicional de backend é necessária para esta correção.


**Reteste NU-08/10:** usuário confirmou ambos como OK após a correção: Número exibe 0 em vez de null e Tabela mantém célula vazia. Aceite desses fluxos, sem confirmação adicional de dashboard ou API nesse retorno. Próximo lote: NU-11 a NU-15; NU-15 também deve colher aceite específico da representação +∞%.


**Retorno NU-11 a NU-15:** usuário confirmou NU-11 com 0.0 na API e 0 em Tabela/Número (zero numérico válido), NU-12 conforme o roteiro e NU-15 OK, incluindo a apresentação +∞% solicitada no lote. Em NU-13, considerou os demais passos OK e enviou captura de trial_converted = 0 renderizado como 0; isso é compatível com falso no SQLite, mas não comprova o metadata Boolean, que não está visível. Esse subcenário de tipagem permanece pendente. Em NU-14, CSV mostrou cabeçalho valor,rotulo, primeira linha de dados com os dois campos vazios e segunda com 12.5,Controle; JSON exportado mostrou strings vazias na primeira linha e "12.5"/"Controle" na segunda. São representações de exportação formatada, sem zeros fabricados; não são evidência de que a API substituiu null por string vazia. Aceite de NU-14 restrito à Tabela e exportações mostradas. Restam NU-16 a NU-18 e subcenários não discriminados.


**Retorno de 11/11/2026:** usuário confirmou que já havia validado type/Boolean em NU-13; item aprovado no escopo do roteiro. NU-16 permanece pendente de execução: as capturas mostram configuração do filtro de texto, com valor padrão cenario e seleção múltipla. Orientação: usar Caixa de texto, Um único valor, padrão positivo e conectar o filtro à variável cenario no card SQL de teste; o nome da variável não é o valor a enviar. Depois executar os quatro valores positivo/zero/nulo/sem_linhas e voltar a positivo. Não há evidência de falha funcional de NU-16 neste retorno.


**Diagnóstico de NU-16 — conexão ausente no payload salvo:** usuário forneceu filtro Cenário id d57fcf3a, pergunta NU-16 card_id 170 e dashcard id 160, aba 14. O dashcard tem parameter_mappings vazio; portanto não há conexão salva de Cenário para a variável cenario. inline_parameters contém bb971ad9, correspondente ao outro filtro Texto, e não ao Cenário. O padrão positivo da pergunta explica o card renderizar 12.5 apesar da conexão ausente. O código oculta filtros sem mapeamento na aba fora da edição. Próximo passo: selecionar Cenário em edição, escolher cenario no seletor dentro do card NU-16 e salvar; se a seleção explícita desaparecer ao salvar, comparar o payload da gravação antes de atribuir a perda ao código. NU-16 permanece pendente, sem alteração de produção.


**Retorno após conexão de NU-16 — 11/11/2026:** usuário confirmou funcionamento após selecionar a variável cenario no card e salvar. Captura mostra aba Guia 4 fora da edição, filtro Cenário com positivo e card NU-16 exibindo 12.5. Resolvida a ausência do filtro por falta de mapeamento, sem correção de código. A confirmação não discrimina alternância para zero/nulo/sem_linhas, retorno a positivo, recarga ou usuário comum; esses subcenários seguem pendentes de confirmação.


**Aceite dos valores de NU-16 — 11/11/2026:** usuário confirmou todos os valores com resultado esperado: positivo → 12.5, zero → 0, nulo → 0, sem_linhas → Sem resultados, incluindo o fluxo de alternância solicitado. NU-16 aprovado nesse escopo. Recarga e usuário comum não foram discriminados no retorno e permanecem pendentes de confirmação específica. NU-17/18 seguem pendentes de levantamento/homologação.


**Encaminhamento para homologação — 11/11/2026:** por decisão do usuário, NU-17/18 e subcenários ainda não discriminados, incluindo recarga e usuário comum de NU-16, ficam para a equipe validar em homologação com o banco/driver real. Permanecem pendentes, sem invalidar os aceites locais registrados e sem representar conclusão de homologação ou do build de produção.


## Eixos e tooltips — EDD-969 — 11/11/2026

**Estado:** implementação reaplicada; 12 suítes/117 testes, tipos, lint e formatação aprovados; smoke visual em andamento: AX-01/02/04/06 aprovados pelo usuário; Linha e Combo aprovados em AX-03, com uniformização do tooltip do RowChart em AX-05 aprovada pelo usuário; AX-07 aprovado; AX-08/09 aprovados pelo usuário; AX-10 validado para PDF (Área e RowChart/static-viz), PNG/CSV/JSON no escopo informado, com assinaturas e build pendentes. Paletas não fazem parte desta leva. Categorias textuais usam TitleCase com conectores portugueses e prefixo de 10 caracteres mais `...`. Tooltip mostra o texto completo original. Datas/unidades numéricas e eixos métricos preservam a formatação oficial, sem mudar o significado dos valores. Em gráficos estreitos, o corte adicional em pixels pode ser menor que 10 caracteres; texto completo deve continuar acessível pelo hover do rótulo. No RowChart interativo, tooltip da aplicação acompanha o mouse sem atraso intencional. O título SVG completo permanece como fallback na renderização estática. A uniformização foi solicitada e aprovada pelo usuário em 12/11/2026 após correção de contraste.

**Preparação local:** executar a consulta abaixo no Sample Database, escolher categoria como dimensão e valor como métrica. A coluna outra permite configurar Combo com uma série em barra e outra em linha. Não modificar dados de origem.

```sql
SELECT 'departamento regional norte' AS categoria, 10 AS valor, 20 AS outra
UNION ALL
SELECT 'departamento regional sul', 20, 10
UNION ALL
SELECT 'gestão de dados e educação', 30, 15
```

As duas primeiras categorias exibem o mesmo prefixo `Departamen...`. Ao passar o mouse, cada uma deve apresentar seu próprio nome completo. Tooltip de ponto/barra e ações de clique devem continuar usando os valores originais.

| ID | Passos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| AX-01 | Exibir a consulta em Barras; conferir categorias e depois uma categoria curta, como vendas | TitleCase em texto (Vendas); nomes longos com prefixo de 10 caracteres e ...; números permanecem corretos | OK — usuário |
| AX-02 | Passar o mouse nos dois rótulos com prefixo Departamen... e depois sair do eixo | Cada tooltip mostra norte/sul corretamente e o texto completo; sem conteúdo do outro rótulo, corte do texto completo ou tooltip preso | OK — usuário |
| AX-03 | Repetir em Linha e Combo; em Combo configurar outra como segunda série | Mesma regra no eixo; tooltip dos pontos/séries preservado; valores e séries corretos | OK para Linha e Combo — usuário; barras horizontais registradas em AX-05 |
| AX-04 | Amostrar Área, Dispersão e Cascata nas configurações suportadas por cada visualização | Eixos de dimensão recebem a regra aplicável; eixos numéricos preservam significado/formatação; fluxo sem erros | OK — usuário |
| AX-05 | Exibir como gráfico de linhas horizontais/RowChart; passar o mouse em cada categoria longa | TitleCase e truncamento; tooltip da aplicação imediato e acompanhando o mouse, com texto completo correto, inclusive com prefixos iguais | OK — usuário confirmou reteste após correção de fundo/contraste |
| AX-06 | Abrir BoxPlot com distribuição/categorias, usando dados compatíveis e categoria longa | Builder categórico aplica a regra e tooltip completo; tooltip da distribuição e ações preservados. Registrar impedimento se a fixture não suportar BoxPlot | OK — usuário |
| AX-07 | Usar eixo temporal ou dimensão numérica com unidades, percentuais ou moeda; comparar rótulo e tooltip | Datas e unidades mantêm formatação/capitalização; quando abreviado, tooltip preserva o texto completo. Eixo métrico não muda | OK — usuário confirmou validação temporal e numérica com moeda após configurar a coluna |
| AX-08 | Adicionar dois gráficos com categorias/prefixos iguais a um dashboard; redimensionar e alternar tema claro/escuro | Sem mistura de textos entre gráficos; tooltip legível e completo, layout sem cortes indevidos; RowChart respeita espaço disponível | OK — usuário |
| AX-09 | Testar tooltip de dados, clique/drill, seleção/zoom quando disponíveis e Visualizer | Dados/interações oficiais preservados; rótulo abreviado não substitui o valor usado na consulta; regra visual também no Visualizer | OK — usuário |
| AX-10 | Conferir exportações e static-viz aplicáveis ao ambiente, além do build de produção posterior | Dados exportados permanecem originais; rótulos estáticos coerentes. PNG não exige hover; SVG de RowChart pode conter title completo | PARCIAL — PDF de Área e RowChart (static-viz), PNG de Área e CSV/JSON validados; assinaturas e build de produção pendentes |

Ao retornar, informar ID, visualização, tema, pergunta/dashboard/Visualizer e resultado. Não aprovar uma família de gráficos pela evidência de outra; cenários sem fixture ficam pendentes com motivo.

**Retorno visual — 12/11/2026:** o teste inicial em Tabela não se aplica ao truncamento de eixos; após selecionar Barras, AX-01/02 foram aprovados. O gráfico horizontal corresponde ao RowChart de AX-05, não ao BoxPlot de AX-06. No PDF enviado, o card Área mantém o corte dos rótulos; PDF estático não oferece tooltip de hover. O usuário esclareceu posteriormente que o erro do card NU-16 era um teste próprio; desconsiderar como pendência ou regressão desta etapa.

**Decisão do usuário — 12/11/2026 (AX-05):** uniformizar o tooltip do RowChart com os demais gráficos: exibir sem atraso intencional e acompanhar o mouse. O comportamento nativo anterior passou despercebido nos smokes da issue original; não é uma preferência de produto a preservar. Aplicado tooltip flutuante da aplicação no renderer interativo, mantendo viz-core independente de overlays e título SVG no fallback estático. AX-05 requer reteste em pergunta/dashboard, temas claro/escuro e categorias com prefixos iguais.

**Complemento AX-07:** partes temporal e moeda aprovadas pelo usuário após a orientação de configuração. Para formatar dimensão numérica, abrir engrenagem → Dados → três pontos ao lado de `faixa` → Estilo → Moeda; selecionar moeda/casas decimais conforme as opções disponíveis. A aba Eixos configura escala/título, não o estilo numérico da coluna. Aceite posterior do usuário confirma a configuração e a validação; as capturas anteriores sem moeda não eram a evidência final.

**Pendências específicas AX-10:** CSV/JSON e PNG validados nas evidências posteriores; static-viz/assinaturas e build de produção continuam para fechamento técnico. PDF do card Área em dashboard escuro já validado para o corte dos rótulos; não exige hover nem comprova os demais formatos ou o build.

**Retorno e correção de estilos — 12/11/2026:** AX-07 confirmado como validado corretamente. AX-10: JSON enviado preserva categorias completas e números como strings formatadas ("10", "20", etc.); CSV preserva as mesmas categorias e valores (a abertura em uma coluna no Excel corresponde ao delimitador da importação); PNG de Área preserva corte dos rótulos e layout legível. NU-16 no PDF era teste do usuário e deve ser ignorado. AX-05: acompanhamento do mouse confirmado, mas tooltip sem fundo/contraste. Tooltip.Floating usa configuração de tema separada de Tooltip e não herdou os overrides padrão; foram aplicados explicitamente tokens de fundo/texto, sombra, raio e tipografia da aplicação. Reteste visual de contraste ainda pendente.

**Aceite AX-05 — 12/11/2026:** usuário confirmou OK após a correção dos estilos do tooltip flutuante. AX-08/09 seguem pendentes. Build de produção fica como etapa final do transporte, sem aprovação antecipada e incluindo checagem de tipos pendente por recursos. Ao revisar o fluxo local, confirmado que `metabase.channel.render.pdf` usa static-viz para renderizar os gráficos do dashboard: PDF de Área já fornece evidência desse fluxo, mas não comprova build atualizado de todos os componentes. Complemento visual sugerido: exportar também RowChart horizontal no PDF e conferir corte/layout, sem exigir hover em imagem estática; assinatura por e-mail permanece cenário separado quando houver ambiente configurado.

**Aceite AX-08/09 e complemento AX-10 — 12/11/2026:** usuário confirmou AX-08 e AX-09 como OK após o roteiro detalhado. A captura do PDF mostra RowChart horizontal e Área com categorias abreviadas, títulos/legenda legíveis e barras/séries coerentes com a consulta (valor: 10/20/30; outra: 20/10/15), sem erro nesses cards. Complemento visual do fluxo static-viz aprovado nesse escopo. Assinaturas por e-mail não executadas; build de produção e checagem de tipos da revisão permanecem para fechamento técnico final.
