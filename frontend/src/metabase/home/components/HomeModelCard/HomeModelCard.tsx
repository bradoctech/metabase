import { EntityIcon } from "metabase/common/components/EntityIcon";
import { Link } from "metabase/common/components/Link";
import type { IconData } from "metabase/common/utils/icon";

import S from "./HomeModelCard.module.css";

interface HomeModelCardProps {
  title: string;
  badge?: string;
  icon: IconData;
  url: string;
}

export const HomeModelCard = ({
  title,
  badge,
  icon,
  url,
}: HomeModelCardProps): JSX.Element => {
  const showBadge = badge != null && badge !== title;

  return (
    <Link className={S.root} to={url}>
      {showBadge && <span className={S.badge}>{badge}</span>}
      <div className={S.iconWrapper}>
        <EntityIcon {...icon} color="core-brand" />
      </div>
      <div className={S.title}>{title}</div>
    </Link>
  );
};
