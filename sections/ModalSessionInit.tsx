import { signal } from "@preact/signals";
import { useScript } from "@deco/deco/hooks";
import { useId } from "../sdk/useId.ts";

interface Props {
  welcomeMessage?: string;
  modalTitle?: string;
  cepPlaceholder?: string;
  submitButtonText?: string;
  findCepText?: string;
}

function sendSessionInit(cep: string) {
  return (window as any).invoke({
    action: "actions/sessionInit/submit",
    props: {
      data: {
        public: {
          country: { value: "BR" },
          postalCode: { value: cep },
        },
      },
    },
  });
}

function validateCep(cep: string) {
  return cep.length === 8 && !isNaN(Number(cep));
}

const onLoad = (id: string) => {
  const input = document.getElementById(id) as HTMLInputElement;
  input.disabled = false;
};

const onSubmit = async (cep: string, showModal: any) => {
  if (!validateCep(cep)) {
    console.error("CEP inválido.");
    return;
  }

  try {
    await sendSessionInit(cep);
    console.log("Sessão iniciada com sucesso");
    showModal.value = false;
  } catch (error) {
    console.error("Erro ao enviar o CEP:", error);
  }
};

function ModalSessionInit({
  modalTitle = "Vamos conferir se atendemos a sua região",
  cepPlaceholder = "CEP 00000-000",
  submitButtonText = "Consultar",
  findCepText = "Não sei meu CEP",
}: Props) {
  const showModal = signal(true);
  const cep = signal("");
  const id = useId();

  const handleInput = (e: Event) => {
    const inputValue = (e.target as HTMLInputElement).value.trim();
    console.log("Valor digitado no CEP:", inputValue);
    cep.value = inputValue;
  };

  return (
    <div>
      {showModal.value && (
        <div class="modal-box">
          <h3 class="font-bold text-lg">{modalTitle}</h3>
          <form>
            <input
              id={id}
              type="text"
              placeholder={cepPlaceholder}
              class="input input-bordered w-full mt-4"
              onInput={handleInput}
              maxLength={8}
              disabled
            />
            <div class="modal-action">
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => onSubmit(cep.value, showModal)}
              >
                {submitButtonText}
              </button>
            </div>
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
      )}
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default ModalSessionInit;
