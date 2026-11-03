import { renderWithProviders, screen } from "__support__/ui";
import { Route } from "metabase/router";

import { AreaTab } from "./AreaTab";
import { AreaTabGroup } from "./AreaTabGroup";

const setup = ({ showLabel = true }: { showLabel?: boolean } = {}) => {
  renderWithProviders(
    <AreaTabGroup label="Content management" showLabel={showLabel}>
      <div data-testid="child">{"Child item"}</div>
    </AreaTabGroup>,
  );
};

describe("AreaTabGroup", () => {
  it("omits an empty category when all links inside fragments are commercial", () => {
    renderWithProviders(
      <AreaTabGroup label="Tools" showLabel>
        <>
          <AreaTab
            label="Schema viewer"
            icon="network"
            to="/schema"
            showLabel
            isGated
          />
          {false}
        </>
      </AreaTabGroup>,
    );
    expect(
      screen.queryByRole("heading", { name: "Tools" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Tools" }),
    ).not.toBeInTheDocument();
  });

  it("keeps a category and its available links when only some items are commercial", () => {
    renderWithProviders(
      <Route
        path="/"
        element={
          <AreaTabGroup label="Tools" showLabel>
            <AreaTab
              label="Schema viewer"
              icon="network"
              to="/schema"
              showLabel
              isGated
            />
            <AreaTab label="Tasks" icon="clipboard" to="/tasks" showLabel />
          </AreaTabGroup>
        }
      />,
      { withRouter: true },
    );
    expect(screen.getByRole("heading", { name: "Tools" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tasks" })).toHaveAttribute(
      "href",
      "/tasks",
    );
    expect(
      screen.queryByRole("link", { name: "Schema viewer" }),
    ).not.toBeInTheDocument();
  });

  it("renders a static heading with its children always visible", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Content management" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeVisible();
  });

  it("is not interactive", () => {
    setup();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides the heading in icon-only mode while keeping children visible and the section labelled", () => {
    setup({ showLabel: false });

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Content management" }),
    ).toBeInTheDocument();
  });
});
