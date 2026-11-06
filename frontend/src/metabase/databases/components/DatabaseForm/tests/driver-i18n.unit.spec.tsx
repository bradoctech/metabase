import userEvent from "@testing-library/user-event";
import { addLocale, useLocale } from "ttag";

import { renderWithProviders, screen, waitFor } from "__support__/ui";
import { Form, FormProvider } from "metabase/forms";

import { DatabaseDetailField } from "../../DatabaseDetailField";

describe("driver connection field translations in the form", () => {
  afterEach(() => useLocale("en"));

  it("renders a translated field and tooltip while binding the original connection property", async () => {
    addLocale("pt-BR-driver-form-test", {
      headers: {
        language: "pt-BR",
        "plural-forms": "nplurals=2; plural=(n != 1);",
      },
      translations: {
        "": {
          Region: { msgid: "Region", msgstr: ["Região"] },
          "Use a different data catalog (if you have federated queries, for example)":
            {
              msgid:
                "Use a different data catalog (if you have federated queries, for example)",
              msgstr: [
                "Use outro catálogo de dados (por exemplo, se você tiver consultas federadas)",
              ],
            },
        },
      },
    });
    useLocale("pt-BR-driver-form-test");
    const onSubmit = jest.fn();
    renderWithProviders(
      <FormProvider
        initialValues={{ details: { region: "" } }}
        onSubmit={onSubmit}
      >
        <Form>
          <DatabaseDetailField
            field={{
              name: "region",
              "display-name": "Region",
              type: "string",
              "helper-text":
                "Use a different data catalog (if you have federated queries, for example)",
            }}
            engineKey="athena"
            engine={undefined}
          />
          <button type="submit">Submit</button>
        </Form>
      </FormProvider>,
    );

    const input = screen.getByLabelText("Região");
    expect(input).toHaveAttribute("name", "details.region");
    await userEvent.type(input, "us-east-1");
    expect(input).toHaveValue("us-east-1");
    await userEvent.hover(screen.getByRole("img", { name: "info icon" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Use outro catálogo de dados (por exemplo, se você tiver consultas federadas)",
    );
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      details: { region: "us-east-1" },
    });
  });
});
