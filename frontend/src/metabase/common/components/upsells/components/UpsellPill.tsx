import { UpsellWrapper } from "./UpsellWrapper";

/** SP fork: upsell pills are not shown. */
export function UpsellPillInner() {
  return null;
}

export const UpsellPill = UpsellWrapper(UpsellPillInner);
