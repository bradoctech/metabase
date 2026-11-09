import { Link } from "metabase/common/components/Link";
import { Icon } from "metabase/ui";

import S from "./HomeXrayCard.module.css";
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
    <Link className={S.root} to={url} onClick={trackHomeXRayClicked}>
      <span className={S.badge}>{title}</span>
      <div className={S.iconWrapper}>
        <Icon name="bolt_filled" c="core-brand" size={24} />
      </div>
      <div className={S.title}>{message}</div>
    </Link>
  );
};
