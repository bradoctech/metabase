# Checklist do QA — homologação saopaulov64

**Edição:** 17/11/2026 · **Responsável:** Tiago Alves (QA).  
**Ambiente:** https://dev.saturno.aisolutions.tec.br/dashboards/  
**Versão PDF:** [checklist-qa-homologacao-saopaulov64.pdf](./checklist-qa-homologacao-saopaulov64.pdf).

Roteiro operacional para uma nova rodada de testes no ambiente publicado, baseado no smoke da saopaulov64. Cada caso começa **PENDENTE**. Os aceites locais são referência para o resultado esperado; preencher este documento com a evidência obtida em homologação. A elaboração deste roteiro não executou testes na aplicação.

### Identificação da rodada

| Campo | Informação |
| --- | --- |
| URL e prefixo | https://dev.saturno.aisolutions.tec.br/dashboards/ · `/dashboards/` |
| Último commit do ambiente informado pela equipe | `51d8b023495b9d0d22359d8003ce29d2fffab648` (`51d8b02`) |
| Data/mensagem do commit | 15/11/2026, 15:55 GMT-4 · docs(saopaulov64): registrar rebuild OSS com AUD-011 e restauração do ambiente dev |
| Versão/hash do pacote em execução | A confirmar com a equipe de implantação |
| Referência do JAR local reconstruído | `v0.64.1-SNAPSHOT (9c0573d)`, de 15/11/2026, com AUD-011; não comprova o pacote publicado |
| QA | Tiago Alves |
| Data de início/fim da execução | A confirmar / a confirmar |
| Banco de dados consultado, driver e versão | A confirmar por fonte de dados |
| Contas/perfis, navegador/versão, sistema e resolução | A confirmar antes da execução |
| SMTP / LDAP / CSV / transformações SQL / Python | A confirmar individualmente |
| Abono de Permanência / Detalhamentos por Situação | Aplicabilidade a confirmar |

O commit informado documenta um rebuild. Ele pode ser diferente do hash incorporado ao JAR; registrar ambos sem concluir que essa diferença, isoladamente, é erro de publicação. A equipe deve confirmar a correspondência entre código, pacote e deploy.

### Como preencher e avaliar

- Marcar a caixa de um passo apenas depois de executá-lo. Ao terminar o caso, registrar **OK**, **FAIL**, **PENDENTE** ou **NÃO APLICÁVEL**.
- **OK:** todos os passos e resultados aplicáveis do caso foram conferidos. Se só parte foi executada, registrar o caso como PENDENTE e discriminar os subcenários já verificados.
- **FAIL:** resultado observado diverge do esperado em cenário com pré-requisitos atendidos. Abrir defeito com passos, esperado, observado e evidência; após correção, registrar reteste e versão.
- **PENDENTE:** falta conta, dado, permissão prevista, integração, definição do indicador ou execução. Registrar a dependência, quem deve fornecê-la e data prevista. Tela/recurso ausente não equivale a aprovação.
- **NÃO APLICÁVEL:** escopo excluído de forma confirmada, com motivo e responsável pelo aceite. Não usar para disfarçar dependência ainda não disponibilizada.
- Nome sugerido da evidência: `L04_FC-05_admin_claro_2026-11-17_01.png`. Para vídeos, incluir o mesmo prefixo. Remover senhas, tokens, cookies e dados pessoais desnecessários.
- Rodar com conta de teste e salvar somente em coleção/destino de QA. Alterações em autenticação, permissões, dados ou integrações compartilhadas exigem coordenação com seus responsáveis. As consultas SQL de apoio são de leitura.
- O QA testa o pacote publicado pelo navegador. Compilação, migrações, reinícios, deploy e investigação de logs do servidor cabem à equipe técnica; solicitar evidência quando necessária.

### Vocabulário e navegação

**Pergunta:** consulta salva que pode ser exibida como tabela ou gráfico. **Dashboard/painel:** conjunto de cards. **Card/dashcard:** bloco do dashboard. **Query Builder (QB):** editor visual acessado por **+ Novo → Pergunta**. **Consulta SQL:** editor de texto, quando permitido. **Visualizer:** editor visual próprio de um card do dashboard. **Raio-X/Xray:** exploração automática de tabelas. **Schema:** agrupamento de tabelas do banco. **Metadata:** tipos, relacionamentos e configuração dos campos. **SMTP:** envio de e-mail; **LDAP:** autenticação de usuários.

Os nomes de alguns controles podem variar conforme idioma, tipo de pergunta e permissões. Use o caminho de menu e a função descritos. Se a opção não aparecer, registrar perfil, URL e captura e conferir os pré-requisitos antes de concluir falha.

Para abrir uma rota direta citada neste roteiro, conservar o prefixo. Exemplo: a rota `/admin/settings/general` corresponde a `https://dev.saturno.aisolutions.tec.br/dashboards/admin/settings/general`. Não acrescentar `/dashboards/` duas vezes.

**DevTools (ferramentas do navegador):** abrir com F12 ou Ctrl+Shift+I; no macOS, usar o menu de ferramentas do navegador. Em **Network/Rede**, selecionar **Fetch/XHR**, limpar a lista e executar novamente o passo. Abrir a requisição para ver **Payload** (envio), **Preview/Response** (resposta) e status HTTP. Em **Console**, registrar erros novos relacionados ao fluxo. Nunca compartilhar exportação completa da sessão/HAR sem remover credenciais e dados sensíveis.

Para consultar a resposta de uma pergunta, localizar a requisição de consulta na rede (por exemplo, uma rota contendo `query`). Conferir `data.rows` e `data.cols` quando presentes: `rows` contém os resultados e `cols` descreve os tipos. CSV/JSON baixados são exportações formatadas e não substituem a resposta original da API.

### Ordem dos lotes

| Lote | Conteúdo | IDs / foco |
| --- | --- | --- |
| 00 | Preparar acesso, contas e material | PRE-01 a PRE-03, HOM-01 |
| 01 | Login, marca e contraste administrativo | HOM-02, AUD-011 |
| 02 | Home, dashboards e subdiretório | HD-01 a HD-12 |
| 03 | Tabelas e congelamento de colunas | DG-01 a DG-08 |
| 04 | Filtros em cascata do editor visual | FC-01 a FC-08; priorizar FC-05 a FC-08 |
| 05 | Nulos, zeros, ausência e KPIs | NU-01 a NU-18; priorizar NU-16 a NU-18 |
| 06 | Eixos, tooltips e exportações | AX-01 a AX-10 |
| 07 | Cores e Visualizer | PA-01 a PA-10 |
| 08 | Traduções e formulários | TS-01 a TS-05 |
| 09 | Administração e política SP | TS-06 a TS-10 |
| 10 | Aplicação e recursos dependentes de dados | TS-11 a TS-15 |
| 11 | Data Studio e perfis | TS-16 a TS-20 |
| 12 | Monitor e perfis | TS-21 a TS-25 |
| 13 | Integrações reais e conteúdo | INT-01, INT-02, HOM-03, HOM-04 |
| 14 | Consolidar e encaminhar resultados | ENC-01 |

Executar 00 e 01 primeiro. Os lotes seguintes podem avançar independentemente quando houver dados/contas. Dado ou integração ausente deve bloquear somente os casos dependentes. Os IDs PRE/INT/ENC são auxiliares deste checklist; HOM/HD/DG/FC/NU/AX/PA/TS e AUD-011 preservam a referência dos documentos de origem.

### Material a solicitar à equipe

| Material | Finalidade | Estado inicial |
| --- | --- | --- |
| Conta administradora de teste | Administração e criação de objetos em QA | A confirmar |
| Conta comum sem privilégios extras | Consulta e negativas de acesso | A confirmar |
| Conta analista e perfil não admin com monitoramento | TS-20 e TS-24, separadamente | A confirmar |
| Coleção de QA gravável e objeto restrito de referência | Salvar testes e conferir permissões | A confirmar |
| Tabela com diversas colunas/linhas e campos correlacionados A/B/C | Datagrid e cascata | A confirmar |
| Banco não Sample com dois schemas elegíveis e X-rays ativos | HD-05 | A confirmar |
| Perguntas de nulos tipadas, séries temporais, BoxPlot e mapa | NU, AX e PA; apoio no Anexo A | A confirmar |
| Indicadores reais, definição e responsável de produto | NU-17/18 | A confirmar |
| Destinatários de teste SMTP e conta/grupo LDAP | Integrações reais | A confirmar |
| Banco/destino de upload e transformação isolados | TS-13/15 | A confirmar |

**Limites de escopo:** ilustrações genéricas permanecem coloridas. A assinatura futura **Dashboards SP + brasão** em incorporação e exportações é tarefa separada; não exigir sua presença nesta rodada. A regra SP de apresentação oculta ofertas comerciais sem conceder licença ou permissões. Não exigir tradução de nomes técnicos nem de toda a ajuda Markdown de todos os drivers. Não excluir/restaurar conteúdo real para testar a Lixeira: o smoke de origem comprovou a presença do item, sem cobrir seu ciclo completo.

## Lote 00 — Preparação e acesso

Separar uma sessão normal para administrador e uma janela anônima para usuário comum. Se não conseguir abrir a aplicação, registrar o impedimento antes de testar os demais lotes.

### PRE-01 — Registrar o ambiente e as contas

**Preparação:** Receber da equipe os acessos de teste e a identificação do pacote.

1. [ ] Abrir a URL de homologação e confirmar que o endereço começa com https://dev.saturno.aisolutions.tec.br/dashboards/.
2. [ ] Preencher a identificação da rodada: data/hora, navegador/versão, sistema, resolução e nome do perfil de teste, sem anotar senha.
3. [ ] Solicitar versão/hash do pacote à equipe ou consultá-los na tela Sobre, se disponível; registrar a origem da informação.
4. [ ] Anotar quais bancos/fontes e quais integrações estão disponíveis. Manter cada informação desconhecida como a confirmar.

**Resultado esperado:** Rodada identificada de forma reproduzível; commit documental e pacote executado registrados separadamente.

**Evidência mínima:** Ficha da rodada preenchida e captura da identificação de versão, quando disponível.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PRE-02 — Preparar coleção, perguntas e dashboard de QA

**Preparação:** Administrador com permissão de criação em espaço de teste.

1. [ ] Na área de coleções, localizar a coleção dedicada ao QA ou criar uma coleção de teste conforme a organização da equipe.
2. [ ] Usar o prefixo QA-HOM em nomes novos. Preparar uma pergunta em tabela, uma agregada e as consultas sintéticas do Anexo A, quando o driver permitir.
3. [ ] Salvar um dashboard QA-HOM com tabela, Número e pelo menos dois gráficos. Anotar suas URLs/IDs e permitir acesso de consulta para a conta comum prevista.
4. [ ] Solicitar que a equipe confirme um objeto que essa conta comum não pode acessar; registrar somente seu identificador autorizado para o teste negativo.

**Resultado esperado:** Objetos de teste localizáveis, salváveis e acessíveis apenas aos perfis previstos. Falta de permissão para criá-los deve ser resolvida pela equipe.

**Evidência mínima:** URLs da coleção, perguntas e dashboard de QA; matriz simples de perfis e acessos.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PRE-03 — Preparar evidências, temas e tamanhos de tela

**Preparação:** Aplicação aberta e pasta de evidências da rodada criada.

1. [ ] Abrir DevTools → Network e Console e localizar uma consulta de teste bem-sucedida para reconhecer o fluxo.
2. [ ] Identificar com a equipe o controle de tema disponível nesta distribuição. Registrar como alternar claro/escuro; se um modo não estiver acessível, registrar o subcenário pendente.
3. [ ] Registrar a largura desktop utilizada e uma largura estreita, por exemplo 390 px no modo responsivo do navegador. Usar zoom de 100% para comparar medidas visuais.
4. [ ] Tirar uma captura inicial de referência e definir onde serão anexadas as evidências e os defeitos da rodada.

**Resultado esperado:** Condições de reprodução e forma de coleta conhecidas; testar aparência em telas realmente diferentes e registrar cada tema.

**Evidência mínima:** Captura inicial, resoluções e procedimento usado para alternar o tema.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HOM-01 — Inicialização, HTTPS e consultas reais

**Preparação:** Pacote implantado; conta admin e comum; pergunta e dashboard que consultem a fonte real.

1. [ ] Abrir a URL informada em uma nova sessão. Conferir se o HTTPS abre sem aviso de certificado e se a página termina de carregar.
2. [ ] Entrar como administrador. Abrir uma pergunta e um dashboard ligados ao banco real; executar/atualizar a consulta e conferir o resultado.
3. [ ] Repetir com usuário comum que tenha acesso a esses objetos. Conferir que a consulta autorizada funciona sem conceder privilégios adicionais.
4. [ ] Registrar versão/commit observado. Solicitar à implantação confirmação de inicialização completa e ausência de erro de migração/conexão nos logs.
5. [ ] Conferir Network e Console para erros relacionados ao fluxo. Se falhar, anotar horário, URL, status HTTP e objeto afetado.

**Resultado esperado:** Aplicação, login, APIs e consultas reais funcionam; pacote identificado e permissões preservadas.

**Evidência mínima:** Tela/versão, resultado de consulta por perfil e confirmação técnica dos logs.

**Atenção:** Uma consulta automatizada anterior, em 17/11/2026, recebeu erro de certificado incompatível com o hostname. Confirmar se ocorre na rede/navegador da equipe; registrar a ocorrência sem presumir sua causa. Não considerar inicialização aprovada só porque o login abriu.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 01 — Marca, login e contraste

Usar uma sessão desconectada e depois administrador. Repetir os estados indicados nos temas disponíveis e na largura estreita.

### HOM-02 — Identidade SP na entrada e na aplicação

**Preparação:** Conta válida; tema e resolução registrados.

1. [ ] Sair da conta ou abrir janela anônima. Conferir layout de login SP, identificação Dashboards SP e brasão, com textos e campos legíveis.
2. [ ] Conferir botão Entrar preto e passar o mouse sobre Esqueci minha senha: o destaque esperado é vermelho SP. Não concluir recuperação de senha.
3. [ ] Entrar. Conferir brasão na barra superior, botão + Novo preto com texto legível e ausência de logo-gov ao lado do título dos dashboards.
4. [ ] Repetir com janela estreita e nos temas claro/escuro onde disponíveis, conferindo cortes, sobreposições e carregamento das fontes/imagens.
5. [ ] Conferir que as ilustrações genéricas continuam coloridas e que navegação e botões ainda respondem.

**Resultado esperado:** Marca SP preservada, controles legíveis e assets carregados; ausência de cortes que impeçam uso.

**Evidência mínima:** Login e aplicação em desktop/estreito, discriminados por tema.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AUD-011 — Contraste da navegação administrativa

**Preparação:** Administrador na rota /admin/settings/general.

1. [ ] Abrir Administração → Configurações → Geral. Conferir o item selecionado na navegação superior.
2. [ ] Passar o mouse sobre o item selecionado: texto deve permanecer preto sobre fundo branco.
3. [ ] Passar o mouse sobre um item inativo: texto preto sobre branco. Retirar o mouse: inativo volta ao texto branco sobre a barra escura.
4. [ ] Clicar em outra seção e repetir os estados. Navegar com Tab/Shift+Tab e Enter; conferir foco visível e destino correto.
5. [ ] Repetir no tema escuro. Se necessário, inspecionar estilo computado: estados selecionado/hover devem usar rgb(0, 0, 0) sobre rgb(255, 255, 255).

**Resultado esperado:** Contraste e navegação preservados em todos os estados; modo escuro não inverte indevidamente seleção/hover.

**Evidência mínima:** Capturas de selecionado, hover e inativo em claro/escuro; foco por teclado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 02 — Home e dashboard

Reutilizar os objetos de PRE-02. Home pode exibir uma seção de conteúdo por vez. Não apagar histórico nem alterar permissões compartilhadas para forçar um estado; solicitar conta adequada à equipe.

### HD-01 — Saudação da home

**Preparação:** Conta com saudação habilitada e home padrão.

1. [ ] Entrar e abrir a página inicial pelo item de navegação da aplicação.
2. [ ] Localizar a saudação e conferir o nome do usuário destacado.
3. [ ] Conferir ausência do logo do Metabot junto à saudação e espaçamento legível.
4. [ ] Recarregar a página e conferir se a saudação e os demais elementos continuam estáveis, sem erro novo no Console.

**Resultado esperado:** Saudação SP legível, nome correto e ausência do logo Metabot.

**Evidência mínima:** Captura da saudação e perfil utilizado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-02 — Cards de itens recentes

**Preparação:** Conta com pergunta/dashboard acessíveis e histórico recente elegível.

1. [ ] Abrir uma pergunta salva e um dashboard de QA para gerar atividade e retornar à home.
2. [ ] Localizar Continue de onde parou ou a seção de recentes. Se Popular tiver prioridade, solicitar outra conta elegível para Recent.
3. [ ] Conferir cards altos SP, ícone, título e badge do banco/dashboard/coleção; em desktop, referência visual de 215 × 315 px.
4. [ ] Clicar em dois cards de tipos diferentes e conferir se cada um abre o objeto indicado; voltar à home entre eles.

**Resultado esperado:** Cards e badges coerentes com seus objetos, links corretos e ausência de layout vazio.

**Evidência mínima:** Home Recent e destinos de dois cards.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-03 — Cards populares

**Preparação:** Conta comum não instaladora, primeiro login há menos de uma semana, acesso a pergunta e dashboard e itens populares elegíveis.

1. [ ] Entrar com a conta preparada em janela separada e abrir uma pergunta e um dashboard criados manualmente e compartilhados para teste.
2. [ ] Voltar à home e localizar a seção Popular; conferir o mesmo padrão de cards altos e badges da seção Recent.
3. [ ] Clicar em um card e conferir abertura do objeto correto; retornar e conferir outro tipo de item.
4. [ ] Se Popular não aparecer, solicitar apoio para conferir GET /api/user/current (is_installer false, has_question_and_dashboard true, first_login recente) e /api/activity/popular_items não vazio.

**Resultado esperado:** Popular apresenta cards SP navegáveis quando suas condições forem atendidas.

**Evidência mínima:** Captura da seção e clique; se impedido, registrar qual condição faltou.

**Atenção:** A simples ausência de Popular em uma conta sem atividade elegível não comprova regressão.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-04 — Cards de exploração Raio-X

**Preparação:** X-rays habilitados, banco sincronizado e conta cujo has_question_and_dashboard seja false, conforme preparação da equipe.

1. [ ] Entrar com a conta adequada e abrir a home padrão; conferir que a seção Raio-X permanece visível.
2. [ ] Conferir cards altos, badge com nome da tabela, texto da exploração e ícone de raio vermelho SP.
3. [ ] Clicar no próprio card de uma tabela e aguardar a exploração/dashboard automático abrir.
4. [ ] Conferir título e dados da tabela esperada, depois voltar à home e repetir com outro card disponível.

**Resultado esperado:** Exploração abre a partir do card da home; aparência e destino corretos.

**Evidência mínima:** Captura da home e da exploração aberta pelo clique.

**Atenção:** Abrir diretamente uma URL de exploração não substitui testar o clique. A equipe deve preparar o perfil; não retirar permissões de usuários reais para forçar Xray.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-05 — Trocar schema nas sugestões Raio-X

**Preparação:** Banco não Sample com pelo menos dois schemas com sugestões elegíveis; home em Xray.

1. [ ] Localizar acima dos cards o nome clicável do schema, acompanhado de seta. Não confundir com filtro de dashboard.
2. [ ] Abrir o seletor, anotar o schema atual e escolher outro schema elegível.
3. [ ] Conferir atualização do nome e dos cards de tabelas, sem travamento ou erro no Console.
4. [ ] Reabrir o seletor e retornar ao schema inicial; conferir que os cards correspondentes voltam.

**Resultado esperado:** Nome e sugestões acompanham a seleção enquanto a seção está montada. Não exigir persistência após recarregar.

**Evidência mínima:** Antes/depois com nomes dos schemas e tabelas, omitindo dados desnecessários.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-06 — Ausência do card Metabase dicas

**Preparação:** Ter conseguido acessar Recent, Popular e Xray com as contas adequadas.

1. [ ] Na seção Recent, percorrer os cards e procurar card de dicas/ajuda com link metabase.com/learn.
2. [ ] Repetir na seção Popular e na seção Xray, registrando separadamente as seções alcançadas.
3. [ ] Conferir que não ficou um card/bloco vazio no lugar das dicas.
4. [ ] Clicar em um card de conteúdo de cada seção exercitada para conferir que a remoção não afetou a navegação.

**Resultado esperado:** No perfil SP, o card Metabase dicas não aparece em nenhuma das três seções; conteúdo permanece navegável.

**Evidência mínima:** Uma captura por seção. Se alguma seção não foi alcançada, registrar cobertura parcial.

**Atenção:** A orientação antiga da checklist canônica sobre ajuda presente foi substituída pela decisão SP de ocultar esse card.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-07 — Home em janela estreita e temas

**Preparação:** Recent/Popular/Xray conforme disponíveis; controle de tema identificado em PRE-03.

1. [ ] Abrir a home em desktop e registrar tema e largura.
2. [ ] Reduzir a largura para a referência estreita e observar quebra dos cards em linhas.
3. [ ] Conferir títulos, badges e controles sem sobreposição ou cortes que impeçam identificar/abrir os itens.
4. [ ] Alternar claro/escuro, repetir a inspeção e clicar em um card; conferir que ilustrações genéricas seguem coloridas.

**Resultado esperado:** Layout responsivo e textos/controles legíveis em cada combinação exercitada.

**Evidência mínima:** Capturas com tema e largura registrados.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-08 — Estilo dos cards do dashboard

**Preparação:** Dashboard de QA com tabela, Número e mais de um gráfico.

1. [ ] Abrir o dashboard fora do modo de edição e conferir contornos dos cards.
2. [ ] Conferir cantos arredondados de referência 8 px, sombra SP e ausência de borda extra nos cards com fundo.
3. [ ] Conferir legenda de referência peso 600, espaçamento compacto e títulos legíveis.
4. [ ] Entrar em edição, reduzir e aumentar o tamanho de um card de teste; salvar e conferir que gráficos, eixos e legenda não ficam cortados.

**Resultado esperado:** Estilo SP preservado e conteúdo utilizável em diferentes tamanhos.

**Evidência mínima:** Dashboard e detalhe de card; estilo computado do raio se houver dúvida.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-09 — Menus, teclado, edição e descrição

**Preparação:** Dashboard editável com card de gráfico e Número com descrição, se disponível.

1. [ ] Fora da edição, passar o mouse no card, abrir o menu de reticências e fechar com Esc.
2. [ ] Usar Tab/Shift+Tab até seus controles; conferir foco visível, abrir com Enter/Espaço e fechar com Esc.
3. [ ] Entrar em Editar dashboard, conferir controles de mover/redimensionar/visualização e abrir uma opção sem remover o card.
4. [ ] No Número com descrição, passar o mouse e conferir a descrição no tamanho que a oferece; registrar esse subcenário separadamente.
5. [ ] Cancelar alterações não desejadas e confirmar retorno normal à leitura.

**Resultado esperado:** Menus e ações acessíveis por mouse e teclado, edição funcional e descrição disponível no cenário compatível.

**Evidência mínima:** Captura/vídeo dos controles, foco e descrição; informar caso sem fixture de descrição.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-10 — Cards sem fundo: texto, ação e incorporação

**Preparação:** Dashboard de teste; ação e incorporação somente se já disponíveis no ambiente.

1. [ ] Editar o dashboard, adicionar um card de texto QA-HOM e sair da edição do texto.
2. [ ] Abrir opções visuais do card, localizar Mostrar fundo e desligar; conferir transparência sem sombra/borda residual.
3. [ ] Ligar novamente para comparar e desligar outra vez; salvar e conferir que menus e edição continuam acessíveis.
4. [ ] Alterar um filtro conectado a uma pergunta do dashboard e conferir atualização dos dados.
5. [ ] Quando houver card de ação, conferir controles sem executar escrita em dados reais; em prévia incorporada disponível, conferir o mesmo card sem fundo. Registrar texto, ação e incorporação individualmente.

**Resultado esperado:** Fundo/sombra acompanham a opção; controles e filtros continuam funcionais em cada tipo exercitado.

**Evidência mínima:** Comparação ligado/desligado e registro por texto/ação/incorporação.

**Atenção:** Aprovar texto não aprova ação ou incorporação. Ausência desses recursos mantém os respectivos trechos pendentes até definição de escopo.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-11 — Brasão e cabeçalhos dos dashboards

**Preparação:** Dashboard salvo e exploração automática de HD-04.

1. [ ] Abrir o dashboard salvo e observar o cabeçalho junto ao título.
2. [ ] Conferir que o logo-gov adicional está oculto e que o brasão continua na barra de navegação.
3. [ ] Abrir a exploração Xray pelo card da home e repetir a inspeção.
4. [ ] Repetir em largura estreita e conferir que título e controles não se sobrepõem.

**Resultado esperado:** Logo-gov oculto nos dois cabeçalhos, brasão da navegação preservado e layout legível.

**Evidência mínima:** Capturas do dashboard salvo e automático.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HD-12 — Publicação sob /dashboards/

**Preparação:** Acesso à URL de homologação; DevTools → Network aberto.

1. [ ] Abrir a URL base e realizar login; conferir que os redirecionamentos conservam o prefixo /dashboards/.
2. [ ] Navegar para home, pergunta, dashboard e Xray quando disponível; copiar uma rota interna e abri-la em nova aba.
3. [ ] Recarregar diretamente a rota interna e conferir se a aplicação abre sem 404 ou perda de sessão indevida.
4. [ ] Na rede, conferir brasão, fontes, imagens e chamadas de API; procurar erro 404 e caminhos com prefixo perdido ou duplicado.
5. [ ] Sair e entrar novamente e conferir retorno à aplicação pelo caminho correto.

**Resultado esperado:** Navegação, recarga, autenticação e recursos funcionam sob o prefixo publicado.

**Evidência mínima:** URLs e requisições relevantes, com status; capturas de eventual erro.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 03 — Datagrid: tabela, congelamento e interação

Usar pergunta em Tabela com muitas colunas e linhas. Para rolagem horizontal, a soma das larguras deve superar a área disponível. Os controles de congelamento ficam à direita do cabeçalho e aparecem no hover/foco. O congelamento é local à sessão do componente; não exigir persistência após reabrir a pergunta.

### DG-01 — Congelar até uma coluna

**Preparação:** Tabela larga, sem congelamento prévio.

1. [ ] Passar o mouse sobre o cabeçalho da segunda ou terceira coluna até aparecer Congelar até esta coluna.
2. [ ] Clicar no controle de congelamento, evitando o menu de ordenação.
3. [ ] Rolar horizontalmente e conferir que a coluna alvo e as anteriores ficam à esquerda.
4. [ ] Conferir que as demais colunas se movem e que o clique no pin não abriu ordenação nem alterou a consulta.

**Resultado esperado:** Congelamento acompanha a posição solicitada dentro do limite de largura; demais colunas rolam.

**Evidência mínima:** Vídeo curto de congelamento e rolagem.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### DG-02 — Descongelar colunas

**Preparação:** Tabela com colunas congeladas por DG-01.

1. [ ] Passar o mouse/focar um cabeçalho fixado e localizar Descongelar colunas.
2. [ ] Acionar o controle e rolar horizontalmente.
3. [ ] Conferir que todas as colunas de dados voltam a rolar; índices/seleção auxiliares seguem o comportamento original.
4. [ ] Congelar e descongelar novamente para verificar que o controle continua disponível.

**Resultado esperado:** Pin removido sem perda de colunas, dados ou controles.

**Evidência mínima:** Antes/depois ou vídeo de rolagem.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### DG-03 — Hover de linha sem clique

**Preparação:** Tabela com parte fixa e parte rolável.

1. [ ] Posicionar o mouse em uma linha sem clicar.
2. [ ] Mover da parte fixa para a parte rolável na mesma linha.
3. [ ] Mover para outra linha e depois retirar o mouse da tabela.
4. [ ] Conferir que o destaque acompanha a linha e some ao sair, sem abrir menu nem deixar seleção persistente.

**Resultado esperado:** Toda a linha recebe hover neutro e transitório, incluindo a parte congelada.

**Evidência mínima:** Vídeo mostrando cruzamento e saída.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### DG-04 — Seleção persistente por clique

**Preparação:** Tabela com colunas congeladas e menus de célula disponíveis.

1. [ ] Clicar em uma célula e observar a marcação da linha e as ações oferecidas.
2. [ ] Fechar o menu, quando aberto, e clicar na mesma linha do lado rolável.
3. [ ] Clicar em outra linha e conferir alternância/mudança da marcação.
4. [ ] Conferir que menu e ações de célula continuam utilizáveis e que a marcação por clique se distingue do hover.

**Resultado esperado:** Marcação persistente alterna/muda conforme interação, sem quebrar ações de célula.

**Evidência mínima:** Vídeo ou capturas de duas linhas e menu.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### DG-05 — Congelamento e hover em Ver registros

**Preparação:** Pergunta agregada com contagem/soma e dimensões que ofereçam detalhamento.

1. [ ] Abrir a pergunta agregada e clicar em um resultado elegível.
2. [ ] Escolher Ver registros ou ação equivalente e aguardar a tabela detalhada abrir.
3. [ ] Congelar até a segunda coluna, rolar e conferir o comportamento de DG-01.
4. [ ] Passar o mouse por uma linha cruzando as duas áreas e depois descongelar; conferir ações da tabela.

**Resultado esperado:** Pin e hover também funcionam na tabela de detalhamento; não basta a tabela principal estar correta.

**Evidência mínima:** Resultado agregado, ação escolhida e vídeo na tabela aberta.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### DG-06 — Reordenar, redimensionar e copiar

**Preparação:** Tabela com várias colunas; começar em largura desktop.

1. [ ] Arrastar uma coluna para outra posição e congelar até a nova posição mostrada.
2. [ ] Rolar e conferir que o pin segue a ordem visível.
3. [ ] Redimensionar uma coluna e selecionar/copiar células para um editor de texto; conferir o conteúdo copiado.
4. [ ] Reduzir a largura da janela e observar quantas colunas continuam efetivamente fixadas.
5. [ ] Ampliar novamente e conferir que rolagem e descongelamento permanecem utilizáveis.

**Resultado esperado:** Reordenação, resize e cópia preservados. Em janela menor, a quantidade efetivamente congelada pode diminuir pelo limite de 90% da largura do grid.

**Evidência mínima:** Vídeo com largura grande/pequena e texto copiado.

**Atenção:** A redução de colunas fixadas por esse limite foi aceita no smoke; não classificá-la isoladamente como falha. O pedido de congelamento permanece na sessão.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### DG-07 — Tabela dentro de dashboard

**Preparação:** Dashboard de QA com card de tabela e várias páginas de resultados.

1. [ ] Abrir a tabela no dashboard e conferir footer/paginação e acesso aos botões.
2. [ ] Editar o dashboard, reduzir o card, salvar e conferir que o footer de referência 50 px não corta controles.
3. [ ] Testar rolagem e pin no espaço reduzido; conferir ausência de barra extra causada por padding.
4. [ ] Repetir nos temas claro/escuro e confirmar legibilidade de texto/ícones.

**Resultado esperado:** Footer e paginação utilizáveis, pin respeita o espaço e não há cortes indevidos.

**Evidência mínima:** Capturas desktop/pequeno e dos temas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### DG-08 — Acessibilidade do pin e toque

**Preparação:** Tabela consultável por teclado; dispositivo de toque se disponível.

1. [ ] Usar Tab até o controle de congelar no cabeçalho e conferir que ele aparece com foco visível.
2. [ ] Acionar com Enter e depois descongelar com Espaço, conferindo que não abre ordenação nem envia formulário.
3. [ ] Continuar a navegação e conferir que o recurso não habilita edição de dados.
4. [ ] Em dispositivo de toque disponível, repetir congelar/descongelar e rolar. Registrar teclado e toque separadamente.

**Resultado esperado:** Controles utilizáveis por teclado; toque avaliado quando houver dispositivo, sem misturar ausência de dispositivo com aprovação.

**Evidência mínima:** Vídeo de teclado e identificação do dispositivo de toque ou motivo da pendência.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 04 — Filtros em cascata do Query Builder

Abrir + Novo → Pergunta, escolher banco e tabela com campos correlacionados A/B/C. Exemplo: Estado/Cidade/Endereço; se não existirem, solicitar equivalentes. Confirmar quais valores coexistem nos dados. Este lote usa filtros irmãos no mesmo estágio do editor visual. Filtros vinculados do dashboard têm configuração própria. Abrir Network e filtrar por filtered-values; no ambiente publicado, conservar /dashboards/ no caminho da API.

### FC-01 — Lista sem filtro irmão

**Preparação:** Pergunta visual nova, sem filtros aplicados; campo com valores configurados.

1. [ ] Abrir Filtrar e escolher o campo B.
2. [ ] Abrir as opções e, se oferecida, realizar uma busca curta.
3. [ ] Conferir na rede o carregamento dos valores conforme configuração do campo.
4. [ ] Fechar sem aplicar e confirmar que não há erro nem POST de cascata desnecessário na ausência de restrições.

**Resultado esperado:** Fluxo oficial de valores/busca preservado sem filtro de contexto.

**Evidência mínima:** Lista e requisição de valores, com status.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### FC-02 — Restringir B por A

**Preparação:** Valores de A/B com correspondência conhecida.

1. [ ] Aplicar filtro A por igualdade com um valor existente.
2. [ ] Abrir o seletor de B e conferir valores compatíveis com A, usando os dados de referência.
3. [ ] Na rede, abrir POST /api/field/<id-de-B>/filtered-values e conferir status 200.
4. [ ] No payload, conferir constraints contendo field_id de A, op e value; na resposta, field_id de B, values e has_more_values.

**Resultado esperado:** Opções de B respeitam A e a requisição leva o contexto; não avaliar somente a tabela final.

**Evidência mínima:** Dropdown e trecho mínimo de payload/resposta, sem dados sensíveis.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### FC-03 — Trocar e remover o contexto

**Preparação:** Pergunta com A aplicado e filtro B ainda sem valor, para isolar o teste.

1. [ ] Abrir B, anotar exemplos de opções e fechar o seletor.
2. [ ] Trocar A por outro valor com conjunto de B conhecido e reabrir B.
3. [ ] Conferir atualização de constraints e das opções retornadas.
4. [ ] Remover A e abrir B novamente; conferir retorno ao fluxo sem restrição de filtros irmãos.

**Resultado esperado:** Opções atualizam sem reutilizar contexto anterior. Se B também estiver aplicado, ele pode restringir A na direção inversa.

**Evidência mínima:** Comparação de opções/payload antes, depois e sem A.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### FC-04 — Editar filtro e trocar sua coluna

**Preparação:** Pergunta com A e B aplicados.

1. [ ] Editar o filtro B existente e abrir as opções.
2. [ ] Conferir que o próprio B não foi incluído como restrição do alvo; A continua no contexto.
3. [ ] Usar Voltar no editor do filtro e selecionar C no lugar de B.
4. [ ] Abrir os valores de C e conferir na rede que B substituído não restringe C, enquanto A continua aplicável.

**Resultado esperado:** Filtro editado/substituído não restringe a si nem a nova coluna; demais irmãos preservados.

**Evidência mínima:** Payload nas duas edições e captura da troca de coluna.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### FC-05 — Dois filtros e múltiplos valores

**Preparação:** A/B/C elegíveis, seleção múltipla disponível e combinações com registros.

1. [ ] Aplicar A por igualdade, selecionando dois valores conhecidos quando o controle permitir.
2. [ ] Aplicar B com valor compatível e abrir as opções de C.
3. [ ] Na requisição filtered-values de C, conferir constraints separadas para A e B e o array de valores de A preservado.
4. [ ] Conferir status 200 e opções coerentes com a combinação; selecionar C e executar a pergunta.
5. [ ] Reabrir o filtro múltiplo e conferir que os valores escolhidos não foram perdidos.

**Resultado esperado:** Constraints e valores múltiplos preservados; sem erro 400/500; opções/dados coerentes.

**Evidência mínima:** Payload, resposta e resultado com a combinação utilizada.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### FC-06 — Busca com contexto

**Preparação:** Campo B configurado para busca de valores; A aplicado.

1. [ ] Abrir B e digitar trecho de um valor que exista no contexto de A.
2. [ ] Na rede, conferir POST de cascata com constraints de A, query digitada e limit quando enviado.
3. [ ] Conferir sugestões compatíveis e selecionar um resultado.
4. [ ] Reabrir B, limpar somente a busca digitada e conferir que o contexto de A permanece, sem erro ou opções antigas indevidas.

**Resultado esperado:** Buscar, selecionar e limpar preservam o filtro irmão e retornam sugestões corretas.

**Evidência mínima:** Sequência de busca e payload com query/constraints.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### FC-07 — Picker do drill na coluna

**Preparação:** Tabela resultante com A aplicado e ação Filtrar por esta coluna disponível para B.

1. [ ] Executar a pergunta e abrir o menu de célula/coluna de B.
2. [ ] Escolher Filtrar por esta coluna ou equivalente que abra seletor de valores.
3. [ ] Conferir opções e requisição com contexto de A.
4. [ ] Selecionar B, aplicar e executar; conferir o filtro criado e o resultado coerente.

**Resultado esperado:** Picker do drill também respeita cascata e mantém a pergunta funcional.

**Evidência mínima:** Menu escolhido, lista/payload e resultado final.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### FC-08 — Número, faixa e relacionamento reconhecido

**Preparação:** Campo numérico elegível; para segunda parte, FK reconhecida no metadata.

1. [ ] Aplicar A numérico por valor e abrir B; conferir constraints e resultado com os dados de referência.
2. [ ] Trocar A para faixa, se suportada, e repetir a inspeção, anotando limites e operador enviados.
3. [ ] Com auxílio da equipe, identificar campos ligados por FK reconhecida e repetir o cenário entre os campos relacionados.
4. [ ] Confrontar as opções com os registros reais e registrar separadamente valor, faixa e FK.

**Resultado esperado:** Restrições numéricas preservadas; relação consistente com o metadata. Sem FK, essa parte fica pendente.

**Evidência mínima:** Payload e dados de referência por subcenário.

**Atenção:** Data/hora, nulo/sem valor, coordenadas, expressões não suportadas, joins arbitrários, SQL nativo, modelos e estágios anteriores não têm equivalência garantida. Se a lista não diminuir porque todos os valores coexistem, isso não é falha por si só.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 05 — Nulos, zeros e indicadores reais

Usar consultas de leitura preparadas no Anexo A e conferir tipos na API. O banco real ainda é a confirmar: solicitar adaptação das fixtures antes de julgar sintaxe ou tipo. Os aceites locais distinguem null numérico, null textual/booleano, uma linha agregada e zero linhas. Copiar/exportar pode usar representação formatada diferente da tela; não reescrever expectativas com base em uma única visualização.

### NU-01 — Null numérico e textual em Tabela

**Preparação:** Fixture F-02, com tipos conhecidos e linha Controle.

1. [ ] Executar a fixture, selecionar Tabela e localizar a primeira linha de valor/rotulo.
2. [ ] Conferir valor numérico null mostrado como 0 e rotulo textual null vazio.
3. [ ] Conferir segunda linha com 12.5 e Controle, admitindo formatação decimal do locale.
4. [ ] Na API, conferir nulls na primeira linha e tipos das colunas; registrar diferença entre dado e apresentação.

**Resultado esperado:** Exemplo aceito: 0 visual no null numérico, texto vazio e controle preservado; API mantém null.

**Evidência mínima:** Tabela, rows e metadata das duas colunas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-02 — Cópia e ações da célula nula

**Preparação:** Tabela de NU-01.

1. [ ] Selecionar/copiar somente a célula numérica nula e colar em editor de texto.
2. [ ] Repetir com 12.5 e comparar os conteúdos copiados.
3. [ ] Abrir as ações da célula nula e conferir menus permitidos, sem erro e sem executar alteração de dados.
4. [ ] Registrar cabeçalhos, espaços e valores efetivamente copiados, distinguindo a cópia do 0 visual.

**Resultado esperado:** No exemplo local, cópia da célula nula continha apenas cabeçalho valor; preenchida continha cabeçalho e 12.5. Menus devem funcionar.

**Evidência mínima:** Texto colado e captura das ações; informar o modo de cópia utilizado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-03 — Uma linha numérica null em Número e dashboard

**Preparação:** Fixture F-03 tipada. Em SQLite, usar coluna numérica declarada via LEFT JOIN conforme Anexo A.

1. [ ] Executar consulta e confirmar na API uma linha com null numérico.
2. [ ] Selecionar Número e a métrica valor, conferindo exibição 0.
3. [ ] Salvar a pergunta de QA e adicioná-la ao dashboard sem transformação adicional.
4. [ ] Salvar e recarregar o dashboard; conferir 0 também no card e ausência de texto null/nulo.

**Resultado esperado:** Uma linha null do exemplo aceito aparece como 0 na pergunta e no dashboard.

**Evidência mínima:** Resposta original, Número e card após recarga.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-04 — Zero linhas em Número

**Preparação:** Variante sem linhas de F-03.

1. [ ] Executar a consulta com condição que não devolva nenhuma linha.
2. [ ] Conferir rows vazio na API, distinguindo de uma linha [null].
3. [ ] Selecionar Número e conferir Sem resultados.
4. [ ] Adicionar ao dashboard de QA ou substituir a consulta de teste e conferir que também não inventa um zero.

**Resultado esperado:** Zero linhas continua Sem resultados; não reaproveita valor anterior.

**Evidência mínima:** rows vazio e telas da pergunta/dashboard.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-05 — Tendência com ponto null

**Preparação:** Fixture temporal F-04, coluna de data reconhecida; selecionar Tendência, mes como data e valor como métrica.

1. [ ] Executar a variante em que o período intermediário tem null e o último período tem valor 100.
2. [ ] Conferir na API os três pontos reais e o null intermediário; observar valor atual, datas e comparação.
3. [ ] Trocar para a variante em que o último valor é null; reexecutar sem alterar a formatação.
4. [ ] Conferir valor atual 0 na data mais recente, com comparação -100% contra o período anterior 100.

**Resultado esperado:** Nos exemplos aceitos, null pode aparecer como 0 na Tendência sem alterar a API nem recuar a data. Comparação contra anterior null normalizado para 0 pode exibir +∞%, conforme NU-15.

**Evidência mínima:** API e Tendência em ambas as variantes, com datas visíveis.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-06 — Período ausente na Tendência

**Preparação:** F-04 com remoção completa da linha intermediária.

1. [ ] Executar a variante com apenas primeiro e último períodos.
2. [ ] Conferir na API que existem duas linhas, sem linha null para o período removido.
3. [ ] Conferir que Tendência compara os dois pontos existentes e usa suas datas reais.
4. [ ] Salvar e repetir no dashboard, verificando que não foi criado um zero para o período ausente.

**Resultado esperado:** Comparação usa os pontos reais; ausência de linha não vira período inventado.

**Evidência mínima:** API com duas linhas e comparação na pergunta/dashboard.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-07 — Zero explícito

**Preparação:** Consulta SELECT 0 AS valor, adaptada pelo responsável se o driver exigir.

1. [ ] Executar a consulta e confirmar uma linha com zero na API.
2. [ ] Selecionar Número e conferir 0.
3. [ ] Salvar no dashboard e conferir o card.
4. [ ] Recarregar pergunta e dashboard e verificar que zero não vira Sem resultados.

**Resultado esperado:** Zero numérico explícito preservado em ambas as telas.

**Evidência mínima:** API e telas após recarga.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-08 — SUM null sem registros de origem

**Preparação:** Fixture F-05 com filtro impossível; métrica soma selecionada.

1. [ ] Executar a consulta e conferir registros = 0, valores_preenchidos = 0 e soma = null.
2. [ ] Selecionar soma na visualização Número; conferir 0, conforme aceite específico desse exemplo.
3. [ ] Trocar para Tabela e registrar a célula de soma, que no exemplo local de metadata desconhecido permaneceu vazia.
4. [ ] Conferir na API que soma continua null e que a consulta agregada devolveu uma linha.

**Resultado esperado:** Número mostra 0 para essa soma null, sem transformar a API; ausência de origem continua identificável pelas contagens.

**Evidência mínima:** Contagens, metadata, Número e Tabela.

**Atenção:** A célula da Tabela depende do tipo reconhecido: null numérico conhecido segue NU-01; o exemplo de agregação SQLite de tipo desconhecido ficou vazio. Registrar o metadata antes de classificar divergência.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-09 — COUNT sem registros

**Preparação:** Mesma fixture F-05.

1. [ ] Executar e selecionar a métrica registros (COUNT).
2. [ ] Conferir na API que seu valor é 0 calculado, diferente da soma null.
3. [ ] Exibir como Número e verificar 0.
4. [ ] Comparar com NU-08 e registrar que visual semelhante não torna os dados equivalentes.

**Resultado esperado:** COUNT devolve zero numérico; apresentação correta sem trocar nulls da outra métrica.

**Evidência mínima:** API e Número com a métrica identificada.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-10 — SUM null com registros existentes

**Preparação:** Fixture F-06, duas linhas de origem com valor null.

1. [ ] Executar e confirmar registros = 2, valores_preenchidos = 0 e soma = null.
2. [ ] Selecionar soma em Número e conferir 0 pelo aceite específico do exemplo.
3. [ ] Trocar para Tabela e registrar exibição e metadata; comparar com a ressalva de NU-08.
4. [ ] Conferir que API mantém a soma null e que a existência das duas linhas não foi confundida com valores preenchidos.

**Resultado esperado:** Número 0, contagens e API preservadas; representação na Tabela avaliada conforme tipo reconhecido.

**Evidência mínima:** Contagens, metadata e duas visualizações.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-11 — Zero real com valores preenchidos

**Preparação:** Fixture F-07 com registros e campo numérico preenchido.

1. [ ] Executar e confirmar contagens positivas de registros e valores preenchidos.
2. [ ] Conferir valor calculado 0 ou 0.0 na API.
3. [ ] Conferir 0 em Tabela e Número.
4. [ ] Comparar o resultado com NU-08/10 e registrar que aqui o zero é dado calculado, não apresentação de null.

**Resultado esperado:** Zero real preservado e distinguível pelos dados de origem. Sem registros preenchidos, a fixture não atende ao caso.

**Evidência mínima:** Contagens e valores originais, Tabela e Número.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-12 — Sinal e precisão

**Preparação:** Fixture F-08 com positivo, negativo e valor pequeno.

1. [ ] Executar e conferir os três valores originais na API.
2. [ ] Exibir cada valor como Número, usando perguntas separadas ou filtro controlado.
3. [ ] Configurar poucas casas decimais para que o pequeno valor arredonde visualmente para 0; conferir o detalhe/tooltip quando disponível.
4. [ ] Aumentar as casas decimais e conferir retorno do valor pequeno; registrar sinal e precisão.

**Resultado esperado:** Sinal e formatação preservados; arredondamento não altera o dado original nem transforma valor em null.

**Evidência mínima:** Valor original e comparação de casas decimais.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-13 — Texto e booleano preservam significado

**Preparação:** Fixture F-09 ou campos reais tipados; booleano deve constar no metadata como type/Boolean.

1. [ ] Executar exemplos de texto "0", string vazia e null textual; conferir tipos na API.
2. [ ] Conferir representação em Tabela e, quando suportado, Número, sem aplicar regra numérica aos textos.
3. [ ] Executar false, true e null booleano e conferir metadata de tipo Boolean.
4. [ ] Registrar a apresentação observada e confirmar que false/null não foram convertidos pelo fallback numérico.

**Resultado esperado:** Tipos e significado preservados; ausência textual/booleana não recebe zero numérico artificial.

**Evidência mínima:** rows/cols com tipo Boolean e telas.

**Atenção:** No SQLite, ver 0 na célula não comprova tipo Boolean; solicitar campo tipado/metadata adequado. Sem isso, parte booleana continua pendente.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-14 — Exportações e outras visualizações

**Preparação:** Tabela de NU-01 e lista de componentes relevantes acordada com a equipe.

1. [ ] Conferir novamente Tabela e cópia do exemplo de nulos.
2. [ ] Baixar CSV e JSON pelo menu de exportação e abri-los em editor de texto.
3. [ ] Conferir linha vazia para os nulls e linha Controle com 12.5 conforme exportação formatada; comparar com a API original.
4. [ ] Listar outras visualizações de KPI usadas pelo cliente, abrir cada uma com fixture adequada e registrar sua regra esperada e observada.

**Resultado esperado:** Exportações não fabricam zeros no exemplo aceito; dados formatados não são confundidos com API. Demais componentes dependem de validação específica.

**Evidência mínima:** CSV/JSON sem dados pessoais, API e lista de componentes cobertos.

**Atenção:** O JSON local exportado mostrou strings vazias e números formatados como strings. Isso não significa que a API substituiu null. Não aprovar todas as visualizações pelo teste de Tabela.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-15 — Comparações com zero, null e período ausente

**Preparação:** Variantes F-04, com data reconhecida e pares de comparação conhecidos.

1. [ ] Executar período anterior com zero real e atual positivo; conferir apresentação +∞% aceita para esse exemplo.
2. [ ] Executar anterior positivo e atual zero real; conferir -100%.
3. [ ] Repetir com null no anterior e no atual, comparando com NU-05 e preservando rows originais.
4. [ ] Remover completamente um período e conferir que a comparação usa os pontos existentes, sem criar linha artificial.

**Resultado esperado:** Comparações e datas coerentes com cada variante; +∞% e -100% aceitos nos exemplos locais não aprovam regras de todos os KPIs reais.

**Evidência mínima:** Uma evidência por variante, com valores e datas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-16 — Filtro Cenário, recarga e usuário comum

**Preparação:** Fixture F-10 com variável cenario e pergunta salva; dashboard de QA editável.

1. [ ] Adicionar a pergunta ao dashboard. Em edição, criar filtro de texto Cenário com Caixa de texto, um único valor e padrão positivo.
2. [ ] Clicar no filtro e, no seletor dentro do card, conectar explicitamente à variável cenario; salvar o dashboard.
3. [ ] Fora da edição, enviar positivo → zero → nulo → sem_linhas → positivo, aplicando cada valor e aguardando a consulta concluir.
4. [ ] Conferir a sequência 12.5 → 0 → 0 → Sem resultados → 12.5. Na ausência, não deve aparecer valor anterior.
5. [ ] Recarregar o dashboard em cada estado relevante e repetir com usuário comum autorizado em sessão separada.
6. [ ] Se o filtro sumir ou não alterar a consulta, voltar à edição e conferir a conexão salva; solicitar inspeção de parameter_mappings antes de atribuir falha ao código.

**Resultado esperado:** Estado atual, recarga e perfil comum respeitados; filtro conectado e sem resultado antigo retido.

**Evidência mínima:** Vídeo da alternância por perfil, recarga e captura da conexão.

**Atenção:** cenario é nome da variável; os valores a enviar são positivo, zero, nulo e sem_linhas. A falta de conexão foi causa de um teste local incompleto, corrigido por configuração.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-17 — Mapear KPIs reais e exceções

**Preparação:** Responsável de negócio/produto e lista dos indicadores candidatos.

1. [ ] Preencher a ficha do Anexo B para cada KPI: card/pergunta, definição, consulta, driver e filtros/período.
2. [ ] Com responsável pelos dados, identificar registros de origem, quantidade de valores preenchidos e resposta original em cada estado.
3. [ ] Distinguir zero calculado, registro com valor null, agregação sem registros e consulta sem linhas.
4. [ ] Definir com produto apresentação esperada, condições/exceções e comparar com pelo menos um card não elegível.
5. [ ] Registrar nome/data do aceite de cada decisão. Deixar pendente o KPI sem regra aprovada.

**Resultado esperado:** Mapa aprovado por KPI sem generalizar fallback baseado apenas em tipo numérico, presença de linha ou formato do card.

**Evidência mínima:** Ficha por indicador com aprovação de produto e exemplo elegível/não elegível.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### NU-18 — Executar a matriz no banco real

**Preparação:** NU-17 aprovado para os indicadores exercitados; filtros reproduzíveis.

1. [ ] Para cada KPI, selecionar os filtros/períodos que produzam positivo, zero real, null e ausência de linhas quando esses estados forem possíveis.
2. [ ] Comparar resposta da API, pergunta e dashboard com a ficha aprovada.
3. [ ] Conferir datas/comparações da Tendência e ausência de períodos, quando o indicador as usa.
4. [ ] Repetir mudança de filtros, recarga e usuário comum nos drivers utilizados pelo cliente.
5. [ ] Registrar divergências por KPI/driver/cenário e encaminhar exceções ao produto para aceite ou correção.

**Resultado esperado:** Métrica real segue sua definição e regra aprovada, sem inventar períodos, alterar dados ou reter valor anterior.

**Evidência mínima:** Matriz por KPI/driver/perfil com consultas, filtros e evidências.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 06 — Eixos, tooltips e exportações

Usar F-01, com categoria como dimensão, valor como métrica e outra como segunda série. Duas categorias começam por departamento e exibem o mesmo prefixo Departamen...; seus textos completos devem continuar distintos. As regras de TitleCase/truncamento são visuais e não alteram os dados originais.

### AX-01 — Barras verticais e rótulos de categoria

**Preparação:** F-01 executada; visualização Barras.

1. [ ] No editor da pergunta, selecionar Barras e configurar categoria no eixo de dimensão e valor como métrica.
2. [ ] Conferir TitleCase nos nomes e truncamento dos longos com prefixo de 10 caracteres mais reticências.
3. [ ] Executar também a variante curta vendas e conferir Vendas no eixo.
4. [ ] Conferir valores 10/20/30 nas categorias originais e ausência de alteração dos dados.

**Resultado esperado:** Regra visual de texto aplicada; métricas preservadas. Em espaço pequeno, pode haver corte adicional por pixels.

**Evidência mínima:** Gráfico e consulta usada.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-02 — Tooltip completo em prefixos iguais

**Preparação:** Barras de AX-01 com norte e sul.

1. [ ] Passar o mouse no rótulo Departamen... correspondente a norte e ler o texto completo original.
2. [ ] Mover para o rótulo de sul e conferir que o conteúdo muda para a categoria correta.
3. [ ] Mover repetidamente entre os dois e conferir ausência de texto trocado, corte do conteúdo ou atraso indevido.
4. [ ] Retirar o mouse do eixo e conferir que o tooltip fecha.

**Resultado esperado:** Cada rótulo mostra seu texto original completo, sem mistura ou tooltip preso.

**Evidência mínima:** Vídeo com norte, sul e saída do mouse.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-03 — Linha e Combo

**Preparação:** F-01; ambas as séries disponíveis.

1. [ ] Selecionar Linha, configurar categoria/valor e conferir eixo e tooltip dos pontos.
2. [ ] Selecionar Combo e incluir outra como segunda métrica.
3. [ ] Configurar uma série em barra e outra em linha e conferir legenda e valores.
4. [ ] Repetir hover nos rótulos com prefixo igual, registrando Linha e Combo separadamente.

**Resultado esperado:** Mesma regra de eixo em ambas, sem perda das séries, valores ou tooltip de dados.

**Evidência mínima:** Capturas de cada família e configuração das séries.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-04 — Área, Dispersão e Cascata

**Preparação:** Fixtures compatíveis para cada família; usar F-01 onde suportada e F-08/colunas numéricas para Dispersão.

1. [ ] Abrir Área com categoria/valor e conferir rótulos e valores.
2. [ ] Abrir Dispersão com dois campos numéricos compatíveis e conferir eixos numéricos e tooltip; categoria textual só quando suportada.
3. [ ] Abrir Cascata com dimensões/métricas compatíveis e conferir rótulos e totais.
4. [ ] Em cada família, passar o mouse no eixo/dados e conferir que a regra textual só atua onde aplicável.

**Resultado esperado:** Dimensões textuais seguem a regra; eixos numéricos preservam significado/formatação; nenhuma família é aprovada por evidência de outra.

**Evidência mínima:** Evidência individual de Área, Dispersão e Cascata, ou fixture faltante.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-05 — Barras horizontais/RowChart

**Preparação:** F-01; gráfico de barras horizontais.

1. [ ] Selecionar o formato horizontal e conferir TitleCase/truncamento das categorias.
2. [ ] Passar o mouse no primeiro nome longo e mover o cursor sobre o rótulo.
3. [ ] Conferir tooltip da aplicação sem atraso intencional, acompanhando o mouse e com fundo/texto legíveis.
4. [ ] Repetir em norte/sul, na pergunta e no dashboard, em claro/escuro.

**Resultado esperado:** Tooltip completo correto e contrastante em cada contexto; dados das barras preservados.

**Evidência mínima:** Vídeo de movimento e capturas nos temas.

**Atenção:** RowChart horizontal não é BoxPlot; executar AX-06 separadamente.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-06 — BoxPlot

**Preparação:** Fixture F-11 com várias observações por categoria ou conjunto equivalente preparado pela equipe.

1. [ ] Abrir a pergunta de distribuição e selecionar BoxPlot.
2. [ ] Configurar categoria e medida conforme opções suportadas e confirmar que a distribuição é válida.
3. [ ] Conferir rótulos longos e hover completo no eixo categórico.
4. [ ] Conferir tooltip da distribuição e ações de dados, sem mudança de valores ou categorias.

**Resultado esperado:** Regra categórica e interações preservadas em BoxPlot. Sem fixture compatível, manter pendente.

**Evidência mínima:** Gráfico, configuração e tooltip de categoria/distribuição.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-07 — Datas e dimensão numérica com moeda

**Preparação:** Fixture temporal F-04 e fixture numérica F-08 ou equivalente.

1. [ ] Abrir gráfico com data reconhecida como dimensão e conferir eixo e tooltip conforme formatação temporal.
2. [ ] Abrir gráfico com dimensão numérica faixa e configurar seu estilo em engrenagem → Dados → opções da coluna → Estilo → Moeda.
3. [ ] Escolher moeda/casas disponíveis e conferir rótulo e tooltip completos, incluindo unidade.
4. [ ] Comparar os valores com a consulta e conferir que o eixo de métrica não recebeu capitalização textual indevida.

**Resultado esperado:** Datas, moedas e unidades preservam a formatação oficial e o significado.

**Evidência mínima:** Exemplo temporal e numérico com configuração visível.

**Atenção:** A aba Eixos trata escala/título; estilo de moeda pertence às opções da coluna em Dados.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-08 — Dois gráficos, pouco espaço e temas

**Preparação:** Dashboard com pelo menos dois gráficos de F-01, incluindo horizontal.

1. [ ] Adicionar os gráficos e posicioná-los próximos com categorias de prefixos iguais.
2. [ ] Passar o mouse alternadamente nos rótulos de cada gráfico e conferir origem do tooltip.
3. [ ] Editar, reduzir os cards e salvar; conferir layout e texto completo no hover.
4. [ ] Repetir em claro/escuro e conferir contraste, ausência de sobreposição e conteúdo correto.

**Resultado esperado:** Sem mistura de textos entre cards; dimensões pequenas não impedem acessar o nome completo.

**Evidência mínima:** Vídeo entre cards e capturas por tema/tamanho.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-09 — Interações e Visualizer

**Preparação:** Pergunta com drill e dashboard com Visualizer disponíveis.

1. [ ] Passar o mouse sobre dados e conferir tooltip de métrica/categoria.
2. [ ] Clicar em um resultado e abrir uma ação de drill permitida; conferir que usa a categoria original completa.
3. [ ] Testar seleção/zoom apenas nos tipos que oferecem essas ações, registrando o que foi exercitado.
4. [ ] No dashboard em edição, abrir Visualizar de outra forma, conferir a regra visual no editor e retornar sem alterar os dados de origem.

**Resultado esperado:** Abreviação não substitui valores de filtro/consulta; interações e Visualizer preservados.

**Evidência mínima:** Ação e valor original, mais captura do Visualizer.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### AX-10 — PNG, PDF, CSV e JSON

**Preparação:** Perguntas de F-01 e dashboard com Área e RowChart; exportações permitidas.

1. [ ] Baixar PNG da pergunta/card suportado e abrir o arquivo; conferir eixos, valores, legenda e legibilidade.
2. [ ] Exportar dashboard/guia como PDF pelo controle disponível e abrir todas as páginas; conferir Área e RowChart sem erro de renderização.
3. [ ] Baixar CSV e JSON e conferir categorias completas originais e valores corretos; números podem vir como strings formatadas.
4. [ ] Registrar formato, caminho usado e pergunta/dashboard; separar do envio real de assinatura, exercitado em HOM-03.

**Resultado esperado:** Exportações legíveis e dados originais preservados. Arquivo estático não exige tooltip de hover.

**Evidência mínima:** Arquivos exportados e comparação com a consulta.

**Atenção:** O botão de PDF do navegador e o PDF renderizado no backend podem usar caminhos diferentes. Não inferir cobertura do backend/static-viz apenas pelo PDF de captura do navegador; HOM-03 cobre o fluxo de assinatura quando disponível.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 07 — Paletas SP e Visualizer

Usar cópias de QA de F-01. A paleta fixa tem 30 posições, com tons repetidos previstos. A distribuição em linhas varia pela largura do seletor. Branco/preto são cores explícitas: não se espera inversão automática ao trocar o tema. Pergunta e Visualizer podem ter configurações visuais independentes.

### PA-01 — Escolher cores de séries

**Preparação:** F-01 em Barras verticais, com valor e outra.

1. [ ] Abrir engrenagem → Dados e clicar na cor da série valor.
2. [ ] Conferir a paleta de 30 posições, com preto, vermelho SP, branco, cinzas e tons temáticos; registrar captura do seletor.
3. [ ] Escolher vermelho SP para valor e uma cor distinta, legível no fundo, para outra.
4. [ ] Conferir aplicação no gráfico/legenda e preservação das categorias e números.

**Resultado esperado:** Seletor SP disponível e escolhas aplicadas sem alterar os dados.

**Evidência mínima:** Seletor e gráfico com as duas séries.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-02 — Persistência por família de gráfico

**Preparação:** Pergunta de PA-01; cópias de QA para Linha, Área, Combo e horizontal.

1. [ ] Salvar a pergunta com as cores escolhidas e recarregar.
2. [ ] Reabrir o seletor e conferir que a cor salva permanece e não muda apenas por abrir o popover.
3. [ ] Repetir escolher/salvar/recarregar nas famílias Linha, Área, Combo e horizontal, conforme suas séries suportadas.
4. [ ] Adicionar uma instância nova da pergunta ao dashboard para comparar herança inicial, sem reutilizar um card já customizado pelo Visualizer.

**Resultado esperado:** Persistência correta em cada família. Visualizer existente pode conservar seu próprio tipo/cor e deve ser validado em PA-07.

**Evidência mínima:** Uma comparação por família e registro de pergunta nova versus card customizado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-03 — Pizza, fatias e Outros

**Preparação:** Pergunta com categorias grandes e pequenas; fixture F-12.

1. [ ] Selecionar Pizza, configurar categoria/valor e alterar cores de duas fatias.
2. [ ] Configurar percentual mínimo de agrupamento para que categorias pequenas entrem em Outros.
3. [ ] Salvar, recarregar e conferir cores das fatias, legenda e agrupamento.
4. [ ] Conferir Outros com sua cor padrão e registrar que não há seletor próprio para personalizá-la nesta versão.

**Resultado esperado:** Fatias persistem e agrupamento está correto. Outros usa cor oficial text-disabled.

**Evidência mínima:** Pizza antes/depois da recarga e configuração de agrupamento.

**Atenção:** Ausência de seletor de cor de Outros no Pizza é comportamento previsto, não regressão.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-04 — Número/Indicador com faixas

**Preparação:** Pergunta numérica compatível e opções de faixas disponíveis.

1. [ ] Selecionar Número ou Indicador e abrir configuração de cores por faixas.
2. [ ] Criar faixas com limites conhecidos e escolher uma cor SP para cada faixa.
3. [ ] Adicionar e remover uma faixa de teste, conferindo limites/rótulos e valores válidos.
4. [ ] Salvar e recarregar; testar valores que caiam em pelo menos duas faixas e conferir aplicação.

**Resultado esperado:** Paleta SP nas faixas e avaliação correta dos limites, com persistência.

**Evidência mínima:** Configuração e resultados dos dois valores.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-05 — Formatação condicional da tabela

**Preparação:** Tabela com valores abaixo e acima de um limite conhecido.

1. [ ] Abrir engrenagem → Formatação condicional e criar regra sólida para valor.
2. [ ] Escolher cor SP e condição que destaque apenas parte das linhas/células.
3. [ ] Salvar, recarregar e conferir que somente os valores previstos recebem destaque.
4. [ ] Conferir também opção de gradiente, sem perder os gradientes semânticos disponíveis.

**Resultado esperado:** Paleta na regra sólida, condições corretas e gradientes funcionais.

**Evidência mínima:** Regra e tabela com valores dentro/fora da condição.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-06 — Escala de cores do mapa

**Preparação:** Fonte geográfica compatível com regiões reconhecidas e medida; preparada pela equipe.

1. [ ] Abrir pergunta de regiões e selecionar mapa de região compatível com os códigos/nomes.
2. [ ] Configurar dimensão geográfica e métrica, conferindo correspondência das regiões.
3. [ ] Abrir escala/base de cores, escolher uma opção SP e salvar.
4. [ ] Recarregar e conferir legenda, regiões, tooltip e filtros sem mudar os valores.

**Resultado esperado:** Bases SP disponíveis e escala coerente com a métrica. Sem fixture geográfica compatível, manter pendente.

**Evidência mínima:** Configuração do mapa, legenda e região com valor conhecido.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-07 — Persistência de cores no Visualizer

**Preparação:** Dashboard de QA com card compatível e permissão de edição.

1. [ ] Entrar em Editar dashboard e no card abrir Visualizar de outra forma/Editar visualização.
2. [ ] Dentro do Visualizer, abrir Configuração, alterar explicitamente cor de uma série e conferir prévia.
3. [ ] Aplicar/salvar o modal e depois salvar o dashboard.
4. [ ] Recarregar o dashboard e reabrir o Visualizer; conferir tipo de gráfico, cor e séries persistentes.
5. [ ] Abrir a pergunta-fonte e registrar que ela pode manter configuração própria diferente.

**Resultado esperado:** Cor SP persiste no card/Visualizer após os dois salvamentos, sem trocar dados ou séries.

**Evidência mínima:** Antes/depois da recarga e identificação do card.

**Atenção:** Salvar só a pergunta não sobrescreve o visual independente de um card já configurado. Não atribuir essa diferença automaticamente a falha de persistência.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-08 — Cores em temas e pouco espaço

**Preparação:** Pergunta/dashboard com cor explícita salva.

1. [ ] Abrir seletor em tema claro e conferir opções, foco e indicação da escolha.
2. [ ] Repetir em escuro e verificar legibilidade do popover e do gráfico.
3. [ ] Reduzir largura do card/janela e conferir acesso às opções sem cortes indevidos.
4. [ ] Confirmar que a cor explícita salva continua a mesma ao alternar o tema; usar uma cor legível para avaliar conteúdo.

**Resultado esperado:** Popover e controles acessíveis; tema não substitui automaticamente uma cor fixa.

**Evidência mínima:** Capturas dos temas, seleção e espaço reduzido.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-09 — Preservar cor antiga e substituir explicitamente

**Preparação:** Cópia de pergunta existente com cor personalizada ou referência accent conhecida.

1. [ ] Abrir pergunta e anotar a cor atual sem tocar no seletor.
2. [ ] Alterar outra configuração inofensiva, como título na cópia, salvar e recarregar.
3. [ ] Conferir que a cor anterior foi preservada.
4. [ ] Agora escolher explicitamente uma cor SP diferente, salvar e recarregar; conferir substituição e persistência.

**Resultado esperado:** Abrir/salvar outra opção não troca a cor; escolha explícita SP substitui a anterior corretamente.

**Evidência mínima:** Antes, salvamento sem cor e substituição explícita.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### PA-10 — Cores nas exportações e dashboard

**Preparação:** Pergunta e dashboard com cores SP explicitamente salvas.

1. [ ] Conferir na pergunta e no card do dashboard as cores e as séries escolhidas.
2. [ ] Baixar PNG do fluxo suportado e abrir; comparar cores, legenda e valores.
3. [ ] Exportar PDF do dashboard e comparar os cards em todas as páginas relevantes.
4. [ ] Registrar qual exportador foi usado e encaminhar a conferência de assinatura por e-mail para HOM-03.

**Resultado esperado:** Cor escolhida, legenda e dados preservados nos arquivos e no dashboard.

**Evidência mínima:** PNG/PDF e capturas de referência, com fluxo de exportação identificado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 08 — Traduções e formulários

Administrador; idioma Português (Brasil). Nesta inspeção, não salvar conexão nem alterar SMTP/LDAP. Se houver texto não técnico em inglês, registrar exatamente a tela/campo e versão antes de encaminhar. Não executar comandos de build no ambiente pelo roteiro de QA.

### TS-01 — Configurações gerais em pt-BR

**Preparação:** Administração → Configurações → Geral, rota /admin/settings/general.

1. [ ] Ler rótulos e descrição da página inicial.
2. [ ] Localizar Tabelas e raios-X e conferir a grafia traduzida.
3. [ ] Ler descrição de rastreamento/coleta de uso e conferir ausência de pontuação duplicada.
4. [ ] Recarregar sem alterar valores e conferir que idioma e configurações permanecem.

**Resultado esperado:** Textos pt-BR corretos e valores preservados.

**Evidência mínima:** Capturas dos três grupos de texto.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-02 — CC/BCC e apresentação de LDAP

**Preparação:** SMTP configurado para exibir CC/BCC; formulário LDAP disponível.

1. [ ] Abrir Configurações → E-mail e localizar destinatários CC/BCC.
2. [ ] Conferir rótulo Adicionar destinatários como CC ou BCC e ajuda/tooltip, sem enviar mensagem.
3. [ ] Abrir Configurações → Autenticação → LDAP e ler rótulos/ajuda disponíveis.
4. [ ] Conferir preservação de identificadores técnicos DN, host e porta; não ativar nem salvar configuração.

**Resultado esperado:** CC/BCC sem typo Adicionr e textos LDAP traduzidos; integrações não alteradas.

**Evidência mínima:** Captura por formulário; se SMTP não estiver configurado, registrar CC/BCC pendente.

**Atenção:** Este caso cobre apresentação. Autenticação real LDAP é INT-01; entrega SMTP é HOM-03.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-03 — String de conexão PostgreSQL

**Preparação:** Administração → Bancos de dados → Adicionar banco, rota /admin/databases/create.

1. [ ] Selecionar PostgreSQL no formulário de criação.
2. [ ] Ativar apenas no formulário Usar uma string de conexão.
3. [ ] Conferir String de conexão (opcional), exemplo técnico preservado e ausência do link externo promocional de ajuda no rodapé.
4. [ ] Conferir acesso ao painel local de ajuda e sair/cancelar sem salvar o banco.

**Resultado esperado:** Rótulo traduzido, exemplo íntegro e painel local acessível.

**Evidência mínima:** Formulário e rodapé/painel.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-04 — Ajuda local PostgreSQL

**Preparação:** Mesmo formulário de TS-03, em pt-BR.

1. [ ] Abrir A ajuda está aqui.
2. [ ] Percorrer versões, conexão, sincronização, detalhes e string de conexão.
3. [ ] Conferir prosa em português, comandos, URLs e nomes técnicos preservados.
4. [ ] Fechar e reabrir o painel, conferindo carregamento sem erro.

**Resultado esperado:** Documento local PostgreSQL traduzido e funcional. Não exigir tradução integral da ajuda dos demais drivers.

**Evidência mínima:** Capturas de início/meio/fim e reabertura.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-05 — Amostra dos drivers instalados

**Preparação:** Formulário Adicionar banco; listar somente drivers realmente disponíveis.

1. [ ] Listar os drivers presentes e selecionar cada um por vez, sem conectar/salvar.
2. [ ] Expandir campos avançados e opções condicionais de autenticação; ler rótulos e descrições.
3. [ ] Amostrar campos de região/projeto/hostname/datasets, porta/header de autenticação, JSON e role quando existirem.
4. [ ] Conferir traduções não técnicas e preservação de exemplos JDBC, PEM/JSON, hosts, portas e valores digitados; cancelar ao final.

**Resultado esperado:** Textos cobertos traduzidos sem alterar identificadores técnicos. Reportar por driver/campo.

**Evidência mínima:** Matriz de drivers/campos e captura de cada divergência; driver ausente registrado como não exercitado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 09 — Administração, apresentação e permissões

Usar administrador de teste. Conferir formulários e navegação sem salvar configurações compartilhadas. Recursos realmente licenciados/habilitados seguem seus próprios acessos; ausência de oferta não significa liberação de feature.

### TS-06 — Configuração de mapas

**Preparação:** Configurações → Mapas.

1. [ ] Abrir a página e localizar URL pública do servidor de mapas.
2. [ ] Ler título, descrição e aviso sobre chaves privadas.
3. [ ] Conferir tradução e preservação do valor configurado.
4. [ ] Sair sem salvar nem trocar servidor.

**Resultado esperado:** Texto pt-BR e formulário preservado.

**Evidência mínima:** Captura com URL/chaves sensíveis omitidas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-07 — Menus sem ofertas comerciais

**Preparação:** Configurações e demais páginas administrativas disponíveis.

1. [ ] Percorrer menus de Configurações, Uploads, Autenticação e Permissões.
2. [ ] Procurar CTAs/cards de compra/plano/upgrade e entradas exclusivamente promocionais de Loja/Licença.
3. [ ] Conferir que os ramos promocionais cobertos estão ausentes e não deixaram colunas/grupos vazios.
4. [ ] Abrir uma configuração funcional de cada área e conferir que continua acessível ao perfil autorizado.

**Resultado esperado:** Política SP de apresentação respeitada, sem eliminar controles funcionais ou alterar permissões.

**Evidência mínima:** Menus e áreas percorridas, com contexto de features disponíveis.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-08 — Rotas administrativas comerciais

**Preparação:** Equipe confirma quais features correspondentes não estão habilitadas.

1. [ ] Abrir, conservando o prefixo da instância, /admin/settings/whitelabel e /admin/settings/remote-sync.
2. [ ] Repetir com /admin/settings/custom-visualizations, /admin/settings/cloud e /admin/settings/license.
3. [ ] Para ramos somente promocionais sem feature, conferir redirecionamento para Geral sem loop ou tela vazia.
4. [ ] Se existir feature real licenciada ou gestão EE permitida por URL, comparar com o acesso esperado da equipe e registrar separadamente.

**Resultado esperado:** Ramos de oferta redirecionam; recursos reais e gestão permitida seguem seus gates.

**Evidência mínima:** Origem/destino por rota e informação da feature.

**Atenção:** Não exigir redirecionamento de uma feature funcional que a equipe confirmou como disponível.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-09 — Ajuda, diagnóstico e Sobre

**Preparação:** Administrador; menus de ajuda/diagnóstico acessíveis.

1. [ ] Abrir menu da aplicação e localizar Sobre e diagnóstico disponíveis.
2. [ ] Conferir informações técnicas de versão e funcionamento dos painéis.
3. [ ] Conferir ausência de links/ofertas externos cobertos pela política SP.
4. [ ] Conferir que avisos técnicos de versão/segurança continuam presentes quando aplicáveis; não disparar tarefas de diagnóstico sem coordenação.

**Resultado esperado:** Informações técnicas preservadas sem CTAs promocionais indevidos.

**Evidência mínima:** Menus, versão e áreas de diagnóstico, omitindo dados sensíveis.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-10 — Estados de Uploads e Autenticação

**Preparação:** Páginas administrativas existentes; configuração real de dependências registrada.

1. [ ] Abrir Uploads e conferir estado configurado ou orientação de banco não elegível.
2. [ ] Abrir Autenticação e inspecionar formulários LDAP disponíveis, sem salvar.
3. [ ] Quando SMTP/LDAP não estiverem configurados, conferir estados informativos sem erro nem coluna comercial vazia.
4. [ ] Registrar o que foi apenas apresentação e encaminhar uso real para TS-13, INT-01 e HOM-03.

**Resultado esperado:** Formulários e estados vazios funcionais; indisponibilidade de integração não causa falha de navegação.

**Evidência mínima:** Uma captura por estado e relação de integrações ausentes.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 10 — Aplicação, upload e transformações

Usar objetos de QA e perfis previstos. TS-13 e TS-15 têm efeitos em banco: somente destinos de teste preparados pela equipe. Falta de infraestrutura mantém os subcenários dependentes pendentes.

### TS-11 — Mais informações de pergunta/dashboard

**Preparação:** Pergunta e dashboard salvos de QA.

1. [ ] Abrir pergunta e acionar Mais informações no controle disponível.
2. [ ] Percorrer abas de informações/histórico permitidas e fechar.
3. [ ] Repetir no dashboard, conferindo navegação e conteúdo.
4. [ ] Sem a feature de Insights, conferir ausência de área promocional/CTA ou espaço vazio; com feature real, conferir acesso esperado.

**Resultado esperado:** Informações e histórico funcionais, sem blocos promocionais indevidos.

**Evidência mínima:** Abas na pergunta e dashboard.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-12 — Compartilhar e prévia de incorporação

**Preparação:** Pergunta/dashboard com permissão de compartilhamento; não publicar acesso novo.

1. [ ] Passar o mouse no controle e conferir tooltip Compartilhar.
2. [ ] Abrir Compartilhar → Incorporar e percorrer opções/configuração e prévia já permitidas.
3. [ ] Conferir ausência de ofertas de tema/fontes/remoção de marca/SDK, mantendo opções realmente disponíveis.
4. [ ] Fechar sem publicar ou ativar incorporação; registrar a marca/banner atualmente exigidos pelo fluxo.

**Resultado esperado:** Fluxos permitidos e prévia preservados, sem ampliar acesso nem exigir assinatura futura SP.

**Evidência mínima:** Prévia e controles disponíveis.

**Atenção:** A assinatura Metabase pode continuar onde exigida pelo fluxo atual. Sua troca por Dashboards SP + brasão pertence a outra tarefa.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-13 — Upload completo de CSV

**Preparação:** Banco elegível e uploads habilitados, destino isolado de QA e perfis autorizados; CSV F-13 sem dados pessoais.

1. [ ] Na aplicação, abrir grupo Dados → + → CSV e conferir estado e ausência de oferta de armazenamento.
2. [ ] Com perfil autorizado, selecionar o arquivo F-13 e o destino de teste combinado.
3. [ ] Concluir upload, abrir o resultado e conferir as três linhas, nomes de colunas e valores.
4. [ ] Consultar o objeto criado e conferir acesso com conta comum autorizada.
5. [ ] Com conta não autorizada prevista pela equipe, tentar a URL do objeto e conferir bloqueio, sem mudar permissões; registrar a tabela criada para limpeza coordenada.

**Resultado esperado:** Importação e consulta corretas, sem exposição indevida ou erro de permissão para quem tem acesso.

**Evidência mínima:** Arquivo sintético, objeto criado e evidência por perfil.

**Atenção:** Sem banco elegível, conferir apresentação e manter upload/consulta/perfis pendentes. Não habilitar uploads em banco compartilhado por iniciativa do teste.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-14 — Onboarding e navegação de áreas

**Preparação:** Home e rota /getting-started, quando disponíveis ao perfil.

1. [ ] Abrir home e introdução/getting-started pelo caminho permitido.
2. [ ] Conferir tarefas funcionais de onboarding e ausência de dicas/rodapé/links externos cobertos pela política.
3. [ ] Abrir menu de troca de áreas e ajuda; conferir que as áreas disponíveis continuam navegáveis.
4. [ ] Usar teclado para percorrer controles e confirmar ausência de link comercial invisível recebendo foco.

**Resultado esperado:** Navegação e onboarding funcionais; política SP sem áreas vazias ou foco indevido.

**Evidência mínima:** Home, introdução e menu de áreas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-15 — Transformações SQL e Python

**Preparação:** Data Studio acessível; banco compatível, destino isolado e recursos/runtime confirmados pela equipe.

1. [ ] Abrir Transformação de dados e conferir lista/menu ou estado sem banco compatível, sem CTA de upgrade.
2. [ ] Quando SQL estiver habilitado, criar transformação mínima de teste no destino acordado, usando somente fontes de QA.
3. [ ] Executar e conferir status, saída e registros esperados; anotar nome/ID do objeto criado.
4. [ ] Quando Python estiver disponível e previsto, repetir no runtime de teste fornecido e conferir execução/saída.
5. [ ] Registrar apresentação, editor e execução separadamente para SQL e Python; listar objetos para limpeza pela equipe.

**Resultado esperado:** Recursos habilitados executam corretamente; indisponíveis permanecem protegidos e documentados como pendência/exclusão confirmada.

**Evidência mínima:** Lista/editor, status e saída por tecnologia.

**Atenção:** Não solicitar liberação de licença apenas para completar o checklist. Ausência de banco/runtime impede aprovar execução; estado vazio correto cobre somente apresentação.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 11 — Data Studio e acesso por perfil

Separar conta admin/analista com acesso previsto e conta comum sem papel de admin/analista. Cada perfil deve ser exercitado em sua própria sessão; não aprovar acesso da conta comum com evidência de administrador.

### TS-16 — Entrada e aparência do Data Studio

**Preparação:** Admin autorizado.

1. [ ] Abrir menu de troca de áreas e entrar em Data Studio.
2. [ ] Conferir brasão SP e carregamento do conteúdo.
3. [ ] Recolher e expandir a sidebar e verificar controles e rótulos.
4. [ ] Repetir claro/escuro e retornar à aplicação.

**Resultado esperado:** Identidade, conteúdo e controles funcionais nos temas exercitados.

**Evidência mínima:** Sidebar aberta/fechada e temas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-17 — Guia, Dados conectados e Glossário

**Preparação:** Data Studio com recursos disponibilizados ao perfil.

1. [ ] Abrir Guia e conferir conteúdo e links existentes.
2. [ ] Abrir Dados conectados e Glossário quando disponíveis.
3. [ ] Conferir agrupamentos Biblioteca/Ferramentas e navegar por seus itens funcionais.
4. [ ] Conferir que Ferramentas não ficou vazia se conteria apenas ofertas; registrar recursos existentes/ausentes.

**Resultado esperado:** Links funcionais preservados e grupos sem ofertas vazias.

**Evidência mínima:** Matriz de páginas e capturas dos grupos.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-18 — Dependências sem feature

**Preparação:** Equipe confirma ausência da feature de dependências para este cenário.

1. [ ] No Data Studio, verificar se há entrada exclusivamente promocional de dependências.
2. [ ] Abrir diretamente /data-studio/dependencies com o prefixo da instância.
3. [ ] Conferir redirecionamento para /data-studio/guide sem loop ou página vazia.
4. [ ] Se a feature estiver habilitada de fato, registrar essa condição e conferir seu acesso funcional esperado, em vez de exigir redirecionamento.

**Resultado esperado:** Política aplicada ao ramo promocional sem desabilitar feature real.

**Evidência mínima:** Origem/destino e confirmação da feature.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-19 — Bloqueio do Data Studio para usuário comum

**Preparação:** Conta comum sem papel admin/analista confirmada pela equipe.

1. [ ] Entrar em janela anônima com essa conta e abrir o menu de áreas.
2. [ ] Conferir ausência da entrada não autorizada de Data Studio.
3. [ ] Tentar diretamente /data-studio/guide.
4. [ ] Conferir acesso negado pelo guard da aplicação e confirmar que dados/funções da área não ficaram acessíveis.

**Resultado esperado:** Entrada ausente e URL direta protegida, sem concessão de permissões.

**Evidência mínima:** Perfil utilizado, menu e resultado do acesso direto.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-20 — Acesso autorizado e teclado

**Preparação:** Conta analista/admin com escopo de dados conhecido.

1. [ ] Entrar com o perfil autorizado e abrir Data Studio pelo menu.
2. [ ] Abrir dados/modelagem permitidos e conferir informações dentro do escopo do perfil.
3. [ ] Navegar pelos controles com Tab/Shift+Tab e Enter, verificando foco visível e destinos corretos.
4. [ ] Voltar à aplicação pelo controle próprio; conferir que nenhum item comercial oculto recebeu foco ou abriu oferta.

**Resultado esperado:** Acesso funcional por perfil e retorno preservados; sem funções além do escopo.

**Evidência mínima:** Perfil/escopo, página acessível e navegação por teclado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 12 — Monitor e acesso por perfil

Não executar, cancelar ou reagendar tarefas reais. Observar listagens, estados, navegação e permissões. O perfil de TS-24 é específico e não pode ser substituído pela conta administradora.

### TS-21 — Entrar em Monitor sem diagnóstico premium

**Preparação:** Administrador, sem diagnóstico premium conforme confirmação da equipe.

1. [ ] Abrir menu de áreas e selecionar Monitor.
2. [ ] Conferir seção inicial disponível, normalmente Tarefas.
3. [ ] Esperar a página concluir e navegar para outra seção disponível.
4. [ ] Conferir que a aplicação permanece em Monitor e não volta à home por fluxo de upsell.

**Resultado esperado:** Entrada abre ferramenta permitida e mantém a área funcional.

**Evidência mínima:** Menu, seção inicial e URL final.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-22 — Listas e estados do Monitor

**Preparação:** Monitor acessível ao administrador.

1. [ ] Abrir Tarefas e conferir lista ou estado vazio informativo.
2. [ ] Repetir com agendamentos, logs e alertas que estiverem disponíveis.
3. [ ] Conferir controles de consulta/navegação sem executar ou cancelar tarefas.
4. [ ] Verificar ausência de CTA comercial e registrar recursos não habilitados com seus gates preservados.

**Resultado esperado:** Listas/estados funcionais e recursos indisponíveis protegidos.

**Evidência mínima:** Uma captura por seção disponível e relação das indisponíveis.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-23 — Bloqueio para usuário sem monitoramento

**Preparação:** Conta comum sem permissão de monitoramento confirmada.

1. [ ] Entrar em sessão separada e abrir menu de áreas.
2. [ ] Conferir que Monitor não aparece para esse perfil.
3. [ ] Abrir diretamente /monitor e depois /monitor/tasks, conservando o prefixo.
4. [ ] Conferir acesso negado, normalmente /unauthorized, sem exibir dados ou ferramentas restritas.

**Resultado esperado:** Menu e rotas protegidos para usuário sem autorização.

**Evidência mínima:** Perfil, menu e resultado das duas rotas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-24 — Perfil não admin com monitoramento

**Preparação:** Conta não administradora com permissão explícita de monitoramento fornecida pela equipe.

1. [ ] Entrar com o perfil específico e conferir entrada e ferramentas autorizadas no Monitor.
2. [ ] Comparar com a matriz esperada do administrador, sem pressupor acesso idêntico a todas as funções.
3. [ ] Abrir rotas diretas relevantes e confirmar que só o escopo autorizado funciona.
4. [ ] Se houver diagnóstico licenciado no escopo, conferir seu link/acesso sem executar tarefas.
5. [ ] Conferir ausência de concessão de funções administrativas e registrar perfil/feature ausente como pendente.

**Resultado esperado:** Ferramentas autorizadas preservadas sem ampliar o papel; subcenário de diagnóstico avaliado somente se disponível.

**Evidência mínima:** Matriz esperado/observado por ferramenta e perfil.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### TS-25 — Marca, sidebar e retorno no Monitor

**Preparação:** Monitor aberto em conta autorizada.

1. [ ] Conferir brasão SP junto à identidade/ícone Monitor.
2. [ ] Recolher e expandir sidebar, observando controles e títulos.
3. [ ] Alternar claro/escuro e navegar por teclado, conferindo foco e ausência de grupo promocional vazio.
4. [ ] Voltar à aplicação e conferir que o destino e a sessão permanecem corretos.

**Resultado esperado:** Identidade, contraste, navegação e retorno funcionais.

**Evidência mínima:** Sidebar/temas e destino de retorno.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 13 — Integrações reais e conteúdo do cliente

Executar somente com canais, contas e destinatários de teste definidos. A inspeção de formulários dos lotes anteriores não comprova autenticação LDAP, recebimento SMTP ou conteúdo de negócio.

### INT-01 — Autenticação LDAP real — complemento de TS-10

**Preparação:** LDAP de homologação já configurado; conta/grupo e acesso esperado fornecidos pela equipe.

1. [ ] Anotar perfil/grupos esperados sem registrar senha, DN completo sensível ou segredo de integração.
2. [ ] Sair da aplicação e autenticar a conta LDAP de teste pelo fluxo previsto.
3. [ ] Conferir nome, sobrenome e e-mail autorizados e associação a grupos quando configurada.
4. [ ] Abrir um objeto permitido e testar um objeto restrito de referência, comparando com a matriz esperada.
5. [ ] Sair e repetir o login; se falhar, registrar horário e solicitar à equipe trecho sanitizado do log.

**Resultado esperado:** Login, atributos e grupos corretos, sem conceder permissões além do previsto.

**Evidência mínima:** Resultado do login e matriz de acesso/atributos sanitizada.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### INT-02 — Consulta real por driver/perfil — complemento de HOM-01

**Preparação:** Relação das fontes/driver/versão confirmada pela equipe.

1. [ ] Para cada fonte usada pelo cliente, escolher pergunta de leitura e filtros conhecidos.
2. [ ] Executar como perfil autorizado e confrontar resultado com a referência fornecida pelo responsável dos dados.
3. [ ] Repetir no dashboard e com usuário comum autorizado, incluindo recarga e mudança de filtro.
4. [ ] Registrar separadamente falha de conexão, permissão, consulta ou apresentação; encaminhar logs ao time responsável sem expor credenciais.

**Resultado esperado:** Consultas e permissões funcionais por fonte real. Não aprovar todos os drivers por um só exemplo.

**Evidência mínima:** Matriz fonte/driver/versão/perfil/objeto/filtro/resultado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HOM-03 — Assinatura real por e-mail — AX-10 e PA-10

**Preparação:** SMTP configurado, assinatura habilitada e destinatários de teste; dashboard com Área, horizontal e cores SP explícitas.

1. [ ] Abrir o dashboard de QA e conferir consulta, filtros, valores 10/20/30 e 20/10/15 de F-01 quando usada e cores salvas.
2. [ ] Abrir controle de assinatura/envio do dashboard, escolher apenas destinatários de teste e anotar formato/canal disponíveis.
3. [ ] Enviar teste pelo fluxo permitido. Se a rodada incluir agendamento, usar janela acordada e anotar horário/fuso e regra criada.
4. [ ] Confirmar recebimento na caixa de teste e abrir corpo, imagens e anexos realmente disponibilizados.
5. [ ] Conferir dados, datas, rótulos abreviados, legenda, cores e layout de Área e RowChart; abrir todas as páginas do PDF anexado, se oferecido.
6. [ ] Conferir links para a instância e registrar qual renderer/formato foi exercitado; remover/desativar somente a assinatura de teste criada, conforme acordo da equipe.

**Resultado esperado:** Entrega real e renderização corretas, sem erro de static-viz no fluxo que o utiliza. Formatos/canais não exercitados permanecem discriminados.

**Evidência mínima:** Tela da assinatura sanitizada, horário de envio/recebimento e arquivos recebidos.

**Atenção:** PNG/PDF não oferecem tooltip de hover. CSV/JSON, quando incluídos, mantêm dados completos. Não exigir a assinatura futura Dashboards SP + brasão nesta rodada; corpo de e-mail/Slack dessa mudança tem escopo separado.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

### HOM-04 — Abono de Permanência e Detalhamentos por Situação

**Preparação:** Responsável confirma se o conteúdo faz parte da entrega e fornece URLs/dados esperados.

1. [ ] Confirmar a aplicabilidade antes de procurar ou criar conteúdo.
2. [ ] Se aplicável, localizar dashboard Abono de Permanência e aba/conteúdo Detalhamentos por Situação.
3. [ ] Abrir com os perfis previstos, conferir dados de referência, filtros e navegação entre abas/detalhes.
4. [ ] Alterar um filtro conhecido, recarregar e conferir resultado e permissões.
5. [ ] Se ausente e fora do escopo, registrar NÃO APLICÁVEL com responsável/data; se esperado e indisponível, registrar impedimento ou defeito conforme diagnóstico.

**Resultado esperado:** Conteúdo aplicável acessível e coerente; exclusão formalmente justificada.

**Evidência mínima:** URLs e resultados por perfil ou aceite de exclusão.

**Atenção:** Não importar seeds nem criar conteúdo fictício só para satisfazer este caso.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Lote 14 — Fechamento da rodada

Reunir registros de todos os lotes, defeitos, impedimentos e aceites de produto. Não transferir os OK do smoke local para homologação.

### ENC-01 — Consolidar, retestar e encaminhar

**Preparação:** Casos executados ou impedimentos identificados.

1. [ ] Preencher a matriz do Anexo C com resultado por ID e subcenário; vincular evidência, perfil, tema e versão testada.
2. [ ] Para FAIL, registrar defeito reproduzível e responsável; após correção, retestar o caso e os fluxos afetados no novo pacote.
3. [ ] Para PENDENTE, registrar dependência, responsável e prazo. Para NÃO APLICÁVEL, anexar motivo e aceite de exclusão.
4. [ ] Confirmar mapa de KPIs de NU-17/18 com produto e relacionar integrações/perfis ainda não testados.
5. [ ] Listar objetos/arquivos/assinaturas de QA criados e combinar limpeza apenas desses itens.
6. [ ] Emitir parecer: aprovado no escopo explicitamente testado, aprovado com ressalvas aceitas pela equipe ou não aprovado, indicando as condições restantes.

**Resultado esperado:** Rodada rastreável, com cobertura e limitações explícitas e sem aceite automático por tela aberta/build aprovado.

**Evidência mínima:** Relatório final do Anexo D com matriz e pendências vinculadas.

**Registro:** resultado: ______ · evidência/link: ______ · data: ______ · observação/impedimento: ______

## Anexo A — Dados e consultas de apoio

### Como usar as fixtures

A equipe ainda precisa confirmar o banco/driver da homologação. Os exemplos SQL abaixo são de leitura e têm **PostgreSQL como referência de sintaxe**, salvo o exemplo explicitamente SQLite. Eles não criam tabelas. Outros drivers podem exigir adaptação de casts, datas, booleanos, CTEs ou seleção sem tabela. Validar com engenharia o tipo retornado antes de atribuir uma divergência à aplicação.

No navegador: **+ Novo → Consulta SQL** ou opção equivalente → escolher a fonte de QA → colar consulta → Executar → selecionar visualização → Salvar na coleção de QA. Se não houver permissão SQL, solicitar à equipe perguntas salvas equivalentes; o QA pode executar o roteiro pelos objetos preparados. Não presumir que Products/Price, State/City ou qualquer exemplo do banco de amostra existe no banco do cliente.

O nome F-xx identifica uma fixture deste documento, não um caso adicional de aprovação. Registrar no caso qual variante foi usada. Para testes de tipagem, conferir a resposta original e `data.cols`; só a aparência da célula não comprova o tipo.

### F-01 — Categorias longas e duas métricas

```sql
SELECT 'departamento regional norte' AS categoria, 10 AS valor, 20 AS outra
UNION ALL
SELECT 'departamento regional sul', 20, 10
UNION ALL
SELECT 'gestão de dados e educação', 30, 15;
```

Usar categoria como dimensão. Em Combo, adicionar valor e outra e configurar barra/linha. Para a categoria curta de AX-01, executar uma cópia substituindo uma das categorias por `vendas`. Não mudar a fixture original durante comparações norte/sul.

### F-02 — Null numérico, null textual e controle

```sql
SELECT CAST(NULL AS DOUBLE PRECISION) AS valor,
       CAST(NULL AS VARCHAR) AS rotulo
UNION ALL
SELECT 12.5, 'Controle';
```

Conferir que a API reconhece valor numérico e rotulo textual. No exemplo local aceito: Tabela mostra 0/vazio na primeira linha e 12.5/Controle na segunda; API mantém os dois nulls. Copiar e exportar têm verificação própria em NU-02/14.

### F-03 — Uma linha numérica null e zero linhas

PostgreSQL, uma linha tipada:

```sql
SELECT CAST(NULL AS DOUBLE PRECISION) AS valor;
```

PostgreSQL, nenhuma linha:

```sql
SELECT CAST(NULL AS DOUBLE PRECISION) AS valor
WHERE 1 = 0;
```

No **SQLite do Sample Database**, o cast isolado de null pode não preservar metadata numérico. Se Products/Price realmente existirem, usar coluna numérica declarada:

```sql
SELECT p.price AS valor
FROM (SELECT 1) AS x
LEFT JOIN products AS p ON 1 = 0;
```

Para a variante sem linhas, acrescentar `WHERE 1 = 0` antes do ponto e vírgula. Se esses objetos não existirem, solicitar equivalente com coluna numérica declarada do banco de QA. Não criar conexão Sample no ambiente apenas para viabilizar o roteiro.

### F-04 — Tendência e suas variantes

Referência PostgreSQL:

```sql
WITH dados AS (
  SELECT DATE '2026-09-01' AS mes,
         CAST(100 AS DOUBLE PRECISION) AS valor
  UNION ALL
  SELECT DATE '2026-10-01', CAST(NULL AS DOUBLE PRECISION)
  UNION ALL
  SELECT DATE '2026-11-01', CAST(100 AS DOUBLE PRECISION)
)
SELECT mes, valor FROM dados ORDER BY mes;
```

Salvar cópias com as seguintes mudanças explícitas:

| Variante | Setembro | Outubro | Novembro | Conferência |
| --- | --- | --- | --- | --- |
| V1 — null anterior | 100 | null | 100 | Atual 100; comparação contra null apresentado como 0 pode ser +∞% no exemplo aceito |
| V2 — null atual | 100 | 100 | null | Atual 0 na data de novembro; -100% contra outubro |
| V3 — zero anterior | 100 | 0 | 100 | +∞% contra zero real |
| V4 — zero atual | 100 | 100 | 0 | -100% contra outubro |
| V5 — período ausente | 100 | Sem linha | 100 | Dois pontos reais; não criar outubro |

Para V5, excluir a linha SQL de outubro e seu `UNION ALL` correspondente. Em todas, conferir rows e tipos de data antes de configurar Tendência. Em SQLite, pedir adaptação com data reconhecida no metadata; literal `DATE '...'` de PostgreSQL não é uma fixture universal.

### F-05 — Sem registros de origem, com linha agregada

Usar tabela/campo numérico reais de QA indicados pela equipe. **Substituir** os identificadores abaixo antes de executar:

```sql
SELECT COUNT(*) AS registros,
       COUNT(campo_numerico_qa) AS valores_preenchidos,
       SUM(campo_numerico_qa) AS soma
FROM tabela_qa
WHERE 1 = 0;
```

Esperado: uma linha com `[0, 0, null]`. Selecionar soma para NU-08 e registros para NU-09. Os identificadores são placeholders; erro por copiá-los sem adaptação não é defeito da aplicação.

### F-06 — Duas linhas de origem com todos os valores null

PostgreSQL:

```sql
WITH dados AS (
  SELECT CAST(NULL AS DOUBLE PRECISION) AS valor
  UNION ALL
  SELECT CAST(NULL AS DOUBLE PRECISION)
)
SELECT COUNT(*) AS registros,
       COUNT(valor) AS valores_preenchidos,
       SUM(valor) AS soma
FROM dados;
```

Esperado: `[2, 0, null]`. No SQLite, quando necessário, usar duas linhas de uma coluna numérica declarada via LEFT JOIN sem correspondência, conforme orientação de F-03. Registrar metadata da soma; no exemplo SQLite local de tipo desconhecido, a Tabela ficou vazia e Número exibiu 0. Não confundir regra de Tabela tipada de NU-01 com essa variante.

### F-07 — Zero calculado com valores preenchidos

Substituir tabela/campo por identificadores reais de QA:

```sql
SELECT COUNT(*) AS registros,
       COUNT(campo_numerico_qa) AS valores_preenchidos,
       SUM(campo_numerico_qa - campo_numerico_qa) AS valor
FROM tabela_qa
WHERE campo_numerico_qa IS NOT NULL;
```

A tabela precisa ter valores numéricos preenchidos. Esperado: contagens positivas e valor 0. Se as contagens forem 0, a preparação não satisfaz NU-11.

### F-08 — Sinal, precisão e dimensões numéricas

```sql
SELECT 1 AS faixa, CAST(12.5 AS DOUBLE PRECISION) AS valor
UNION ALL
SELECT 2, CAST(-3.25 AS DOUBLE PRECISION)
UNION ALL
SELECT 3, CAST(0.0004 AS DOUBLE PRECISION);
```

Para testar Número individualmente, salvar variantes com apenas a linha desejada ou aplicar filtro adequado. Para AX-07, usar faixa como dimensão e formatá-la como moeda nas opções da coluna. Para Dispersão, usar dimensões numéricas compatíveis com a configuração disponível.

### F-09 — Texto e booleano conhecido

PostgreSQL, textos:

```sql
SELECT 'texto-zero' AS cenario, CAST('0' AS VARCHAR) AS rotulo
UNION ALL
SELECT 'texto-vazio', CAST('' AS VARCHAR)
UNION ALL
SELECT 'texto-null', CAST(NULL AS VARCHAR);
```

PostgreSQL, booleanos:

```sql
SELECT 'falso' AS cenario, CAST(FALSE AS BOOLEAN) AS indicador
UNION ALL
SELECT 'verdadeiro', CAST(TRUE AS BOOLEAN)
UNION ALL
SELECT 'ausente', CAST(NULL AS BOOLEAN);
```

Conferir metadata `type/Boolean`. Em drivers que representam booleano como inteiro, solicitar à equipe fonte/metadata apropriados para testar o comportamento booleano; não presumir que número 0 já o comprova.

### F-10 — Alternância do filtro Cenário (NU-16)

PostgreSQL; configurar `cenario` como **variável de texto básica**, com valor padrão `positivo`, e não como Field Filter:

```sql
SELECT CASE
         WHEN {{cenario}} = 'positivo' THEN CAST(12.5 AS DOUBLE PRECISION)
         WHEN {{cenario}} = 'zero' THEN CAST(0 AS DOUBLE PRECISION)
         ELSE CAST(NULL AS DOUBLE PRECISION)
       END AS valor
WHERE {{cenario}} IN ('positivo', 'zero', 'nulo');
```

A variável pode aparecer repetidamente na mesma pergunta. Testar inicialmente no editor com os quatro valores e conferir metadata antes de salvar. Esperado em Número: positivo = 12.5; zero = 0; nulo = 0; sem_linhas = Sem resultados. O último valor não passa no WHERE e deve produzir zero linhas. Em outro driver, solicitar adaptação tipada equivalente.

No dashboard: criar filtro de texto **Cenário**, exibição **Caixa de texto**, **Um único valor**, padrão `positivo`; selecionar o filtro e mapear, dentro do card, para a variável `cenario`. Salvar o dashboard. Digitar `cenario` como valor não substitui o mapeamento. Se o filtro desaparecer na leitura, conferir conexão do filtro na aba/card antes de reportar perda por código.

### F-11 — Distribuição para BoxPlot

```sql
SELECT 'departamento regional norte' AS categoria, 10 AS valor
UNION ALL SELECT 'departamento regional norte', 15
UNION ALL SELECT 'departamento regional norte', 22
UNION ALL SELECT 'departamento regional norte', 30
UNION ALL SELECT 'departamento regional sul', 8
UNION ALL SELECT 'departamento regional sul', 12
UNION ALL SELECT 'departamento regional sul', 24
UNION ALL SELECT 'departamento regional sul', 35;
```

Usar a configuração de distribuição suportada pelo BoxPlot. Se o editor exigir formato diferente, solicitar pergunta compatível ao time de dados. Não tratar gráfico horizontal como substituto do BoxPlot.

### F-12 — Pizza com categorias agrupáveis

```sql
SELECT 'principal' AS categoria, 80 AS valor
UNION ALL SELECT 'secundaria', 15
UNION ALL SELECT 'pequena a', 3
UNION ALL SELECT 'pequena b', 2;
```

Definir percentual mínimo de agrupamento de modo que as categorias pequenas entrem em Outros. Conferir o limite conforme controle disponível; não exigir um seletor de cor próprio para Outros.

### F-13 — CSV sintético de upload

Salvar como `qa-hom-upload.csv` em UTF-8:

```csv
codigo,categoria,valor
1,QA-A,10
2,QA-B,20
3,QA-C,30
```

Conferir três linhas e valores 10/20/30 após upload. O delimitador é vírgula. Se o editor de planilha abrir tudo em uma coluna, importar escolhendo o delimitador antes de classificar erro da aplicação.

### Preparação sem SQL: cascata, geografia e perfis

Para FC, solicitar tabela A/B/C e lista de combinações conhecidas, por exemplo dois estados com cidades diferentes e endereço compatível. Confirmar campos elegíveis, lista/busca, seleção múltipla e FK reconhecida para os respectivos subcenários. Um filtro por ID existente pode ajudar a restringir outro campo à mesma linha, sem modificar dados.

Para PA-06, solicitar coluna geográfica com códigos/nomes reconhecidos pelo mapa disponível e valores distintos por região. Para HD-05, solicitar dois schemas com sugestões de exploração, não apenas dois schemas no banco. Para negativas de acesso, pedir à equipe contas com papéis definidos e objetos de referência; não mudar grupos herdados de usuários reais para montar o teste.

## Anexo B — Ficha por KPI e por defeito

### Ficha por KPI (NU-17/18)

Copiar uma ficha para cada indicador e cada exceção aprovada:

| Campo | Preenchimento |
| --- | --- |
| Nome do KPI, pergunta/card e dashboard/aba | ______ |
| URL/ID e versão testada | ______ |
| Definição de negócio e consulta/métrica | ______ |
| Fonte de dados, driver e versão | ______ |
| Perfil, filtros e período reproduzível | ______ |
| Quantidade de registros de origem / valores preenchidos | ______ / ______ |
| Resultado original rows/cols e tipo da métrica | ______ |
| Estado: positivo / zero real / null / sem linhas | ______ |
| Significado do null/ausência neste indicador | ______ |
| Apresentação esperada na pergunta/dashboard/Tendência | ______ |
| Apresentação observada | ______ |
| Regra/condição que autoriza exceção e card não elegível comparado | ______ |
| Evidência e resultado | ______ |
| Responsável do produto e data do aceite | ______ |

### Modelo de defeito

- **Título:** `[HOM][ID][perfil] comportamento observado`.
- **Ambiente/pacote:** URL, versão/commit observado, navegador/versão, sistema, tema e resolução.
- **Pré-condições:** conta/perfil, banco/driver, objeto de QA e estado inicial.
- **Passos:** sequência mínima numerada, incluindo valores de filtros e se houve recarga.
- **Esperado:** resultado deste checklist e eventual regra aprovada pelo produto.
- **Observado:** descrição concreta, mensagem/status e frequência de reprodução.
- **Impacto:** fluxo impedido, perfis atingidos e alternativa conhecida.
- **Evidências:** prints/vídeo, arquivo ou trecho de API/log sanitizado, com horário/fuso.
- **Reteste:** versão corrigida, data, executor, resultado e evidência nova.

Não registrar como defeito de produto uma consulta de fixture incompatível com o driver sem antes confirmar sintaxe/metadata. Falta de dado ou integração é impedimento de execução; divergência real com pré-requisitos atendidos é candidata a defeito.

## Anexo C — Matriz de execução

Todos os registros abaixo começam PENDENTE. Atualizar também o registro ao final do caso e discriminar subcenários quando não houver cobertura completa. A caixa do passo registra execução; a matriz registra o resultado do caso.

| Lote | ID | Resultado | Evidência / defeito / dependência |
| --- | --- | --- | --- |
| L00 | PRE-01 | PENDENTE | ______ |
| L00 | PRE-02 | PENDENTE | ______ |
| L00 | PRE-03 | PENDENTE | ______ |
| L00 | HOM-01 | PENDENTE | ______ |
| L01 | HOM-02 | PENDENTE | ______ |
| L01 | AUD-011 | PENDENTE | ______ |
| L02 | HD-01 | PENDENTE | ______ |
| L02 | HD-02 | PENDENTE | ______ |
| L02 | HD-03 | PENDENTE | ______ |
| L02 | HD-04 | PENDENTE | ______ |
| L02 | HD-05 | PENDENTE | ______ |
| L02 | HD-06 | PENDENTE | ______ |
| L02 | HD-07 | PENDENTE | ______ |
| L02 | HD-08 | PENDENTE | ______ |
| L02 | HD-09 | PENDENTE | ______ |
| L02 | HD-10 | PENDENTE | ______ |
| L02 | HD-11 | PENDENTE | ______ |
| L02 | HD-12 | PENDENTE | ______ |
| L03 | DG-01 | PENDENTE | ______ |
| L03 | DG-02 | PENDENTE | ______ |
| L03 | DG-03 | PENDENTE | ______ |
| L03 | DG-04 | PENDENTE | ______ |
| L03 | DG-05 | PENDENTE | ______ |
| L03 | DG-06 | PENDENTE | ______ |
| L03 | DG-07 | PENDENTE | ______ |
| L03 | DG-08 | PENDENTE | ______ |
| L04 | FC-01 | PENDENTE | ______ |
| L04 | FC-02 | PENDENTE | ______ |
| L04 | FC-03 | PENDENTE | ______ |
| L04 | FC-04 | PENDENTE | ______ |
| L04 | FC-05 | PENDENTE | ______ |
| L04 | FC-06 | PENDENTE | ______ |
| L04 | FC-07 | PENDENTE | ______ |
| L04 | FC-08 | PENDENTE | ______ |
| L05 | NU-01 | PENDENTE | ______ |
| L05 | NU-02 | PENDENTE | ______ |
| L05 | NU-03 | PENDENTE | ______ |
| L05 | NU-04 | PENDENTE | ______ |
| L05 | NU-05 | PENDENTE | ______ |
| L05 | NU-06 | PENDENTE | ______ |
| L05 | NU-07 | PENDENTE | ______ |
| L05 | NU-08 | PENDENTE | ______ |
| L05 | NU-09 | PENDENTE | ______ |
| L05 | NU-10 | PENDENTE | ______ |
| L05 | NU-11 | PENDENTE | ______ |
| L05 | NU-12 | PENDENTE | ______ |
| L05 | NU-13 | PENDENTE | ______ |
| L05 | NU-14 | PENDENTE | ______ |
| L05 | NU-15 | PENDENTE | ______ |
| L05 | NU-16 | PENDENTE | ______ |
| L05 | NU-17 | PENDENTE | ______ |
| L05 | NU-18 | PENDENTE | ______ |
| L06 | AX-01 | PENDENTE | ______ |
| L06 | AX-02 | PENDENTE | ______ |
| L06 | AX-03 | PENDENTE | ______ |
| L06 | AX-04 | PENDENTE | ______ |
| L06 | AX-05 | PENDENTE | ______ |
| L06 | AX-06 | PENDENTE | ______ |
| L06 | AX-07 | PENDENTE | ______ |
| L06 | AX-08 | PENDENTE | ______ |
| L06 | AX-09 | PENDENTE | ______ |
| L06 | AX-10 | PENDENTE | ______ |
| L07 | PA-01 | PENDENTE | ______ |
| L07 | PA-02 | PENDENTE | ______ |
| L07 | PA-03 | PENDENTE | ______ |
| L07 | PA-04 | PENDENTE | ______ |
| L07 | PA-05 | PENDENTE | ______ |
| L07 | PA-06 | PENDENTE | ______ |
| L07 | PA-07 | PENDENTE | ______ |
| L07 | PA-08 | PENDENTE | ______ |
| L07 | PA-09 | PENDENTE | ______ |
| L07 | PA-10 | PENDENTE | ______ |
| L08 | TS-01 | PENDENTE | ______ |
| L08 | TS-02 | PENDENTE | ______ |
| L08 | TS-03 | PENDENTE | ______ |
| L08 | TS-04 | PENDENTE | ______ |
| L08 | TS-05 | PENDENTE | ______ |
| L09 | TS-06 | PENDENTE | ______ |
| L09 | TS-07 | PENDENTE | ______ |
| L09 | TS-08 | PENDENTE | ______ |
| L09 | TS-09 | PENDENTE | ______ |
| L09 | TS-10 | PENDENTE | ______ |
| L10 | TS-11 | PENDENTE | ______ |
| L10 | TS-12 | PENDENTE | ______ |
| L10 | TS-13 | PENDENTE | ______ |
| L10 | TS-14 | PENDENTE | ______ |
| L10 | TS-15 | PENDENTE | ______ |
| L11 | TS-16 | PENDENTE | ______ |
| L11 | TS-17 | PENDENTE | ______ |
| L11 | TS-18 | PENDENTE | ______ |
| L11 | TS-19 | PENDENTE | ______ |
| L11 | TS-20 | PENDENTE | ______ |
| L12 | TS-21 | PENDENTE | ______ |
| L12 | TS-22 | PENDENTE | ______ |
| L12 | TS-23 | PENDENTE | ______ |
| L12 | TS-24 | PENDENTE | ______ |
| L12 | TS-25 | PENDENTE | ______ |
| L13 | INT-01 | PENDENTE | ______ |
| L13 | INT-02 | PENDENTE | ______ |
| L13 | HOM-03 | PENDENTE | ______ |
| L13 | HOM-04 | PENDENTE | ______ |
| L14 | ENC-01 | PENDENTE | ______ |

## Anexo D — Parecer de QA e referências

### Relatório para encaminhar à equipe

| Campo | Preenchimento |
| --- | --- |
| Rodada, datas e executor | ______ |
| URL, pacote/versão e commit informado | ______ |
| Bancos/drivers, perfis, temas e resoluções cobertos | ______ |
| Quantidade OK / FAIL / PENDENTE / NÃO APLICÁVEL | ______ / ______ / ______ / ______ |
| Casos parcialmente executados e subcenários restantes | ______ |
| Defeitos e retestes | ______ |
| Dependências e responsáveis/prazos | ______ |
| Aceites de KPIs e exclusões aprovadas | ______ |
| Objetos de QA criados e encaminhamento da limpeza | ______ |
| Parecer e responsáveis pelo aceite final | ______ |

Aprovação vale para os casos e condições registrados. Pendências precisam de responsável e encaminhamento; exclusões dependem de aceite da equipe/produto. Testes locais, build e abertura de tela não substituem evidência de homologação.

### Fontes no repositório

- [smoke-saopaulov64.md](./smoke-saopaulov64.md): IDs HD/DG/FC/NU/AX/PA/TS, decisões de aceite e complemento AUD-011. Principal referência dos passos e resultados esperados.
- [pendencias-homologacao-saopaulov64.md](./pendencias-homologacao-saopaulov64.md): URL, responsável, commit informado, HOM-01 a HOM-04 e dependências reais.
- [fechamento-tecnico-saopaulov64.md](./fechamento-tecnico-saopaulov64.md): fechamento local, rebuild com AUD-011 e separação entre pacote local e ambiente publicado.
- [checklist-smoke-test.md](./checklist-smoke-test.md): checklist canônica histórica; decisões específicas mais recentes do smoke saopaulov64 prevalecem, incluindo ocultar Metabase dicas e CC/BCC sem typo.
- [pendencia-assinatura-dashboards-sp.md](./pendencia-assinatura-dashboards-sp.md): tarefa posterior de assinatura SP; sua implementação não é presumida por este checklist.

O PDF é a versão de distribuição deste roteiro. Links de arquivos do repositório podem exigir acesso ao projeto; todos os passos necessários para a execução estão descritos aqui. Os dados ainda desconhecidos permanecem a confirmar e os resultados não estão preenchidos como aprovação.
