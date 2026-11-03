import type React from "react";

import { Link } from "metabase/common/components/Link";
import { useLocation } from "metabase/router";
import { SP_COMMERCIAL_POLICY } from "metabase/sp/commercial-policy";
import {
  Icon,
  NavLink,
  type NavLinkProps,
  Stack,
  type StackProps,
} from "metabase/ui";
import type { IconName } from "metabase-types/api";
export const AdminNavWrapper = ({
  children,
  ...stackProps
}: {
  children: React.ReactNode;
} & StackProps) => {
  return (
    <Stack w="16rem" gap={0} p="lg" h="100%" {...stackProps} component="nav">
      {children}
    </Stack>
  );
};

export type AdminNavItemProps = {
  isUpsell?: boolean;
  path?: string;
  /* folderPath is used to highlight the folder when one of its children is active, but doesn't navigate */
  folderPattern?: string;
  icon?: IconName;
  onClick?: () => void;
} & Omit<NavLinkProps, "href">;

export function AdminNavItem({
  isUpsell,
  path,
  folderPattern,
  label,
  icon,
  ...navLinkProps
}: AdminNavItemProps) {
  const location = useLocation();
  const subpath = location.pathname;

  if (isUpsell && !SP_COMMERCIAL_POLICY.showUpsells) {
    return null;
  }

  return (
    <NavLink
      component={path ? Link : undefined}
      to={path ?? ""}
      defaultOpened={folderPattern ? subpath.includes(folderPattern) : false}
      active={path === subpath}
      variant="secondary"
      label={label}
      mb="xxs"
      {...(icon ? { leftSection: <Icon name={icon} /> } : undefined)}
      {...navLinkProps}
    />
  );
}
