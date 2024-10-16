import { AppContext } from "../../apps/site.ts";
import Modal from "../ui/Modal.tsx";
import Section from "../ui/Section.tsx";
import {
  HEADER_HEIGHT_MOBILE,
  MODAL_SESSION_INIT_ID,
} from "../../constants.ts";
import { useComponent } from "../../sections/Component.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { type SectionProps } from "@deco/deco";

export interface Props {
  welcomeMessage?: string;
  modalTitle?: string;
  cepPlaceholder?: string;
  submitButtonText?: string;
  findCepText?: string;
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

export async function action(props: Props, req: Request, ctx: AppContext) {
  const platform = usePlatform();
  const form = await req.formData();
  const cep = `${form.get("email") ?? ""}`;

  if (platform === "vtex") {
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

export function loader(props: Props) {
  return { ...props };
}

function ModalSessionInit({
  modalTitle = "Vamos conferir se atendemos a sua região",
  cepPlaceholder = "CEP 00000-000",
  submitButtonText = "Consultar",
  findCepText = "Não sei meu CEP",
}: Props & SectionProps<typeof loader, typeof action>) {
  // Verifica se o CEP está salvo no localStorage e abre o modal, se necessário
  const savedCep =
    typeof window !== "undefined" ? getCepFromLocalStorage() : null;

  // O modal será aberto apenas se não houver um CEP salvo
  const modalOpenClass = !savedCep ? "modal-open" : "";

  return (
    <div className={`modal ${modalOpenClass}`} id={MODAL_SESSION_INIT_ID}>
      <div
        class="bg-base-100 absolute top-0 p-14 modal-box"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        <h3 class="font-bold text-lg">{modalTitle}</h3>
        <form
          hx-post={useComponent(import.meta.url)} // Isso conecta o htmx ao endpoint correto para a ação
          hx-trigger="submit"
          hx-swap="none"
          hx-on="htmx:afterRequest: document.getElementById('MODAL_SESSION_INIT_ID').classList.remove('modal-open')" // Fecha o modal após o envio
          class="flex flex-col sm:flex-row gap-4 w-full"
        >
          <input
            name="email"
            class="input input-bordered flex-grow"
            type="text"
            placeholder={cepPlaceholder}
          />

          <button class="btn btn-primary" type="submit">
            <span class="[.htmx-request_&]:hidden inline">
              {submitButtonText}
            </span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
          </button>
        </form>
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener noreferrer"
          class="link link-primary mt-2 block"
        >
          {findCepText}
        </a>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="412px" />;

export default ModalSessionInit;
