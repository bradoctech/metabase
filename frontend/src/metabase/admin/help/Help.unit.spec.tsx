import { setupBugReportingDetailsEndpoint } from "__support__/server-mocks";
import { mockSettings } from "__support__/settings";
import { createMockState } from "__support__/state";
import { renderWithProviders, screen } from "__support__/ui";
import { SP_COMMERCIAL_POLICY } from "metabase/sp/commercial-policy";

import { Help } from "./Help";

describe("Admin help", () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([false, true])(
    "shows external help and issue reporting only when the SP policy permits them (%s)",
    (showExternalHelpLinks) => {
      jest.replaceProperty(
        SP_COMMERCIAL_POLICY,
        "showExternalHelpLinks",
        showExternalHelpLinks,
      );
      setupBugReportingDetailsEndpoint();
      renderWithProviders(<Help />, {
        withRouter: true,
        storeInitialState: createMockState({ settings: mockSettings() }),
      });

      expect(screen.queryAllByRole("link", { name: /Get help/i })).toHaveLength(
        showExternalHelpLinks ? 1 : 0,
      );
      expect(
        screen.queryAllByRole("link", { name: /Report an issue/i }),
      ).toHaveLength(showExternalHelpLinks ? 1 : 0);
      expect(
        screen.getByRole("heading", { name: "Diagnostic info" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Connection Pool Details/i }),
      ).toHaveAttribute(
        "href",
        expect.stringContaining("/api/bug-reporting/connection-pool-details"),
      );
    },
  );
});
