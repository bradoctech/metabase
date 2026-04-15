import { t } from "ttag";

import {
  SettingsPageWrapper,
  SettingsSection,
} from "metabase/admin/components/SettingsSection";
import { PLUGIN_UPLOAD_MANAGEMENT } from "metabase/plugins";

import { UploadSettingsForm } from "../UploadSettings/UploadSettingsForm";

export function UploadSettingsPage() {
  return (
    <SettingsPageWrapper title={t`Uploads`}>
      <SettingsSection>
        <UploadSettingsForm />
        <PLUGIN_UPLOAD_MANAGEMENT.UploadManagementTable />
      </SettingsSection>
    </SettingsPageWrapper>
  );
}
