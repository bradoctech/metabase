import type { ReactNode } from "react";
import { t } from "ttag";

import LogoIcon from "metabase/common/components/LogoIcon";

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
      <LayoutLeftPanel>
        <LayoutFrameTop src="/app/img/login_frametop.png" alt="" />
        <LayoutFrameBottom src="/app/img/login_framebottom.png" alt="" />
        <LayoutLeftImage
          src="/app/img/login_dashboard.png"
          alt={t`Dashboard preview`}
        />
        <LayoutLeftTitle>{t`Dashboards SP`}</LayoutLeftTitle>
        <LayoutLeftSubtitle>
          {t`Make more informed decisions by analyzing the numbers carefully. Understanding the data can lead to better outcomes and strategies.`}
        </LayoutLeftSubtitle>
      </LayoutLeftPanel>

      <LayoutRightPanel>
        <LogoIcon height={65} />
        <LayoutCard>{children}</LayoutCard>
      </LayoutRightPanel>
    </LayoutRoot>
  );
};
