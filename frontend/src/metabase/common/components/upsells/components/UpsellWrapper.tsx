import { getUserIsAdmin } from "metabase/current-user";
import { useSelector } from "metabase/redux";
import { withSpCommercialPolicy } from "metabase/sp/with-commercial-policy";

/**
 * we should wrap all upsell components in this HoC to ensure that they are only rendered for admins
 */
export function UpsellWrapper<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  const WrappedComponent = (props: Props) => {
    const isAdmin = useSelector(getUserIsAdmin);

    if (!isAdmin) {
      return null;
    }

    return <Component {...props} />;
  };

  return withSpCommercialPolicy(WrappedComponent);
}
