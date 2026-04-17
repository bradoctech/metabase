import type { ReactNode } from "react";
import { t } from "ttag";

import { LogoIcon } from "metabase/common/components/LogoIcon";
import { getSubpathSafeUrl } from "metabase/lib/urls";

import {
  LayoutCard,
  LayoutFrameBottom,
  LayoutFrameTop,
  LayoutLeftImage,
  LayoutLeftPanel,
  LayoutLeftSubtitle,
  LayoutLeftTitle,
  LayoutRightPanel,
  LayoutRoot,
} from "./AuthLayout.styled";

interface AuthLayoutProps {
  children?: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps): JSX.Element => {
  return (
    <LayoutRoot data-testid="login-page">
      <LayoutLeftPanel
        bgImage={getSubpathSafeUrl("app/img/login_leftbg_only.png")}
      >
        <LayoutFrameTop
          src={getSubpathSafeUrl("app/img/login_frametop.png")}
          alt=""
        />
        <LayoutFrameBottom
          src={getSubpathSafeUrl("app/img/login_framebottom.png")}
          alt=""
        />
        <LayoutLeftImage
          src={getSubpathSafeUrl("app/img/login_dashboard.png")}
          alt={t`Dashboard preview`}
        />
        <LayoutLeftTitle>{t`Dashboards SP`}</LayoutLeftTitle>
        <LayoutLeftSubtitle>
          {t`Ambiente de análise com indicadores e dados consolidados para apoio à gestão pública.`}
        </LayoutLeftSubtitle>
      </LayoutLeftPanel>

      <LayoutRightPanel>
        <LogoIcon height={65} />
        <LayoutCard>{children}</LayoutCard>
      </LayoutRightPanel>
    </LayoutRoot>
  );
};
