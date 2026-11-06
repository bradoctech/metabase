# EDD-1523 — Auditoria pós-update do Metabase v64

**Issue / branch:** `EDD-1523`  
**Status:** auditoria e smoke locais concluídos; testes adiados para homologação/próxima leva registrados abaixo
**Início do registro:** 30/10/2026  
**Última atualização:** 06/11/2026

## Objetivo e referências

Registrar os problemas encontrados na auditoria pós-update para a v64, os ajustes necessários para preservar o tema e os comportamentos SP, as correções aplicadas e as evidências de validação. Este documento será atualizado a cada novo levantamento, sem substituir a estratégia já acordada.

Referências: [instruções do agente](./INSTRUCOES-AGENTE.md), [estratégia do salto 60→64](./estrategia-salto-60-64.md), [notas da etapa](./notas-etapa-60-64.md), [manifesto de customizações](./manifesto-customizacoes.md), [runbook](./runbook-atualizacao.md), [listas canônicas](./lists/README.md) e [checklist de smoke](./checklist-smoke-test.md).

## Resumo do levantamento

**Fechamento local:** todos os ajustes locais e suas validações previstas foram aprovados pelo usuário. A sequência abaixo preserva o histórico dos retornos; pendências de etapas anteriores foram resolvidas nos aceites posteriores. Somente upload completo de CSV, menu/editor de transformações e validações de Python/logs ANSI seguem adiados conforme suas decisões.

**Aceite específico das traduções em 06/11/2026:** o usuário validou e aprovou individualmente General (AUD-002), E-mail (AUD-003), string de conexão (AUD-004), ajuda completa de PostgreSQL (AUD-005) e servidor de mapas (AUD-017). As pendências específicas desses cinco itens estão encerradas.

**Revalidação mais recente do usuário:** traduções de `/admin` corretas até onde verificadas, com exceção dos dois textos de mapas registrados em AUD-017. `/data-studio/` e a aplicação principal também foram revalidados sem novas ocorrências de tradução relatadas. Esse retorno se refere a traduções; não encerra os pontos de cores, menus, upsells ou estados sem dados do levantamento prévio. Os itens específicos abaixo mantêm suas evidências próprias.

**Smoke posterior da política comercial:** o usuário percorreu as telas do admin e não encontrou resquícios de upsell. Na aplicação principal, validou somente o menu de troca de áreas e a entrada no Data Studio. Foram encontrados o retorno de Monitor à home, o logo upstream no Data Studio e a categoria Ferramentas vazia; os ajustes estão em AUD-019/AUD-020/AUD-021. Os demais fluxos comerciais da aplicação principal ainda não foram validados nesse smoke.

**Retorno após os ajustes:** usuário confirmou Monitor e Data Studio funcionais, brasão SP correto no Data Studio e redirecionamento do item 6 para o Guia. CSV, detalhes/Insights, incorporação e transformações continuam pendentes de execução; os roteiros de reprodução estão abaixo.

**Retorno seguinte do smoke:** CSV aprovado visualmente, com upload completo não exercitado porque a tela informa ausência de banco compatível. Detalhes de perguntas/dashboards e incorporação aprovados sem upsell na amostra testada. Transformações exibiram o estado de banco incompatível, sem acesso à lista/menu. A imagem do Data Studio também confirma o brasão SP e a ausência da categoria Ferramentas vazia. Novo achado: tooltip de compartilhamento “Percentagem”, registrado em AUD-022.

| ID | Área / rota | Ponto identificado | Situação |
| --- | --- | --- | --- |
| AUD-001 | `/admin/settings/general` | Textos em inglês mesmo com pt-BR ativo | Usuário confirmou resolução após regenerar recursos e reiniciar o backend, até onde testou |
| AUD-002 | `/admin/settings/general` | “Tabelas e X-Rays” e pontuação duplicada na descrição de rastreamento | Validado e aprovado pelo usuário em 06/11/2026 |
| AUD-003 | `/admin/settings/email` | Erro de digitação “Adicionr destinatários…” identificado no catálogo | Validado e aprovado pelo usuário em 06/11/2026 |
| AUD-004 | `/admin/databases/create` | Rótulo “Connection string (optional)” sem tradução | Validado e aprovado pelo usuário em 06/11/2026 |
| AUD-005 | `/admin/databases/create` → “A ajuda está aqui” → PostgreSQL | Corpo do painel de ajuda em inglês | Implementado e testado; validação visual aprovada pelo usuário em 06/11/2026 |
| AUD-017 | `/admin/settings/maps` | Título e descrição da URL pública do servidor de mapas em inglês | Validado e aprovado pelo usuário em 06/11/2026 |
| AUD-018 | Admin, Data Studio, Monitor e fluxos comerciais da aplicação | CTAs e links de upsell | Smoke local aprovado nos cenários relatados; upload completo e menu/editor de transformações adiados para homologação |
| AUD-019 | Menu de troca de áreas → Monitor | Entrada em Monitor seguida de retorno à home | Funcionamento administrativo aprovado; usuário comum validado sem entrada no menu e com redirecionamento de `/monitor` e `/monitor/tasks` para `/unauthorized` |
| AUD-020 | Cabeçalho do Data Studio | Logo Metabase em vez do brasão SP | Brasão SP confirmado pelo usuário |
| AUD-021 | Sidebar do Data Studio → Ferramentas | Categoria sem itens após bloqueio das ofertas | Ausência da categoria vazia confirmada pela imagem posterior do usuário |
| AUD-022 | Botão de compartilhar pergunta/dashboard | Tooltip “Percentagem” em vez de “Compartilhar” | Resolvido; usuário confirmou “Compartilhar” na interface com imagem |
| AUD-023 | Cabeçalho do Monitor | Ícone do Monitor ocupava o lugar do brasão SP | Validado pelo usuário: brasão junto ao ícone e recolhimento/expansão da sidebar funcionando |
| AUD-024 | `/admin/databases/create` → diferentes drivers | Rótulos, descrições e tooltips de conexão em inglês | Concluído: usuário validou todos os tipos de banco e campos em `/admin/databases/create`, incluindo Druid, sem strings em inglês |

“Aplicado” indica alteração no diretório de trabalho. Não implica commit, publicação ou aceite visual. A confirmação geral do usuário em AUD-001 não é tratada como aceite individual dos demais ajustes.

## AUD-001 — Recursos de tradução antigos em General

**Sintoma:** mistura de português e inglês em `/admin/settings/general`, com pt-BR ativo.

Trechos informados pelo usuário:

- “Homepage”.
- “Where users land after signing in.”.
- “Default Metabase home”.
- “Tables and X-Rays”.
- “Usage tracking”.
- “Send anonymous tracking data to Metabase”.
- “Enable the collection of anonymous usage data in order to help Metabase improve..”.

**Diagnóstico:** as entradas já tinham tradução em `locales/pt-BR.po`. Os textos de frontend citados também estavam traduzidos no JSON local `resources/frontend_client/app/locales/pt_BR.json`. O backend mantém os recursos de tradução em memória.

**Procedimento:** executar `./bin/i18n/build-translation-resources`, reiniciar o backend e recarregar a página. O comando gera os recursos de execução a partir dos `.po`; não preenche traduções ausentes. O frontend também precisa incorporar os recursos atualizados quando aplicável.

**Validação:** o usuário confirmou que faltava reiniciar o backend e que, após isso, os textos estavam corretos até onde havia testado. Novas ocorrências serão registradas separadamente.

## AUD-002 — Qualidade das traduções em General

**Arquivo:** `locales/pt-BR.po`.

| Entrada original (`msgid`) | Antes (`msgstr`) | Ajuste aplicado |
| --- | --- | --- |
| `Tables and X-Rays` | Tabelas e X-Rays | Tabelas e raios-X |
| `Enable the collection of anonymous usage data in order to help Metabase improve..` | Habilite a coleta de dados de uso anônimos para ajudar o Metabase a melhorar.. | Habilite a coleta de dados de uso anônimos para ajudar o Metabase a melhorar. |

As chaves em inglês foram preservadas. Somente as traduções foram ajustadas.

**Validação:** `git diff --check` passou. O usuário validou e aprovou as duas entradas de General em 06/11/2026 (item 1 do roteiro).

## AUD-003 — Erro de digitação na configuração de e-mail

**Arquivo:** `locales/pt-BR.po`.  
**Entrada:** `Add Recipients as CC or BCC`.

**Correção aplicada:** “Adicionr destinatários como CC ou BCC” → “Adicionar destinatários como CC ou BCC”. O erro foi confirmado no catálogo durante a leitura das pendências históricas.

**Validação:** `git diff --check` passou. O usuário validou e aprovou o rótulo de E-mail em 06/11/2026 (item 2 do roteiro).

## AUD-004 — Rótulo da string de conexão

**Rota:** `/admin/databases/create`.  
**Trecho informado:** `Connection string (optional)`.

**Causa:** o atributo `label` estava escrito diretamente em inglês em `frontend/src/metabase/databases/components/DatabaseConnectionUri/DatabaseConnectionStringField.tsx`, sem a marcação `t` do ttag. Regenerar os recursos não traduzia esse rótulo.

**Ajustes aplicados:**

- Marcar o rótulo com `t` para tradução.
- Adicionar `Connection string (optional)` → “String de conexão (opcional)” a `locales/pt-BR.po`.
- Incluir o componente em `lists/dual-changed.txt` para preservar o ajuste em upgrades futuros.

A chave já estava no template `locales/metabase.po` e não precisou ser acrescentada novamente.

**Validação:** `git diff --check` passou. O usuário confirmou o rótulo traduzido e aprovou em 06/11/2026 (item 3 do roteiro).

## AUD-005 — Ajuda de PostgreSQL no painel lateral

**Fluxo:** `/admin/databases/create` → PostgreSQL → “A ajuda está aqui”.

**Evidência:** imagem enviada pelo usuário mostrando os controles do painel traduzidos, mas o corpo em inglês, incluindo “Supported versions”, “Connect to Supabase”, “Connection and sync”, “Edit connection details” e “Connection string”.

**Causa:** `useEngineDocMarkdownContent.tsx` importava diretamente `docs/databases/connections/postgresql.md`. O corpo da documentação não passa pelo catálogo `.po`.

**Ajustes aplicados:**

- Criar `docs/databases/connections/postgresql.pt-BR.md` com a tradução completa da ajuda de PostgreSQL.
- Selecionar esse Markdown quando o banco for PostgreSQL e o idioma da interface for `pt-BR` ou `pt_BR`.
- Recarregar o conteúdo quando o idioma mudar.
- Preservar os links, os exemplos de código e os identificadores técnicos da documentação original.
- Registrar o Markdown em `lists/restore-ours.txt` e o carregador e seus testes em `lists/dual-changed.txt`.

**Escopo:** PostgreSQL. Os demais bancos continuam carregando a documentação upstream disponível; suas ajudas ainda não foram auditadas individualmente.

**Validação automatizada:**

- Suíte `useEngineDocMarkdownContent.unit.spec.tsx`: **8 testes passaram**, incluindo seleção pt-BR/pt_BR, mudança de idioma, carregamento original e tratamento de erros.
- Comparação com o Markdown original: links e blocos de código preservados; ambos possuem 37 títulos.
- `git diff --check` passou.

**Validação visual aprovada:** o usuário validou a ajuda PostgreSQL em 06/11/2026 (item 4 do roteiro, incluindo conteúdo completo, rolagem e links). A tradução deste Markdown não depende de regenerar os `.po`.

## Levantamento prévio do usuário — a conferir

Recebido em 30/10/2026 para alinhamento de contexto. O usuário informou que alguns pontos já foram corrigidos. Os itens abaixo não foram revalidados nesta conversa e não representam autorização para iniciar sua implementação agora. A aplicação permanece sem novas alterações por causa deste levantamento.

| ID | Área / rota | Ponto informado / ajuste proposto | Situação |
| --- | --- | --- | --- |
| AUD-006 | Toggle do Metabot | Textos em inglês | Textos conferidos e aprovados pelo usuário em 04/11/2026 |
| AUD-007 | Menu do usuário, no topo direito | Remover Ajuda → “Obter ajuda”; Sobre Metabase mantido por decisão do usuário; comparação com PRODESP sem validação específica | “Obter ajuda” não renderizado pela política SP; Sobre Metabase mantido por decisão do usuário; blocos externos de `/getting-started` também ocultados |
| AUD-008 | Adicione seus dados → CSV | Texto sem tradução | Visual aprovado pelo usuário no smoke; upload completo adiado pelo usuário para o ambiente publicado de testes |
| AUD-009 | Lixeira | Aviso “Este collection está no lixo”: conferir o vermelho do fundo e localizar outros usos do mesmo tom para adequação à paleta SP | Cores e contraste validados nos dois temas; “Esta collection…” aprovado pelo usuário em 06/11/2026 |
| AUD-010 | `/browse/metrics` e hover de coleção | Ícones com vermelho aparentemente fora da paleta; no hover de uma coleção, cor diferente da de “Nome” | `icon-brand` alinhado ao vermelho principal SP nos dois temas, igual ao nome no hover; validado pelo usuário nos temas claro e escuro |
| AUD-011 | Navegação administrativa | Texto do item ativo claro sobre fundo claro, prejudicando a leitura; ajuste proposto para preto | Aba superior ativa e hover das abas inativas com preto SP sobre branco, aprovados pelo usuário em 06/11/2026 |
| AUD-012 | `/admin/settings/uploads` | Ocultar chamadas “Atualize para o Metabase Pro”; revisar textos em inglês no hover de informação | CTA e contêiner lateral bloqueados pela política SP; admin aprovado no smoke geral, sem resquícios de upsell relatados |
| AUD-013 | Área administrativa | Revisar traduções e ocultar chamadas para planos Pro | Traduções revalidadas até onde testado; política de ofertas aplicada e admin aprovado no smoke do usuário |
| AUD-014 | Menus administrativos | Ocultar “Sincronização remota”, itens com diamante que levam ao Pro e “Licença” | Entradas promocionais não renderizadas e menu Licença oculto; recursos disponíveis preservados; admin aprovado no smoke do usuário |
| AUD-015 | `/admin/databases/create` | Ocultar o link “Precisa de ajuda para conectar?” que leva ao Metabase | Validado pelo usuário: link do rodapé não renderizado pela política SP; painel de ajuda PostgreSQL preservado |
| AUD-016 | `/admin/settings/updates` | Tratar falta de dados | Usuário confirmou que a tela voltou a renderizar corretamente em 04/11/2026; concluído sem novo ajuste de código |

### Cruzamento com os ajustes desta conversa

- **Textos em inglês em `/admin/databases/create`:** já há duas ocorrências tratadas, AUD-004 (rótulo da string de conexão) e AUD-005 (documentação de PostgreSQL). Ambas foram validadas e aprovadas pelo usuário em 06/11/2026; isso não amplia a cobertura para todos os textos da rota.
- **Ajuda de conexão:** AUD-005 trata da tradução do corpo do painel “A ajuda está aqui”. AUD-015 registra uma proposta de ocultação de link externo. Não presumir que ambos sejam o mesmo elemento nem remover a tradução já implementada com base nesse relato.
- **Textos do admin:** General teve resolução confirmada pelo usuário em AUD-001. As demais telas e os pontos do levantamento prévio precisam de confirmação própria.
- **Preservação em próximos updates:** manter o contrato das listas canônicas. As alterações de código e documentação de AUD-004/AUD-005 já foram incluídas nas listas correspondentes; `locales/pt-BR.po` já era adapter. Ao implementar os demais pontos, registrar sua proteção no mesmo conjunto de alterações e validar pelo processo existente, sem criar outro fluxo de transporte.

## AUD-017 — URL pública do servidor de blocos de mapas

**Rota:** `/admin/settings/maps`.

**Sintoma:** título “Map tile server public URL” e descrição “Public URL of the tile server to use when rendering maps…” em inglês; o link “Saiba mais” já estava traduzido.

**Causa:** o componente `MapsSettingsPage.tsx` já usa `t` e `jt`, mas as novas chaves não estavam em `locales/pt-BR.po` nem no template `locales/metabase.po`. Os catálogos ainda continham o título e a descrição anteriores.

**Ajustes aplicados:**

- Adicionar o título “URL pública do servidor de blocos de mapas”.
- Adicionar a descrição: “URL pública do servidor de blocos usado para renderizar mapas. Por padrão, usa o OpenStreetMaps, mas você pode definir uma URL personalizada. Esta URL fica visível para os clientes, portanto, não inclua chaves privadas.”
- Preservar `{0}` para o link “Saiba mais” ao final da descrição e manter as chaves anteriores para compatibilidade.
- Atualizar o template com as duas novas chaves. Ambos os catálogos já estão cobertos pelas listas canônicas existentes.

**Validação:** entradas e placeholder conferidos; `git diff --check` passou. O usuário validou e aprovou título, descrição e link na interface em 06/11/2026 (item 5 do roteiro).

## Levantamento de CTAs de upsell e navegação premium

**Status:** levantamento estático do código da branch `EDD-1523`; nenhuma ocultação ou inativação implementada nesta etapa. A presença no código não confirma que o bloco esteja visível na instância: plano, token, permissões, configurações e build OSS/EE mudam a renderização.

**Orientação recebida:** preservar o código e ocultar os contêineres dos CTAs; inativar os links que levam somente a recursos premium, como Aparência no admin. A estratégia abaixo é uma proposta para definição conjunta antes dos fixes. Este levantamento detalha AUD-012, AUD-013 e AUD-014.

### Componentes compartilhados e limites de cobertura

Base dos caminhos desta tabela: `frontend/src/metabase/common/components/upsells/`.

| Componente | Papel e achado | Consequência para o fix |
| --- | --- | --- |
| `components/UpsellWrapper.tsx` | Restringe os componentes envolvidos a administradores. Atualmente não contém uma política SP de ocultação | Candidato a ponto compartilhado, mas não cobre todos os CTAs e menus |
| `UpsellCard.tsx` | Card com título, descrição, ilustração e CTA; usa `UpsellWrapper` | Ocultar a raiz completa do card |
| `components/UpsellBanner.tsx` | Banner, inclusive dispensável; usa `UpsellWrapper` e `UpsellWrapperDismissible` | Ocultar o banner inteiro e conferir o espaço reservado pelo pai |
| `components/UpsellBigCard.tsx` | Card grande de Aparência e Sincronização remota; usa `UpsellWrapper` | Ocultar o bloco completo; tratar também a entrada de menu e a rota de destino |
| `components/UpsellPill.tsx` | Link/botão compacto com diamante; usa `UpsellWrapper` | Ocultar a pill inteira |
| `components/UpsellCardContent.tsx` | Conteúdo promocional usado em páginas completas; não passa por `UpsellWrapper` | Exige cobertura própria e revisão dos contêineres externos, como `DottedBackground` e `LineDecorator` |
| `components/UpsellCta.tsx` | Renderiza botão, link externo ou link interno, conforme as props | Não basta esconder o link: os textos, imagens e estrutura do bloco continuariam visíveis |
| `components/UpsellGem.tsx` | Apenas o ícone de diamante, com variantes normal e `New` | Ocultar só o ícone não desativa a navegação nem classifica o recurso |
| `StoragePurchaseModal/StoragePurchaseButton.tsx` | Compra de armazenamento, com botão próprio e modal/link para a Store | Caminho separado dos cards e banners comuns |

A classe informada no levantamento prévio (`UpsellCta-module__UpsellCTALink___aBdyE`) vem de `components/UpsellCta.module.css`. O sufixo é gerado pelo build e não deve virar seletor permanente do fork.

### Admin — CTAs dentro de telas que precisam continuar úteis

Base dos caminhos abreviados: `frontend/src/metabase/`. Os componentes específicos `Upsell*` do admin ficam em `admin/upsells/`.

| View / rota | Origem | Exibição identificada no código | Tratamento proposto |
| --- | --- | --- | --- |
| `/admin/settings/uploads` | `UploadSettingsPage.tsx` → `UpsellUploads` | Card “Manage your uploads” / upgrade para Pro; planos `oss` ou `starter` | Ocultar card e seu `Box` lateral; manter formulário e tabela de uploads disponível |
| `/admin/settings/authentication` | `AuthenticationSettingsPage.tsx` → `UpsellSSO` | Card lateral quando não há SSO/SCIM; ao lado de Google, LDAP e API keys | Ocultar apenas a área promocional; preservar autenticação existente |
| `/admin/people` e grupos | `admin/people/components/PeopleNav.tsx` → `UpsellSSO` | Nudge controlado por `shouldNudgeToPro` | Ocultar card; preservar pessoas e grupos |
| `/admin/permissions` | `PermissionsEditor.tsx` → `UpsellPermissions` | Banner quando falta `advanced_permissions` | Ocultar banner e revisar `Box` com margens; manter editor de permissões |
| `/admin/performance/databases` | `StrategyEditorForDatabases.tsx` → `UpsellCacheConfig` | Card quando falta `cache_granular_controls` | Ocultar oferta; manter controles realmente disponíveis |
| `/admin/settings/general` | `GeneralSettingsPage.tsx` → `UpsellDevInstances` | Instância de desenvolvimento; depende de Store URL e de não estar em modo de desenvolvimento | Ocultar banner, sem alterar configurações gerais |
| Geral, em build EE | `enterprise/frontend/src/metabase-enterprise/semantic_search/SearchSettingsWidget.tsx` → `UpsellSemanticSearchPill` | Oferta de busca semântica | Cobrir pill; preservar as opções disponíveis do widget |
| `/admin/settings/email` | `EmailFromAddressWidget.tsx` → `UpsellEmailWhitelabelPill`; `EmailSettingsPage.tsx` → `UpsellHostingBanner` | Pill de remetente personalizado e banner de migração para Cloud | Ocultar ofertas; preservar configuração de e-mail |
| `/admin/settings/updates` | `UpdatesSettingsPage.tsx` → `UpsellHostingBanner` | Migração para Cloud; banner retorna `null` se hospedado ou Pro | Ocultar oferta; manter informações e avisos de atualização de versão |
| `/admin/help` | `admin/help/Help.tsx` → `UpsellBetterSupport` | Suporte pago; plano `oss` | Ocultar banner; decisão sobre links gerais de ajuda continua em AUD-007/AUD-015 |
| `/admin/embedding` | `EmbeddingSettings.tsx` → `UpsellDevInstances`; `SharedCombinedEmbeddingSettings.tsx` → `UpsellBanner` | Ofertas de desenvolvimento e métodos avançados de incorporação | Ocultar os blocos comerciais; preservar incorporação guest e configurações disponíveis |
| Configuração do SDK de incorporação | `EmbeddingSdkSettings.tsx` → `UpsellSdkLink` | Link de upgrade dentro de uma frase, quando o SDK não está disponível | Tratar a mensagem comercial completa para não deixar uma frase quebrada |
| `/admin/metabot` | `admin/ai/AISettingsPage.tsx` → `EmbeddedMetabotUpsell` | Aba Embedded com diamante sem `embedding`; conteúdo promocional depende do Metabot ativo e do estado de upsell | Inativar entrada promocional e ocultar card sem afetar configuração interna existente |

### Admin — menus que podem levar a páginas inteiras de upsell

As entradas principais ficam em `admin/settings/components/SettingsNav/SettingsNav.tsx`; as rotas estão em `admin/settingsRoutes.tsx`.

| Entrada / destino | Condição e origem | Proposta para SP |
| --- | --- | --- |
| Aparência → `/admin/settings/whitelabel` | Sem `whitelabel`, mostra diamante e `AppearanceSettingsPage` retorna `UpsellWhitelabel`. Com feature, há páginas reais de Branding/Conceal | Inativar a entrada quando o destino for somente upsell; considerar também os acessos diretos `/appearance`, `/whitelabel/branding` e `/whitelabel/conceal-metabase` |
| Sincronização remota → `/admin/settings/remote-sync` | Sem plugin ativo e fora do Pro, mostra diamante; página usa `UpsellRemoteSync` sem `remote_sync`/Pro. Com plugin ativo, usa `LibraryNav` | Tratar o ramo promocional separadamente do recurso disponível |
| Visualizações personalizadas → `/admin/settings/custom-visualizations` | `CustomVisualizationsNav.tsx` usa `custom-viz-available` para o diamante. As páginas de gerenciamento, formulário e desenvolvimento verificam plugin e usam `UpsellCustomViz`, que consulta `custom-viz` | Conferir as duas flags; inativar o menu apenas quando levar à oferta |
| Cloud → `/admin/settings/cloud` | Diamante sem `hosting`; página usa `CloudPanel` e `UpsellCloud`; com hospedagem, mostra gerenciamento da conta | Inativar a entrada comercial no cenário SP; manter a distinção entre migração e conta existente |
| Licença → `/admin/settings/license` | Entrada sempre presente. OSS usa `SettingsLicense`, com “Explore our paid plans”. EE usa `LicenseAndBillingSettings`, que também possui gestão real de licença e seção de upsell | Ocultação solicitada no levantamento prévio; definir separadamente do simples teste de feature |
| Data apps | `DataAppsNav.tsx` tem diamante sem `data-apps`, mas menu e rotas estão condicionados a `PLUGIN_DATA_APPS.isEnabled` na v64; ramo de upsell de `DataAppsSettingsPage.tsx` está comentado | Não contar como CTA visível confirmado nesta versão; acompanhar em upgrades |
| Temas → `/admin/embedding/themes` | `EmbeddingNav.tsx` mostra diamante sem `embedding_simple`; `EmbeddingThemeListingApp.tsx` usa `UpsellEmbeddingTheme` | Inativar o ramo promocional e ocultar a página de oferta |
| Tenants → `/admin/people/tenants` e subrotas | `PeopleNav.tsx` usa `shouldShowTenantsUpsell`; rotas sem feature `tenants` carregam `UpsellTenants` | Inativar somente a entrada de oferta; preservar pessoas/grupos e eventual gestão real de tenants |
| Controles, personalização e prompts do Metabot | `enterprise/.../ai-controls/nav.tsx` fornece `AiControlsUpsellNavItems`; `ai-controls/routes.tsx` fornece páginas de upsell quando o plugin não disponibiliza o recurso | Cobrir o menu fornecido pelo plugin EE e as respectivas páginas comerciais |
| Loja no topo do admin | `nav/components/AdminNavbar/AdminNavbar.tsx` → `StoreLink`, mostrado para admin sem plano pago; link direto `https://metabase.com/upgrade` | Ocultar a entrada comercial; não passa pelo wrapper de upsell |

### Fora do admin — pontos adicionais encontrados

| View / fluxo | Origem | Ponto identificado |
| --- | --- | --- |
| Data Studio: camada semântica, visualizador de esquema, dependências e Git sync | `data-studio/app/pages/DataStudioLayout/DataStudioLayout.tsx`, `data-studio/routes.tsx`, `data-studio/upsells/pages/*` | `AreaTab` usa `isGated` para o diamante, mas continua navegável; existem páginas de oferta específicas por ausência de `library`, `schema-viewer`, `dependencies` e `remote_sync` |
| Data Studio: transformações | `TransformsSectionLayout.tsx` → `PLUGIN_TRANSFORMS.TransformsUpsellPage` | Há ramo de upsell controlado por `getShouldShowTransformsUpsell`; implementação depende de build/plugin |
| Transformações Python e inspector, build EE | `enterprise/.../transforms-python/upsells/PythonTransformsUpsellModal/*`, `transforms-inspector/routes.tsx`, `transforms/pages/TransformListPage/CreateTransformMenu/CreateTransformMenu.tsx` | Menus, modais e página de inspector podem oferecer upgrade; não dependem todos do wrapper comum |
| Monitor: diagnóstico de dependências e perguntas com erro | `monitor/components/MonitorLayout/MonitorLayout.tsx`, `monitor/routes.tsx`, `MonitorUpsell.tsx`, `DependencyDiagnosticsUpsellPage.tsx` | Menus com `isGated` e páginas completas de oferta. Outros itens, como tarefas, logs e agendamentos, não devem ser ocultados em bloco |
| Monitor: estatísticas de uso de IA, build EE | `MonitorLayout.tsx` e `enterprise/.../monitor/ai-auditing/metabot-analytics/components/MetabotAnalyticsUpsellPage/*` | Usa `audit_app`/`ai_controls`; separar auditoria disponível da oferta |
| Detalhes de dashboard/pergunta | `DashboardInfoSidebar.tsx`, `QuestionInfoSidebar.tsx`, `common/components/upsells/InsightsUpsellTab/*` e `components/InsightsTabOrLink/*` | Aba Insights sem `audit_app` leva a `UpsellUsageAnalytics`; ocultar só o card deixaria uma aba vazia |
| Home voltada a incorporação | `home/components/EmbedHomepage/EmbedHomepageView.tsx` → `UpsellEmbedHomepage` | Card promocional específico dessa home |
| Modal de incorporação | `embedding/components/EmbedModal/StaticEmbedSetupPane/LookAndFeelSettings.tsx` → `UpsellMetabaseBanner` e link de upgrade | CTA para recursos de aparência/remoção de marca; revisar a área comercial sem afetar a configuração disponível |
| Assistente de incorporação | `embedding/embedding-iframe-sdk-setup/components/Common/EmbeddingUpsell.tsx`, passos `AppearanceStep` e `SelectEmbedExperienceStep` | Cards de upgrade e opções com diamante |
| Adicione seus dados → CSV | `nav/containers/MainNavbar/MainNavbarContainer/AddDataModal/Panels/*`, `StoragePurchaseButton` e modal de armazenamento EE | Compra de armazenamento condicionada a `canPurchaseStorage`; preservar upload CSV disponível |
| Configurações de Git sync, build EE | `enterprise/.../remote_sync/components/RemoteSyncAdminSettings/SyncModeSection.tsx` → `DevInstanceUpsell` | Oferta de instância de desenvolvimento mesmo dentro de uma tela funcional |

`enterprise/...` nesta seção significa `enterprise/frontend/src/metabase-enterprise/`. Esses pontos foram encontrados no código; não se afirma que todos estejam visíveis na instância local.

### Proposta de estratégia para os fixes

1. **Ocultar os contêineres comerciais completos:** introduzir uma política SP central e uma classe/atributo estável em componentes de upsell. Usar `display: none` na raiz do bloco, preservando seu código. Cobrir cards, banners, pills, páginas completas e caminhos independentes. Conferir os pais com margens, colunas e fundos para não deixar espaços vazios. Uma regra só em `UpsellCta` ou só em `UpsellWrapper` não cobre o levantamento.
2. **Inativar a navegação promocional:** distinguir ausência de feature de função disponível. Para entradas mantidas visíveis, usar estado desabilitado real, sem destino navegável, e verificar teclado e clique. Apenas `pointer-events: none` não resolve navegação por teclado. Onde a decisão já for ocultar, como Licença no levantamento prévio, tratar item e separadores sem apagar o código.
3. **Definir o comportamento dos acessos diretos:** retirar o link do menu não muda uma URL já salva. Para rotas cujo único conteúdo é upsell, definir redirecionamento para uma tela útil ou estado neutro sem CTA. Isso é uma decisão de navegação a fechar antes da implementação; não alterar gates de licença ou habilitar artificialmente funcionalidades premium.
4. **Cobrir os casos fora dos wrappers:** StoreLink, licença OSS/EE, SDK inline, `UpsellCardContent`, tabs de Insights, `AreaTab`, compra de armazenamento, plugins EE e modais. Não inferir que qualquer diamante ou qualquer palavra “upgrade” seja publicidade sem conferir o destino.
5. **Preservar o transporte nos próximos updates:** módulo/estilos exclusivos SP em `restore-ours`; adaptadores de componentes e menus em `dual-changed`; ajustes de comportamento em `behavior-manual`, conforme a alteração final. Registrar os paths efetivamente alterados no mesmo conjunto de fixes. As listas atuais não possuem entradas explícitas para os componentes centrais de upsell e navegação examinados; validar também globs quando consolidar os arquivos finais.
6. **Validar por levas:** começar por `/admin/settings` (Uploads, Aparência, Sincronização remota, Cloud, Licença e visualizações personalizadas), depois demais áreas admin e, em seguida, Data Studio/Monitor/app. Conferir ausência de CTAs, espaços vazios, navegação por teclado e preservação das funções disponíveis. Rodar testes direcionados dos componentes afetados e os checks necessários ao escopo, além do smoke SP.

Ocultar por CSS mantém os componentes montados: hooks, consultas e eventos de visualização podem continuar executando. Se o objetivo também incluir interromper esses efeitos, aplicar a mesma política aos efeitos comerciais explicitamente, sem presumir que `display: none` faça isso.

### Elementos que exigem distinção

- `common/components/AppBanner/UpgradeBanner` avisa sobre atualização de versão; não é, por esse nome, uma oferta de plano. O banner do Security Center também deve ser avaliado pelo conteúdo e finalidade, preservando alertas técnicos relevantes.
- Links de documentação e suporte não são automaticamente upsells. A proposta de ocultar ajuda externa continua separada em AUD-007/AUD-015.
- A configuração do tema SP não depende de liberar `whitelabel` upstream. Inativar o menu promocional de Aparência não deve remover os tokens e adapters SP existentes.
- O levantamento não confirma o estado da instalação PRODESP nem quais recursos pagos estão contratados/ativos nela.

**Decisão posterior (02/11/2026):** aprovada a opção de não renderizar por uma condição SP, preservando o código upstream. A implementação abaixo substitui a proposta inicial de ocultação via CSS. As tabelas acima mantêm o registro do levantamento.

## Política SP de ofertas comerciais — implementação de 02/11/2026

**Situação atual:** implementada no frontend, com validação automatizada e smoke local aprovados nos cenários registrados; upload completo e menu/editor de transformações adiados por decisão do usuário. Registro AUD-018, relacionado a AUD-012/AUD-013/AUD-014.

### Organização para os próximos upgrades

- `frontend/src/metabase/sp/commercial-policy.ts`: decisão central de apresentação (`showUpsells: false`, `showLicenseMenu: false`). Não altera licença, token nem disponibilidade das features upstream.
- `frontend/src/metabase/sp/with-commercial-policy.tsx`: envolve os componentes comerciais antes de montar suas implementações. As implementações upstream permanecem no arquivo e recebem o sufixo `Upstream`. Com a política SP ativa, seus hooks e efeitos não são executados.
- Módulo `sp` registrado na camada `lib` de `frontend/lint/module-boundaries.mjs`, sem dependência do router no módulo SP.
- Módulo e testes SP em `lists/restore-ours.txt`; integrações com componentes, navegação, testes e registro de módulo em `lists/dual-changed.txt`. Não foi criado outro processo de transporte.

### Cobertura aplicada

- Cards, banners, pills, conteúdo de cards, CTA e modal de upgrade compartilhados; wrapper dispensável bloqueado antes de montar `UserHasSeen`.
- Entradas comerciais específicas do admin (`admin/upsells`), antes dos hooks de oferta; Loja, oferta do Metabot incorporado e compra de armazenamento.
- Contêineres laterais de Uploads e Autenticação e bloco com margens em Permissões, para evitar áreas comerciais vazias.
- Links promocionais de Aparência, Sincronização remota, visualizações personalizadas, Cloud, temas de incorporação, tenants e controles premium de IA. Entradas exclusivamente promocionais deixam de ser renderizadas; as versões funcionais continuam seguindo as condições upstream.
- Menu Licença oculto pela política própria. A gestão real de licença EE continua disponível por URL direta; sua seção comercial foi condicionada à política SP.
- Preservados os avisos técnicos de versão e segurança, incluindo o card de configuração de alertas do Security Center quando o recurso está disponível. Esse card não oferece upgrade de plano.
- Tabs `AreaTab` e `PillTabNavigation` com `isGated` deixam de aparecer. Isso cobre os links promocionais de Data Studio e Monitor sem remover tabs funcionais.
- Aba de Insights promocional, ofertas de home e de incorporação; mensagem inline de upgrade do SDK e aviso de plano pago para fontes.
- Transformações: página de oferta, modal Python, inspector, opção Python sem feature e linha de biblioteca Python que levaria a upsell. As funções Python disponíveis permanecem condicionadas à feature original.
- CSV: botão e texto de compra de armazenamento bloqueados; busca inicial de add-ons do provider fica desabilitada pela política. Uploads e estados de armazenamento existente não foram removidos.

### Acessos diretos às páginas comerciais

| Destino comercial sem feature disponível | Comportamento SP |
| --- | --- |
| Aparência, Sincronização remota, visualizações personalizadas e Cloud no admin | Redirecionar para `/admin/settings/general` |
| Licença na implementação OSS | Redirecionar para `/admin/settings/general` |
| Oferta de tenants | Redirecionar para `/admin/people` |
| Oferta de temas de incorporação | Redirecionar para `/admin/embedding` |
| Páginas de oferta do Data Studio | Redirecionar para `/data-studio/guide` |
| Ofertas de controles de IA | Redirecionar para `/admin/metabot` |
| Ofertas de Monitor, transformações e inspector | Redirecionar para `/` |

Os redirecionamentos se aplicam aos ramos comerciais. As páginas de features disponíveis continuam usando os plugins e verificações upstream. Modais de oferta deixam de ser montados.

### Validação e limites

- Testes direcionados verificam ausência de montagem/efeitos comerciais, preservação do componente upstream quando permitido, ausência de links gated e preservação dos menus comuns.
- Testes de rotas SP cobrem acesso direto a Aparência, Sincronização remota, visualizações personalizadas e Cloud sem features.
- **Jest:** 6 suítes direcionadas, **35 testes passaram**. Incluem os casos SP e a preservação dos ramos upstream quando a política permite ofertas.
- **ESLint:** passou nos arquivos da implementação e testes, incluindo o registro de módulo.
- **TypeScript:** `tsc --noEmit --pretty false` passou sem erros com heap de 5120 MiB. A tentativa inicial com 3072 MiB esgotou o heap; não foi tratada como aprovação. Build de produção e suíte completa não foram executados nesta leva.
- **Integridade:** `git diff --check` passou; os 68 paths de implementação/testes/registro de módulo estão explicitamente cobertos pelas listas canônicas (3 SP-owned e 65 adapters).
- Smoke visual do admin aprovado pelo usuário. Data Studio e Monitor tiveram pendências identificadas e corrigidas na rodada abaixo. Insights, incorporação e CSV ainda precisam de smoke.
- O usuário retomou temporariamente o fundo verde em `UpsellCta.module.css` para o smoke e informou que restaurará a cor padrão antes de commitar. O experimento não foi alterado nesta rodada pós-smoke.
- Novos componentes upstream que não usem os pontos de integração existentes ainda exigem revisão no próximo upgrade. As listas protegem as adaptações atuais; não detectam automaticamente novas ofertas.

## Ajustes após o smoke — Monitor, marca e grupos vazios

### AUD-019 — Monitor retornava à home

**Causa:** `/monitor` priorizava o diagnóstico de dependências para administradores e analistas, mesmo sem o plugin desse recurso disponível. Esse ramo abria uma página de upsell, redirecionada pela política SP para `/`, causando o efeito de entrada e retorno descrito pelo usuário.

**Constatação:** Monitor não é composto somente por ofertas premium. Administradores e usuários com permissão de monitoramento têm acesso a ferramentas como tarefas, agendamentos e logs; administradores também têm gerenciamento de alertas. Essas funções foram preservadas.

**Ajuste:** `getMonitorInitialSection`, em `common/monitor/selectors.ts`, passa a determinar tanto a presença do item no menu quanto a seção inicial. Prioriza diagnósticos quando o plugin está disponível (ou quando ofertas forem permitidas pela política); caso contrário, seleciona tarefas ou alertas conforme a permissão. Quando nenhuma seção estiver disponível, o item Monitor deixa de aparecer. `monitor/routes.tsx` usa a mesma decisão para a entrada na área.

**Revalidar:** para o administrador sem diagnóstico premium, o menu deve abrir `/monitor/tasks` e permanecer na área; tarefas, logs, agendamentos e alertas disponíveis devem continuar acessíveis. Para um analista sem plugin de diagnóstico e sem permissão de monitoramento, Monitor não deve aparecer.

### AUD-020 — Brasão SP no Data Studio

**Causa:** `DataStudioLayout.tsx` importava diretamente `assets/img/data-studio-logo.svg`, sem passar pelo componente de marca já adaptado pelo fork.

**Ajuste:** reutilizar `LogoIcon`, que carrega o brasão SP e respeita a integração de marca existente. Não foi duplicado o asset nem criado outro mecanismo de tema.

**Revalidar:** brasão na sidebar expandida e recolhida; controles de abrir/fechar a sidebar continuam funcionais.

### AUD-021 — Categoria Ferramentas vazia

**Causa:** `AreaTab` já omitia os links promocionais, mas o componente pai `AreaTabGroup` continuava renderizando o título e a seção.

**Ajuste:** o grupo filtra os filhos `AreaTab` indisponíveis pela política SP e deixa de renderizar sua seção quando não restar nenhum filho visível. A filtragem trata fragments e mantém grupos mistos com links funcionais. Com um recurso disponível, Ferramentas e seu respectivo link continuam aparecendo.

**Revalidar:** Ferramentas não deve aparecer no cenário da imagem; Biblioteca deve continuar visível com Glossário. Confirmar o comportamento também com a sidebar recolhida.

### Verificação desta rodada

- **66 testes distintos passaram em 6 suítes** de seletores/guards/rotas de Monitor, menu de troca de áreas, grupos de navegação e layout do Data Studio. O teste adicional de ocultação de Monitor no menu foi validado na reexecução da suíte de AppSwitcher.
- **ESLint passou** nos 9 arquivos de código e testes desta rodada; `git diff --check` passou.
- **TypeScript passou** sem erros (`tsc --noEmit --pretty false`, heap de 5120 MiB).
- Conferência do brasão SP, ausência de categoria vazia, preservação dos links disponíveis e ausência de Monitor quando só haveria oferta.
- Novos paths de integração e testes registrados em `lists/dual-changed.txt`.
- Esta rodada não altera o experimento verde nem executa commits.

## Checklist visual restante da política comercial

| Área / fluxo | Conferir | Estado |
| --- | --- | --- |
| Telas do admin percorridas pelo usuário | Ausência de resquícios de upsell | **OK informado pelo usuário** |
| Menu da aplicação → Monitor | Abrir seção disponível sem voltar à home; omitir entrada quando não houver função disponível | **OK informado pelo usuário nos dois perfis:** administrador com acesso funcional; usuário comum sem entrada no menu e com acesso direto negado em `/monitor` e `/monitor/tasks` |
| Data Studio | Brasão SP, sidebar expandida/recolhida, ausência de Ferramentas vazia e preservação de Glossário/Dados conectados | **OK de funcionamento e brasão informado pelo usuário**; imagem confirma ausência de Ferramentas vazia; sidebar recolhida também aprovada pelo usuário em 06/11/2026 |
| Adicione seus dados → CSV | Ausência de compra de armazenamento e de textos promocionais; manter configuração de uploads e upload funcional quando disponível | **Visual OK informado pelo usuário**; upload completo adiado para o ambiente publicado de testes |
| Pergunta e dashboard → detalhes/Insights | Nenhuma aba de oferta, CTA ou área comercial vazia; detalhes comuns continuam funcionando | **OK informado pelo usuário** |
| Compartilhar/incorporar pergunta ou dashboard | Sem ofertas de planos para fontes, temas ou remoção de marca; preservar opções permitidas e o banner de marca efetivamente usado no embed | **Sem upsell: OK informado pelo usuário** na amostra testada; tooltip incorreto tratado em AUD-022 |
| Home específica de incorporação | Ausência do card comercial e de espaço reservado vazio | Não aplicável ao cenário testado: a home padrão mostra “Continue de onde parou”; a variante de incorporação não foi exibida nem exercitada |
| Data Studio → Transformação de dados | Ausência de opções/biblioteca Python que apenas abririam oferta; preservar funções liberadas | Estado de banco incompatível observado sem oferta comercial; lista/menu/editor não exercitados |
| URLs diretas de páginas promocionais | Por exemplo, `/data-studio/dependencies` sem a feature deve levar ao Guia; sem loop ou tela comercial vazia | **OK informado pelo usuário para o exemplo do item 6** |

### Roteiros para os itens 2 a 5 do smoke

Executar com o usuário administrador usado no smoke anterior e com uma pergunta/dashboard salvos para os fluxos de detalhes e incorporação.

**2 — Adicionar dados por CSV**

1. Voltar à aplicação principal, por exemplo `/`.
2. Na barra lateral esquerda, localizar o grupo **Dados** e clicar no **+** à direita do título, com tooltip **Adicionar dados**. Se houver o atalho **Adicione seus dados**, ele abre o mesmo modal.
3. No modal, selecionar a aba **CSV**.
4. Conferir ausência de oferta de compra de armazenamento, upgrade e espaços vazios. Se uploads estiverem desabilitados, o botão de habilitação deve continuar disponível para quem tem permissão, levando a `/admin/settings/uploads`.
5. Para testar o upload completo, configurar nessa página um banco/esquema elegível disponibilizado pela interface e voltar à aba CSV. Selecionar um CSV de teste pequeno, concluir o upload e conferir a tabela criada. Caso não exista banco elegível configurado, registrar a verificação visual e deixar o upload completo como não exercitado.

Exemplo de conteúdo de CSV local:

```csv
categoria,valor
Teste A,10
Teste B,20
```

**3 — Detalhes de pergunta e dashboard / Insights**

1. Abrir uma pergunta salva. Para criar uma amostra, usar **+ Novo → Pergunta**, escolher uma tabela do Sample Database e salvar a pergunta.
2. No cabeçalho, clicar no ícone de informação **ⓘ**, com tooltip **Mais informações**.
3. Conferir que o painel lateral carrega as informações e as abas disponíveis, como **Visão global** e **Histórico**, sem card de upgrade ou área comercial vazia. Sem `audit_app`, a aba promocional **Insights** deve estar ausente.
4. Repetir em um dashboard salvo, fora do modo de edição, usando o ícone **ⓘ / Mais informações** do cabeçalho. As abas disponíveis variam com o conteúdo e as permissões.

**4 — Compartilhar/incorporar**

1. Abrir a pergunta salva ou um dashboard salvo e clicar no ícone **Compartilhar** no cabeçalho.
2. No menu aberto, escolher **Incorporar**.
3. Na v64, essa ação pode abrir o assistente de incorporação. Percorrer as opções disponíveis até **Aparência/Comportamento**, conferindo ausência de cards e links de upgrade. Se o fluxo apresentar o modal clássico **Incorporação estática**, conferir a aba **Aparência**.
4. Verificar opções de tema, fonte, borda e título conforme disponíveis. Não deve haver oferta de plano para fontes/temas nem card comercial para remover a marca. O banner de marca efetivamente usado na prévia continua seguindo as regras existentes.
5. Basta inspecionar a configuração e a prévia; publicar o conteúdo não é necessário para essa verificação. Se o acesso à etapa depender de incorporação desativada ou de configuração ausente, registrar o estado e marcar a parte não acessada como não exercitada.
6. Repetir no outro tipo de conteúdo, pergunta/dashboard, se ambos estiverem disponíveis.

**5 — Transformação de dados**

1. Abrir **Estúdio de dados → Transformação de dados**, ou `/data-studio/transforms`.
2. Se a lista estiver disponível, abrir o menu **Novo**.
3. Sem a feature Python, conferir ausência da opção **Python script / Script Python** e da linha **Python library / Biblioteca Python** que levariam somente à oferta.
4. Conferir as opções disponíveis, como construtor de consultas ou SQL; abrir uma delas e verificar o editor, sem precisar executar ou salvar uma transformação para este smoke.
5. Pedidos de habilitação de transformações e avisos de ausência de banco compatível são estados funcionais. Caso impeçam acessar a lista/menu, registrar esse estado e deixar essa parte do fluxo como não exercitada.

### Limitações de ambiente confirmadas no smoke

- **Uploads:** a imagem mostra o seletor de banco sem opção elegível e o botão de habilitação desabilitado. `UploadSettingsForm.tsx` solicita a lista de bancos com `include_only_uploadable: true`. Registrar como ausência de conexão elegível informada pela tela, sem atribuir a causa à política comercial nem declarar o upload completo aprovado.
- **Transformações:** a imagem mostra “Nenhuma conexão de banco de dados compatível”. `useTransformSupportedDbs` filtra os bancos por `validateDatabase`, que exclui explicitamente Sample Database, banco de Usage Analytics, bancos com roteamento e conexões sem `transforms/table`. O screenshot confirma o estado sem conexão compatível; não identifica sozinho qual requisito cada conexão deixou de atender.

Esses dois fluxos funcionais poderão ser completados quando houver uma conexão elegível configurada. A inspeção visual realizada permanece registrada como evidência própria.

### AUD-022 — Tooltip “Percentagem” no compartilhamento

**Evidência:** imagem do botão de compartilhamento com tooltip “Percentagem”; usuário confirmou que a ação abre o fluxo de compartilhamento/incorporação.

**Origem:** `Share` é uma chave usada tanto em `common/utils/fields.ts`, como nome do tipo semântico numérico `TYPE.Share`, quanto em `embedding/components/SharingMenu/SharingMenu.tsx`, como ação. O catálogo pt-BR tinha uma única tradução sem contexto: `Share` → “Percentagem”. Por isso o botão herdava o significado numérico.

**Correção:** usar `c("Sharing action").t\`Share\`` nos quatro rótulos de ação do componente (tooltip e nome acessível do menu e do botão). Adicionar `msgctxt "Sharing action"`, `msgid "Share"`, `msgstr "Compartilhar"` a `locales/pt-BR.po` e a chave contextual ao template. A tradução numérica sem contexto continua “Percentagem”. Componente e testes registrados em `lists/dual-changed.txt`.

**Validação:** 3 testes passaram em 2 suítes direcionadas (SharingMenu e CopyLinkButton); ESLint e `git diff --check` passaram. Os testes verificam tooltip/nome acessível “Compartilhar”, preservação de “Percentagem” no significado numérico e o nome acessível quando o tooltip é um elemento React. Os catálogos foram conferidos para garantir as duas entradas distintas.

**Revalidar na interface:** executar `./bin/i18n/build-translation-resources`, reiniciar o backend e recarregar a aplicação com o frontend recompilado. O tooltip e o nome acessível do botão devem passar a “Compartilhar”.

**Resultado visual:** usuário confirmou a resolução e enviou imagem do tooltip “Compartilhar”. AUD-022 validada na interface; nome acessível coberto pelos testes automatizados.

O smoke comercial não encerra automaticamente outros pontos do levantamento inicial. Cores, links de Ajuda e conexão, contraste administrativo e Atualizações receberam seus próprios aceites posteriores, conforme os registros abaixo. Sobre Metabase foi mantido por decisão do usuário.

## AUD-009/AUD-010 — Origem dos vermelhos e alinhamento à paleta SP

**Solicitação:** verificar se os vermelhos apontados são da paleta SP ou do upstream e substituir os que forem externos à paleta SP.

### Diagnóstico

| Uso | Origem encontrada | Ajuste aplicado |
| --- | --- | --- |
| Fundo do aviso da lixeira | `ArchivedEntityBanner` usa `feedback-negative`, herdado de `baseColors.lobster[50]` nos temas upstream | Mapear `feedback-negative` ao vermelho de erro SP `spColors.status.error.base` (`#E52207`) no módulo central |
| Variação forte do feedback negativo | `feedback-negative-strong` herdava `lobster[60]` no claro e `lobster[30]` no escuro | Usar `spColors.redDark.base` (`#842519`) no claro e `spColors.red[20]` (`#FFB9BC`) no escuro |
| Alias legado `error` | Claro já usava erro SP; escuro ainda herdava lobster | Definir o vermelho de erro SP compartilhado entre claro e escuro |
| Ícone de `/browse/metrics` e hover de links de coleção | `icon-brand`: no claro já era SP `red[30]` (`#FF686D`); no escuro era derivado da marca SP. Não eram cores fixas de outra marca, mas havia diferença de tom em relação ao nome, que usa `core-brand` | Alinhar `icon-brand` ao vermelho principal SP `red[40]` (`#FF161F`) em ambos os temas |

Os tons de marca e de erro são cores distintas já existentes na paleta SP e mantêm seus papéis semânticos. Nenhuma nova cor foi inventada.

### Implementação e alcance

- Definições concentradas em `frontend/src/metabase/ui/colors/constants/sp-theme.ts`, já classificado como SP-owned em `lists/restore-ours.txt`. Os arquivos de tema upstream e as views de métricas/coleções não precisaram de patches para esses tokens.
- A alteração dos tokens semânticos também alcança outros consumidores de `feedback-negative`, `feedback-negative-strong`, `error` e `icon-brand` na aplicação. Não é uma troca isolada do fundo da lixeira.
- Texto, ícone e botões do aviso da lixeira passam a usar `core-white_constant`, mantendo branco nos dois temas. `text-primary-inverse` muda conforme o tema e não garantia o mesmo contraste sobre o novo fundo saturado.
- Os três arquivos de integração da lixeira foram adicionados a `lists/dual-changed.txt`.
- A parte textual de AUD-009 foi tratada em rodada posterior com a tradução contextual “Esta collection…”, conforme registro abaixo.

### Validação

- **8 testes passaram em 2 suítes existentes:** derivação de tema e cores de formatação.
- **ESLint e `git diff --check` passaram.**
- Contraste calculado entre branco e o fundo de erro SP `#E52207`: **4,60:1**.
- **Smoke visual aprovado pelo usuário em 04/11/2026:** cores da lixeira, métricas e hover de coleções conferidas nos temas claro e escuro, sem problemas relatados. O nome e o hover do link de coleção usam o vermelho principal SP; o aviso de erro usa o vermelho semântico de erro SP.

### Revisão complementar — vermelhos da v64

**Retorno do usuário:** as cores conferidas ficaram adequadas à identidade SP, incluindo o hover nos cards de KPI. Em 04/11/2026, após receber o roteiro de smoke, o usuário confirmou que os testes ficaram OK tanto no tema claro quanto no escuro.

**Esclarecimento sobre `error`:** a linha `error: spColors.status.error.base` foi movida do bloco claro para `SP_SHARED_COLORS`. O alias continua necessário para consumidores existentes e agora atende os dois temas. Foi acrescentado comentário no código para explicitar essa intenção.

A busca por usos de `lobster`, literais vermelhos e consumidores dos tokens no frontend comum e enterprise encontrou os seguintes pontos adicionais:

| Token | Uso encontrado | Ajuste central SP |
| --- | --- | --- |
| `core-red-saturated` | Realce de sintaxe e cores ANSI nos logs | Vermelho principal `red[40]`, `#FF161F`, nos dois temas |
| `saturated-red` | Alias legado do vermelho saturado | Mesmo vermelho principal nos dois temas, alinhado ao token novo |
| `background_surface-error` | Hover de ações de excluir/arquivar, erros de expressões e resultados de Python, indicadores de complexidade e inspeção de transformações | `red[10]` no claro e `red[90]` no escuro |
| `background_surface-error-subtle` | Alertas de erro, erros do SDK e aviso de envio forçado de sincronização | `red[5]` no claro e `red[100]` no escuro |
| `danger` no tema escuro | Alias legado de ações destrutivas | Vermelho principal SP; o claro já usava vermelho escuro SP |
| `background-error` e `background-error-secondary` no tema escuro | Fundos legados de erro | `red[90]` e `red[100]`; no claro já eram SP |

Os tokens de erro/feedback previamente alinhados à paleta SP continuam com suas funções semânticas. A preferência pelo vermelho principal foi aplicada aos tokens saturados e ao alias destrutivo escuro que ainda herdavam o upstream. Fundos usam variantes suaves/escuras para manter a hierarquia visual.

**Limites da busca:** foram preservados gradientes do seletor de cores, a cor de dados do mapa de calor, exemplos, histórias de componentes, mensagens do console e ferramentas de desenvolvimento. Não são substituições de cor das telas comuns. Cores salvas em perguntas, dashboards e configurações de embedding também não foram migradas. Esta inspeção de código não equivale a uma validação visual de todas as telas.

**Preservação nos upgrades:** todos os novos ajustes estão em `sp-theme.ts`, já protegido por `lists/restore-ours.txt`; nenhuma nova view precisou ser alterada.

**Validação automatizada:** 8 testes passaram nas suítes existentes de derivação de tema e cores de formatação; ESLint do módulo passou. `git diff --check` passou.

**Smoke visual aprovado em 04/11/2026:** o usuário confirmou os testes do roteiro nos temas claro e escuro, sem problemas relatados. O roteiro cobre métricas/coleções, hover de excluir/arquivar, aviso da lixeira, erro no editor de expressão e realce de código SQL. Transformações Python e logs ANSI dependentes de recursos/saídas indisponíveis permanecem não exercitados; a aprovação não amplia a cobertura para esses fluxos.

## Recorte do PR e saldo da auditoria — 04/11/2026

**Decisão do usuário:** a validação específica de transformações Python e logs ANSI fica para uma próxima leva e não integra o foco deste PR. Os tokens centrais SP já aplicados continuam atendendo esses consumidores; o adiamento é da validação desses fluxos, sem reversão das cores.

### Próxima leva — fora do foco deste PR

- [ ] Validar cores dos resultados/erros de transformações Python quando houver ambiente compatível.
- [ ] Validar trechos vermelhos em logs ANSI quando houver saída colorida disponível.

Esses dois itens não bloqueiam o encerramento do PR atual por decisão expressa do usuário. Continuam registrados como não exercitados.

### Itens ainda sem correção ou conclusão específica

| Item | Saldo |
| --- | --- |
| AUD-006 — Metabot | Textos conferidos e aprovados pelo usuário em 04/11/2026 |
| AUD-007 — Ajuda/Sobre | “Obter ajuda” ausente no menu e Sobre presente, aprovados em 06/11/2026; blocos externos de `/getting-started` aprovados como ausentes, com checklist preservada; links de `/admin/help` tratados na rodada complementar abaixo |
| AUD-009 — texto da lixeira | “Esta collection…” aprovado pelo usuário em 06/11/2026 |
| AUD-011 — item ativo do admin | Item ativo e hover das abas inativas aprovados pelo usuário em 06/11/2026 |
| AUD-015 — ajuda de conexão | Ausência do link externo do formulário aprovada pelo usuário; painel de ajuda PostgreSQL preservado |
| AUD-016 — Atualizações | Concluído: usuário confirmou renderização correta em 04/11/2026; sem novo ajuste de código |

### Correções de tradução com confirmação específica concluída — 06/11/2026

- AUD-002/AUD-003: qualidade dos textos de General e rótulo de destinatários em E-mail.
- AUD-004/AUD-005: rótulo da string de conexão e corpo completo da ajuda PostgreSQL.
- AUD-017: título/descrição da URL pública do servidor de mapas.

O usuário retornou explicitamente “Validado e ok” para cada um dos cinco itens do roteiro em 06/11/2026. AUD-002, AUD-003, AUD-004, AUD-005 e AUD-017 ficam encerrados quanto às correções e validações de tradução descritas neste documento.

### Cobertura adicional ainda não relatada

- Monitor com usuário comum sem seções disponíveis: aprovado; menu oculto e rotas diretas redirecionam para `/unauthorized`.
- Data Studio com a sidebar recolhida: aprovado pelo usuário em 06/11/2026.
- Home específica de incorporação: não exibida no cenário testado; não aplicável a esse cenário, sem validação visual da variante.
- Upload completo adiado pelo usuário para o ambiente publicado de testes. Lista/menu/editor de transformações também adiados pelo usuário para o ambiente publicado de testes, por ausência de conexão elegível local.

Essas lacunas de cobertura não demonstram falha. Somente Python e logs ANSI foram explicitamente adiados pelo usuário nesta decisão; o enquadramento dos demais itens pode ser definido separadamente.

## Rodada seguinte — texto da lixeira, ajuda externa e contraste administrativo

**Decisões do usuário em 04/11/2026:** corrigir o artigo para “Esta collection”; não renderizar o link externo de ajuda da conexão, “Obter ajuda” no submenu Ajuda e os blocos externos ao final de `/getting-started`; manter Sobre Metabase; usar preto SP no item ativo do admin. Metabot e Atualizações foram aprovados pelo usuário.

### Implementação

- **AUD-009:** novo contexto de tradução exclusivo de `entityType === "collection"`, com “Esta {0} está no lixo.” em pt-BR. A palavra `collection` foi mantida conforme pedido. A tradução genérica dos demais tipos permanece “Este {0}…”. Requer regenerar os recursos i18n e reiniciar o backend para a nova entrada do catálogo.
- **AUD-007/AUD-015:** acrescentado `showExternalHelpLinks: false` a `SP_COMMERCIAL_POLICY`, separado de `showUpsells`. A condição preserva os ramos upstream e impede renderização do link do rodapé de `DatabaseForm`, do item “Obter ajuda” no submenu Ajuda de `AppSwitcher` e do footer de aprendizado/suporte em `Onboarding` (`/getting-started`). A checklist de primeiros passos, Sobre Metabase, atalhos e ajuda PostgreSQL traduzida continuam disponíveis. Não foi feita uma remoção global de links externos.
- **AUD-011:** aba superior selecionada do admin passa a texto `sp-black` sobre `core-white_constant`, inclusive em hover, nos dois temas. A alteração é restrita à aba ativa.
- **AUD-006/AUD-016:** concluídos pelo retorno do usuário; nenhuma nova alteração de código para esses dois itens.
- Os novos adapters e testes foram registrados em `lists/dual-changed.txt`; política SP e catálogos já têm proteção no fluxo existente.

### Validação automatizada desta rodada

- **65 testes passaram em 5 suítes:** AppSwitcher, formulário de banco e Onboarding comum/enterprise/premium. Incluem ausência dos links sob política SP, preservação de Sobre/atalhos/checklist e cobertura dos ramos upstream quando a política permite links.
- **ESLint passou** nos módulos TypeScript/TSX alterados.
- Catálogos pt-BR e template analisados com Babel; novo contexto feminino de coleção e tradução genérica masculina conferidos.
- `git diff --check` passou. O contraste da aba administrativa ainda depende do smoke visual; a tradução nova depende da regeneração dos recursos.
- Nenhum commit ou alteração do staging foi realizado pelo agente nesta rodada.

### Smoke desta rodada

- Abrir uma coleção na lixeira e conferir “Esta collection está no lixo.” com os recursos atualizados.
- Abrir Menu de configurações → Ajuda: “Obter ajuda” ausente, Sobre Metabase e atalhos presentes.
- Abrir `/getting-started`: checklist presente, blocos “Aproveite Metabase ao máximo” e “Precisa conversar com alguém?” ausentes.
- Abrir `/admin/databases/create`: link “Precisa de ajuda para conectar?” ausente no rodapé; controles de salvar/cancelar e painel de ajuda preservados.
- Alternar as abas superiores do admin e conferir texto preto legível no item selecionado, inclusive no hover, nos temas claro e escuro.

### Próximas etapas — lembrar após esta rodada

A pedido do usuário, retomar somente após estes ajustes e seu smoke:

1. **Concluído em 06/11/2026:** confirmação específica dos textos de General/E-mail (AUD-002/AUD-003), string de conexão (AUD-004), ajuda PostgreSQL (AUD-005) e URL do servidor de mapas (AUD-017), todos aprovados pelo usuário.
2. **Concluído:** Monitor com usuário comum aprovado conforme registro abaixo. Data Studio com sidebar recolhida também aprovado; home específica de incorporação não se aplica ao cenário relatado.
3. Upload completo no ambiente publicado de testes, conforme adiamento do usuário. Lista/menu/editor de transformações também adiados para o ambiente publicado de testes por decisão do usuário.

Python e logs ANSI continuam destinados à próxima leva, fora do foco deste PR. Sobre Metabase permanece disponível por decisão confirmada do usuário em 06/11/2026; a avaliação de remoção deixou de ser uma pendência deste PR.

## Retorno do smoke e complemento — 06/11/2026

**Aprovados pelo usuário:** “Esta collection…” (AUD-009); ausência de “Obter ajuda” no submenu Ajuda; manutenção de Sobre Metabase; contraste da aba administrativa ativa (AUD-011); Metabot e Atualizações seguem aprovados.

**Ocorrências restantes informadas:** `/admin/help` ainda exibia “Obter ajuda” e “Relatar um problema”; abas administrativas inativas ficavam sem contraste ao receber hover.

**Ajustes complementares:**

- `admin/help/Help.tsx`: o grupo dos dois links externos passa a depender de `SP_COMMERCIAL_POLICY.showExternalHelpLinks`, sem renderização no SP. O contêiner também é omitido para não reservar espaço vazio. Os dados de diagnóstico e o download local de detalhes das conexões continuam disponíveis.
- `AdminNavbar.module.css`: hover e seleção compartilham texto `sp-black` e fundo `core-white_constant`, incluindo abas que não estão selecionadas.
- Componente e teste da ajuda administrativa registrados em `lists/dual-changed.txt`.

**Validação automatizada:** 2 testes da ajuda administrativa passaram, cobrindo os dois estados da política e preservação dos diagnósticos/download local. ESLint dos módulos alterados e `git diff --check` passaram. O hover foi posteriormente aprovado no smoke visual do usuário.

**Smoke aprovado pelo usuário em 06/11/2026:** em `/admin/help`, “Obter ajuda” e “Relatar um problema” não renderizam; diagnósticos e detalhes avançados permanecem disponíveis. O hover das abas administrativas, inclusive inativas, foi conferido e aprovado com texto preto SP sobre branco. Nenhuma nova ocorrência foi relatada nesses dois pontos.

A confirmação inicial “OK no menu” foi registrada somente para o submenu Ajuda. No aceite final, o usuário também confirmou especificamente o rodapé de criação de banco e os blocos externos de `/getting-started`; as respectivas pendências estão encerradas.

## AUD-023 — Brasão SP no Monitor

**Retorno do usuário em 06/11/2026:** sidebar recolhida do Data Studio testada e aprovada; decisão de manter Sobre Metabase confirmada. No Monitor, foi identificada ausência do brasão, substituído pelo ícone de pulso da área.

**Correção:** `MonitorLayout` utiliza `LogoIcon` (mesmo brasão SP da aplicação e do Data Studio) no slot `logo` e mantém o ícone original de pulso em `headerControls`. Na sidebar expandida, os dois aparecem lado a lado. Na recolhida, o layout compartilhado mostra somente o brasão e mantém o controle de expansão existente. O slot de logo mede 32 × 32 px; separar os dois elementos evita inserir ambos nessa largura fixa.

**Preservação:** componente e teste adicionados a `lists/dual-changed.txt`; nenhuma alteração no layout compartilhado ou nos assets.

**Validação automatizada:** 47 testes da suíte MonitorLayout passaram, incluindo presença do brasão/ícone na sidebar expandida e brasão na recolhida sob política SP. Os cenários upstream de gating passaram a habilitar explicitamente ofertas no setup de teste, preservando a cobertura dos ramos originais. ESLint e `git diff --check` passaram.

**Smoke aprovado pelo usuário:** brasão junto ao ícone do Monitor e comportamento ao recolher/expandir a sidebar conferidos e aprovados no item 3 do aceite final. AUD-023 encerrado no escopo visual testado.

## Home e configurações de incorporação — retorno do usuário

**Validação de `/admin/embedding`:** usuário confirmou ausência de upgrade/upsell na tela administrativa de incorporação. Este aceite é específico dessa rota e complementa o smoke anterior do fluxo Compartilhar → Incorporar.

**Home com painel configurado:** ao selecionar Painel em `/admin/settings/general`, a home abriu o dashboard “E-commerce Insights”, conforme relato e imagem do usuário.

**Home padrão:** ao voltar para Página inicial padrão do Metabase, a tela exibiu “Olá, Felipe” e “Continue de onde parou”, com cards de conteúdos acessados. Essa é a seção de itens recentes (`HomeRecentSection`), mesmo sem o título literal “Recentes”. O comportamento observado está correto para a home comum.

**Home alternativa de incorporação:** `EmbedHomepage` não apareceu nesse acesso. É uma variante condicionada a `embedding-homepage === "visible"` e usuário administrador, distinta da seleção entre home padrão e dashboard e distinta de `/admin/embedding`. Registrar como **não aplicável ao cenário testado**, sem declarar o card comercial dessa variante validado visualmente e sem alterar configurações para forçar sua exibição.

## AUD-019 — Smoke do Monitor com usuário comum

**Resultado confirmado pelo usuário em 06/11/2026:** após definir a senha pelo fluxo de redefinição e entrar com a conta comum de teste, os três pontos foram aprovados:

1. Monitor ausente no menu de áreas.
2. Acesso direto a `/monitor` negado, com redirecionamento para `http://localhost:3002/unauthorized`.
3. Acesso direto a `/monitor/tasks` negado, com o mesmo redirecionamento para `/unauthorized`.

A validação cobre ocultação da entrada e os guards de navegação para o perfil comum testado. Não implica uma auditoria adicional das permissões das APIs. A entrega de e-mail não foi necessária para este smoke; a conta foi acessada pelo link de redefinição obtido pelo administrador.

## AUD-024 — Traduções dos formulários de conexão por driver

**Novo retorno do usuário:** percorreu os tipos de banco e não encontrou CTAs de upsell, mas identificou textos em inglês nos campos, descrições e tooltips. O print recebido mostra o formulário de conexão PostgreSQL com opções avançadas, sem CTA na área exibida. O aceite de ausência de CTA nos demais tipos baseia-se no relato do usuário.

**Distinção de cobertura:** a tela é `/admin/databases/create`, não o menu/editor de transformações de `/data-studio/transforms`. Esta evidência amplia o smoke dos formulários de conexão; não encerra o teste dos editores de transformações.

### Trechos e drivers informados

| Driver | Ocorrências relatadas |
| --- | --- |
| Amazon Athena | Region; Workgroup; S3 staging directory; Catalog; Access key; Secret key; Full hostname; Specific database; Additional Athena connection string options; tooltips dos ícones de informação em inglês |
| ClickHouse | Enable multiple databases; Enable syncing and scanning tables from multiple ClickHouse databases except the system ones.; Databases; Disable system wide proxy settings; ClickHouse settings (comma-separated); Max open HTTP connections in the JDBC driver (default: 100) |
| Databricks | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| Druid | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| Druid JDBC | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| MongoDB | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| MySQL | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| Oracle | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| Presto | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| Snowflake | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| SQL Server | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| SQLite | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |
| Starburst (Trino) | Relato inicial de campos em inglês; corrigidos e aprovados na revisão banco a banco |

### Diagnóstico inicial e próximo tratamento

Os trechos de Athena e ClickHouse foram localizados em `modules/drivers/athena/resources/metabase/athena/metabase-plugin.yaml` e `modules/drivers/clickhouse/resources/metabase/clickhouse/metabase-plugin.yaml`, em propriedades como `display-name` e `helper-text`. Os metadados são processados pelo carregamento de plugins/driver antes de chegar ao formulário.

Várias chaves específicas relatadas não foram encontradas no catálogo pt-BR. “Region” já possui tradução “Região” em outro contexto de uso do catálogo, portanto não se deve atribuir todas as ocorrências apenas a ausência de tradução: é necessário conferir também a aplicação da tradução aos metadados dos drivers. A revisão central e o aceite visual posterior dos demais tipos de banco estão registrados abaixo.

**Estado atualizado:** correção aplicada e validação visual concluída. O usuário percorreu cada tipo de banco em `/admin/databases/create` e confirmou todos os campos traduzidos, incluindo Druid, sem strings em inglês. AUD-024 encerrado no escopo visual dos formulários de conexão. AUD-004/AUD-005 permanecem encerrados.

### Correção central e inventário

- `frontend/src/metabase/sp/connection-field-i18n.ts`: registro de **168 mensagens** com chamadas literais `t`, avaliadas ao renderizar para acompanhar mudanças de idioma. As chaves ficam visíveis à extração estática, evitando perdê-las ao regenerar o template.
- `DatabaseDetailField.tsx`: adapter único chama `localizeConnectionField` antes de montar os campos. Localiza `display-name`, `description`, `helper-text`, nomes das opções e o placeholder genérico “Optional”. Não altera `name`, `default`, valores das opções, condições de visibilidade, credenciais ou placeholders técnicos. Textos desconhecidos e rótulos já traduzidos são mantidos.
- **119 novas entradas pt-BR** e **130 entradas no template**, sem substituir traduções preexistentes. A diferença de contagem decorre de chaves já traduzidas no pt-BR que não estavam no template atual.
- Inventário cobre **129 textos distintos dos manifestos-fonte atuais** de Athena, ClickHouse, Databricks, Druid JDBC, MongoDB, Oracle, Presto JDBC, Snowflake, SQL Server, Starburst e Hive-like, incluindo grupos e opções aninhadas. Inclui também textos compartilhados de conexão de MySQL/SQLite e variantes presentes nos artefatos locais de drivers, para compatibilidade com o ambiente de smoke.
- Nomes de produtos e protocolos como AWS, Azure, Google Cloud e OpenID Connect (JWT) permanecem técnicos. Navegação externa do Databricks “SQL Warehouses > Connection details” foi preservada como nome das opções do produto de destino.
- O driver Druid clássico não possui manifesto-fonte nesta árvore; recebe as traduções compartilhadas pelo mesmo adapter. O usuário conferiu esse tipo de banco na interface e confirmou ausência de strings em inglês, encerrando a lacuna de validação visual desse driver.
- Módulo SP e teste registrados em `lists/restore-ours.txt`; adapter e teste de integração em `lists/dual-changed.txt`. Nenhum manifesto upstream foi reescrito.

### Validação automatizada de AUD-024

- **22 testes distintos passaram em 4 suítes direcionadas:** localização de metadados, integração de campo/tooltip, formulário de banco e mudança de engine. O teste de integração também confirmou que o valor digitado continua sendo enviado em `details.region`, sem traduzir identificadores nem valores.
- Testes cobrem troca de idioma, preservação de defaults/condições/valores de opções, ausência de mutação dos metadados originais e manutenção de textos desconhecidos ou já traduzidos.
- **ESLint e `git diff --check` passaram.**
- Catálogos analisados com Babel: as **168 mensagens registradas** existem no template e têm tradução pt-BR. Conferência dos manifestos-fonte confirmou cobertura dos **129 textos distintos** coletados das propriedades de conexão.
- Smoke visual dos drivers aprovado posteriormente pelo usuário, banco a banco, incluindo Druid. O aceite cobre os campos exibidos no formulário; não implica teste de conexão ou execução em cada banco. Nenhum commit foi realizado pelo agente e o staging existente foi preservado.

### Roteiro de revalidação — concluído pelo usuário

Executar `./bin/i18n/build-translation-resources`, reiniciar o backend e recarregar o frontend recompilado. Abrir `/admin/databases/create`, selecionar os drivers relatados, expandir opções avançadas e passar o mouse nos ícones de informação. Conferir também seletores de autenticação e seus campos condicionais. Não é necessário preencher credenciais, salvar ou conectar para esse smoke visual.

### Upload CSV — adiamento confirmado

O usuário decidiu deixar o upload completo para o ambiente publicado de testes. Manter o resultado visual anterior aprovado e o fluxo completo como não exercitado, destinado a essa próxima etapa. Não é necessário configurar um banco local apenas para fechar esse teste nesta rodada.

## Transformações — adiamento confirmado pelo usuário

Assim como o upload completo de CSV, o menu/editor de transformações fica para o ambiente publicado de testes. O ambiente local continua sem conexão de banco compatível. Ambos permanecem não exercitados funcionalmente, com adiamento autorizado; não exigem configurar conexão local nesta leva. Python e logs ANSI seguem fora do foco deste PR conforme decisão anterior.

## Consolidação para fechamento — aceite dos drivers

**Feedback final de AUD-024:** o usuário validou banco a banco em Database Create e confirmou que todos os campos de todos os tipos estavam corretos. Destacou que Druid também não apresentou nenhuma string em inglês. As traduções dos formulários ficam aprovadas e encerradas no escopo testado.

**Saldo local registrado:** não há outra correção confirmada por implementar neste levantamento. Os três últimos pontos receberam aceite explícito do usuário:

1. **OK — `/getting-started`:** ausência dos blocos externos de aprendizado e suporte, mantendo a checklist. Usuário enviou print como evidência.
2. **OK — `/admin/databases/create`:** ausência específica do link de rodapé “Precisa de ajuda para conectar?” (AUD-015), distinto do painel “A ajuda está aqui”.
3. **OK — Monitor:** brasão junto ao ícone de pulso na sidebar expandida e funcionamento ao recolher/expandir (AUD-023). O acesso do usuário comum já está aprovado em AUD-019.

**Adiados por decisão do usuário:** upload completo de CSV e menu/editor de transformações para o ambiente publicado de testes; Python e logs ANSI para próxima leva, fora do foco deste PR. A home alternativa de incorporação não é aplicável ao cenário testado. Esses adiamentos não foram convertidos em testes aprovados.

**Fechamento:** auditoria e smoke locais concluídos no escopo descrito, após os aceites explícitos dos três pontos acima. Restam somente os testes adiados para homologação/próxima leva. O aceite não altera a cobertura dos testes de conexão, upload ou execução de transformações e não implica publicação ou commit.

## Pendências de acompanhamento

- [x] Confirmar visualmente os ajustes AUD-002 e AUD-003. Aprovado pelo usuário em 06/11/2026.
- [x] Confirmar o rótulo “String de conexão (opcional)” na criação de banco (AUD-004). Aprovado pelo usuário em 06/11/2026.
- [x] Confirmar a ajuda completa de PostgreSQL em pt-BR (AUD-005). Aprovado pelo usuário em 06/11/2026.
- [x] Confirmar título, descrição e link da URL pública do servidor de mapas (AUD-017). Aprovado pelo usuário em 06/11/2026.
- [x] Smoke visual dos CTAs no admin, conforme retorno do usuário (AUD-018).
- [x] Smoke do Monitor com usuário comum (AUD-019): menu oculto e `/monitor` e `/monitor/tasks` redirecionando para `/unauthorized`, confirmado em 06/11/2026.
- [x] Smoke de detalhes/Insights e ausência de upsell na incorporação, na amostra relatada pelo usuário.
- [x] Confirmar ausência de upsell em `/admin/embedding`, conforme retorno específico do usuário.
- [x] Conferir alternância entre dashboard como home e home padrão com “Continue de onde parou”; home alternativa de incorporação não aplicável ao cenário testado.
- [x] Smoke relatado de Monitor, Data Studio, detalhes/Insights e incorporação consolidado; AUD-019/AUD-020/AUD-021 aprovados nos cenários testados. Itens adicionais não confirmados explicitamente permanecem separados abaixo.
- [x] Revalidar “Compartilhar” no tooltip após gerar os recursos atualizados (AUD-022), confirmado pelo usuário com imagem.
- [ ] Próxima etapa no ambiente publicado de testes: exercitar upload completo de CSV, adiado pelo usuário.
- [ ] Próxima etapa no ambiente publicado de testes: exercitar lista/menu/editor de transformações, adiados pelo usuário por ausência de conexão elegível local.
- [x] Revalidar as cores SP da lixeira, métricas e hover de coleções nos temas claro e escuro (AUD-009/AUD-010), confirmado pelo usuário em 04/11/2026.
- [x] Smoke complementar dos vermelhos da v64 nos temas claro e escuro: hover de excluir/arquivar, erro de expressão e realce de código, conforme retorno do usuário em 04/11/2026.
- [x] Confirmar os textos do Metabot (AUD-006) e a renderização de Atualizações (AUD-016), conforme retorno do usuário.
- [x] Validar o texto “Esta collection…” e a manutenção de Sobre Metabase, confirmados pelo usuário em 06/11/2026.
- [x] Validar ausência de “Obter ajuda” no menu e contraste da aba administrativa ativa, confirmados em 06/11/2026.
- [x] Validar links ocultados em `/admin/help`, preservação dos diagnósticos/detalhes avançados e contraste do hover das abas administrativas, aprovados pelo usuário em 06/11/2026.
- [x] Confirmar especificamente os blocos de `/getting-started` (com print enviado) e o link de ajuda da conexão (AUD-015), aprovados no aceite final do usuário.
- [x] Retomar as próximas etapas solicitadas pelo usuário e consolidar seus retornos, conforme registros de tradução, home, Data Studio e acesso ao Monitor.
- [x] Validar sidebar recolhida do Data Studio e confirmar manutenção de Sobre Metabase, conforme retorno do usuário em 06/11/2026.
- [x] Validar brasão SP junto ao ícone do Monitor e comportamento ao recolher/expandir a sidebar (AUD-023), aprovados no aceite final do usuário.
- [x] AUD-024: validação visual dos campos de todos os tipos de banco em `/admin/databases/create`, incluindo Druid, aprovada pelo usuário; nenhuma string em inglês relatada.
Acompanhamento contínuo: registrar novas ocorrências informadas pelo usuário com rota, texto, causa, correção e evidência de validação; não constitui uma pendência específica de fechamento.

Ao acrescentar correções SP, atualizar também a lista canônica correspondente no mesmo conjunto de alterações. Não marcar itens como validados apenas por estarem implementados ou por testes automatizados terem passado.
