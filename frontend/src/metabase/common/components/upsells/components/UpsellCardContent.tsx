export type UpsellCardContentProps = {
  campaign: string;
  location: string;
  title: string;
  description: string;
  bulletPoints?: string[];
  image?: string;
  variant?: "image-full-height" | "image-card";
  upgradeOnClick?: () => void;
  upgradeUrl?: string;
};

/** SP fork: upsell cards are not shown. */
export const UpsellCardContent = (_props: UpsellCardContentProps) => null;
