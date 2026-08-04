import { createSelector } from "@reduxjs/toolkit";
import _ from "underscore";

import { getEmbedOptions } from "metabase/selectors/embed";
import { getSettings } from "metabase/selectors/settings";

export const getFont = createSelector(
  [getSettings, getEmbedOptions],
  (settings, embedOptions) => {
    if (embedOptions.font) {
      return embedOptions.font;
    } else if (!_.isEmpty(settings["application-font-files"])) {
      return "Custom";
    } else {
      // SP: keep charts/labels aligned with GlobalStyles (--mb-default-font-family)
      return "Rawline";
    }
  },
);

export const getFontFiles = createSelector([getSettings], (settings) => {
  return settings["application-font-files"];
});
