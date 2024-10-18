import { AppContext } from "../../apps/site.ts";
import Section from "../ui/Section.tsx";
import {
  HEADER_HEIGHT_MOBILE,
  MODAL_SESSION_INIT_ID,
} from "../../constants.ts";
import { useComponent } from "../../sections/Component.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { type SectionProps } from "@deco/deco";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /**
   * @title Mensagem de boas vindas
   * @default Seja bem vindo(a) ao
   */
  welcomeMessage?: string;
  /**
   * @title Texto modal
   * @default Vamos conferir se atendemos a sua região:
   */
  modalTitle?: string;
  /**
   * @title Placeholder
   * @default CEP 00000-000
   */
  cepPlaceholder?: string;
  /**
   * @title Texto botão
   * @default Salvar
   */
  submitButtonText?: string;
  /**
   * @title Não sei cep
   * @default Não sei meu CEP
   */
  findCepText?: string;
  /***
   * @title Logo modal
   */
  logo?: ImageWidget;
}

export interface ModalInitProps {
  modalInitProps: Props;
}

const saveCepToLocalStorage = (cep: string, expirationHours = 24) => {
  const now = new Date();
  const expirationTime = now.getTime() + expirationHours * 60 * 60 * 1000;
  const data = { cep, expirationTime };
  localStorage.setItem("userCep", JSON.stringify(data));
};

const getCepFromLocalStorage = () => {
  const storedData = localStorage.getItem("userCep");

  if (storedData) {
    const { cep, expirationTime } = JSON.parse(storedData);
    const now = new Date().getTime();

    if (now < expirationTime) {
      return cep;
    } else {
      localStorage.removeItem("userCep");
    }
  }

  return null;
};

export async function action(
  _props: ModalInitProps,
  req: Request,
  ctx: AppContext
) {
  const platform = usePlatform();
  const form = await req.formData();
  const cep = `${form.get("email") ?? ""}`;

  if (platform === "vtex") {
    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("site/actions/sessionInit/submit.ts", {
      data: {
        public: {
          country: { value: "BR" },
          postalCode: { value: cep },
        },
      },
    });
  }

  saveCepToLocalStorage(cep);

  return true;
}

export function loader(props: ModalInitProps) {
  return { ...props };
}

function ModalSessionInit({
  modalInitProps,
}: ModalInitProps & SectionProps<typeof loader, typeof action>) {
  const savedCep =
    typeof window !== "undefined" ? getCepFromLocalStorage() : null;

  const modalOpenClass = !savedCep ? "modal-open" : "";

  return (
    <div className={`modal ${modalOpenClass}`} id={MODAL_SESSION_INIT_ID}>
      <div
        class="bg-base-100 absolute top-0 pt-5 pb-20 px-[30px] sm:px-[40px] modal-box rounded-lg flex flex-col gap-2.5"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        {modalInitProps.welcomeMessage && (
          <div>
            <h3 class="font-bold text-base text-center">
              {modalInitProps.welcomeMessage}
            </h3>
          </div>
        )}
        {modalInitProps.logo && (
          <div class="flex justify-center">
            <Image width={250} height={40} src={modalInitProps.logo} />
          </div>
        )}
        <h3 class="font-normal text-center text-[12.8px]">
          {modalInitProps.modalTitle}
        </h3>
        <form
          hx-post={useComponent(import.meta.url)}
          hx-trigger="submit"
          hx-swap="none"
          hx-on="htmx:afterRequest: document.querySelector('#modal-session-init').classList.remove('modal-open')"
          class="flex flex-col gap-2.5 w-full"
        >
          <input
            name="email"
            class="input input-bordered flex-grow text-center rounded-[5px]"
            type="text"
            placeholder={modalInitProps.cepPlaceholder}
          />

          <button
            class="flex justify-center items-center text-base rounded-[5px] w-full transition duration-300 ease-in-out cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: "#282828",
              outline: "none",
              padding: "12px",
              color: "#fff",
              borderRadius: "5px",
              border: "1px solid #282828",
            }}
            type="submit"
          >
            <span class="[.htmx-request_&]:hidden inline">
              {modalInitProps.submitButtonText}
            </span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
          </button>
        </form>
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener noreferrer"
          class="link block text-xs underline"
          style={{
            color: "#6495ed",
          }}
        >
          {modalInitProps.findCepText}
        </a>
      </div>
    </div>
  );
}

export default ModalSessionInit;
