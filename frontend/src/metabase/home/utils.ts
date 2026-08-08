import dayjs from "dayjs";

import { ROOT_COLLECTION } from "metabase/entities/collections/constants";
import { parseTimestamp } from "metabase/lib/time-dayjs";
import { type RecentItem, isRecentTableItem } from "metabase-types/api";

export const isWithinWeeks = (
  timestamp: string,
  weekCount: number,
): boolean => {
  const date = parseTimestamp(timestamp);
  const weeksAgo = dayjs().subtract(weekCount, "week");
  return date.isAfter(weeksAgo);
};

/** Where the item lives: its database, dashboard or collection. */
export const getItemBadge = (item: RecentItem): string | undefined => {
  if (isRecentTableItem(item)) {
    return item.database.name;
  }

  if (item.dashboard) {
    return item.dashboard.name;
  }

  if (item.parent_collection?.id == null) {
    return ROOT_COLLECTION.name;
  }

  return item.parent_collection.name;
};
