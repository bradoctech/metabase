import * as Lib from "metabase-lib";
import {
  DEFAULT_TEST_QUERY,
  SAMPLE_METADATA,
  columnFinder,
  createMetadataProvider,
} from "metabase-lib/test-helpers";
import { PEOPLE, PRODUCTS } from "metabase-types/api/mocks/presets";

import { getChainFilterConstraints } from "./chain-filter-constraints";

function createQueryWithMetadata(metadata = SAMPLE_METADATA) {
  const provider = createMetadataProvider({ metadata });
  const query = Lib.createTestQuery(provider, DEFAULT_TEST_QUERY);
  const stageIndex = 0;
  const availableColumns = Lib.filterableColumns(query, stageIndex);
  const findColumn = columnFinder(query, availableColumns);
  return { query, stageIndex, findColumn };
}

describe("getChainFilterConstraints", () => {
  const { query, stageIndex, findColumn } = createQueryWithMetadata();

  it("returns constraints from sibling filters on other columns", () => {
    const category = findColumn("PRODUCTS", "CATEGORY");
    const vendor = findColumn("PRODUCTS", "VENDOR");
    const queryWithFilter = Lib.filter(
      query,
      stageIndex,
      Lib.stringFilterClause({
        operator: "=",
        column: category,
        values: ["Gadget"],
        options: {},
      }),
    );

    expect(
      getChainFilterConstraints(queryWithFilter, stageIndex, vendor),
    ).toEqual([
      {
        field_id: PRODUCTS.CATEGORY,
        op: "=",
        value: "Gadget",
      },
    ]);
  });

  it("excludes filters on the target column", () => {
    const category = findColumn("PRODUCTS", "CATEGORY");
    const queryWithFilter = Lib.filter(
      query,
      stageIndex,
      Lib.stringFilterClause({
        operator: "=",
        column: category,
        values: ["Gadget"],
        options: {},
      }),
    );

    expect(
      getChainFilterConstraints(queryWithFilter, stageIndex, category),
    ).toEqual([]);
  });

  it("supports multi-value string filters", () => {
    const state = findColumn("PEOPLE", "STATE");
    const source = findColumn("PEOPLE", "SOURCE");
    const queryWithFilter = Lib.filter(
      query,
      stageIndex,
      Lib.stringFilterClause({
        operator: "=",
        column: state,
        values: ["CA", "NY"],
        options: {},
      }),
    );

    expect(
      getChainFilterConstraints(queryWithFilter, stageIndex, source),
    ).toEqual([
      {
        field_id: PEOPLE.STATE,
        op: "=",
        value: ["CA", "NY"],
      },
    ]);
  });

  it("supports number filters", () => {
    const price = findColumn("PRODUCTS", "PRICE");
    const title = findColumn("PRODUCTS", "TITLE");
    const queryWithFilter = Lib.filter(
      query,
      stageIndex,
      Lib.numberFilterClause({
        operator: "between",
        column: price,
        values: [10, 20],
      }),
    );

    expect(
      getChainFilterConstraints(queryWithFilter, stageIndex, title),
    ).toEqual([
      {
        field_id: PRODUCTS.PRICE,
        op: "between",
        value: [10, 20],
      },
    ]);
  });

  it("includes case-sensitive options for string operators that use them", () => {
    const category = findColumn("PRODUCTS", "CATEGORY");
    const vendor = findColumn("PRODUCTS", "VENDOR");
    const queryWithFilter = Lib.filter(
      query,
      stageIndex,
      Lib.stringFilterClause({
        operator: "contains",
        column: category,
        values: ["get"],
        options: { caseSensitive: false },
      }),
    );

    expect(
      getChainFilterConstraints(queryWithFilter, stageIndex, vendor),
    ).toEqual([
      {
        field_id: PRODUCTS.CATEGORY,
        op: "contains",
        value: "get",
        options: { "case-sensitive": false },
      },
    ]);
  });

  it("skips empty and null-check filters", () => {
    const category = findColumn("PRODUCTS", "CATEGORY");
    const vendor = findColumn("PRODUCTS", "VENDOR");
    const queryWithFilter = Lib.filter(
      query,
      stageIndex,
      Lib.stringFilterClause({
        operator: "is-empty",
        column: category,
        values: [],
        options: {},
      }),
    );

    expect(
      getChainFilterConstraints(queryWithFilter, stageIndex, vendor),
    ).toEqual([]);
  });

  it("returns no constraints when there are no sibling filters", () => {
    const vendor = findColumn("PRODUCTS", "VENDOR");
    expect(getChainFilterConstraints(query, stageIndex, vendor)).toEqual([]);
  });
});
