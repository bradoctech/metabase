import { createPlainCellFormatter } from "metabase/visualizations/lib/plain-cell-formatter";
import {
  createMockColumn,
  createMockDatasetData,
  createMockSingleSeries,
} from "metabase-types/api/mocks";

import {
  normalizeNumericNull,
  normalizeNumericNullSeries,
  normalizeScalarNull,
} from "./numeric-null";

const numeric = createMockColumn({ name: "metric", base_type: "type/Float" });
const text = createMockColumn({ name: "label", base_type: "type/Text" });

describe("SP numeric null display", () => {
  it.each([0, 7, -2, false, "", "null"])(
    "preserves non-null value %p",
    (value) => {
      expect(normalizeNumericNull(value, numeric)).toBe(value);
    },
  );

  it("renders numeric null as zero and keeps text null empty", () => {
    expect(normalizeNumericNull(null, numeric)).toBe(0);
    expect(normalizeNumericNull(null, text)).toBeNull();
  });

  it("uses zero for copied numeric cells without changing drill values", () => {
    const clicked = { value: null, column: numeric };
    const getClicked = jest.fn(() => clicked);
    const plain = createPlainCellFormatter({
      columnSettings: { column: numeric },
      translate: (value) => value,
      getClicked,
    });
    expect(plain(normalizeNumericNull(null, numeric), 0, "metric")).toBe("0");
    expect(getClicked).toHaveBeenCalledWith(0, "metric");
    expect(clicked.value).toBeNull();
  });

  it("normalizes only the chosen numeric metric without mutating query results", () => {
    const rows = [
      [null, null],
      ["A", 4],
    ];
    const single = createMockSingleSeries(
      {},
      { data: createMockDatasetData({ cols: [text, numeric], rows }) },
    );
    Object.freeze(rows[0]);
    Object.freeze(rows);
    const normalized = normalizeNumericNullSeries([single], "metric");
    expect(normalized[0].data.rows).toEqual([
      [null, 0],
      ["A", 4],
    ]);
    expect(single.data.rows).toEqual([
      [null, null],
      ["A", 4],
    ]);
    expect(normalized[0].data.rows[1]).toBe(rows[1]);
  });

  it("does not invent rows or normalize an unknown/text metric", () => {
    const empty = createMockSingleSeries(
      {},
      { data: createMockDatasetData({ cols: [numeric], rows: [] }) },
    );
    expect(normalizeNumericNullSeries([empty], "metric")[0]).toBe(empty);
    const single = createMockSingleSeries(
      {},
      { data: createMockDatasetData({ cols: [text], rows: [[null]] }) },
    );
    expect(normalizeNumericNullSeries([single], "label")[0]).toBe(single);
    expect(normalizeNumericNullSeries([single], "missing")[0]).toBe(single);
  });
});

describe("Number visualization null policy", () => {
  it.each([
    {},
    { base_type: "type/*" },
    { base_type: "type/*", effective_type: "type/*" },
  ])("renders an untyped null as zero only in Number: %p", (types) => {
    const column = createMockColumn(types);
    expect(normalizeScalarNull(null, column)).toBe(0);
    expect(normalizeNumericNull(null, column)).toBeNull();
  });

  it.each(["type/Text", "type/Boolean"])("preserves known %s nulls", (type) => {
    const column = createMockColumn({ base_type: type });
    expect(normalizeScalarNull(null, column)).toBeNull();
    expect(
      normalizeScalarNull(null, { ...column, effective_type: "type/*" }),
    ).toBeNull();
  });

  it.each([0, 12.5, "0", "", false])("preserves non-null value %p", (value) => {
    expect(
      normalizeScalarNull(value, createMockColumn({ base_type: "type/*" })),
    ).toBe(value);
  });
});
