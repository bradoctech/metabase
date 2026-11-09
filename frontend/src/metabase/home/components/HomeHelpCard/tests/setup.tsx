import { setupEnterpriseOnlyPlugin } from "__support__/enterprise";
import { mockSettings } from "__support__/settings";
import { createMockState } from "__support__/state";
import { renderWithProviders } from "__support__/ui";
import { SP_COMMERCIAL_POLICY } from "metabase/sp/commercial-policy";
import type { TokenFeatures } from "metabase-types/api";
import { createMockTokenFeatures } from "metabase-types/api/mocks";

import { HomeHelpCard } from "../HomeHelpCard";

export interface SetupOpts {
  applicationName?: string;
  showMetabaseLinks?: boolean;
  showExternalHelpLinks?: boolean;
  tokenFeatures?: Partial<TokenFeatures>;
  enterprisePlugins?: Parameters<typeof setupEnterpriseOnlyPlugin>[0][];
}

export const setup = ({
  applicationName = "Metabase",
  showMetabaseLinks = true,
  showExternalHelpLinks = true,
  tokenFeatures = {},
  enterprisePlugins = [],
}: SetupOpts = {}) => {
  // Existing upstream scenarios explicitly allow external help links.
  jest.replaceProperty(
    SP_COMMERCIAL_POLICY,
    "showExternalHelpLinks",
    showExternalHelpLinks,
  );
  const state = createMockState({
    settings: mockSettings({
      "application-name": applicationName,
      "show-metabase-links": showMetabaseLinks,
      "token-features": createMockTokenFeatures(tokenFeatures),
    }),
  });

  enterprisePlugins.forEach((plugin) => {
    setupEnterpriseOnlyPlugin(plugin);
  });

  renderWithProviders(<HomeHelpCard />, { storeInitialState: state });
};

afterEach(() => jest.restoreAllMocks());
