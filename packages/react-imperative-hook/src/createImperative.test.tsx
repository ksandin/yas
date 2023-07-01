import type { ComponentType, ReactNode } from "react";
import {
  screen,
  within,
  render,
  fireEvent as userEvent,
} from "@testing-library/react";
import { createImperative } from "./createImperative";
import type { ImperativeComponentProps } from "./index";
import { ComponentStore } from "./index";

test("predefined dialog with built-in message", async () => {
  setup(() => {
    const alert = useModal(Dialog);
    return <button onClick={() => alert()}>Open dialog</button>;
  });
  userEvent.click(screen.getByText("Open dialog"));
  const dialog = await screen.findByRole("dialog");
  await within(dialog).findByText("Built-in message");
});

test("predefined dialog with default message", async () => {
  setup(() => {
    const alert = useModal(Dialog, { message: "Default message" });
    return <button onClick={() => alert()}>Open dialog</button>;
  });
  userEvent.click(screen.getByText("Open dialog"));
  const dialog = await screen.findByRole("dialog");
  await within(dialog).findByText("Default message");
});

test("predefined dialog with custom message", async () => {
  setup(() => {
    const alert = useModal(Dialog, { message: "Default message" });
    return (
      <button onClick={() => alert({ message: "Custom message" })}>
        Open dialog
      </button>
    );
  });
  userEvent.click(screen.getByText("Open dialog"));
  const dialog = await screen.findByRole("dialog");
  await within(dialog).findByText("Custom message");
});

test("inline dialog with built-in message", async () => {
  setup(() => {
    const showModal = useModals();
    return <button onClick={() => showModal(Dialog)}>Open dialog</button>;
  });
  userEvent.click(screen.getByText("Open dialog"));
  const dialog = await screen.findByRole("dialog");
  await within(dialog).findByText("Built-in message");
});

test("inline dialog with custom message", async () => {
  setup(() => {
    const showModal = useModals();
    return (
      <button onClick={() => showModal(Dialog, { message: "Custom message" })}>
        Open dialog
      </button>
    );
  });
  userEvent.click(screen.getByText("Open dialog"));
  const dialog = await screen.findByRole("dialog");
  await within(dialog).findByText("Custom message");
});

function Dialog({
  state,
  message = "Built-in message",
  resolve,
}: ModalProps & { message?: ReactNode }) {
  if (state.type !== "pending") {
    return null;
  }
  return (
    <div role="dialog">
      <p>{message}</p>
      <button onClick={() => resolve()}>OK</button>
    </div>
  );
}

function setup(Content: ComponentType) {
  const store = new ComponentStore();
  function Wrapper({ children }: { children?: ReactNode }) {
    return (
      <ModalContext.Provider value={store}>
        {children}
        <ModalOutlet />
      </ModalContext.Provider>
    );
  }
  return render(<Content />, { wrapper: Wrapper });
}

const {
  useInstanceSpawner: useModal,
  useComponentSpawner: useModals,
  Context: ModalContext,
  Outlet: ModalOutlet,
} = createImperative();

type ModalProps<Output = void> = ImperativeComponentProps<Output>;
