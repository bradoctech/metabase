import { t } from "ttag";

import { UpsellPill } from "metabase/common/components/upsells/components";
import { UPGRADE_URL } from "metabase/common/components/upsells/constants";
import { useHasTokenFeature } from "metabase/common/hooks";
import { useSetting } from "metabase/settings";
import { withSpCommercialPolicy } from "metabase/sp/with-commercial-policy";

const UpsellEmailWhitelabelPillUpstream = ({ source }: { source: string }) => {
  const isHosted = useSetting("is-hosted?");
  const hasCloudSMTPFeature = useHasTokenFeature("cloud_custom_smtp");

  if (!isHosted || hasCloudSMTPFeature) {
    return null;
  }

  return (
    <UpsellPill
      campaign="smtp-whitelabeling"
      link={UPGRADE_URL}
      source={source}
    >
      {t`Whitelabel email notifications`}
    </UpsellPill>
  );
};

export const UpsellEmailWhitelabelPill = withSpCommercialPolicy(
  UpsellEmailWhitelabelPillUpstream,
);
