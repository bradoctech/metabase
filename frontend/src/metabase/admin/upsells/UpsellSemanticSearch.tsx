import { t } from "ttag";

import { UpsellPill } from "metabase/common/components/upsells/components";
import { UPGRADE_URL } from "metabase/common/components/upsells/constants";
import { withSpCommercialPolicy } from "metabase/sp/with-commercial-policy";

const UpsellSemanticSearchPillUpstream = ({ source }: { source: string }) => {
  return (
    <UpsellPill campaign="semantic-search" link={UPGRADE_URL} source={source}>
      {t`Get this with Pro. Try for free.`}
    </UpsellPill>
  );
};

export const UpsellSemanticSearchPill = withSpCommercialPolicy(
  UpsellSemanticSearchPillUpstream,
);
