import { Link } from "metabase/common/components/Link";
import { Icon, Tooltip } from "metabase/ui";

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
    <Tooltip
      refProp="innerRef"
      label={`${message} ${title}`}
      events={{ hover: true, focus: true, touch: false }}
      multiline
      maw="min(24rem, calc(100vw - 2rem))"
      style={{ overflowWrap: "anywhere" }}
    >
      <Link className={S.root} to={url} onClick={trackHomeXRayClicked}>
        <span className={S.badge}>{title}</span>
        <div className={S.iconWrapper}>
          <Icon name="bolt_filled" c="core-brand" size={24} />
        </div>
        <div className={S.title}>{message}</div>
      </Link>
    </Tooltip>
  );
};
