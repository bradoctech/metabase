import { t } from "ttag";

import { UpsellBanner } from "metabase/common/components/upsells/components";
import { useStoreUrl } from "metabase/common/hooks";
import { useSetting } from "metabase/settings";
import { withSpCommercialPolicy } from "metabase/sp/with-commercial-policy";
import { Text } from "metabase/ui";

type LOCATION = "embedding-page" | "settings-general";

function UpsellDevInstancesUpstream({ location }: { location: LOCATION }) {
  const isDevMode = useSetting("development-mode?");
  const storeUrl = useStoreUrl("account/new-dev-instance");
  const campaign = "dev_instances";

  if (isDevMode || storeUrl === undefined) {
    return null;
  }

  return (
    <UpsellBanner
      title={t`Get a development instance`}
      campaign={campaign}
      buttonText={t`Set up`}
      buttonLink={storeUrl}
      location={location}
      dismissible
    >
      <Text c="text-secondary" lh="md">
        {t`Test out code in staging in a separate Metabase instance before deploying to production.`}
      </Text>
    </UpsellBanner>
  );
}

export const UpsellDevInstances = withSpCommercialPolicy(
  UpsellDevInstancesUpstream,
);
