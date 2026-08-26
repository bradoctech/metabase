#!/usr/bin/env python3
"""Seed a native Metabase dashboard for the Abono de Permanência mock.

Requires a running Metabase (admin user) and the SQLite mock built next to this file.

    python3 docs/internal/abono-demo/seed_abono_demo.py

Environment:
    MB_URL       default http://localhost:3000
    MB_EMAIL     admin email
    MB_PASSWORD  admin password
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from build_sqlite import build  # noqa: E402

COLLECTION_NAME = "Abono de Permanência (demo)"
DATABASE_NAME = "Abono de Permanência (mock)"
DASHBOARD_NAME = "Abono de Permanência"

PARAM_PERIODO = "a1b2c3d4"
PARAM_ORGAO = "b2c3d4e5"

DEFAULT_PERIODO = "2025-07-01~2025-12-31"
DEFAULT_ORGAO = "Seduc"

BRL = {
    "number_style": "currency",
    "currency": "BRL",
    "currency_style": "symbol",
    "decimals": 2,
}


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


def col_settings(*pairs: tuple[str, dict]) -> dict:
    return {json.dumps(["name", name]): settings for name, settings in pairs}


def field_ref(field_id: int, extra: dict | None = None) -> list:
    return ["field", field_id, extra]


def mbql(database_id: int, query: dict) -> dict:
    return {"database": database_id, "type": "query", "query": query}


def named_sum(field_id: int, name: str) -> list:
    return [
        "aggregation-options",
        ["sum", field_ref(field_id)],
        {"name": name, "display-name": name},
    ]


def named_avg(field_id: int, name: str) -> list:
    return [
        "aggregation-options",
        ["avg", field_ref(field_id)],
        {"name": name, "display-name": name},
    ]


def map_dimension(parameter_id: str, card_id: int, field_id: int, extra: dict | None = None) -> dict:
    return {
        "parameter_id": parameter_id,
        "card_id": card_id,
        "target": ["dimension", field_ref(field_id, extra)],
    }


def map_template_tag(parameter_id: str, card_id: int, tag: str) -> dict:
    return {
        "parameter_id": parameter_id,
        "card_id": card_id,
        "target": ["dimension", ["template-tag", tag]],
    }


def date_tag(field_id: int) -> dict:
    return {
        "id": "c0ffee01",
        "name": "periodo",
        "display-name": "Período",
        "type": "dimension",
        "dimension": field_ref(field_id),
        "widget-type": "date/all-options",
    }


def orgao_tag(field_id: int) -> dict:
    return {
        "id": "c0ffee02",
        "name": "orgao",
        "display-name": "Órgão",
        "type": "dimension",
        "dimension": field_ref(field_id),
        "widget-type": "string/=",
    }


def virtual_heading(text: str) -> dict:
    card = {
        "name": None,
        "display": "heading",
        "visualization_settings": {},
        "archived": False,
    }
    return {
        "text": text,
        "virtual_card": card,
        "dashcard.background": False,
    }


def find_named(items: list[dict], name: str) -> dict | None:
    wanted = name.lower()
    for item in items:
        if (item.get("name") or "").lower() == wanted:
            return item
    return None


def ensure_database(mb: MetabaseClient, sqlite_file: Path) -> dict:
    dbs = mb.request("GET", "/api/database")
    data = dbs.get("data", dbs) if isinstance(dbs, dict) else dbs
    existing = find_named(data, DATABASE_NAME)
    details = {"db": str(sqlite_file.resolve())}
    if existing:
        mb.request(
            "PUT",
            f"/api/database/{existing['id']}",
            {"name": DATABASE_NAME, "engine": "sqlite", "details": details, "is_full_sync": True},
        )
        db_id = existing["id"]
    else:
        created = mb.request(
            "POST",
            "/api/database",
            {
                "name": DATABASE_NAME,
                "engine": "sqlite",
                "details": details,
                "is_full_sync": True,
                "is_on_demand": False,
            },
        )
        db_id = created["id"]
    mb.request("POST", f"/api/database/{db_id}/sync_schema")
    return wait_for_tables(mb, db_id)


def wait_for_tables(mb: MetabaseClient, db_id: int, timeout: int = 90) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        meta = mb.request("GET", f"/api/database/{db_id}/metadata")
        tables = {t["name"]: t for t in meta.get("tables", []) if t.get("active", True)}
        if "abono_folha" in tables and "abono_divergencia" in tables:
            if all(t.get("fields") for t in (tables["abono_folha"], tables["abono_divergencia"])):
                return tables
        time.sleep(2)
    raise RuntimeError("Timeout esperando o sync das tabelas mock. Veja Admin > Databases.")


def fields_by_name(table: dict) -> dict[str, dict]:
    return {f["name"]: f for f in table.get("fields", [])}


def classify_fields(mb: MetabaseClient, tables: dict) -> None:
    folha = fields_by_name(tables["abono_folha"])
    div = fields_by_name(tables["abono_divergencia"])
    updates = [
        (folha["competencia"]["id"], {"semantic_type": "type/CreationDate"}),
        (folha["valor_total"]["id"], {"semantic_type": "type/Currency"}),
        (folha["valor_analisado"]["id"], {"semantic_type": "type/Currency"}),
        (folha["valor_divergencias"]["id"], {"semantic_type": "type/Currency"}),
        (div["competencia"]["id"], {"semantic_type": "type/CreationDate"}),
        (div["orgao"]["id"], {"semantic_type": "type/Category", "has_field_values": "list"}),
        (div["motivo"]["id"], {"semantic_type": "type/Category", "has_field_values": "list"}),
        (div["cargo"]["id"], {"semantic_type": "type/Category", "has_field_values": "list"}),
        (div["valor"]["id"], {"semantic_type": "type/Currency"}),
    ]
    for field_id, body in updates:
        mb.request("PUT", f"/api/field/{field_id}", body)
    mb.request("POST", f"/api/field/{div['orgao']['id']}/rescan_values")
    mb.request("POST", f"/api/field/{div['motivo']['id']}/rescan_values")


def ensure_collection(mb: MetabaseClient) -> int:
    root = mb.request("GET", "/api/collection/root/items?models=collection")
    items = root.get("data", [])
    existing = find_named(items, COLLECTION_NAME)
    if existing:
        return existing["id"]
    created = mb.request(
        "POST",
        "/api/collection",
        {
            "name": COLLECTION_NAME,
            "description": "Dashboard nativo de demonstração — dados mock, sem integração com a base do cliente.",
        },
    )
    return created["id"]


def archive_old_dashboard(mb: MetabaseClient, collection_id: int) -> None:
    items = mb.request(
        "GET",
        f"/api/collection/{collection_id}/items?models=dashboard",
    ).get("data", [])
    for item in items:
        if item.get("name") == DASHBOARD_NAME:
            mb.request("PUT", f"/api/dashboard/{item['id']}", {"archived": True})


def create_card(mb: MetabaseClient, collection_id: int, **card: Any) -> dict:
    payload = {
        "collection_id": collection_id,
        "type": "question",
        "visualization_settings": {},
        **card,
    }
    return mb.request("POST", "/api/card", payload)


def native_query(database_id: int, sql: str, tags: dict) -> dict:
    return {
        "database": database_id,
        "type": "native",
        "native": {"query": sql, "template-tags": tags},
    }


def seed(mb: MetabaseClient, sqlite_file: Path) -> str:
    tables = ensure_database(mb, sqlite_file)
    classify_fields(mb, tables)
    collection_id = ensure_collection(mb)
    archive_old_dashboard(mb, collection_id)

    folha = tables["abono_folha"]
    diverg = tables["abono_divergencia"]
    ff = fields_by_name(folha)
    df = fields_by_name(diverg)
    db_id = folha["db_id"]

    folha_id = folha["id"]
    diverg_id = diverg["id"]
    f_comp = ff["competencia"]["id"]
    f_valor = ff["valor_total"]["id"]
    f_bens = ff["qtd_beneficiarios"]["id"]
    f_ok_v = ff["valor_analisado"]["id"]
    f_ok_p = ff["qtd_analisado"]["id"]
    f_div_v = ff["valor_divergencias"]["id"]
    f_div_p = ff["qtd_divergencias"]["id"]
    d_comp = df["competencia"]["id"]
    d_orgao = df["orgao"]["id"]
    d_motivo = df["motivo"]["id"]
    d_cargo = df["cargo"]["id"]
    d_valor = df["valor"]["id"]
    d_pessoas = df["qtd_pessoas"]["id"]
    d_score = df["score_normativa"]["id"]

    tags_periodo = {"periodo": date_tag(d_comp)}
    tags_periodo_folha = {"periodo": date_tag(f_comp)}
    tags_both = {"periodo": date_tag(d_comp), "orgao": orgao_tag(d_orgao)}

    red_segment = [{"min": 0, "max": None, "color": "#E75C58", "label": "Divergência"}]

    cards: dict[str, dict] = {}

    def scalar(name: str, field_id: int, table_id: int, extra_settings: dict | None = None) -> dict:
        settings = {
            "column_settings": col_settings(("sum", BRL)),
            **(extra_settings or {}),
        }
        return create_card(
            mb,
            collection_id,
            name=name,
            display="scalar",
            dataset_query=mbql(
                db_id,
                {"source-table": table_id, "aggregation": [["sum", field_ref(field_id)]]},
            ),
            visualization_settings=settings,
        )

    cards["valor_total"] = scalar("Valor total", f_valor, folha_id)
    cards["valor_medio"] = create_card(
        mb,
        collection_id,
        name="Valor mensal médio",
        display="scalar",
        dataset_query=mbql(
            db_id,
            {"source-table": folha_id, "aggregation": [named_avg(f_valor, "media")]},
        ),
        visualization_settings={"column_settings": col_settings(("media", BRL))},
    )
    cards["valor_benef"] = create_card(
        mb,
        collection_id,
        name="Valor por beneficiário/mês",
        display="scalar",
        dataset_query=mbql(
            db_id,
            {
                "source-table": folha_id,
                "aggregation": [
                    [
                        "aggregation-options",
                        ["/", ["sum", field_ref(f_valor)], ["sum", field_ref(f_bens)]],
                        {"name": "per_capita", "display-name": "Valor por beneficiário/mês"},
                    ]
                ],
            },
        ),
        visualization_settings={"column_settings": col_settings(("per_capita", BRL))},
    )

    cards["evolucao"] = create_card(
        mb,
        collection_id,
        name="Evolução",
        display="combo",
        dataset_query=mbql(
            db_id,
            {
                "source-table": folha_id,
                "aggregation": [
                    named_sum(f_valor, "Valor total"),
                    named_sum(f_bens, "Beneficiários"),
                ],
                "breakout": [field_ref(f_comp, {"temporal-unit": "month"})],
            },
        ),
        visualization_settings={
            "graph.dimensions": ["competencia"],
            "graph.metrics": ["Valor total", "Beneficiários"],
            "graph.split_panels": True,
            "graph.show_values": True,
            "graph.label_value_frequency": "all",
            "graph.label_value_formatting": "compact",
            "graph.x_axis.labels_enabled": False,
            "series_settings": {
                "Valor total": {"display": "line", "color": "#509EE3", "line.marker_enabled": True},
                "Beneficiários": {"display": "bar", "color": "#7BBCE7"},
            },
            "column_settings": col_settings(("Valor total", {**BRL, "decimals": 1})),
        },
    )

    cards["analisado_valor"] = scalar("Analisado — valor", f_ok_v, folha_id)
    cards["diverg_valor"] = scalar(
        "Divergências — valor",
        f_div_v,
        folha_id,
        extra_settings={"scalar.segments": red_segment},
    )
    cards["analisado_pessoas"] = create_card(
        mb,
        collection_id,
        name="Analisado — pessoas",
        display="scalar",
        dataset_query=mbql(
            db_id,
            {"source-table": folha_id, "aggregation": [named_sum(f_ok_p, "pessoas")]},
        ),
        visualization_settings={},
    )
    cards["diverg_pessoas"] = create_card(
        mb,
        collection_id,
        name="Divergências — pessoas",
        display="scalar",
        dataset_query=mbql(
            db_id,
            {"source-table": folha_id, "aggregation": [named_sum(f_div_p, "pessoas")]},
        ),
        visualization_settings={"scalar.segments": red_segment},
    )
    cards["analisado_pct"] = create_card(
        mb,
        collection_id,
        name="Analisado — % do valor",
        display="scalar",
        dataset_query=mbql(
            db_id,
            {
                "source-table": folha_id,
                "aggregation": [
                    [
                        "aggregation-options",
                        ["/", ["sum", field_ref(f_ok_v)], ["sum", field_ref(f_valor)]],
                        {"name": "pct", "display-name": "% analisado"},
                    ]
                ],
            },
        ),
        visualization_settings={
            "column_settings": col_settings(("pct", {"number_style": "percent", "decimals": 1})),
        },
    )
    cards["diverg_pct"] = create_card(
        mb,
        collection_id,
        name="Divergências — % do valor",
        display="scalar",
        dataset_query=mbql(
            db_id,
            {
                "source-table": folha_id,
                "aggregation": [
                    [
                        "aggregation-options",
                        ["/", ["sum", field_ref(f_div_v)], ["sum", field_ref(f_valor)]],
                        {"name": "pct", "display-name": "% divergências"},
                    ]
                ],
            },
        ),
        visualization_settings={
            "scalar.segments": red_segment,
            "column_settings": col_settings(("pct", {"number_style": "percent", "decimals": 1})),
        },
    )

    def top3_bar(name: str, breakout_field: int, extra: dict | None = None) -> dict:
        return create_card(
            mb,
            collection_id,
            name=name,
            display="bar",
            dataset_query=mbql(
                db_id,
                {
                    "source-table": diverg_id,
                    "aggregation": [named_sum(d_valor, "valor")],
                    "breakout": [field_ref(breakout_field, extra)],
                    "order-by": [["desc", ["aggregation", 0]]],
                    "limit": 3,
                },
            ),
            visualization_settings={
                "graph.dimensions": [
                    "motivo" if breakout_field == d_motivo else "orgao" if breakout_field == d_orgao else "competencia"
                ],
                "graph.metrics": ["valor"],
                "graph.show_values": True,
                "graph.label_value_formatting": "compact",
                "graph.x_axis.labels_enabled": False,
                "column_settings": col_settings(("valor", BRL)),
            },
        )

    cards["top_motivo"] = top3_bar("Top 3 por motivo", d_motivo)
    cards["top_orgao"] = top3_bar("Top 3 por órgão", d_orgao)
    cards["top_mes"] = top3_bar("Top 3 por mês", d_comp, {"temporal-unit": "month"})

    scatter_sql = """
SELECT
  orgao,
  SUM(valor) AS divergencia_financeira_bruta,
  AVG(score_normativa) AS divergencia_normativa,
  SUM(qtd_pessoas) AS pessoas
FROM abono_divergencia
WHERE {{periodo}}
GROUP BY orgao
""".strip()
    cards["scatter"] = create_card(
        mb,
        collection_id,
        name="Análise / detalhamento divergências",
        display="scatter",
        dataset_query=native_query(db_id, scatter_sql, tags_periodo),
        visualization_settings={
            "graph.dimensions": ["divergencia_financeira_bruta"],
            "graph.metrics": ["divergencia_normativa"],
            "scatter.bubble": "pessoas",
            "graph.x_axis.title_text": "Divergência financeira bruta",
            "graph.y_axis.title_text": "Divergência normativa",
            "click_behavior": {
                "type": "crossfilter",
                "parameterMapping": {
                    PARAM_ORGAO: {
                        "id": PARAM_ORGAO,
                        "source": {"type": "column", "id": "orgao", "name": "orgao"},
                        "target": {"type": "parameter", "id": PARAM_ORGAO},
                    }
                },
            },
            "column_settings": col_settings(
                ("divergencia_financeira_bruta", BRL),
                ("divergencia_normativa", {"decimals": 1}),
            ),
        },
    )

    detalhe_sql = """
SELECT
  motivo,
  SUM(valor) AS valor,
  ROUND(100.0 * SUM(valor) / SUM(SUM(valor)) OVER (), 1) AS percentual
FROM abono_divergencia
WHERE {{periodo}} AND {{orgao}}
GROUP BY motivo
ORDER BY valor DESC
""".strip()
    cards["detalhe_motivo"] = create_card(
        mb,
        collection_id,
        name="Divergência financeira por motivo",
        display="table",
        dataset_query=native_query(db_id, detalhe_sql, tags_both),
        visualization_settings={
            "table.pivot": False,
            "column_settings": col_settings(
                ("valor", BRL),
                ("percentual", {"suffix": " %", "decimals": 1}),
            ),
        },
    )

    cargos_sql = """
SELECT
  cargo,
  SUM(qtd_pessoas) AS pessoas,
  ROUND(100.0 * SUM(qtd_pessoas) / SUM(SUM(qtd_pessoas)) OVER (), 1) AS percentual
FROM abono_divergencia
WHERE {{periodo}} AND {{orgao}}
GROUP BY cargo
ORDER BY pessoas DESC
""".strip()
    cards["detalhe_cargos"] = create_card(
        mb,
        collection_id,
        name="Pessoal afetado",
        display="table",
        dataset_query=native_query(db_id, cargos_sql, tags_both),
        visualization_settings={
            "column_settings": col_settings(("percentual", {"suffix": " %", "decimals": 1})),
        },
    )

    media_sql = """
SELECT ROUND(SUM(valor) * 1.0 / COUNT(DISTINCT competencia), 2) AS media_mensal
FROM abono_divergencia
WHERE {{periodo}} AND {{orgao}}
""".strip()
    cards["media_div"] = create_card(
        mb,
        collection_id,
        name="Divergência média mensal",
        display="scalar",
        dataset_query=native_query(db_id, media_sql, tags_both),
        visualization_settings={"column_settings": col_settings(("media_mensal", BRL))},
    )

    dashboard = mb.request(
        "POST",
        "/api/dashboard",
        {
            "name": DASHBOARD_NAME,
            "description": (
                "Protótipo nativo (nível A). Dados mock de jul–dez/2025. "
                "Clique numa bolha para filtrar o detalhe do órgão."
            ),
            "collection_id": collection_id,
            "parameters": [
                {
                    "id": PARAM_PERIODO,
                    "name": "Período",
                    "slug": "periodo",
                    "type": "date/all-options",
                    "sectionId": "date",
                    "default": DEFAULT_PERIODO,
                },
                {
                    "id": PARAM_ORGAO,
                    "name": "Órgão",
                    "slug": "orgao",
                    "type": "string/=",
                    "sectionId": "string",
                    "default": DEFAULT_ORGAO,
                    "isMultiSelect": False,
                },
            ],
        },
    )
    dash_id = dashboard["id"]
    mb.request("PUT", f"/api/dashboard/{dash_id}", {"width": "full"})

    def cid(key: str) -> int:
        return cards[key]["id"]

    def folha_maps(card_key: str) -> list[dict]:
        return [map_dimension(PARAM_PERIODO, cid(card_key), f_comp)]

    def diverg_maps(card_key: str) -> list[dict]:
        return [map_dimension(PARAM_PERIODO, cid(card_key), d_comp)]

    def native_periodo(card_key: str) -> list[dict]:
        return [map_template_tag(PARAM_PERIODO, cid(card_key), "periodo")]

    def native_both(card_key: str) -> list[dict]:
        return [
            map_template_tag(PARAM_PERIODO, cid(card_key), "periodo"),
            map_template_tag(PARAM_ORGAO, cid(card_key), "orgao"),
        ]

    heading_main = {
        "id": -1,
        "card_id": None,
        "row": 0,
        "col": 0,
        "size_x": 24,
        "size_y": 2,
        "inline_parameters": [PARAM_PERIODO],
        "parameter_mappings": [],
        "visualization_settings": virtual_heading("Abono de Permanência"),
        "series": [],
    }
    heading_analise = {
        "id": -2,
        "card_id": None,
        "row": 1,
        "col": 12,
        "size_x": 6,
        "size_y": 1,
        "inline_parameters": [],
        "parameter_mappings": [],
        "visualization_settings": virtual_heading("Análise / detalhamento divergências"),
        "series": [],
    }
    heading_orgao = {
        "id": -3,
        "card_id": None,
        "row": 1,
        "col": 18,
        "size_x": 6,
        "size_y": 1,
        "inline_parameters": [PARAM_ORGAO],
        "parameter_mappings": [
            {
                "parameter_id": PARAM_ORGAO,
                "target": ["text-tag", "orgao"],
            }
        ],
        "visualization_settings": virtual_heading("{{orgao}}"),
        "series": [],
    }
    heading_top3 = {
        "id": -4,
        "card_id": None,
        "row": 8,
        "col": 6,
        "size_x": 6,
        "size_y": 1,
        "inline_parameters": [],
        "parameter_mappings": [],
        "visualization_settings": virtual_heading("Top 3 divergências"),
        "series": [],
    }

    question_cards = [
        # Coluna 1
        {"id": -10, "card_id": cid("valor_total"), "row": 2, "col": 0, "size_x": 6, "size_y": 2, "parameter_mappings": folha_maps("valor_total")},
        {"id": -11, "card_id": cid("valor_medio"), "row": 4, "col": 0, "size_x": 6, "size_y": 2, "parameter_mappings": folha_maps("valor_medio")},
        {"id": -12, "card_id": cid("valor_benef"), "row": 6, "col": 0, "size_x": 6, "size_y": 2, "parameter_mappings": folha_maps("valor_benef")},
        {"id": -13, "card_id": cid("evolucao"), "row": 8, "col": 0, "size_x": 6, "size_y": 8, "parameter_mappings": folha_maps("evolucao")},
        # Coluna 2
        {"id": -20, "card_id": cid("analisado_valor"), "row": 2, "col": 6, "size_x": 3, "size_y": 3, "parameter_mappings": folha_maps("analisado_valor")},
        {"id": -21, "card_id": cid("diverg_valor"), "row": 2, "col": 9, "size_x": 3, "size_y": 3, "parameter_mappings": folha_maps("diverg_valor")},
        {"id": -22, "card_id": cid("analisado_pessoas"), "row": 5, "col": 6, "size_x": 3, "size_y": 2, "parameter_mappings": folha_maps("analisado_pessoas")},
        {"id": -23, "card_id": cid("diverg_pessoas"), "row": 5, "col": 9, "size_x": 3, "size_y": 2, "parameter_mappings": folha_maps("diverg_pessoas")},
        {"id": -24, "card_id": cid("analisado_pct"), "row": 7, "col": 6, "size_x": 3, "size_y": 1, "parameter_mappings": folha_maps("analisado_pct")},
        {"id": -25, "card_id": cid("diverg_pct"), "row": 7, "col": 9, "size_x": 3, "size_y": 1, "parameter_mappings": folha_maps("diverg_pct")},
        {"id": -26, "card_id": cid("top_motivo"), "row": 9, "col": 6, "size_x": 2, "size_y": 7, "parameter_mappings": diverg_maps("top_motivo")},
        {"id": -27, "card_id": cid("top_orgao"), "row": 9, "col": 8, "size_x": 2, "size_y": 7, "parameter_mappings": diverg_maps("top_orgao")},
        {"id": -28, "card_id": cid("top_mes"), "row": 9, "col": 10, "size_x": 2, "size_y": 7, "parameter_mappings": diverg_maps("top_mes")},
        # Coluna 3
        {"id": -30, "card_id": cid("scatter"), "row": 2, "col": 12, "size_x": 6, "size_y": 14, "parameter_mappings": native_periodo("scatter"), "visualization_settings": cards["scatter"]["visualization_settings"]},
        # Coluna 4
        {"id": -40, "card_id": cid("detalhe_motivo"), "row": 2, "col": 18, "size_x": 6, "size_y": 7, "parameter_mappings": native_both("detalhe_motivo")},
        {"id": -41, "card_id": cid("detalhe_cargos"), "row": 9, "col": 18, "size_x": 6, "size_y": 5, "parameter_mappings": native_both("detalhe_cargos")},
        {"id": -42, "card_id": cid("media_div"), "row": 14, "col": 18, "size_x": 6, "size_y": 2, "parameter_mappings": native_both("media_div")},
    ]
    for dc in question_cards:
        dc.setdefault("series", [])
        dc.setdefault("inline_parameters", [])
        dc.setdefault("visualization_settings", {})

    mb.request(
        "PUT",
        f"/api/dashboard/{dash_id}",
        {
            "name": DASHBOARD_NAME,
            "width": "full",
            "parameters": dashboard["parameters"]
            if dashboard.get("parameters")
            else [
                {
                    "id": PARAM_PERIODO,
                    "name": "Período",
                    "slug": "periodo",
                    "type": "date/all-options",
                    "sectionId": "date",
                    "default": DEFAULT_PERIODO,
                },
                {
                    "id": PARAM_ORGAO,
                    "name": "Órgão",
                    "slug": "orgao",
                    "type": "string/=",
                    "sectionId": "string",
                    "default": DEFAULT_ORGAO,
                    "isMultiSelect": False,
                },
            ],
            "dashcards": [heading_main, heading_analise, heading_orgao, heading_top3, *question_cards],
        },
    )

    return f"{mb.base_url}/dashboard/{dash_id}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sqlite-only",
        action="store_true",
        help="Só gera o arquivo SQLite, sem chamar a API do Metabase.",
    )
    parser.add_argument("--url", default=os.environ.get("MB_URL", "http://localhost:3000"))
    parser.add_argument("--email", default=os.environ.get("MB_EMAIL", ""))
    parser.add_argument("--password", default=os.environ.get("MB_PASSWORD", ""))
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    sqlite_file = build()
    print(f"SQLite mock: {sqlite_file}")
    if args.sqlite_only:
        return 0
    if not args.email or not args.password:
        print(
            "Informe MB_EMAIL e MB_PASSWORD (ou --email / --password).\n"
            "O SQLite já foi gerado; rode o script de novo depois do login admin.",
            file=sys.stderr,
        )
        return 1
    user = MetabaseClient(args.url, args.email, args.password)
    me = user.request("GET", "/api/user/current")
    if not me.get("is_superuser"):
        print("A conta precisa ser admin para adicionar o banco SQLite.", file=sys.stderr)
        return 1
    url = seed(user, sqlite_file)
    print(f"Dashboard criado: {url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
