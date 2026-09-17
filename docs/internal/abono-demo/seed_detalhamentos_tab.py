#!/usr/bin/env python3
"""Add the 'Detalhamentos por Situação' hub tab (cross-filter in-page details).

Keeps the existing mock layout on tab 1 (Visão analítica). Tab 2 is a hub of
clickable cards; each group has a detail panel below that updates via
cross-filter. Global Período / Órgão stay on the same dashboard (no new page).

    python3 docs/internal/abono-demo/seed_detalhamentos_tab.py \
      --url http://localhost:3001 \
      --email SEU_ADMIN@empresa.com \
      --password 'sua-senha' \
      --dashboard-id 10

Environment: MB_URL, MB_EMAIL, MB_PASSWORD, MB_DASHBOARD_ID
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

PARAM_PERIODO = "a1b2c3d4"
PARAM_ORGAO = "b2c3d4e5"
DEFAULT_PERIODO = "2025-07-01~2025-12-31"
DEFAULT_ORGAO = "Seduc"
DASHBOARD_NAME = "Abono de Permanência"
COLLECTION_NAME = "Abono de Permanência (demo)"
TAB_OVERVIEW = "Visão analítica"
TAB_HUB = "Detalhamentos por Situação"
DETAIL_PREFIX = "[Detalhe] "
HUB_CARD_PREFIX = "[Hub] "

# One situation-filter per group so each detail panel updates independently.
HUB_GROUPS: list[dict[str, Any]] = [
    {
        "name": "Divergências",
        "param_id": "d1v2e3r4",
        "param_slug": "sit_divergencias",
        "param_name": "Situação (Divergências)",
        "items": [
            {
                "key": "servidores_divergencia",
                "title": "Servidores com divergência",
                "description": "Lista completa de servidores com divergência de cálculo.",
                "value": 3811,
            },
            {
                "key": "divergencia_previdenciaria",
                "title": "Divergência da contribuição previdenciária",
                "description": "Casos com diferença na contribuição previdenciária.",
                "value": None,
            },
            {
                "key": "ocorrencias_previdenciaria",
                "title": "Detalhamento das ocorrências da contribuição previdenciária",
                "description": "Ocorrências a maior / detalhamento por ocorrência.",
                "value": None,
            },
        ],
    },
    {
        "name": "Elegibilidade",
        "param_id": "e1l2e3g4",
        "param_slug": "sit_elegibilidade",
        "param_name": "Situação (Elegibilidade)",
        "items": [
            {
                "key": "comissionado_indevido",
                "title": "Cargo comissionado recebendo abono indevidamente",
                "description": "Comissionados sem direito que estão recebendo.",
                "value": 3808,
            },
            {
                "key": "vinculos_nao_permitem",
                "title": "Detalhamento dos vínculos que não permitem abono",
                "description": "Vínculos irregulares / sem elegibilidade.",
                "value": 3291,
            },
            {
                "key": "terceirizados",
                "title": "Terceirizados que não podem receber",
                "description": "Terceirizados fora da regra de abono.",
                "value": None,
            },
            {
                "key": "exclusivamente_comissionados",
                "title": "Exclusivamente comissionados que não podem receber",
                "description": "Somente comissionados sem direito.",
                "value": 0,
            },
        ],
    },
    {
        "name": "Situações específicas",
        "param_id": "s1i2t3e4",
        "param_slug": "sit_especificas",
        "param_name": "Situação (Específicas)",
        "items": [
            {
                "key": "estabilizados",
                "title": "Servidores estabilizados com abono implantado",
                "description": "Estabilizados (pré-CF/88) com abono.",
                "value": 2447568.66,
                "currency": True,
            },
            {
                "key": "analise_judicial",
                "title": "Casos em análise judicial",
                "description": "Processos / análise judicial.",
                "value": None,
            },
            {
                "key": "transicao",
                "title": "Casos de transição / após",
                "description": "Situações de transição.",
                "value": 1067,
            },
            {
                "key": "categoria_extinta",
                "title": "Cargo ou categoria extinta",
                "description": "Cargos/categorias extintas.",
                "value": 2143,
            },
        ],
    },
    {
        "name": "Regra legislativa",
        "param_id": "r1e2g3r4",
        "param_slug": "sit_legislativa",
        "param_name": "Situação (Legislativa)",
        "items": [
            {
                "key": "restricao_legal",
                "title": "Cargos com restrição legal de elegibilidade parcial",
                "description": "Elegibilidade parcial por restrição legal.",
                "value": None,
            },
        ],
    },
]


class MetabaseClient:
    def __init__(self, base_url: str, email: str, password: str):
        self.base_url = base_url.rstrip("/")
        self.session_id = self._login(email, password)

    def _login(self, email: str, password: str) -> str:
        data = self.request(
            "POST",
            "/api/session",
            {"username": email, "password": password},
            authenticated=False,
        )
        session_id = data.get("id")
        if not session_id:
            raise RuntimeError(f"Login não retornou sessão: {data}")
        return session_id

    def request(
        self,
        method: str,
        path: str,
        body: Any | None = None,
        authenticated: bool = True,
    ) -> Any:
        url = self.base_url + path
        headers = {"Content-Type": "application/json"}
        if authenticated:
            headers["X-Metabase-Session"] = self.session_id
        payload = None if body is None else json.dumps(body).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                raw = resp.read()
                if not raw:
                    return None
                return json.loads(raw.decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"{method} {path} -> HTTP {exc.code}: {detail}") from exc
        except urllib.error.URLError as exc:
            raise RuntimeError(
                f"Não conectou em {self.base_url} ({exc.reason}). "
                "Suba o Metabase e tente de novo."
            ) from exc


def virtual_heading(text: str) -> dict:
    return {
        "text": text,
        "virtual_card": {
            "name": None,
            "display": "heading",
            "visualization_settings": {},
            "archived": False,
        },
        "dashcard.background": False,
    }


def virtual_text(text: str) -> dict:
    return {
        "text": text,
        "virtual_card": {
            "name": None,
            "display": "text",
            "visualization_settings": {},
            "archived": False,
        },
        "dashcard.background": True,
    }


def find_named(items: list[dict], name: str) -> dict | None:
    wanted = name.lower()
    for item in items:
        if (item.get("name") or "").lower() == wanted:
            return item
    return None


def find_dashboard(mb: MetabaseClient, dashboard_id: int | None) -> dict:
    if dashboard_id:
        dash = mb.request("GET", f"/api/dashboard/{dashboard_id}")
        if not dash or dash.get("archived"):
            raise RuntimeError(f"Dashboard {dashboard_id} não encontrado.")
        return dash

    roots = mb.request("GET", "/api/collection")
    collection = find_named(roots if isinstance(roots, list) else [], COLLECTION_NAME)
    if not collection:
        raise RuntimeError(
            f"Coleção '{COLLECTION_NAME}' não encontrada. "
            "Rode seed_abono_demo.py antes ou passe --dashboard-id."
        )
    items = mb.request(
        "GET",
        f"/api/collection/{collection['id']}/items?models=dashboard",
    )
    data = items.get("data", items) if isinstance(items, dict) else items
    for item in data:
        if (item.get("name") or "") == DASHBOARD_NAME and not item.get("archived"):
            return mb.request("GET", f"/api/dashboard/{item['id']}")
    raise RuntimeError(f"Dashboard '{DASHBOARD_NAME}' não encontrado na coleção demo.")


def archive_prefixed(mb: MetabaseClient, collection_id: int, prefix: str) -> None:
    items = mb.request(
        "GET",
        f"/api/collection/{collection_id}/items?models=dashboard&models=card",
    )
    data = items.get("data", items) if isinstance(items, dict) else items
    for item in data:
        name = item.get("name") or ""
        if not name.startswith(prefix) or item.get("archived"):
            continue
        model = item.get("model")
        if model == "dashboard":
            mb.request("PUT", f"/api/dashboard/{item['id']}", {"archived": True})
        elif model == "card":
            mb.request("PUT", f"/api/card/{item['id']}", {"archived": True})


def situation_params() -> list[dict]:
    return [
        {
            "id": g["param_id"],
            "name": g["param_name"],
            "slug": g["param_slug"],
            "type": "string/=",
            "sectionId": "string",
            "isMultiSelect": False,
        }
        for g in HUB_GROUPS
    ]


def base_parameters(existing: list[dict] | None) -> list[dict]:
    """Keep período/órgão; replace/add situation filters."""
    keep_ids = {PARAM_PERIODO, PARAM_ORGAO}
    sit_ids = {g["param_id"] for g in HUB_GROUPS}
    base = [
        p
        for p in (existing or [])
        if p.get("id") in keep_ids and p.get("id") not in sit_ids
    ]
    have = {p["id"] for p in base}
    if PARAM_PERIODO not in have:
        base.append(
            {
                "id": PARAM_PERIODO,
                "name": "Período",
                "slug": "periodo",
                "type": "date/all-options",
                "sectionId": "date",
                "default": DEFAULT_PERIODO,
            }
        )
    if PARAM_ORGAO not in have:
        base.append(
            {
                "id": PARAM_ORGAO,
                "name": "Órgão",
                "slug": "orgao",
                "type": "string/=",
                "sectionId": "string",
                "default": DEFAULT_ORGAO,
                "isMultiSelect": False,
            }
        )
    return base + situation_params()


def crossfilter_behavior(param_id: str, param_name: str) -> dict:
    return {
        "type": "crossfilter",
        "parameterMapping": {
            param_id: {
                "id": param_id,
                "source": {"type": "column", "id": "situacao", "name": "situacao"},
                "target": {"type": "parameter", "id": param_id},
            }
        },
    }


def create_hub_nav_card(
    mb: MetabaseClient,
    collection_id: int,
    database_id: int,
    item: dict[str, Any],
    param_id: str,
    param_name: str,
) -> dict:
    """Bar with one category so click can pass `situacao` via cross-filter."""
    title = item["title"].replace("'", "''")
    if item.get("currency") and item.get("value") is not None:
        sql = (
            f"SELECT '{title}' AS situacao, CAST({item['value']} AS FLOAT) AS indicador"
        )
        col_settings = {
            json.dumps(["name", "indicador"]): {
                "number_style": "currency",
                "currency": "BRL",
                "currency_style": "symbol",
                "decimals": 2,
            }
        }
    elif item.get("value") is not None:
        sql = f"SELECT '{title}' AS situacao, {int(item['value'])} AS indicador"
        col_settings = {}
    else:
        # No KPI: still one clickable bar so cross-filter works.
        sql = f"SELECT '{title}' AS situacao, 1 AS indicador"
        col_settings = {}

    viz = {
        "graph.dimensions": ["situacao"],
        "graph.metrics": ["indicador"],
        "graph.x_axis.labels_enabled": False,
        "graph.y_axis.labels_enabled": False,
        "graph.label_value_formatting": "auto",
        "graph.show_values": True,
        "click_behavior": crossfilter_behavior(param_id, param_name),
        "column_settings": col_settings,
    }

    return mb.request(
        "POST",
        "/api/card",
        {
            "name": f"{HUB_CARD_PREFIX}{item['title']}",
            "collection_id": collection_id,
            "display": "row",
            "dataset_query": {
                "database": database_id,
                "type": "native",
                "native": {"query": sql, "template-tags": {}},
            },
            "visualization_settings": viz,
            "description": item["description"],
        },
    )


def create_detail_question(
    mb: MetabaseClient,
    collection_id: int,
    database_id: int,
    group: dict[str, Any],
) -> dict:
    """Placeholder detail table driven by the group's situation filter."""
    slug = group["param_slug"]
    tag_id = group["param_id"]
    # f-string: {{{{slug}}}} -> {{slug}} (Metabase text template tag)
    sql = (
        "SELECT\n"
        f"  {{{{{slug}}}}} AS situacao_selecionada,\n"
        "  'Mock — no cliente, aqui entra a tabela/pergunta completa desta situação' AS observacao,\n"
        "  'Período e Órgão do dashboard continuam valendo nos cards ligados a eles' AS filtros_globais"
    )

    tags = {
        slug: {
            "id": tag_id,
            "name": slug,
            "display-name": group["param_name"],
            "type": "text",
            "required": False,
        }
    }

    return mb.request(
        "POST",
        "/api/card",
        {
            "name": f"{HUB_CARD_PREFIX}Detalhe — {group['name']}",
            "collection_id": collection_id,
            "display": "table",
            "dataset_query": {
                "database": database_id,
                "type": "native",
                "native": {"query": sql, "template-tags": tags},
            },
            "visualization_settings": {"table.pivot": False},
            "description": f"Painel de detalhe in-page do grupo {group['name']}.",
        },
    )


def pick_database_id(mb: MetabaseClient, dash: dict) -> int:
    for dc in dash.get("dashcards") or []:
        card = dc.get("card") or {}
        dq = card.get("dataset_query") or {}
        db_id = dq.get("database")
        if db_id:
            return int(db_id)
    dbs = mb.request("GET", "/api/database")
    data = dbs.get("data", dbs) if isinstance(dbs, dict) else dbs
    named = find_named(data, "Abono de Permanência (mock)")
    if named:
        return int(named["id"])
    if not data:
        raise RuntimeError("Nenhum database disponível no Metabase.")
    return int(data[0]["id"])


def serialize_existing_dashcard(dc: dict, tab_id: int) -> dict:
    out: dict[str, Any] = {
        "id": dc["id"],
        "card_id": dc.get("card_id"),
        "row": dc.get("row", 0),
        "col": dc.get("col", 0),
        "size_x": dc.get("size_x", 4),
        "size_y": dc.get("size_y", 4),
        "parameter_mappings": dc.get("parameter_mappings") or [],
        "visualization_settings": dc.get("visualization_settings") or {},
        "series": [{"id": s["id"]} for s in (dc.get("series") or []) if s.get("id")],
        "dashboard_tab_id": tab_id,
        "inline_parameters": dc.get("inline_parameters") or [],
    }
    if dc.get("action_id") is not None:
        out["action_id"] = dc["action_id"]
    return out


def build_hub_dashcards(
    mb: MetabaseClient,
    collection_id: int,
    database_id: int,
    tab_id: int,
    next_neg_id: int,
) -> tuple[list[dict], int]:
    cards: list[dict] = []
    nid = next_neg_id

    def alloc() -> int:
        nonlocal nid
        nid -= 1
        return nid + 1

    cards.append(
        {
            "id": alloc(),
            "card_id": None,
            "row": 0,
            "col": 0,
            "size_x": 24,
            "size_y": 1,
            "dashboard_tab_id": tab_id,
            "inline_parameters": [PARAM_PERIODO, PARAM_ORGAO],
            "parameter_mappings": [],
            "visualization_settings": virtual_heading("Detalhamentos por Situação"),
            "series": [],
        }
    )
    cards.append(
        {
            "id": alloc(),
            "card_id": None,
            "row": 1,
            "col": 0,
            "size_x": 24,
            "size_y": 2,
            "dashboard_tab_id": tab_id,
            "inline_parameters": [],
            "parameter_mappings": [],
            "visualization_settings": virtual_text(
                "Clique em um card de situação para **atualizar o detalhe do grupo** "
                "(cross-filter), sem sair desta página. "
                "Os filtros globais **Período** e **Órgão** continuam valendo no dashboard.\n\n"
                "_Mock local — indicadores de referência; o painel abaixo de cada grupo "
                "mostra a situação selecionada._"
            ),
            "series": [],
        }
    )

    row = 3
    for group in HUB_GROUPS:
        param_id = group["param_id"]
        slug = group["param_slug"]
        items = group["items"]

        cards.append(
            {
                "id": alloc(),
                "card_id": None,
                "row": row,
                "col": 0,
                "size_x": 24,
                "size_y": 1,
                "dashboard_tab_id": tab_id,
                "inline_parameters": [],
                "parameter_mappings": [],
                "visualization_settings": virtual_heading(group["name"]),
                "series": [],
            }
        )
        row += 1

        # Navigation cards (NOT mapped to the situation filter)
        col = 0
        n = len(items)
        width = 6 if n >= 4 else (8 if n == 3 else (12 if n == 2 else 24))
        for item in items:
            if col + width > 24:
                col = 0
                row += 4
            nav = create_hub_nav_card(
                mb, collection_id, database_id, item, param_id, group["param_name"]
            )
            cards.append(
                {
                    "id": alloc(),
                    "card_id": nav["id"],
                    "row": row,
                    "col": col,
                    "size_x": width,
                    "size_y": 4,
                    "dashboard_tab_id": tab_id,
                    "inline_parameters": [],
                    "parameter_mappings": [],  # navigation card stays disconnected
                    "visualization_settings": nav.get("visualization_settings") or {},
                    "series": [],
                }
            )
            col += width
        row += 4

        # Detail heading + text + table for this group
        cards.append(
            {
                "id": alloc(),
                "card_id": None,
                "row": row,
                "col": 0,
                "size_x": 24,
                "size_y": 1,
                "dashboard_tab_id": tab_id,
                "inline_parameters": [param_id],
                "parameter_mappings": [],
                "visualization_settings": virtual_heading(
                    f"Detalhe — {group['name']}"
                ),
                "series": [],
            }
        )
        row += 1

        detail_md = (
            f"**Situação selecionada:** {{{{{slug}}}}}\n\n"
            "Clique em um dos cards acima neste grupo para preencher este painel. "
            "No ambiente do cliente, aqui entraria a **tabela completa / pergunta salva** "
            "da situação, já filtrada por Período e Órgão."
        )

        cards.append(
            {
                "id": alloc(),
                "card_id": None,
                "row": row,
                "col": 0,
                "size_x": 10,
                "size_y": 4,
                "dashboard_tab_id": tab_id,
                "inline_parameters": [],
                "parameter_mappings": [
                    {
                        "parameter_id": param_id,
                        "target": ["text-tag", slug],
                    }
                ],
                "visualization_settings": virtual_text(detail_md),
                "series": [],
            }
        )

        detail_q = create_detail_question(mb, collection_id, database_id, group)
        cards.append(
            {
                "id": alloc(),
                "card_id": detail_q["id"],
                "row": row,
                "col": 10,
                "size_x": 14,
                "size_y": 4,
                "dashboard_tab_id": tab_id,
                "inline_parameters": [],
                "parameter_mappings": [
                    {
                        "parameter_id": param_id,
                        "card_id": detail_q["id"],
                        "target": ["variable", ["template-tag", slug]],
                    }
                ],
                "visualization_settings": {},
                "series": [],
            }
        )
        row += 5

    return cards, nid


def seed_tab(mb: MetabaseClient, dashboard_id: int | None) -> str:
    dash = find_dashboard(mb, dashboard_id)
    dash_id = dash["id"]
    collection_id = dash.get("collection_id")
    if collection_id is None:
        raise RuntimeError("Dashboard sem collection_id; mova-o para a coleção demo.")

    # Clean previous hub artifacts (detail dashboards + hub cards)
    archive_prefixed(mb, collection_id, DETAIL_PREFIX)
    archive_prefixed(mb, collection_id, HUB_CARD_PREFIX)

    database_id = pick_database_id(mb, dash)

    tabs_payload = [
        {"id": -1, "name": TAB_OVERVIEW},
        {"id": -2, "name": TAB_HUB},
    ]

    existing_tabs = dash.get("tabs") or []
    hub_tab_ids = {t["id"] for t in existing_tabs if t.get("name") == TAB_HUB}
    overview_tab_ids = {t["id"] for t in existing_tabs if t.get("name") == TAB_OVERVIEW}

    overview_source: list[dict] = []
    for dc in dash.get("dashcards") or []:
        tab_id = dc.get("dashboard_tab_id")
        if not existing_tabs:
            overview_source.append(dc)
            continue
        if tab_id in hub_tab_ids:
            continue
        if overview_tab_ids and tab_id not in overview_tab_ids:
            continue
        overview_source.append(dc)

    existing = [serialize_existing_dashcard(dc, -1) for dc in overview_source]
    hub_cards, _ = build_hub_dashcards(
        mb, collection_id, database_id, tab_id=-2, next_neg_id=-100
    )

    parameters = base_parameters(dash.get("parameters"))

    mb.request(
        "PUT",
        f"/api/dashboard/{dash_id}",
        {
            "name": dash.get("name") or DASHBOARD_NAME,
            "width": dash.get("width") or "full",
            "parameters": parameters,
            "tabs": tabs_payload,
            "dashcards": existing + hub_cards,
        },
    )

    updated = mb.request("GET", f"/api/dashboard/{dash_id}")
    hub_tab = next(
        (t for t in (updated.get("tabs") or []) if t.get("name") == TAB_HUB),
        None,
    )
    tab_qs = ""
    if hub_tab:
        slug = f"{hub_tab['id']}-{TAB_HUB.lower().replace(' ', '-')}"
        tab_qs = f"&tab={slug}"

    return (
        f"{mb.base_url}/dashboard/{dash_id}-abono-de-permanencia"
        f"?orgao={DEFAULT_ORGAO}&periodo={DEFAULT_PERIODO}{tab_qs}"
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=os.environ.get("MB_URL", "http://localhost:3001"))
    parser.add_argument("--email", default=os.environ.get("MB_EMAIL", ""))
    parser.add_argument("--password", default=os.environ.get("MB_PASSWORD", ""))
    parser.add_argument(
        "--dashboard-id",
        type=int,
        default=int(os.environ["MB_DASHBOARD_ID"])
        if os.environ.get("MB_DASHBOARD_ID")
        else 10,
        help="ID do dashboard Abono (default: 10).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.email or not args.password:
        print(
            "Informe --email / --password (ou MB_EMAIL / MB_PASSWORD).\n"
            "Exemplo:\n"
            "  python3 docs/internal/abono-demo/seed_detalhamentos_tab.py \\\n"
            "    --url http://localhost:3001 \\\n"
            "    --email admin@suaempresa.com \\\n"
            "    --password '***' \\\n"
            "    --dashboard-id 10",
            file=sys.stderr,
        )
        return 1

    mb = MetabaseClient(args.url, args.email, args.password)
    me = mb.request("GET", "/api/user/current")
    if not me.get("is_superuser"):
        print("A conta precisa ser admin para criar cards/dashboards.", file=sys.stderr)
        return 1

    url = seed_tab(mb, args.dashboard_id)
    print("Aba 'Detalhamentos por Situação' atualizada (cross-filter in-page).")
    print(f"Abra: {url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
