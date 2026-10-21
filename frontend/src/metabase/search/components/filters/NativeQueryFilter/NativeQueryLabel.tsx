import { t } from "ttag";

import { canUserCreateNativeQueries } from "metabase/current-user";
import { useSelector } from "metabase/redux";

export const NativeQueryLabel = () => {
  const hasNativeWrite = useSelector(canUserCreateNativeQueries);
  return hasNativeWrite
    ? t`Search the contents of native queries`
    : t`Search the contents of SQL queries`;
};
