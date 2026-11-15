import { readFileSync } from "node:fs";

import { addLocale, useLocale } from "ttag";

import { localizeConnectionField } from "./connection-field-i18n";

// The frontend locale builder excludes backend-only PO entries. Test the
// checked-in catalog, rather than supplying translations that hide that gap.
const catalogEntries = readFileSync("locales/pt-BR.po", "utf8").split(
  /\n\s*\n/,
);

afterEach(() => useLocale("en"));

it.each([
  ["Region", "Região"],
  ["Project ID (override)", "ID do projeto (substituição)"],
  ["Alternate hostname", "Nome de host alternativo"],
  ["Datasets", "Conjuntos de dados"],
  ["Broker node port", "Porta do nó broker"],
  ["Authentication header", "Cabeçalho de autenticação"],
  ["Allow unfolding of JSON columns", "Permitir desdobramento de colunas JSON"],
  [
    "Role (optional, required for connection impersonation)",
    "Função (opcional, necessária para representação de conexão)",
  ],
])("includes %s in the frontend pt-BR catalog", (message, translation) => {
  const entry = catalogEntries.find(
    (entry) =>
      entry.includes(`msgid "${message}"`) && !entry.includes("msgctxt "),
  );
  expect(entry).toBeDefined();
  expect(entry).toMatch(/^#: .*frontend\//m);
  expect(entry).toContain(`msgstr "${translation}"`);
  const serializedTranslation = entry?.match(/^msgstr (".*")$/m)?.[1];
  expect(serializedTranslation).toBeDefined();
  addLocale("pt-BR-driver-catalog-test", {
    headers: { "plural-forms": "nplurals=2; plural=(n != 1);" },
    translations: {
      "": {
        [message]: {
          msgid: message,
          msgstr: [JSON.parse(serializedTranslation ?? '""')],
        },
      },
    },
  });
  useLocale("pt-BR-driver-catalog-test");
  expect(
    localizeConnectionField({
      name: "original-property",
      "display-name": message,
    })["display-name"],
  ).toBe(translation);
});
