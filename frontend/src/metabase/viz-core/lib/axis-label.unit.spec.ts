import {
  AXIS_LABEL_MAX_CHARS,
  createAxisLabelOptions,
  formatAxisLabel,
  toTitleCase,
  truncateAxisLabel,
} from "./axis-label";

describe("SP axis labels", () => {
  it("uses Portuguese connectors in title case", () => {
    expect(toTitleCase("DADOS DA SECRETARIA DE SAÚDE E EDUCAÇÃO")).toBe(
      "Dados da Secretaria de Saúde e Educação",
    );
    expect(toTitleCase("  dados  gerais")).toBe("  Dados  Gerais");
  });

  it("truncates after ten characters without splitting Unicode characters", () => {
    expect(AXIS_LABEL_MAX_CHARS).toBe(10);
    expect(truncateAxisLabel("1234567890")).toBe("1234567890");
    expect(truncateAxisLabel("123456789😀resto")).toBe("123456789😀...");
    expect(formatAxisLabel("DEPARTAMENTO DE SAÚDE")).toBe("Departamen...");
  });

  it("preserves separate full labels that share the same displayed prefix", () => {
    const axis = createAxisLabelOptions((value: string) => value);
    expect(axis.formatter("departamento norte", 0)).toBe(
      axis.formatter("departamento sul", 1),
    );
    expect(
      axis.tooltip.formatter({ value: "departamento norte", tickIndex: 0 }),
    ).toBe("departamento norte");
    expect(
      axis.tooltip.formatter({ value: "departamento sul", tickIndex: 1 }),
    ).toBe("departamento sul");
  });

  it("isolates labels by axis/chart and resolves numeric tick indices", () => {
    const first = createAxisLabelOptions(
      (value: number) => `R$ ${value} milhões`,
      false,
    );
    const second = createAxisLabelOptions(
      (value: number) => `${value} USD`,
      false,
    );
    first.formatter(1000, 2);
    second.formatter(1000, 2);
    expect(first.tooltip.formatter({ value: "1,000", tickIndex: 2 })).toBe(
      "R$ 1000 milhões",
    );
    expect(second.tooltip.formatter({ value: 1000, tickIndex: 2 })).toBe(
      "1000 USD",
    );
  });

  it("escapes HTML in full labels and axis names", () => {
    const axis = createAxisLabelOptions((value: string) => value);
    axis.formatter("<img src=x>", 0);
    expect(axis.tooltip.formatter({ value: "<img src=x>" })).toBe(
      "&lt;img src=x&gt;",
    );
    expect(axis.tooltip.formatter({ name: "<nome>" })).toBe("&lt;nome&gt;");
  });

  it("preserves numeric units/date case and hidden ticks", () => {
    const axis = createAxisLabelOptions((value: string) => value, false);
    expect(axis.formatter("1 MB", 0)).toBe(" 1 MB ");
    expect(axis.formatter("10 PM", 1)).toBe(" 10 PM ");
    expect(axis.formatter("", 2)).toBe("");
  });
});
