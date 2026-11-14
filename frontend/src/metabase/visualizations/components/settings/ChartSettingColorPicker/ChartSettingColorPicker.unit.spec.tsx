import userEvent from "@testing-library/user-event";

import { render, screen, within } from "__support__/ui";
import { color } from "metabase/ui/colors";
import { SP_PALETTE_COLORS } from "metabase/ui/colors/constants/accent-colors";

import { ChartSettingColorPicker } from "./ChartSettingColorPicker";

const pickSpBlack = async () => {
  await userEvent.click(screen.getByLabelText(color("brand")));
  const popover = await screen.findByRole("dialog");
  expect(within(popover).getAllByRole("button")).toHaveLength(30);
  await userEvent.click(within(popover).getByLabelText(SP_PALETTE_COLORS[0]));
};

describe("ChartSettingColorPicker", () => {
  it("should not report the palette color name by default", async () => {
    const onChange = jest.fn();

    render(
      <ChartSettingColorPicker value={color("brand")} onChange={onChange} />,
    );

    await pickSpBlack();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(SP_PALETTE_COLORS[0], undefined);
  });

  it("should report a fixed SP color without an accent reference even with forwardColorName", async () => {
    const onChange = jest.fn();

    render(
      <ChartSettingColorPicker
        value={color("brand")}
        forwardColorName
        onChange={onChange}
      />,
    );

    await pickSpBlack();

    expect(onChange).toHaveBeenCalledWith(SP_PALETTE_COLORS[0], undefined);
  });
});
