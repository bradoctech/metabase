# Dashboard demo: Abono de Permanência

Protótipo **nativo** (nível A da [análise de viabilidade](../viabilidade-dashboard-abono-permanencia.md)) para apresentar no seu Metabase local. Os dados são mock (jul–dez/2025) e não falam com a base do cliente.

## O que o seed cria

- Banco SQLite `abono_permanencia.sqlite` com duas tabelas: `abono_folha` e `abono_divergencia`
- Coleção **Abono de Permanência (demo)**
- Dashboard em largura full, quatro colunas na mesma linha:

| Coluna | Cards nativos |
| --- | --- |
| Cabeçalho | Heading **Abono de Permanência** + filtro **Período** (`date/all-options`, padrão `2025-07-01~2025-12-31`) |
| 1. Evolução | 3 Numbers + Combo (linha de valor / barras de beneficiários, **Stack series**) |
| 2. Comparação + Top 3 | Numbers Analisado vs Divergências (valor, pessoas, %) + 3 Bars |
| 3. Scatter | Bolhas financeira × normativa × pessoas. Clique atualiza o órgão |
| 4. Detalhe | Heading `{{orgao}}` (padrão Seduc) + tabelas motivo/cargo + Number da média mensal |

O check de apply do mockup não entra: o Metabase aplica o período no select.

## Subir no seu ambiente

1. Metabase rodando e **setup já feito**, com um usuário **admin**.
2. Na raiz do repositório:

```
python3 docs/internal/abono-demo/seed_abono_demo.py \
  --url http://localhost:3000 \
  --email SEU_ADMIN@empresa.com \
  --password 'sua-senha'
```

Ou via ambiente: `MB_URL`, `MB_EMAIL`, `MB_PASSWORD`.

3. Abra a URL que o script imprimir (`/dashboard/<id>`), ou a coleção **Abono de Permanência (demo)**.

Rodar de novo arquiva o dashboard anterior com o mesmo nome e cria outro. O SQLite é recriado a cada execução.

Só gerar o arquivo, sem API:

```
python3 docs/internal/abono-demo/seed_abono_demo.py --sqlite-only
```

## Docker

O Metabase precisa **enxergar o caminho do SQLite**. Se o app roda num container, monte a pasta e aponte o banco para o path **dentro** do container, por exemplo `/data/abono_permanencia.sqlite`. Depois ajuste Admin > Databases ou rode o seed a partir de um ambiente que use esse mesmo path.

No WSL / jar / `clojure -M:dev` na mesma máquina, o path absoluto gerado pelo script costuma funcionar.

## Totais do mock (jul–dez/2025)

- Valor total: **R$ 300.979.598,94**
- Valor mensal médio: **R$ 50.163.266,49**
- Valor por beneficiário/mês: **R$ 1.967,18**
- Divergências: **12%** da folha (o restante é “analisado”)
- Órgãos: Seduc (maior bolha), SES, SSP, SEFAZ, SEINFRA, DETRAN

## O que ainda não é nativo neste protótipo

Deixado de propósito para a próxima etapa:

- KPIs + Combo no **mesmo** card
- Fundo vermelho no box inteiro de Divergências (só a cor do número)
- Ícones de unidade, olho nos pontos, quadrantes e labels nas bolhas
- Accordion com % no header da coluna 4
- Uma moldura única por coluna

Clique na bolha **Seduc** (ou outro órgão) para ver o detalhe da coluna 4 mudar.
