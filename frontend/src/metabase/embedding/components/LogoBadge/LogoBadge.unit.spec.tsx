import { render, screen } from "__support__/ui";

import { LogoBadge } from ".";

describe("LogoBadge", () => {
  it("should render the prefix and Dashboards SP as text alongside the coat of arms", () => {
    setup();

    expect(screen.getByText("Powered by")).toBeInTheDocument();
    expect(screen.getByText("Dashboards SP")).toBeInTheDocument();
    expect(screen.getByTestId("main-logo")).toHaveAttribute(
      "src",
      expect.stringContaining("app/assets/img/logo.svg"),
    );
  });

  it("should render the signature without a link", () => {
    setup();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

function setup() {
  render(<LogoBadge dark={false} />);
}
