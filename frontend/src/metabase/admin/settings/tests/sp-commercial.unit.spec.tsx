import { createMockSettingsState } from "__support__/state";
import { renderWithProviders, screen } from "__support__/ui";
import { UpsellUploads } from "metabase/admin/upsells";
import { CSVPanelEmptyState } from "metabase/nav/containers/MainNavbar/MainNavbarContainer/AddDataModal/Panels/AddDataModalEmptyStates";
import { PLUGIN_ADMIN_SETTINGS } from "metabase/plugins";
import { Route } from "metabase/router";
import {
  createMockSettings,
  createMockTokenFeatures,
} from "metabase-types/api/mocks";

import { AppearanceSettingsPage } from "../components/SettingsPages/AppearanceSettingsPage";
import { CloudSettingsPage } from "../components/SettingsPages/CloudSettingsPage";
import { CustomVisualizationsManagePage } from "../components/SettingsPages/CustomVisualizationsSettingsPage";
import { RemoteSyncSettingsPage } from "../components/SettingsPages/RemoteSyncSettingsPage";

describe("SP commercial settings routes", () => {
  it("does not start the uploads upsell flow", () => {
    const upsellFlow = jest.spyOn(PLUGIN_ADMIN_SETTINGS, "useUpsellFlow");
    renderWithProviders(<UpsellUploads location="settings-uploads" />);
    expect(upsellFlow).not.toHaveBeenCalled();
    expect(screen.queryByTestId("upsell-card")).not.toBeInTheDocument();
    upsellFlow.mockRestore();
  });

  it("preserves CSV setup without offering storage for purchase", () => {
    renderWithProviders(
      <Route
        path="/"
        element={
          <CSVPanelEmptyState
            canOfferStorage
            ctaLink={{ text: "Enable uploads", to: "/admin/settings/uploads" }}
          />
        }
      />,
      { withRouter: true },
    );
    expect(
      screen.getByRole("link", { name: "Enable uploads" }),
    ).toHaveAttribute("href", "/admin/settings/uploads");
    expect(
      screen.getByText(
        "To work with CSVs, enable file uploads in your database.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Add Metabase Storage")).not.toBeInTheDocument();
  });

  it.each([
    { name: "Appearance", element: <AppearanceSettingsPage /> },
    { name: "Remote sync", element: <RemoteSyncSettingsPage /> },
    {
      name: "Custom visualizations",
      element: <CustomVisualizationsManagePage />,
    },
    { name: "Cloud", element: <CloudSettingsPage /> },
  ])("redirects $name without rendering an offer", async ({ element }) => {
    renderWithProviders(
      <>
        <Route path="/admin/settings/offer" element={element} />
        <Route
          path="/admin/settings/general"
          element={<div>General settings</div>}
        />
      </>,
      {
        withRouter: true,
        initialRoute: "/admin/settings/offer",
        storeInitialState: {
          settings: createMockSettingsState(
            createMockSettings({
              "token-features": createMockTokenFeatures({}),
            }),
          ),
        },
      },
    );

    expect(await screen.findByText("General settings")).toBeInTheDocument();
    expect(screen.queryByTestId("upsell-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("upsell-big-card")).not.toBeInTheDocument();
  });
});
