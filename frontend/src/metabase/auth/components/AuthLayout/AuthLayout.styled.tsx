// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import { breakpointMaxSmall } from "metabase/styled-components/theme";

// eslint-disable-next-line no-color-literals
const LEFT_SUBTITLE_COLOR = "#5e5e5e";

export const LayoutRoot = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const LayoutLeftPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 1.5rem 2.5rem;
  background-color: var(--mb-color-button-primary);
  background-image: url("/app/img/login_leftbg_only.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  gap: 0;
  text-align: center;
  overflow: hidden;

  ${breakpointMaxSmall} {
    display: none;
  }
`;

export const LayoutFrameTop = styled.img`
  position: absolute;
  top: 0;
  right: 1.5rem;
  width: auto;
  max-width: 44%;
  pointer-events: none;
  user-select: none;
`;

export const LayoutFrameBottom = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: auto;
  max-width: 36%;
  pointer-events: none;
  user-select: none;
`;

export const LayoutLeftImage = styled.img`
  width: 95%;
  max-width: 95%;
  border-radius: 0.75rem;
  object-fit: cover;
  margin-top: 0;
  z-index: 1;
`;

export const LayoutLeftTitle = styled.h1`
  color: var(--mb-color-text-primary-inverse);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 1rem 0 0.35rem;
  z-index: 1;
`;

export const LayoutLeftSubtitle = styled.p`
  color: ${LEFT_SUBTITLE_COLOR};
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 320px;
  margin: 0;
  z-index: 1;
`;

export const LayoutRightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 3rem 2rem;
  background-color: var(--mb-color-background);

  ${breakpointMaxSmall} {
    padding: 2rem 1.5rem;
  }
`;

export const LayoutCard = styled.div`
  width: 100%;
  max-width: 420px;
  margin-top: 1rem;
`;

export const LayoutFormSubtitle = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: var(--mb-color-text-primary);
  margin: 0.75rem 0 0;
  padding: 0 0.625rem;
  text-align: center;
`;
