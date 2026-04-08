// eslint-disable-next-line no-restricted-imports
import { css } from "@emotion/react";

export const saoPauloFontFiles = ({ baseUrl = "./" } = {}) => {
  const localInstanceUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const basePath = `${localInstanceUrl}app/fonts/Rawline`;

  return css`
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 100;
      src:
        url("${basePath}/rawline-100.woff") format("woff"),
        url("${basePath}/rawline-100.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 100;
      src:
        url("${basePath}/rawline-100i.woff") format("woff"),
        url("${basePath}/rawline-100i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 200;
      src:
        url("${basePath}/rawline-200.woff") format("woff"),
        url("${basePath}/rawline-200.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 200;
      src:
        url("${basePath}/rawline-200i.woff") format("woff"),
        url("${basePath}/rawline-200i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 300;
      src:
        url("${basePath}/rawline-300.woff") format("woff"),
        url("${basePath}/rawline-300.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 300;
      src:
        url("${basePath}/rawline-300i.woff") format("woff"),
        url("${basePath}/rawline-300i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 400;
      src:
        url("${basePath}/rawline-400.woff") format("woff"),
        url("${basePath}/rawline-400.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 400;
      src:
        url("${basePath}/rawline-400i.woff") format("woff"),
        url("${basePath}/rawline-400i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 500;
      src:
        url("${basePath}/rawline-500.woff") format("woff"),
        url("${basePath}/rawline-500.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 500;
      src:
        url("${basePath}/rawline-500i.woff") format("woff"),
        url("${basePath}/rawline-500i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 600;
      src:
        url("${basePath}/rawline-600.woff") format("woff"),
        url("${basePath}/rawline-600.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 600;
      src:
        url("${basePath}/rawline-600i.woff") format("woff"),
        url("${basePath}/rawline-600i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 700;
      src:
        url("${basePath}/rawline-700.woff") format("woff"),
        url("${basePath}/rawline-700.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 700;
      src:
        url("${basePath}/rawline-700i.woff") format("woff"),
        url("${basePath}/rawline-700i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 800;
      src:
        url("${basePath}/rawline-800.woff") format("woff"),
        url("${basePath}/rawline-800.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 800;
      src:
        url("${basePath}/rawline-800i.woff") format("woff"),
        url("${basePath}/rawline-800i.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: normal;
      font-weight: 900;
      src:
        url("${basePath}/rawline-900.woff") format("woff"),
        url("${basePath}/rawline-900.ttf") format("truetype");
      font-display: swap;
    }
    @font-face {
      font-family: "Rawline";
      font-style: italic;
      font-weight: 900;
      src:
        url("${basePath}/rawline-900i.woff") format("woff"),
        url("${basePath}/rawline-900i.ttf") format("truetype");
      font-display: swap;
    }
  `;
};
