import { t } from "ttag";

import { SettingsPageWrapper } from "metabase/admin/components/SettingsSection";
import { useGetSettingsQuery } from "metabase/api";
import { hasAnySsoFeature } from "metabase/common/utils/plan";
import { PLUGIN_AUTH_PROVIDERS } from "metabase/plugins";
import { Stack } from "metabase/ui";

import { ApiKeysAuthCard } from "../../auth/components/ApiKeysAuthCard";
import { GoogleAuthCard } from "../../auth/containers/GoogleAuthCard/GoogleAuthCard";
import { LdapAuthCard } from "../../auth/containers/LdapAuthCard";
import { ManageApiKeys } from "../ApiKeys/ManageApiKeys";

export function AuthenticationSettingsPage({ tab }: { tab: string }) {
  const hasSSO = useHasSso();

  if (hasSSO) {
    return <PLUGIN_AUTH_PROVIDERS.AuthSettingsPage tab={tab} />;
  }

  if (tab === "api-keys") {
    return <ManageApiKeys />;
  }

  return (
    <SettingsPageWrapper title={t`Authentication`}>
      <Stack gap="lg">
        <GoogleAuthCard />
        <LdapAuthCard />
        <ApiKeysAuthCard />
      </Stack>
    </SettingsPageWrapper>
  );
}

const useHasSso = () => {
  const { data: settings } = useGetSettingsQuery();

  const tokenFeatures = settings?.["token-features"];
  return hasAnySsoFeature(tokenFeatures);
};
