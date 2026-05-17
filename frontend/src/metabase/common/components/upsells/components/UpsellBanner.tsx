import { UpsellWrapper } from "./UpsellWrapper";
import {
  type DismissibleProps,
  UpsellWrapperDismissible,
} from "./UpsellBannerDismissible";

type CardLinkProps =
  | {
      buttonLink: string;
      internalLink?: never;
    }
  | {
      internalLink: string;
      buttonLink?: never;
    };

type UpsellBannerPropsBase = {
  title: string;
  buttonText: string;
  campaign: string;
  location: string;
  large?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export type UpsellBannerProps =
  | (UpsellBannerPropsBase & CardLinkProps)
  | (UpsellBannerPropsBase & CardLinkProps & DismissibleProps);

/** SP fork: upsell banners are not shown. */
export const UpsellBannerInner: React.FC<UpsellBannerProps> = () => null;

export const UpsellBanner = UpsellWrapperDismissible(
  UpsellWrapper(UpsellBannerInner),
);
