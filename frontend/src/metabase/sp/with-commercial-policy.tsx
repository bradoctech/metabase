import type { ComponentType, ReactNode } from "react";

import { SP_COMMERCIAL_POLICY } from "./commercial-policy";

/** Keep upstream implementations available without mounting commercial content. */
export function withSpCommercialPolicy<Props extends object>(
  Component: ComponentType<Props>,
  fallback: ReactNode = null,
) {
  return function SpCommercialContent(props: Props) {
    return SP_COMMERCIAL_POLICY.showUpsells ? (
      <Component {...props} />
    ) : (
      fallback
    );
  };
}
