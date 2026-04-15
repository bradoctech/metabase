import type { IconName } from "metabase/ui";

import {
  CardIcon,
  CardTitle,
  ModelCardIconWrapper,
  ModelCardRoot,
  ModelCategoryBadge,
} from "./HomeModelCard.styled";

interface HomeModelCardProps {
  title: string;
  icon: HomeModelIconProps;
  url: string;
  category?: string;
}

export interface HomeModelIconProps {
  name: IconName;
}

export const HomeModelCard = ({
  title,
  icon,
  url,
  category,
}: HomeModelCardProps): JSX.Element => {
  return (
    <ModelCardRoot to={url}>
      {category && <ModelCategoryBadge>{category}</ModelCategoryBadge>}
      <ModelCardIconWrapper>
        <CardIcon {...icon} />
      </ModelCardIconWrapper>
      <CardTitle>{title}</CardTitle>
    </ModelCardRoot>
  );
};
