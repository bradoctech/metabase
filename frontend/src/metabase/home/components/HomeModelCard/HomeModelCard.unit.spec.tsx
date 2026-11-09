import { render, screen } from "__support__/ui";
import type { IconData } from "metabase/common/utils/icon";

import { HomeModelCard } from "./HomeModelCard";

interface SetupOpts {
  title: string;
  badge?: string;
  icon: IconData;
  url: string;
}

const setup = ({ title, badge, icon, url }: SetupOpts) => {
  render(<HomeModelCard title={title} badge={badge} icon={icon} url={url} />);
};

describe("HomeModelCard", () => {
  it("should render correctly", () => {
    setup({
      title: "Orders",
      icon: { name: "table" },
      url: "/question/1",
    });

    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByLabelText("table icon")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/question/1");
  });

  it("should show the item's location as a badge", () => {
    setup({
      title: "Orders",
      badge: "Sales",
      icon: { name: "table" },
      url: "/question/1",
    });
    expect(screen.getByText("Sales")).toBeInTheDocument();
  });

  it("should not repeat a badge identical to the title", () => {
    setup({
      title: "Orders",
      badge: "Orders",
      icon: { name: "table" },
      url: "/question/1",
    });
    expect(screen.getAllByText("Orders")).toHaveLength(1);
  });
});
