import { EntityIcon } from "metabase/common/components/EntityIcon";
import { Link } from "metabase/common/components/Link";
import type { IconData } from "metabase/common/utils/icon";
import { Tooltip } from "metabase/ui";

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
    <Tooltip
      refProp="innerRef"
      label={showBadge ? `${badge} · ${title}` : title}
      events={{ hover: true, focus: true, touch: false }}
      multiline
      maw="min(24rem, calc(100vw - 2rem))"
      style={{ overflowWrap: "anywhere" }}
    >
      <Link className={S.root} to={url}>
        {showBadge && <span className={S.badge}>{badge}</span>}
        <div className={S.iconWrapper}>
          <EntityIcon {...icon} color="core-brand" />
        </div>
        <div className={S.title}>{title}</div>
      </Link>
    </Tooltip>
  );
};
