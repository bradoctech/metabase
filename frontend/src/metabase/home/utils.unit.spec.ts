import { ROOT_COLLECTION } from "metabase/common/collections/constants";
import {
  createMockRecentCollectionItem,
  createMockRecentTableDatabaseInfo,
  createMockRecentTableItem,
} from "metabase-types/api/mocks";

import { getItemBadge } from "./utils";

describe("getItemBadge", () => {
  it("uses the database name for tables", () => {
    const item = createMockRecentTableItem({
      database: createMockRecentTableDatabaseInfo({ name: "Warehouse" }),
    });
    expect(getItemBadge(item)).toBe("Warehouse");
  });

  it("uses the parent collection for saved questions", () => {
    const item = createMockRecentCollectionItem({
      parent_collection: { id: 10, name: "Sales" },
    });
    expect(getItemBadge(item)).toBe("Sales");
  });

  it("prefers the dashboard when a question was viewed inside it", () => {
    const item = createMockRecentCollectionItem({
      dashboard: { id: 20, name: "Revenue", moderation_status: null },
      parent_collection: { id: 10, name: "Sales" },
    });
    expect(getItemBadge(item)).toBe("Revenue");
  });

  it("labels items in the root collection", () => {
    const item = createMockRecentCollectionItem({
      parent_collection: { id: null, name: "" },
    });
    expect(getItemBadge(item)).toBe(ROOT_COLLECTION.name);
  });
});
