// eslint-disable-next-line no-restricted-imports
import { css } from "@emotion/react";
// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

import { Link } from "metabase/common/components/Link";
import { TreeNode } from "metabase/common/components/tree/TreeNode";
import { NAV_SIDEBAR_WIDTH } from "metabase/nav/constants";
import type { IconProps } from "metabase/ui";
import { Icon, Tooltip } from "metabase/ui";
import type { ColorName } from "metabase/ui/colors/types";
import { color } from "metabase/ui/utils/colors";

export const SidebarIcon = styled(
  forwardRef<SVGSVGElement, IconProps & { isSelected: boolean }>(
    function SidebarIcon({ isSelected, ...props }, ref) {
      return <Icon {...props} size={props.size ?? 16} ref={ref} />;
    },
  ),
)<{
  color?: ColorName | string;
  isSelected: boolean;
}>`
  ${(props) =>
    !props.color &&
    css`
      color: var(--mb-color-brand);
    `}
`;

export const ExpandToggleButton = styled(TreeNode.ExpandToggleButton)`
  padding: 4px 0 4px 2px;
  color: var(--mb-color-brand);
`;

const activeColorCSS = css`
  color: var(--mb-color-brand);
`;

function getTextColor(isSelected: boolean) {
  return isSelected ? color("text-primary") : color("sp-black-hover");
}

type NodeRootProps = ComponentProps<typeof TreeNode.Root> & {
  hasDefaultIconStyle?: boolean;
};

export const NodeRoot = styled(TreeNode.Root)<NodeRootProps>`
  color: ${(props) => getTextColor(props.isSelected)};
  background-color: ${(props) =>
    props.isSelected ? "var(--mb-color-background-menu-selected)" : "unset"};
  padding-left: ${(props) => props.depth}rem;
  border-radius: 4px;

  &:focus-within {
    outline: 2px solid var(--mb-color-focus);
    outline-offset: -2px;
  }

  ${ExpandToggleButton} {
    ${(props) => props.isSelected && activeColorCSS}
  }

  &:hover {
    background-color: var(--mb-color-background-menu-hover);
    color: var(--mb-color-text-primary);

    ${ExpandToggleButton} {
      color: var(--mb-color-brand);
    }
  }

  &:hover,
  &:focus,
  &:focus-within {
    ${SidebarIcon} {
      ${({ hasDefaultIconStyle = true }) =>
        hasDefaultIconStyle && activeColorCSS};
    }
  }
`;

const collectionDragAndDropHoverStyle = css`
  color: var(--mb-color-text-primary-inverse);
  background-color: var(--mb-color-brand);
`;

export const CollectionNodeRoot = styled(NodeRoot)<{ hovered?: boolean }>`
  ${(props) => props.hovered && collectionDragAndDropHoverStyle}
`;

const itemContentStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const FullWidthButton = styled.button<{ isSelected: boolean }>`
  color: ${(props) =>
    props.isSelected ? color("text-primary") : color("sp-black-hover")};
  cursor: pointer;

  ${itemContentStyle}
  ${TreeNode.NameContainer} {
    color: ${(props) =>
      props.isSelected ? color("text-primary") : color("sp-black-hover")};
    text-align: start;

    &:hover {
      color: inherit;
    }
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

export const FullWidthLink = styled(Link)`
  ${itemContentStyle}
  &:focus,
  &:focus-visible {
    outline: none !important;
  }
`;

const ITEM_NAME_LENGTH_TOOLTIP_THRESHOLD = 35;
const ITEM_NAME_LABEL_WIDTH = Math.round(parseInt(NAV_SIDEBAR_WIDTH, 10) * 0.7);

export const ItemName = styled(TreeNode.NameContainer)`
  width: ${ITEM_NAME_LABEL_WIDTH}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export function NameContainer({ children: itemName }: { children: string }) {
  if (itemName.length >= ITEM_NAME_LENGTH_TOOLTIP_THRESHOLD) {
    return (
      <Tooltip label={itemName} withArrow maw="none">
        <ItemName>{itemName}</ItemName>
      </Tooltip>
    );
  }
  return <TreeNode.NameContainer>{itemName}</TreeNode.NameContainer>;
}

export const LeftElementContainer = styled.div``;
export const RightElementContainer = styled.div``;
