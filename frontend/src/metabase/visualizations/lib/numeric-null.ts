import { isNumeric } from "metabase-lib/v1/types/utils/isa";
import type { DatasetColumn, RowValue, Series } from "metabase-types/api";

// SP display policy: a present numeric null is zero; an absent row stays absent.
export function normalizeNumericNull(value: RowValue, column: DatasetColumn) {
  return value === null && isNumeric(column) ? 0 : value;
}

// Number visualization also accepts an untyped null result (e.g. SQLite SUM).
// Keep this separate from table/trend formatting and never synthesize a row.
export function normalizeScalarNull(value: RowValue, column: DatasetColumn) {
  const knownType =
    column.effective_type && column.effective_type !== "type/*"
      ? column.effective_type
      : column.base_type;
  return value === null && (!knownType || knownType === "type/*")
    ? 0
    : normalizeNumericNull(value, column);
}

export function normalizeNumericNullSeries(
  series: Series,
  field: string | undefined,
): Series {
  return series.map((singleSeries) => {
    if (!("data" in singleSeries)) {
      return singleSeries;
    }
    const { cols, rows } = singleSeries.data;
    const index = cols.findIndex((column) => column.name === field);
    if (
      index < 0 ||
      !isNumeric(cols[index]) ||
      !rows.some((row) => row[index] === null)
    ) {
      return singleSeries;
    }
    return {
      ...singleSeries,
      data: {
        ...singleSeries.data,
        rows: rows.map((row) =>
          row[index] === null
            ? row.map((value, i) => (i === index ? 0 : value))
            : row,
        ),
      },
    };
  });
}
