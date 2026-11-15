import { render, screen } from "@testing-library/react";
import { useEffect } from "react";

import { SP_COMMERCIAL_POLICY } from "./commercial-policy";
import { withSpCommercialPolicy } from "./with-commercial-policy";

describe("SP commercial policy", () => {
  afterEach(() => {
    SP_COMMERCIAL_POLICY.showUpsells = false;
  });

  it("does not mount commercial content or run its effects", () => {
    const mounted = jest.fn();
    function Offer() {
      useEffect(mounted, []);
      return <a href="https://metabase.com/upgrade">Upgrade</a>;
    }
    const CommercialOffer = withSpCommercialPolicy(Offer);

    render(<CommercialOffer />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(mounted).not.toHaveBeenCalled();
  });

  it("preserves the upstream component when the policy allows it", () => {
    SP_COMMERCIAL_POLICY.showUpsells = true;
    const CommercialOffer = withSpCommercialPolicy(
      ({ name }: { name: string }) => <div>{name}</div>,
    );

    render(<CommercialOffer name="Original offer" />);

    expect(screen.getByText("Original offer")).toBeInTheDocument();
  });
});
