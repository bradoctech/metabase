import { UpsellWrapper } from "./UpsellWrapper";

export type UpsellBigCardProps = React.PropsWithChildren<{
  title: string;
  buttonText: string;
  campaign: string;
  source: string;
  illustrationSrc?: string;
  style?: React.CSSProperties;
}> &
  (
    | {
        buttonLink: string;
        onClick?: never;
      }
    | {
        buttonLink?: string;
        onClick: () => void;
      }
  );

/** SP fork: upsell cards are not shown. */
export const UpsellBigCardInner: React.FC<UpsellBigCardProps> = () => null;

export const UpsellBigCard = UpsellWrapper(UpsellBigCardInner);
