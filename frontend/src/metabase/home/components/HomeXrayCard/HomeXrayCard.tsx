import {
  CardIcon,
  CardIconWrapper,
  CardTitle,
  CategoryBadge,
  XrayCardRoot,
} from "./HomeXrayCard.styled";
import { trackHomeXRayClicked } from "./analytics";

interface HomeXrayCardProps {
  title: string;
  url: string;
  message: string;
}

export const HomeXrayCard = ({
  title,
  url,
  message,
}: HomeXrayCardProps): JSX.Element => {
  return (
    <XrayCardRoot to={url} onClick={trackHomeXRayClicked}>
      <CategoryBadge>{title}</CategoryBadge>
      <CardIconWrapper>
        <CardIcon name="bolt_filled" />
      </CardIconWrapper>
      <CardTitle>{message}</CardTitle>
    </XrayCardRoot>
  );
};
