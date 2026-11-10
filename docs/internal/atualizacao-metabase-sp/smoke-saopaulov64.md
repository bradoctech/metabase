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
| Filtros cascata e nulls | Transporte e smoke pendentes |
| Eixos/tooltip e paletas nos charts/Visualizer | Transporte e smoke pendentes |
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
