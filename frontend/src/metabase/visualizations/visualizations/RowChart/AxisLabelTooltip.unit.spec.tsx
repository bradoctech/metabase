import userEvent from "@testing-library/user-event";

import { renderWithProviders, screen, waitFor } from "__support__/ui";

import { renderAxisLabelTooltip } from "./AxisLabelTooltip";

it("shows the hovered full axis label and clears it when leaving, even with identical prefixes", async () => {
  renderWithProviders(
    <svg>
      {["departamento norte", "departamento sul"].map((label) => (
        <g key={label}>
          {renderAxisLabelTooltip(
            label,
            <g role="img" aria-label={label}>
              <text>Departamen...</text>
            </g>,
          )}
        </g>
      ))}
    </svg>,
  );
  const north = screen.getByRole("img", { name: "departamento norte" });
  const south = screen.getByRole("img", { name: "departamento sul" });
  await userEvent.hover(north);
  const tooltip = await screen.findByRole("tooltip");
  expect(tooltip).toHaveTextContent("departamento norte");
  expect(tooltip).toHaveStyle({
    backgroundColor: "var(--mb-color-tooltip-background)",
    color: "var(--mb-color-tooltip-text)",
  });
  await userEvent.unhover(north);
  await waitFor(() =>
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
  );
  await userEvent.hover(south);
  expect(await screen.findByRole("tooltip")).toHaveTextContent(
    "departamento sul",
  );
  await userEvent.unhover(south);
  await waitFor(() =>
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
  );
});
