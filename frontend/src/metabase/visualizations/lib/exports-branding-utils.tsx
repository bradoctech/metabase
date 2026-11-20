import { t } from "ttag";

import spLogo from "assets/img/logo.svg?source";

type BrandingSize = "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl";

export const getBrandingSize = (width: number): BrandingSize => {
  const sizes: [number, BrandingSize][] = [
    [200, "xs"],
    [600, "s"],
    [960, "m"],
    [1280, "l"],
    [1600, "xl"],
    [1920, "xxl"],
  ];

  for (const [threshold, size] of sizes) {
    if (width < threshold) {
      return size;
    }
  }

  return "xxxl";
};

type BrandingConfig = {
  /** Font size */
  fz: number;
  /** Margin between the text and the logo (if any) */
  m: number;
  /** Container padding */
  p: number;
  /** Container height */
  h: number;
  /** Logo height */
  ly: number;
};

/**
 * Returns a configuration object for a branding element based on the given size.
 *
 * @param size - The desired element size (e.g., 's', 'm', 'l', etc.)
 * @returns An object containing font size, margin, padding, height, and logo height.
 */
export const getBrandingConfig = (size: BrandingSize): BrandingConfig => {
  const sizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
  const sizeIndex = sizes.indexOf(size);

  const fzValues = [6, 6, 8, 12, 14, 16, 20];
  const marginValues = [0, 4, 6, 6, 12, 14, 20];
  const paddingValues = [8, 16, 24, 24, 32, 32, 48];
  const heightValues = [32, 32, 52, 60, 84, 112, 144];
  const logoHeights = [16, 16, 20, 28, 36, 48, 64];

  const getDimension = (values: number[]): number => values[sizeIndex];

  return {
    fz: getDimension(fzValues),
    m: getDimension(marginValues),
    p: getDimension(paddingValues),
    h: getDimension(heightValues),
    ly: getDimension(logoHeights),
  };
};

export const createBrandingElement = (size: BrandingSize) => {
  const { fz, h, ly, m, p } = getBrandingConfig(size);

  // Preserve the coat of arms' viewBox ratio; the product name stays DOM text.
  const LOGO_ASCPECT_RATIO = 370.206 / 430.138;
  const LOGO_HEIGHT = ly;
  const LOGO_WIDTH = LOGO_HEIGHT * LOGO_ASCPECT_RATIO;

  const container = document.createElement("div");
  container.style.cssText = `
    height: ${h}px;
    width: 100%;
    padding-inline: ${p}px;
    background-color: var(--mb-color-bg-dashboard);
    display: flex;
    align-items: center;
    justify-content: ${size === "xs" ? "center" : "flex-end"};
  `;

  if (size !== "xs") {
    const brandingCopy = document.createElement("span");
    brandingCopy.textContent = t`Made with`;
    brandingCopy.style.cssText = `
      font-family: "Lato", sans-serif;
      font-size: ${fz}px;
      color: var(--mb-color-text-secondary);
      display: inline-block;
      margin-inline-end: ${m}px;
      vertical-align: middle;
      line-height: 1;
    `;
    container.appendChild(brandingCopy);
  }

  const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(spLogo, "utf-8").toString("base64")}`;

  const logo = document.createElement("img");
  logo.src = logoDataUrl;
  logo.width = Math.round(LOGO_WIDTH);
  logo.height = LOGO_HEIGHT;
  logo.alt = "";
  logo.style.objectFit = "contain";
  logo.style.flexShrink = "0";

  container.appendChild(logo);

  const brandName = document.createElement("span");
  brandName.textContent = "Dashboards SP";
  brandName.style.cssText = `
    font-family: "Rawline", sans-serif;
    font-size: ${ly * 0.65}px;
    font-weight: 700;
    color: var(--mb-color-text-secondary);
    margin-inline-start: ${m || 4}px;
    white-space: nowrap;
    line-height: 1;
  `;
  container.appendChild(brandName);

  return container;
};
