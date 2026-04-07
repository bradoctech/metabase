import { IS_SAOPAULO_CLIENT } from "metabase/lib/client-config";

import { HomeCard } from "../HomeCard";

import {
  CardIcon,
  CardTitle,
  CardTitlePrimary,
  CardTitleSecondary,
  SpCardIcon,
  SpCardIconWrapper,
  SpCardTitle,
  SpCategoryBadge,
  SpXrayCardRoot,
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
  if (IS_SAOPAULO_CLIENT) {
    return (
      <SpXrayCardRoot to={url} onClick={trackHomeXRayClicked}>
        <SpCategoryBadge>{title}</SpCategoryBadge>
        <SpCardIconWrapper>
          <SpCardIcon name="bolt_filled" />
        </SpCardIconWrapper>
        <SpCardTitle>{message}</SpCardTitle>
      </SpXrayCardRoot>
    );
  }

  return (
    <HomeCard url={url} onClick={trackHomeXRayClicked}>
      <CardIcon name="bolt_filled" />
      <CardTitle>
        <CardTitleSecondary>{message}</CardTitleSecondary>{" "}
        <CardTitlePrimary>{title}</CardTitlePrimary>
      </CardTitle>
    </HomeCard>
  );
};
