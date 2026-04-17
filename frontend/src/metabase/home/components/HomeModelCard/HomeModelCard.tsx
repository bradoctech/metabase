import type { IconName } from "metabase/ui";

import {
  CardBadge,
  CardIcon,
  CardIconWrapper,
  CardTitle,
  ModelCardRoot,
} from "./HomeModelCard.styled";

interface HomeModelCardProps {
  title: string;
  badge?: string;
  icon: HomeModelIconProps;
  url: string;
}

export interface HomeModelIconProps {
  name: IconName;
}

export const HomeModelCard = ({
  title,
  badge,
  icon,
  url,
}: HomeModelCardProps): JSX.Element => {
  const showBadge = badge != null && badge !== title;
  return (
    <ModelCardRoot to={url}>
      {showBadge && <CardBadge>{badge}</CardBadge>}
      <CardIconWrapper>
        <CardIcon {...icon} />
      </CardIconWrapper>
      <CardTitle>{title}</CardTitle>
    </ModelCardRoot>
  );
};
