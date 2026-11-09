import { screen } from "__support__/ui";

import { setup } from "./setup";

describe("HomeHelpCard (OSS)", () => {
  it("should hide the tips card under the SP policy even when Metabase links are enabled", () => {
    setup({ showExternalHelpLinks: false, showMetabaseLinks: true });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("should show Metabase despite customizing the application name", () => {
    setup({ applicationName: "My app analytics" });
    expect(screen.getByText("Metabase tips")).toBeInTheDocument();
  });

  it("should render help link when `show-metabase-links: true`", () => {
    setup({ showMetabaseLinks: true });
    expect(screen.getByText("Metabase tips")).toBeInTheDocument();
  });

  it("should render help link when `show-metabase-links: false`", () => {
    setup({ showMetabaseLinks: false });
    expect(screen.getByText("Metabase tips")).toBeInTheDocument();
  });
});
