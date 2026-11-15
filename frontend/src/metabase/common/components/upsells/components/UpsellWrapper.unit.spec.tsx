import { renderWithProviders, screen } from "__support__/ui";
import { SP_COMMERCIAL_POLICY } from "metabase/sp/commercial-policy";
import { createMockUser } from "metabase-types/api/mocks";

import { UpsellWrapper } from "./UpsellWrapper";

const Component = () => <div>Hello, beautiful</div>;

describe("Upsells > UpsellWrapper", () => {
  afterEach(() => {
    SP_COMMERCIAL_POLICY.showUpsells = false;
  });

  it("does not mount upsells for SP admins", () => {
    const Offer = jest.fn(() => <div>Commercial offer</div>);
    const WrappedComponent = UpsellWrapper(Offer);
    renderWithProviders(<WrappedComponent />, {
      storeInitialState: {
        currentUser: createMockUser({ is_superuser: true }),
      },
    });
    expect(Offer).not.toHaveBeenCalled();
    expect(screen.queryByText("Commercial offer")).not.toBeInTheDocument();
  });

  it("should show a component for admins", () => {
    SP_COMMERCIAL_POLICY.showUpsells = true;
    const WrappedComponent = UpsellWrapper(Component);

    renderWithProviders(<WrappedComponent />, {
      storeInitialState: {
        currentUser: createMockUser({ is_superuser: true }),
      },
    });

    expect(screen.getByText("Hello, beautiful")).toBeInTheDocument();
  });

  it("should not show component for non-=admins", () => {
    SP_COMMERCIAL_POLICY.showUpsells = true;
    const WrappedComponent = UpsellWrapper(Component);

    renderWithProviders(<WrappedComponent />, {
      storeInitialState: {
        currentUser: createMockUser({ is_superuser: false }),
      },
    });

    expect(screen.queryByText("Hello, beautiful")).not.toBeInTheDocument();
  });
});
