import { t } from "ttag";

import { usePageTitle } from "metabase/hooks/use-page-title";

export function GitSyncSectionLayout() {
  usePageTitle(t`Git sync`);
  return null;
}
