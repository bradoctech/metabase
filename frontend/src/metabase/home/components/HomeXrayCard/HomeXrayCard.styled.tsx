// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import { Ellipsified } from "metabase/common/components/Ellipsified";
import { alpha } from "metabase/lib/colors";
import { Icon } from "metabase/ui";
import { color } from "metabase/ui/utils/colors";

import { CardRoot } from "../HomeCard/HomeCard.styled";

// ─── São Paulo client: new vertical card layout ───────────────────────────────

export const SpXrayCardRoot = styled(CardRoot)`
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

  &:hover {
    box-shadow: -1px 6px 18.9px 0 var(--mb-color-shadow-card-hover);
  }
`;

export const SpCategoryBadge = styled.span`
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

export const SpCardIconWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
`;

export const SpCardIcon = styled(Icon)`
  display: block;
  color: var(--mb-color-brand);
  width: 2rem;
  height: 2rem;
`;

export const SpCardTitle = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--mb-color-text-primary);
  width: 100%;
`;

// ─── Default: original card layout ────────────────────────────────────────────

export const CardIcon = styled(Icon)`
  display: block;
  flex: 0 0 auto;
  color: ${() => color("accent4")};
  width: 1.25rem;
  height: 1.25rem;
`;

export const CardTitle = styled(Ellipsified)`
  font-size: 1rem;
  font-weight: bold;
  margin-left: 0.5rem;
  padding-right: 0.2rem;
`;

export const CardTitlePrimary = styled.span`
  color: var(--mb-color-text-primary);
`;

export const CardTitleSecondary = styled.span`
  color: var(--mb-color-text-secondary);
`;
