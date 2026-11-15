import {
  Children,
  Fragment,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";

import { SP_COMMERCIAL_POLICY } from "metabase/sp/commercial-policy";
import { Stack, Text } from "metabase/ui";

import S from "./AreaLayout.module.css";
import { AreaTab } from "./AreaTab";

type AreaTabGroupProps = {
  label: string;
  showLabel: boolean;
  children: ReactNode;
  mb?: string;
};

function getVisibleChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap<ReactNode>((child) => {
    if (!isValidElement<{ children?: ReactNode; isGated?: boolean }>(child)) {
      return [child];
    }
    if (child.type === Fragment) {
      const visibleChildren = getVisibleChildren(child.props.children);
      return visibleChildren.length
        ? [cloneElement(child, {}, visibleChildren)]
        : [];
    }
    if (
      child.type === AreaTab &&
      child.props.isGated &&
      !SP_COMMERCIAL_POLICY.showUpsells
    ) {
      return [];
    }
    return [child];
  });
}

export function AreaTabGroup({
  label,
  showLabel,
  children,
  mb,
}: AreaTabGroupProps) {
  const visibleChildren = getVisibleChildren(children);
  if (!visibleChildren.length) {
    return null;
  }

  return (
    <Stack component="section" gap="0" mb={mb} aria-label={label}>
      {showLabel && (
        <Text component="h4" className={S.groupHeading} px="sm">
          {label}
        </Text>
      )}
      {visibleChildren}
    </Stack>
  );
}
