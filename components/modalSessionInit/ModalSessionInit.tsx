import { AppContext } from "../../apps/site.ts";
import { setCookie, getCookies } from "@std/http/cookie";
import {
  HEADER_HEIGHT_MOBILE,
  MODAL_SESSION_INIT_ID,
} from "../../constants.ts";
import { useComponent } from "../../sections/Component.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { type SectionProps } from "@deco/deco";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";

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
    const response = await (ctx as any).invoke(
      "site/actions/sessionInit/submit.ts",
      {
        data: {
          public: {
            country: { value: "BRA" },
            postalCode: { value: cep },
          },
        },
      }
    );

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

    const cookies = getCookies(req.headers);

    console.log(cookies);
  }

  saveCepToCookies(ctx, cep);

  return true;
}

const onLoad = (id: string) => {
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const lastPart = parts.pop();
      if (lastPart) {
        const splitPart = lastPart.split(";");
        if (splitPart.length > 0) {
          return splitPart.shift() || null;
        }
      }
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

const onSubmit = (id: string) => {
  setTimeout(() => {
    function getCookie(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      if (parts.length === 2) {
        const lastPart = parts.pop();
        if (lastPart) {
          const splitPart = lastPart.split(";");
          if (splitPart.length > 0) {
            return splitPart.shift() || null;
          }
        }
      }

      return null;
    }

    const cep = getCookie("vtex_last_session_cep");
    const vtex_segment_cookie = getCookie("vtex_last_segment");

    const vtex_segment = vtex_segment_cookie ? atob(vtex_segment_cookie) : null;

    const modal = document.getElementById(id);

    const regionId = vtex_segment ? JSON.parse(vtex_segment)?.regionId : null;

    const limeText = modal!.querySelector(".text-lime-600");
    const redText = modal!.querySelector(".text-red-700");

    console.log(limeText, redText);

    if (cep && regionId) {
      limeText?.classList.remove("hidden");
      setTimeout(() => {
        modal?.classList.remove("modal-open");
        window.location.reload();
      }, 1000);
    } else {
      redText?.classList.remove("hidden");
      modal?.classList.add("modal-open");
    }
  }, 3000);
};

export function loader(props: ModalInitProps) {
  return { ...props };
}

function ModalSessionInit({
  modalInitProps,
}: ModalInitProps & SectionProps<typeof loader, typeof action>) {
  const id = useId();
  return (
    <div className={`modal`} id={id}>
      <div
        class="bg-base-100 absolute top-0 pt-5 pb-5 px-[30px] sm:px-[40px] modal-box rounded-lg flex flex-col gap-2.5"
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
          //hx-on={`htmx:afterRequest: document.querySelector(${id}).classList.remove('modal-open')`, useScript(onSubmit)}
          hx-on:submit={useScript(onSubmit, id)}
          class="flex flex-col gap-2.5 w-full"
        >
          <input
            name="email"
            class="input input-bordered flex-grow text-center rounded-[5px]"
            type="text"
            placeholder={modalInitProps.cepPlaceholder}
          />

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
          class="link block text-xs underline text-center"
          style={{
            color: "#6495ed",
          }}
        >
          {modalInitProps.findCepText}
        </a>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default ModalSessionInit;
