import userEvent from "@testing-library/user-event";
import { addLocale, useLocale as setTtagLocale, t } from "ttag";

import { renderWithProviders, screen } from "__support__/ui";

import { SharingButton, SharingMenu } from "./SharingMenu";

describe("Sharing labels in pt-BR", () => {
  beforeEach(() => {
    addLocale("pt-BR", {
      headers: {
        language: "pt-BR",
        "plural-forms": "nplurals=2; plural=(n != 1);",
      },
      translations: {
        "": { Share: { msgid: "Share", msgstr: ["Percentagem"] } },
        "Sharing action": {
          Share: { msgid: "Share", msgstr: ["Compartilhar"] },
        },
      },
    });
    setTtagLocale("pt-BR");
  });

  afterEach(() => {
    setTtagLocale("en");
  });

  it("translates the sharing tooltip and accessible name without changing the numeric semantic type", async () => {
    renderWithProviders(<SharingMenu actions={<button>Copiar link</button>} />);

    const button = screen.getByRole("button", { name: "Compartilhar" });
    await userEvent.hover(button);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Compartilhar",
    );
    expect(t`Share`).toBe("Percentagem");
  });

  it("uses the sharing context for the accessible name when a custom tooltip is a node", () => {
    renderWithProviders(<SharingButton tooltip={<span>Link copiado</span>} />);
    expect(
      screen.getByRole("button", { name: "Compartilhar" }),
    ).toBeInTheDocument();
  });
});
