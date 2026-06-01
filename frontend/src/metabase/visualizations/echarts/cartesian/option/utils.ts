import type { BaseCartesianChartModel, DataKey } from "../model/types";

export function getSeriesYAxisIndex(
  dataKey: DataKey,
  chartModel: BaseCartesianChartModel,
): number {
  const { leftAxisModel, rightAxisModel } = chartModel;
  const hasSingleYAxis = leftAxisModel == null || rightAxisModel == null;

  if (hasSingleYAxis) {
    return 0;
  }

  return leftAxisModel.seriesKeys.includes(dataKey) ? 0 : 1;
}

export const getPaddedAxisLabel = (label: string | number): string =>
  ` ${label} `; // spaces force padding between ticks

export const AXIS_LABEL_MAX_CHARS = 15;

export const truncateAxisLabel = (label: string): string => {
  if (label.length <= AXIS_LABEL_MAX_CHARS) {
    return label;
  }
  return label.slice(0, AXIS_LABEL_MAX_CHARS) + "...";
};

const LOWERCASE_WORDS = new Set([
  // Articles
  "a",
  "o",
  "as",
  "os",
  "um",
  "uma",
  "uns",
  "umas",
  "à",
  "às",

  // Prepositions & contractions
  "de",
  "do",
  "da",
  "dos",
  "das",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "ao",
  "aos",
  "num",
  "numa",
  "nuns",
  "numas",
  "por",
  "para",
  "pelo",
  "pelos",
  "pela",
  "pelas",
  "com",
  "sem",
  "sob",
  "sobre",
  "entre",
  "até",
  "após",
  "ante",
  "contra",
  "via",
  "per",

  // Conjunctions / connectors
  "e",
  "ou",
  "mas",
  "nem",
  "como",
  "que",

  // Short useful tokens
  "vs",
  "v.",
  "x",
]);

export const toTitleCase = (text: string): string =>
  text
    .split(" ")
    .map((word, index) => {
      if (word === "") {
        return word;
      }
      if (index > 0 && LOWERCASE_WORDS.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
