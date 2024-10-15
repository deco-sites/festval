import { AppContext } from "../apps/site.ts";
import Modal from "../components/ui/Modal.tsx";
import Section from "../components/ui/Section.tsx";
import { HEADER_HEIGHT_MOBILE, MODAL_SESSION_INIT_ID } from "../constants.ts";
import { usePlatform } from "../sdk/usePlatform.tsx";
import { useComponent } from "./Component.tsx";
import { type SectionProps } from "@deco/deco";
import { useSignal } from "@preact/signals";

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
  window.localStorage.setItem("userCep", JSON.stringify(data));
};

const getCepFromLocalStorage = () => {
  console.log(window.localStorage);
  const storedData = window.localStorage.getItem("userCep");
  if (storedData) {
    const { cep, expirationTime } = JSON.parse(storedData);
    const now = new Date().getTime();
    if (now < expirationTime) {
      return cep;
    } else {
      window.localStorage.removeItem("userCep");
    }
  }
  return null;
};

export async function action(props: Props, req: Request, ctx: AppContext) {
  const platform = usePlatform();
  const form = await req.formData();
  const cep = `${form.get("email") ?? ""}`;
  console.log("CEP enviado:", cep);

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

console.log("Component is loading");

function ModalSessionInit({
  modalTitle = "Vamos conferir se atendemos a sua região",
  cepPlaceholder = "CEP 00000-000",
  submitButtonText = "Consultar",
  findCepText = "Não sei meu CEP",
}: Props & SectionProps<typeof loader, typeof action>) {
  const isModalOpen = useSignal(false);

  // Verificação direta do CEP salvo
  const savedCep =
    typeof window !== "undefined" ? getCepFromLocalStorage() : null;
  console.log("Verificando se há CEP salvo:", savedCep);

  if (!savedCep) {
    console.log("Nenhum CEP salvo, abrindo modal...");
    isModalOpen.value = true;
  } else {
    console.log("CEP encontrado, modal não será aberto");
  }

  return (
    <Modal id={MODAL_SESSION_INIT_ID} open={isModalOpen.value}>
      <div
        class="bg-base-100 absolute top-0 p-14"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        <h3 class="font-bold text-lg">{modalTitle}</h3>
        <form
          hx-post={useComponent(import.meta.url)}
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
    </Modal>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="412px" />;

export default ModalSessionInit;
