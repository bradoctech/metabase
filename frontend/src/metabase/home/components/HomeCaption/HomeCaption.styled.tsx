// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import { breakpointMinExtraLarge } from "metabase/styled-components/theme";
import { color } from "metabase/ui/utils/colors";

interface CaptionProps {
  primary?: boolean;
}

export const CaptionRoot = styled.div<CaptionProps>`
  display: flex;
  align-items: center;
  color: ${color("sp-primary-40")};
  font-weight: 500;
  margin-bottom: 1.1563rem;
  line-height: 1.875rem;

  ${breakpointMinExtraLarge} {
    margin-bottom: 2rem;
  }
`;
