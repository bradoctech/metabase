import { addLocale, useLocale } from "ttag";

import { localizeConnectionField } from "./connection-field-i18n";

describe("driver connection field localization", () => {
  beforeEach(() => {
    addLocale("pt-BR-driver-test", {
      headers: {
        language: "pt-BR",
        "plural-forms": "nplurals=2; plural=(n != 1);",
      },
      translations: {
        "": {
          Region: { msgid: "Region", msgstr: ["Região"] },
          "Enable multiple databases": {
            msgid: "Enable multiple databases",
            msgstr: ["Habilitar múltiplos bancos de dados"],
          },
          "Optionally filter which databases are visible.": {
            msgid: "Optionally filter which databases are visible.",
            msgstr: [
              "Opcionalmente, filtre quais bancos de dados ficam visíveis.",
            ],
          },
          "Username & password": {
            msgid: "Username & password",
            msgstr: ["Usuário e senha"],
          },
          Optional: { msgid: "Optional", msgstr: ["Opcional"] },
        },
      },
    });
    useLocale("pt-BR-driver-test");
  });

  afterEach(() => useLocale("en"));

  it("translates visible text without changing names, defaults, conditions or option values", () => {
    const original = {
      name: "auth-mode",
      "display-name": "Region",
      description: "Enable multiple databases",
      "helper-text": "Optionally filter which databases are visible.",
      default: "password",
      placeholder: "s3://your_bucket",
      "visible-if": { "use-auth-provider": false },
      options: [{ name: "Username & password", value: "password" }],
    };
    const localized = localizeConnectionField(original);

    expect(localized).toEqual({
      ...original,
      "display-name": "Região",
      description: "Habilitar múltiplos bancos de dados",
      "helper-text":
        "Opcionalmente, filtre quais bancos de dados ficam visíveis.",
      options: [{ name: "Usuário e senha", value: "password" }],
    });
    expect(original["display-name"]).toBe("Region");
    expect(original.options[0].name).toBe("Username & password");
  });

  it("follows locale changes without retaining translated metadata", () => {
    const field = { name: "region", "display-name": "Region" };
    expect(localizeConnectionField(field)["display-name"]).toBe("Região");
    useLocale("en");
    expect(localizeConnectionField(field)["display-name"]).toBe("Region");
  });

  it("keeps unknown driver strings, already translated labels and numeric placeholders intact", () => {
    expect(
      localizeConnectionField({
        name: "vendor-field",
        "display-name": "Campo traduzido",
        description: "Vendor-specific copy",
        placeholder: 100,
      }),
    ).toMatchObject({
      "display-name": "Campo traduzido",
      description: "Vendor-specific copy",
      placeholder: 100,
    });
  });

  it("localizes the generic Optional placeholder while preserving technical examples", () => {
    expect(
      localizeConnectionField({ name: "host", placeholder: "Optional" })
        .placeholder,
    ).toBe("Opcional");
    expect(
      localizeConnectionField({
        name: "host",
        placeholder: "name.database.com",
      }).placeholder,
    ).toBe("name.database.com");
  });
});
