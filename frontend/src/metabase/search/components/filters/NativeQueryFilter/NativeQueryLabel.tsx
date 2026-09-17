import { t } from "ttag";

import { useSelector } from "metabase/lib/redux";
import { canUserCreateNativeQueries } from "metabase/selectors/user";

export const NativeQueryLabel = () => {
  const hasNativeWrite = useSelector(canUserCreateNativeQueries);
  return hasNativeWrite
    ? t`Search the contents of native queries`
    : t`Search the contents of SQL queries`;
};
