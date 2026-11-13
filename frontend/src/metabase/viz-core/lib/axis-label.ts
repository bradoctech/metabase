import { escape } from "underscore";

export const AXIS_LABEL_MAX_CHARS = 10;

export const truncateAxisLabel = (label: string): string => {
  const characters = Array.from(label);
  return characters.length > AXIS_LABEL_MAX_CHARS
    ? characters.slice(0, AXIS_LABEL_MAX_CHARS).join("") + "..."
    : label;
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

export const formatAxisLabel = (label: string) =>
  truncateAxisLabel(toTitleCase(label));

// Each axis owns its full labels. Never use truncated text as an identifier.
export function createAxisLabelOptions<T extends string | number>(
  formatFullLabel: (value: T) => string,
  titleCase = true,
) {
  const labelsByValue = new Map<string, string>();
  const labelsByIndex = new Map<number, string>();
  return {
    formatter: (value: T, index: number) => {
      const fullLabel = formatFullLabel(value);
      labelsByValue.set(String(value), fullLabel);
      labelsByIndex.set(index, fullLabel);
      if (!fullLabel) {
        return "";
      }
      const displayLabel = titleCase
        ? formatAxisLabel(fullLabel)
        : truncateAxisLabel(fullLabel);
      return ` ${displayLabel} `;
    },
    tooltip: {
      show: true,
      extraCssText:
        "padding: 4px 8px !important; max-width: min(360px, 80vw); white-space: normal; overflow-wrap: anywhere;",
      formatter: (params: {
        value?: unknown;
        tickIndex?: number;
        name?: string;
      }) =>
        escape(
          labelsByValue.get(String(params.value)) ??
            (params.tickIndex != null
              ? labelsByIndex.get(params.tickIndex)
              : undefined) ??
            params.name ??
            "",
        ),
    },
  };
}
