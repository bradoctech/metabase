// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import {
  breakpointMinLarge,
  breakpointMinSmall,
} from "metabase/styled-components/theme";
import { Icon } from "metabase/ui";
import { alpha } from "metabase/ui/colors";

import { CardRoot } from "../HomeCard/HomeCard.styled";

export const ModelCardRoot = styled(CardRoot)`
  flex-direction: column;
  align-items: flex-start;
  height: 315px;
  width: 215px;
  max-width: 215px;
  gap: 1.25rem;
  border-radius: 0.75rem;
  border-color: var(--mb-color-border-card-home);
  box-shadow: 0 0 0 0 transparent;
  transition: box-shadow 0.2s ease;

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

export const CardBadge = styled.span`
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
  width: 1.5rem;
  height: 1.5rem;
  max-width: 24px;
  max-height: 24px;
`;

export const CardTitle = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--mb-color-text-primary);
  width: 100%;
`;
