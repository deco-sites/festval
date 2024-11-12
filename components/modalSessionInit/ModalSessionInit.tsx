import { AppContext } from "../../apps/site.ts";
import { deleteCookie, setCookie } from "@std/http/cookie";
import { HEADER_HEIGHT_MOBILE } from "../../constants.ts";
import { useComponent } from "../../sections/Component.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";
import { type SectionProps } from "@deco/deco";

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

const saveCepToCookies = (
  ctx: AppContext,
  cep: string,
  expirationHours = 24
) => {
  const now = new Date();
  const expirationTime = now.getTime() + expirationHours * 60 * 60 * 1000;
  const encodedCep = encodeURIComponent(cep);
  setCookie(ctx.response.headers, {
    value: encodedCep,
    name: "vtex_last_session_cep",
    path: "/",
    expires: new Date(expirationTime),
    secure: true,
  });
};

const saveSegmentToCookie = (ctx: AppContext, segment: string) => {
  setCookie(ctx.response.headers, {
    value: segment,
    name: "vtex_last_segment",
    path: "/",
    secure: true,
  });
};

export const action = async (
  _props: ModalInitProps,
  req: Request,
  ctx: AppContext
) => {
  const platform = usePlatform();
  const form = await req.formData();
  const cep = `${form.get("cep") ?? ""}`;
  if (!cep) return { actionResult: false };
  const cepFormatted = cep.replace("-", "").trim();

  if (platform === "vtex") {
    // deno-lint-ignore no-explicit-any
    const response = await (ctx as any).invoke(
      "site/actions/sessionInit/submit.ts",
      {
        data: {
          public: {
            country: { value: "BRA" },
            postalCode: { value: cepFormatted },
          },
        },
      }
    );

    console.log(response);

    if (response) {
      deleteCookie(req.headers, "vtex_segment");
      deleteCookie(req.headers, "vtex_session");

      setCookie(ctx.response.headers, {
        value: response.segmentToken,
        name: "vtex_segment",
        path: "/",
        secure: true,
      });

      setCookie(ctx.response.headers, {
        value: response.sessionToken,
        name: "vtex_session",
        path: "/",
        secure: true,
      });

      saveSegmentToCookie(ctx, response.segmentToken);
      saveCepToCookies(ctx, cep);
      return true;
    }
    return false;
  }

  return false;
};

const onLoad = (id: string) => {
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }
  const cep = getCookie("vtex_last_session_cep");
  const vtex_segment_cookie = getCookie("vtex_last_segment");
  const vtex_segment = vtex_segment_cookie ? atob(vtex_segment_cookie) : null;
  const modal = document.getElementById(id);
  const regionId = vtex_segment ? JSON.parse(vtex_segment)?.regionId : null;
  if (cep && regionId) {
    modal?.classList.remove("modal-open");
  } else {
    modal?.classList.add("modal-open");
  }
};

const onSubmit = (id: string, maxAttempts = 5, delay = 1000) => {
  let attempts = 0;

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  function attemptSubmit() {
    const modal = document.getElementById(id);
    const limeText = modal?.querySelector(".text-lime-600");
    const redText = modal?.querySelector(".text-red-700");
    const btnSubmit = modal?.querySelector(".btn-submit");
    const loading = modal?.querySelector(".loading");

    btnSubmit?.classList.add("hidden");
    loading?.classList.remove("hidden");

    const cep = getCookie("vtex_last_session_cep");
    const vtex_segment_cookie = getCookie("vtex_last_segment");
    const vtex_segment = vtex_segment_cookie ? atob(vtex_segment_cookie) : null;
    const regionId = vtex_segment ? JSON.parse(vtex_segment)?.regionId : null;

    if (cep && regionId) {
      limeText?.classList.remove("hidden");
      redText?.classList.add("hidden");

      setTimeout(() => {
        modal?.classList.remove("modal-open");
        window.location.reload();
      }, 1000);
    } else if (attempts < maxAttempts) {
      attempts += 1;
      setTimeout(attemptSubmit, delay);
    } else {
      redText?.classList.remove("hidden");
      limeText?.classList.add("hidden");
      btnSubmit?.classList.remove("hidden");
      loading?.classList.add("hidden");
    }
  }

  attemptSubmit();
};

const applyCepMask = () => {
  const cepInput = event?.currentTarget as HTMLInputElement;
  cepInput.value = cepInput.value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

export function loader(props: ModalInitProps) {
  return { ...props };
}

function ModalSessionInit({
  modalInitProps,
}: ModalInitProps & SectionProps<typeof loader, typeof action>) {
  const id = useId();
  const {
    welcomeMessage,
    logo,
    modalTitle,
    cepPlaceholder,
    submitButtonText,
    findCepText,
  } = modalInitProps;
  return (
    <div className={`modal`} id={id}>
      <div
        class="bg-base-100 absolute top-0 pt-5 pb-5 px-[30px] sm:px-[40px] modal-box rounded-lg flex flex-col gap-2.5"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        {welcomeMessage && (
          <div>
            <h3 class="font-bold text-base text-center">{welcomeMessage}</h3>
          </div>
        )}
        {logo && (
          <div class="flex justify-center">
            <Image width={250} height={40} src={logo} />
          </div>
        )}
        {modalTitle && (
          <h3 class="font-normal text-center text-[12.8px]">{modalTitle}</h3>
        )}

        <form
          hx-post={useComponent(import.meta.url)}
          hx-trigger="submit"
          hx-swap="none"
          hx-on:submit={useScript(onSubmit, id)}
          class="flex flex-col gap-2.5 w-full"
        >
          {cepPlaceholder && (
            <input
              name="cep"
              class="input input-bordered flex-grow text-center rounded-[5px]"
              type="text"
              inputmode="numeric"
              pattern="\d{5}-?\d{3}"
              placeholder={cepPlaceholder}
              hx-on:input={useScript(applyCepMask)}
            />
          )}

          <span class="text-lime-600 text-center hidden">
            Você será redirecionado
          </span>

          <span class="text-red-700 text-center hidden">
            Infelizmente o festval ainda não atende sua região
          </span>

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
            {submitButtonText && (
              <span class="btn-submit inline">{submitButtonText}</span>
            )}

            <span class="inline hidden loading loading-spinner" />
          </button>
        </form>
        {findCepText && (
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            class="link block text-xs underline text-center"
            style={{
              color: "#6495ed",
            }}
          >
            {findCepText}
          </a>
        )}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default ModalSessionInit;
