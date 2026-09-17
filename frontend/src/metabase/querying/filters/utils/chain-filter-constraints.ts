import * as Lib from "metabase-lib";
import type { FieldValuesConstraint } from "metabase-types/api";

const OPERATORS_WITHOUT_VALUES = new Set([
  "is-empty",
  "not-empty",
  "is-null",
  "not-null",
]);

type SupportedFilterParts =
  | Lib.StringFilterParts
  | Lib.NumberFilterParts
  | Lib.BooleanFilterParts;

function isSupportedFilterParts(
  parts: Lib.FilterParts | null,
): parts is SupportedFilterParts {
  if (parts == null || !("values" in parts) || !("operator" in parts)) {
    return false;
  }
  // Date/time/coordinate/exclude filters have extra keys we do not support yet.
  if ("unit" in parts || "hasTime" in parts || "longitudeColumn" in parts) {
    return false;
  }
  if (OPERATORS_WITHOUT_VALUES.has(parts.operator)) {
    return false;
  }
  return parts.values.length > 0;
}

function normalizeConstraintValue(values: SupportedFilterParts["values"]) {
  const normalized = values.map((value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  if (normalized.length === 1) {
    return normalized[0];
  }
  return normalized;
}

function optionsForConstraint(
  parts: SupportedFilterParts,
): FieldValuesConstraint["options"] {
  if (!("options" in parts) || parts.options == null) {
    return undefined;
  }
  const { caseSensitive } = parts.options;
  if (caseSensitive == null) {
    return undefined;
  }
  return { "case-sensitive": caseSensitive };
}

/**
 * Convert sibling filters on the same stage into chain-filter constraints so
 * value pickers cascade (e.g. State → City), matching dashboard Linked Filters.
 *
 * Filters on the target column are excluded so the picker is not self-constrained
 * while editing. Unsupported filter types are skipped.
 */
export function getChainFilterConstraints(
  query: Lib.Query,
  stageIndex: number,
  column: Lib.ColumnMetadata,
): FieldValuesConstraint[] {
  const targetFieldId = Lib.fieldValuesSearchInfo(query, column).fieldId;
  const constraints: FieldValuesConstraint[] = [];

  for (const filter of Lib.filters(query, stageIndex)) {
    const parts = Lib.filterParts(query, stageIndex, filter);
    if (!isSupportedFilterParts(parts)) {
      continue;
    }

    const { fieldId } = Lib.fieldValuesSearchInfo(query, parts.column);
    if (fieldId == null || fieldId === targetFieldId) {
      continue;
    }

    const options = optionsForConstraint(parts);
    constraints.push({
      field_id: fieldId,
      op: parts.operator,
      value: normalizeConstraintValue(parts.values),
      ...(options != null ? { options } : {}),
    });
  }

  return constraints;
}
