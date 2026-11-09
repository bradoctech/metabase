import { setupRecentViewsEndpoints } from "__support__/server-mocks";
import {
  renderWithProviders,
  screen,
  waitForLoaderToBeRemoved,
} from "__support__/ui";
import { dayjs } from "metabase/dayjs";
import { SP_COMMERCIAL_POLICY } from "metabase/sp/commercial-policy";
import type { User } from "metabase-types/api";
import {
  createMockRecentTableItem,
  createMockUser,
} from "metabase-types/api/mocks";

import { HomeRecentSection } from "./HomeRecentSection";

interface SetupOpts {
  user?: User;
}

const setup = async ({ user = createMockUser() }: SetupOpts = {}) => {
  setupRecentViewsEndpoints([
    createMockRecentTableItem({
      model: "table",
      name: "ORDERS",
      display_name: "Orders",
    }),
  ]);

  renderWithProviders(<HomeRecentSection />, {
    storeInitialState: {
      currentUser: user,
    },
  });

  await waitForLoaderToBeRemoved();
};

describe("HomeRecentSection", () => {
  describe("new installers", () => {
    it("should hide the help link for new installers under the SP policy", async () => {
      await setup({
        user: createMockUser({
          is_installer: true,
          first_login: dayjs().add(1, "hour").toISOString(),
        }),
      });

      expect(screen.queryByText("Metabase tips")).not.toBeInTheDocument();
    });

    it("should retain the upstream help card when the client policy permits it", async () => {
      jest.replaceProperty(SP_COMMERCIAL_POLICY, "showExternalHelpLinks", true);
      try {
        await setup({
          user: createMockUser({
            is_installer: true,
            first_login: dayjs().add(1, "hour").toISOString(),
          }),
        });
        expect(screen.getByText("Metabase tips")).toBeInTheDocument();
      } finally {
        jest.restoreAllMocks();
      }
    });

    it("should not show a help link for regular users", async () => {
      await setup({
        user: createMockUser({
          is_installer: false,
          first_login: dayjs().subtract(1, "year").toISOString(),
        }),
      });

      expect(screen.queryByText("Metabase tips")).not.toBeInTheDocument();
    });
  });

  it("should render a list of recent items", async () => {
    await setup();

    expect(screen.getByText("Pick up where you left off")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });
});
