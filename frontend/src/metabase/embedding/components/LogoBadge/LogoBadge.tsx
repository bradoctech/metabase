import cx from "classnames";
import { t } from "ttag";

import { DefaultLogoIcon } from "metabase/common/components/LogoIcon";
import EmbedFrameS from "metabase/embedding/theme.module.css";

import LogoBadgeStyle from "./LogoBadge.module.css";

const SP_PRODUCT_NAME = "Dashboards SP";

export const LogoBadge = ({ dark }: { dark: boolean }) => {
  return (
    <div
      className={cx(EmbedFrameS.LogoBadge, LogoBadgeStyle.metabaseLink, {
        [LogoBadgeStyle.dark]: dark,
        [LogoBadgeStyle.light]: !dark,
      })}
    >
      <span>{t`Powered by`}</span>
      <DefaultLogoIcon height={32} />
      <span className={LogoBadgeStyle.brandName}>{SP_PRODUCT_NAME}</span>
    </div>
  );
};
