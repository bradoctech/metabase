# EDD-1523 — Auditoria pós-update do Metabase v64

**Issue / branch:** `EDD-1523`  
**Status:** em andamento  
**Início do registro:** 30/10/2026  
**Última atualização:** 02/11/2026

## Objetivo e referências

Registrar os problemas encontrados na auditoria pós-update para a v64, os ajustes necessários para preservar o tema e os comportamentos SP, as correções aplicadas e as evidências de validação. Este documento será atualizado a cada novo levantamento, sem substituir a estratégia já acordada.

Referências: [instruções do agente](./INSTRUCOES-AGENTE.md), [estratégia do salto 60→64](./estrategia-salto-60-64.md), [notas da etapa](./notas-etapa-60-64.md), [manifesto de customizações](./manifesto-customizacoes.md), [runbook](./runbook-atualizacao.md), [listas canônicas](./lists/README.md) e [checklist de smoke](./checklist-smoke-test.md).

## Resumo do levantamento

**Revalidação mais recente do usuário:** traduções de `/admin` corretas até onde verificadas, com exceção dos dois textos de mapas registrados em AUD-017. `/data-studio/` e a aplicação principal também foram revalidados sem novas ocorrências de tradução relatadas. Esse retorno se refere a traduções; não encerra os pontos de cores, menus, upsells ou estados sem dados do levantamento prévio. Os itens específicos abaixo mantêm suas evidências próprias.

| ID | Área / rota | Ponto identificado | Situação |
| --- | --- | --- | --- |
| AUD-001 | `/admin/settings/general` | Textos em inglês mesmo com pt-BR ativo | Usuário confirmou resolução após regenerar recursos e reiniciar o backend, até onde testou |
| AUD-002 | `/admin/settings/general` | “Tabelas e X-Rays” e pontuação duplicada na descrição de rastreamento | Ajustes aplicados ao `.po`; revalidação específica pendente |
| AUD-003 | `/admin/settings/email` | Erro de digitação “Adicionr destinatários…” identificado no catálogo | Correção aplicada ao `.po`; revalidação específica pendente |
| AUD-004 | `/admin/databases/create` | Rótulo “Connection string (optional)” sem tradução | Marcação e tradução aplicadas; validação visual pendente |
| AUD-005 | `/admin/databases/create` → “A ajuda está aqui” → PostgreSQL | Corpo do painel de ajuda em inglês | Markdown pt-BR e seleção por idioma implementados; testes passaram; validação visual pendente |
| AUD-017 | `/admin/settings/maps` | Título e descrição da URL pública do servidor de mapas em inglês | Entradas adicionadas ao catálogo pt-BR e ao template; revalidação visual pendente |
| AUD-018 | Admin, Data Studio, Monitor e fluxos comerciais da aplicação | CTAs e links de upsell | Política SP implementada sem montar as ofertas; validação automatizada concluída; smoke visual pendente |

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

**Validação:** `git diff --check` passou. Falta confirmar visualmente as duas entradas após gerar e carregar os recursos atualizados.

## AUD-003 — Erro de digitação na configuração de e-mail

**Arquivo:** `locales/pt-BR.po`.  
**Entrada:** `Add Recipients as CC or BCC`.

**Correção aplicada:** “Adicionr destinatários como CC ou BCC” → “Adicionar destinatários como CC ou BCC”. O erro foi confirmado no catálogo durante a leitura das pendências históricas.

**Validação:** `git diff --check` passou. Falta revalidar especificamente o rótulo em `/admin/settings/email` com os recursos atualizados.

## AUD-004 — Rótulo da string de conexão

**Rota:** `/admin/databases/create`.  
**Trecho informado:** `Connection string (optional)`.

**Causa:** o atributo `label` estava escrito diretamente em inglês em `frontend/src/metabase/databases/components/DatabaseConnectionUri/DatabaseConnectionStringField.tsx`, sem a marcação `t` do ttag. Regenerar os recursos não traduzia esse rótulo.

**Ajustes aplicados:**

- Marcar o rótulo com `t` para tradução.
- Adicionar `Connection string (optional)` → “String de conexão (opcional)” a `locales/pt-BR.po`.
- Incluir o componente em `lists/dual-changed.txt` para preservar o ajuste em upgrades futuros.

A chave já estava no template `locales/metabase.po` e não precisou ser acrescentada novamente.

**Validação:** `git diff --check` passou. Falta gerar os recursos, reiniciar o backend, incorporar a alteração no frontend e confirmar o rótulo na tela.

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

**Validação visual pendente:** após recompilar o frontend, reabrir o painel e conferir o conteúdo completo, a rolagem e os links. A tradução deste Markdown não depende de regenerar os `.po`.

## Levantamento prévio do usuário — a conferir

Recebido em 30/10/2026 para alinhamento de contexto. O usuário informou que alguns pontos já foram corrigidos. Os itens abaixo não foram revalidados nesta conversa e não representam autorização para iniciar sua implementação agora. A aplicação permanece sem novas alterações por causa deste levantamento.

| ID | Área / rota | Ponto informado / ajuste proposto | Situação |
| --- | --- | --- | --- |
| AUD-006 | Toggle do Metabot | Textos em inglês | A verificar |
| AUD-007 | Menu do usuário, no topo direito | Remover Ajuda → “Obter ajuda”; avaliar também “Sobre Metabase”; verificar se os itens existem na PRODESP | A verificar; remoção de “Sobre Metabase” ainda é uma possibilidade, não decisão fechada |
| AUD-008 | Adicione seus dados → CSV | Texto sem tradução | A verificar; identificar trecho exato |
| AUD-009 | Lixeira | Aviso “Este collection está no lixo”: conferir o vermelho do fundo e localizar outros usos do mesmo tom para adequação à paleta SP | A verificar; registrar também o texto misto como candidato à revisão de tradução |
| AUD-010 | `/browse/metrics` e hover de coleção | Ícones com vermelho aparentemente fora da paleta; no hover de uma coleção, cor diferente da de “Nome” | A verificar com referência visual e tokens SP |
| AUD-011 | Navegação administrativa | Texto do item ativo claro sobre fundo claro, prejudicando a leitura; ajuste proposto para preto | A verificar |
| AUD-012 | `/admin/settings/uploads` | Ocultar chamadas “Atualize para o Metabase Pro”; revisar textos em inglês no hover de informação | CTA e contêiner lateral bloqueados pela política SP; validar a tela e eventuais hovers remanescentes |
| AUD-013 | Área administrativa | Revisar traduções e ocultar chamadas para planos Pro | Traduções revalidadas pelo usuário até onde testado; política de ofertas aplicada; smoke visual pendente |
| AUD-014 | Menus administrativos | Ocultar “Sincronização remota”, itens com diamante que levam ao Pro e “Licença” | Entradas promocionais não renderizadas e menu Licença oculto; recursos disponíveis preservados; smoke visual pendente |
| AUD-015 | `/admin/databases/create` | Ocultar o link “Precisa de ajuda para conectar?” que leva ao Metabase | A verificar; identificar o link exato antes de alterar o painel de ajuda |
| AUD-016 | `/admin/settings/updates` | Tratar falta de dados | A verificar; reproduzir o estado e definir o comportamento esperado |

### Cruzamento com os ajustes desta conversa

- **Textos em inglês em `/admin/databases/create`:** já há duas ocorrências tratadas, AUD-004 (rótulo da string de conexão) e AUD-005 (documentação de PostgreSQL). A validação visual continua pendente; isso não encerra a auditoria de todos os textos da rota.
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

**Validação:** conferir as novas entradas e a preservação do placeholder; `git diff --check`. Falta regenerar os recursos com `./bin/i18n/build-translation-resources`, reiniciar o backend e confirmar título, descrição e link na tela.

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

**Situação:** implementada no frontend; validação automatizada concluída e smoke visual pendente. Registro AUD-018, relacionado a AUD-012/AUD-013/AUD-014.

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
- Smoke visual pendente: admin, Data Studio, Monitor, Insights, incorporação e CSV; conferir espaços vazios, separadores e as funções disponíveis na instância.
- O experimento de cor em `UpsellCta.module.css` foi removido a pedido do usuário: restaurado `background-color: var(--mb-color-core-metabase_brand)`, sem cores de teste.
- Novos componentes upstream que não usem os pontos de integração existentes ainda exigem revisão no próximo upgrade. As listas protegem as adaptações atuais; não detectam automaticamente novas ofertas.

## Pendências de acompanhamento

- [ ] Confirmar visualmente os ajustes AUD-002 e AUD-003.
- [ ] Confirmar o rótulo “String de conexão (opcional)” na criação de banco (AUD-004).
- [ ] Confirmar a ajuda completa de PostgreSQL em pt-BR (AUD-005).
- [ ] Confirmar título, descrição e link da URL pública do servidor de mapas (AUD-017).
- [ ] Smoke visual da política comercial (AUD-018), incluindo preservação das funções disponíveis, menus e redirecionamentos.
- [ ] Conferir o estado atual dos itens AUD-006 a AUD-016 antes de implementar, distinguindo os que já foram corrigidos.
- [ ] Registrar novas ocorrências informadas pelo usuário, com rota, texto, causa, correção e evidência de validação.

Ao acrescentar correções SP, atualizar também a lista canônica correspondente no mesmo conjunto de alterações. Não marcar itens como validados apenas por estarem implementados ou por testes automatizados terem passado.
