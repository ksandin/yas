import { render } from "@testing-library/react";
import { z } from "zod";
import { createComposableForm } from "../createComposableForm";

describe("components", () => {
  it("can be defined by value type", () => {
    const Form = createComposableForm({
      components: (builder) =>
        builder
          .type(z.string(), () => <span>text</span>)
          .type(z.number(), () => <span>number</span>),
    });
    const { getByText } = render(
      <Form schema={z.object({ foo: z.number() })} />,
    );
    getByText("number");
  });

  it("can be defined per field name", () => {
    const Form = createComposableForm({
      components: (builder) =>
        builder
          .field("foo", () => <span>foo</span>)
          .field("bar", () => <span>bar</span>),
    });
    const { getByText } = render(
      <Form schema={z.object({ bar: z.number() })} />,
    );
    getByText("bar");
  });

  describe("can be extended from predefined forms", () => {
    it("by value type", () => {
      const Form = createComposableForm({
        components: (builder) =>
          builder.type(z.string(), () => <span>text</span>),
      });
      const ExtendedForm = Form.extend({
        components: (builder) =>
          builder.type(z.number(), () => <span>number</span>),
      });
      const { getByText } = render(
        <ExtendedForm
          schema={z.object({ foo: z.number(), bar: z.number() })}
        />,
      );
      getByText("number");
      getByText("text");
    });

    it("by field name", () => {
      const Form = createComposableForm({
        components: (builder) => builder.field("foo", () => <span>foo</span>),
      });
      const ExtendedForm = Form.extend({
        components: (builder) => builder.field("bar", () => <span>bar</span>),
      });
      const { getByText } = render(
        <ExtendedForm
          schema={z.object({ foo: z.string(), bar: z.number() })}
        />,
      );
      getByText("foo");
      getByText("bar");
    });
  });
});

describe("layout", () => {
  it("default can be defined", () => {
    const Form = createComposableForm({ layout: () => <span>default</span> });
    const { getByText } = render(<Form />);
  });

  it("can be extended from predefined forms", () => {
    const Form = createComposableForm();
    const ExtendedForm = Form.extend({
      layout: () => <span>extended</span>,
    });
    const { getByText } = render(<ExtendedForm />);
    getByText("extended");
  });

  it("can control where fields are rendered", () => {
    const Form = createComposableForm({
      components: (builder) =>
        builder.type(z.string(), ({ name }) => <span>{name}</span>),
    });
    const { baseElement } = render(
      <Form schema={z.object({ foo: z.string(), bar: z.string() })}>
        {({ fields: { Foo, Bar } }) => (
          <main>
            <section>
              <Foo />
            </section>
            <section>
              <Bar />
            </section>
          </main>
        )}
      </Form>,
    );
    expect(baseElement.outerHTML).toBe(
      `<main><section>foo</section><section><span>bar</span></section></main>`,
    );
  });

  it("can override field component props", () => {
    const Form = createComposableForm({
      components: (builder) =>
        builder.type(z.string(), ({ name }) => <span>{name}</span>),
    });
    const { getByText } = render(
      <Form schema={z.object({ foo: z.string() })}>
        {({ fields: { Foo } }) => <Foo name="bar" />}
      </Form>,
    );
    getByText("bar");
  });
});
