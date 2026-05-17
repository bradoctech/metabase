import { UpsellWrapper } from "./components/UpsellWrapper";

type CardWidthProps =
  | {
      maxWidth?: never;
      fullWidth?: boolean;
    }
  | {
      maxWidth?: number;
      fullWidth?: never;
    }
  | {
      maxWidth?: "initial";
      fullWidth?: boolean;
    };

type CardLinkProps =
  | {
      buttonLink: string;
      internalLink?: never;
    }
  | {
      internalLink: string;
      buttonLink?: never;
    };

export type UpsellCardProps = {
  title: string;
  buttonText: string;
  campaign: string;
  location: string;
  illustrationSrc?: string;
  children: React.ReactNode;
  large?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  buttonStyle?: React.CSSProperties;
} & CardWidthProps &
  CardLinkProps;

/** SP fork: upsell cards are not shown. */
export const UpsellCardInner: React.FC<UpsellCardProps> = () => null;

export const UpsellCard = UpsellWrapper(UpsellCardInner);
