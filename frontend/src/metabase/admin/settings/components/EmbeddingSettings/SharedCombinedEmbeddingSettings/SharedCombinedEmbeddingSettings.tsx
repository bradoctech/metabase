import { t } from "ttag";

import { SettingsSection } from "metabase/admin/components/SettingsSection";
import { EmbeddingSettingsCard } from "metabase/admin/settings/components/EmbeddingSettings";
import { NewEmbedButton } from "metabase/admin/settings/components/EmbeddingSettings/NewEmbedButton/NewEmbedButton";
import { useSetting } from "metabase/common/hooks";
import { PLUGIN_CONTENT_TRANSLATION } from "metabase/plugins";
import { Box } from "metabase/ui";

import { SettingTitle } from "../../SettingHeader";
import { EmbeddedResources } from "../../widgets/PublicLinksListing/EmbeddedResources";
import { EmbeddingSecretKeyWidget } from "../EmbeddingSecretKeyWidget";

type Props = {
  showEmbeddingSdkSettings?: boolean;
  showContentTranslationSettings?: boolean;
};

export function SharedCombinedEmbeddingSettings({
  showContentTranslationSettings,
}: Props) {
  const isGuestEmbedsEnabled = useSetting("enable-embedding-static");

  return (
    <>
      <EmbeddingSettingsCard
        title={t`Enable guest embeds`}
        description={t`A secure way to embed charts and dashboards, without single sign-on, when you don't want to offer ad-hoc querying or chart drill-through.`}
        settingKey="enable-embedding-static"
        actionButton={<NewEmbedButton />}
        sdk-setting-card
        testId="guest-embeds-setting-card"
      />

      <SettingsSection>
        <EmbeddingSecretKeyWidget />
      </SettingsSection>

      {isGuestEmbedsEnabled && (
        <SettingsSection>
          <Box data-testid="embedded-resources">
            <SettingTitle
              id="static-embeds"
              fz="lg"
              mb="md"
            >{t`Published embeds`}</SettingTitle>

            <EmbeddedResources />
          </Box>
        </SettingsSection>
      )}

      {showContentTranslationSettings && (
        <PLUGIN_CONTENT_TRANSLATION.ContentTranslationConfiguration />
      )}
    </>
  );
}
