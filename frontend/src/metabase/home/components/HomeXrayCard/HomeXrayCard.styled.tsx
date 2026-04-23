// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import {
  breakpointMinLarge,
  breakpointMinSmall,
} from "metabase/styled-components/theme";
import { Icon } from "metabase/ui";
import { alpha } from "metabase/ui/colors";

import { CardRoot } from "../HomeCard/HomeCard.styled";

export const XrayCardRoot = styled(CardRoot)`
  flex-direction: column;
  align-items: flex-start;
  height: 315px;
  width: 215px;
  max-width: 215px;
  gap: 1.5rem;
  border-radius: 0.75rem;
  border-color: var(--mb-color-border-card-home);
  box-shadow: 0 0 0 0 transparent;
  transition: box-shadow 0.2s ease;

  /* Override inherited responsive max-width from CardRoot */
  ${breakpointMinSmall} {
    max-width: 215px;
  }

  ${breakpointMinLarge} {
    padding: 1rem;
  }

  &:hover {
    box-shadow: -1px 6px 18.9px 0 var(--mb-color-shadow-card-hover);
  }
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--mb-color-brand);
  background-color: ${() => alpha("brand", 0.1)};
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardIconWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
`;

export const CardIcon = styled(Icon)`
  display: block;
  color: var(--mb-color-brand);
  width: auto;
  height: auto;
  max-width: 32px;
  max-height: 32px;
  min-width: 26.6px;
  min-height: 26.6px;

  svg,
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const CardTitle = styled.div`
  font-size: 1.25rem; /* 20px */
  line-height: 1.875rem; /* 30px */
  font-weight: 600;
  color: var(--mb-color-sp-black-hover);
  width: 100%;
`;
