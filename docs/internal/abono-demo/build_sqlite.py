"""Build the SQLite mock used by the Abono de Permanência demo dashboard."""

from __future__ import annotations

import sqlite3
from pathlib import Path

DB_NAME = "abono_permanencia.sqlite"

# Totals from the mockup: R$ 300.979.598,94 / média R$ 50.163.266,49 / R$ 1.967,18 por beneficiário.
FOLHA = [
    # competencia, valor_total, qtd_beneficiarios
    ("2025-07-01", 50_100_000.00, 25_500),
    ("2025-08-01", 51_300_000.00, 25_800),
    ("2025-09-01", 52_700_000.00, 26_200),
    ("2025-10-01", 49_800_000.00, 25_200),
    ("2025-11-01", 49_079_598.94, 25_100),
    ("2025-12-01", 48_000_000.00, 25_200),
]

ORGAOS = [
    ("Seduc", 0.45, 78.4),
    ("SES", 0.18, 41.2),
    ("SSP", 0.12, 55.0),
    ("SEFAZ", 0.10, 22.5),
    ("SEINFRA", 0.08, 33.8),
    ("DETRAN", 0.07, 18.1),
]

MOTIVOS = [
    ("Pagamento a maior", 0.40),
    ("Tempo de serviço irregular", 0.25),
    ("Acumulação indevida", 0.18),
    ("Cargo incompatível", 0.12),
    ("Outros", 0.05),
]

CARGOS_POR_ORGAO = {
    "Seduc": [
        ("Professor", 0.62),
        ("Agente administrativo", 0.22),
        ("Diretor escolar", 0.16),
    ],
    "SES": [
        ("Técnico de enfermagem", 0.48),
        ("Médico", 0.32),
        ("Agente administrativo", 0.20),
    ],
    "SSP": [
        ("Policial civil", 0.55),
        ("Escrivão", 0.28),
        ("Agente administrativo", 0.17),
    ],
    "SEFAZ": [
        ("Auditor fiscal", 0.50),
        ("Analista fazendário", 0.30),
        ("Agente administrativo", 0.20),
    ],
    "SEINFRA": [
        ("Engenheiro", 0.42),
        ("Técnico em edificações", 0.35),
        ("Agente administrativo", 0.23),
    ],
    "DETRAN": [
        ("Examinador de trânsito", 0.46),
        ("Agente de trânsito", 0.34),
        ("Agente administrativo", 0.20),
    ],
}

# Share of payroll flagged as divergence (rest is "analisado").
DIVERGENCIA_SHARE = 0.12


def db_path(base_dir: Path | None = None) -> Path:
    root = base_dir or Path(__file__).resolve().parent
    return root / DB_NAME


def _create_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        DROP TABLE IF EXISTS abono_folha;
        DROP TABLE IF EXISTS abono_divergencia;

        CREATE TABLE abono_folha (
            competencia DATE NOT NULL,
            valor_total REAL NOT NULL,
            qtd_beneficiarios INTEGER NOT NULL,
            valor_analisado REAL NOT NULL,
            qtd_analisado INTEGER NOT NULL,
            valor_divergencias REAL NOT NULL,
            qtd_divergencias INTEGER NOT NULL
        );

        CREATE TABLE abono_divergencia (
            competencia DATE NOT NULL,
            orgao TEXT NOT NULL,
            motivo TEXT NOT NULL,
            cargo TEXT NOT NULL,
            valor REAL NOT NULL,
            qtd_pessoas INTEGER NOT NULL,
            score_normativa REAL NOT NULL
        );
        """
    )


def _build_rows() -> tuple[list[tuple], list[tuple]]:
    folha_rows: list[tuple] = []
    divergencia_rows: list[tuple] = []

    for competencia, valor_total, qtd_beneficiarios in FOLHA:
        valor_div = round(valor_total * DIVERGENCIA_SHARE, 2)
        valor_ok = round(valor_total - valor_div, 2)
        qtd_div = int(round(qtd_beneficiarios * DIVERGENCIA_SHARE))
        qtd_ok = qtd_beneficiarios - qtd_div
        folha_rows.append(
            (
                competencia,
                valor_total,
                qtd_beneficiarios,
                valor_ok,
                qtd_ok,
                valor_div,
                qtd_div,
            )
        )

        remaining_valor = valor_div
        remaining_pessoas = qtd_div
        org_items = list(enumerate(ORGAOS))
        for org_i, (orgao, org_w, score) in org_items:
            last_org = org_i == len(org_items) - 1
            org_valor = remaining_valor if last_org else round(valor_div * org_w, 2)
            org_pessoas = remaining_pessoas if last_org else int(round(qtd_div * org_w))
            remaining_valor = round(remaining_valor - org_valor, 2)
            remaining_pessoas -= org_pessoas

            mot_remaining_v = org_valor
            mot_remaining_p = org_pessoas
            mot_items = list(enumerate(MOTIVOS))
            cargos = CARGOS_POR_ORGAO[orgao]
            for mot_i, (motivo, mot_w) in mot_items:
                last_mot = mot_i == len(mot_items) - 1
                mot_valor = mot_remaining_v if last_mot else round(org_valor * mot_w, 2)
                mot_pessoas = mot_remaining_p if last_mot else int(round(org_pessoas * mot_w))
                mot_remaining_v = round(mot_remaining_v - mot_valor, 2)
                mot_remaining_p -= mot_pessoas

                cargo_remaining_v = mot_valor
                cargo_remaining_p = mot_pessoas
                cargo_items = list(enumerate(cargos))
                for cargo_i, (cargo, cargo_w) in cargo_items:
                    last_cargo = cargo_i == len(cargo_items) - 1
                    cargo_valor = (
                        cargo_remaining_v if last_cargo else round(mot_valor * cargo_w, 2)
                    )
                    cargo_pessoas = (
                        cargo_remaining_p if last_cargo else max(1, int(round(mot_pessoas * cargo_w)))
                    )
                    if cargo_pessoas > cargo_remaining_p:
                        cargo_pessoas = cargo_remaining_p
                    cargo_remaining_v = round(cargo_remaining_v - cargo_valor, 2)
                    cargo_remaining_p -= cargo_pessoas
                    if cargo_valor <= 0 and cargo_pessoas <= 0:
                        continue
                    divergencia_rows.append(
                        (
                            competencia,
                            orgao,
                            motivo,
                            cargo,
                            cargo_valor,
                            max(cargo_pessoas, 0),
                            score,
                        )
                    )

    return folha_rows, divergencia_rows


def build(base_dir: Path | None = None) -> Path:
    path = db_path(base_dir)
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        path.unlink()

    folha_rows, divergencia_rows = _build_rows()
    conn = sqlite3.connect(path)
    try:
        _create_schema(conn)
        conn.executemany(
            """
            INSERT INTO abono_folha (
                competencia, valor_total, qtd_beneficiarios,
                valor_analisado, qtd_analisado, valor_divergencias, qtd_divergencias
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            folha_rows,
        )
        conn.executemany(
            """
            INSERT INTO abono_divergencia (
                competencia, orgao, motivo, cargo, valor, qtd_pessoas, score_normativa
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            divergencia_rows,
        )
        conn.commit()
    finally:
        conn.close()
    return path


if __name__ == "__main__":
    out = build()
    print(f"SQLite gerado em {out}")
