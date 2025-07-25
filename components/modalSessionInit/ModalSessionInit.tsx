import { type SectionProps } from "@deco/deco";
import { useScript } from "@deco/deco/hooks";
import { deleteCookie, setCookie } from "@std/http/cookie";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { AppContext } from "../../apps/site.ts";
import { HEADER_HEIGHT_MOBILE } from "../../constants.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useComponent } from "../../sections/Component.tsx";

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

export interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

// export interface Address {
//   cep: string;
//   state: string;
//   city: string;
//   neighborhood: string;
//   street: string;
//   service: string;
// }

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

export const viaCep = async (
  cep: string,
  maxRetries = 3,
  retryDelay = 1000,
  timeoutMs = 5000
): Promise<Address> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      //   signal: controller.signal,
      // });

      const formattedCep = cep?.replace('-', '')

      const response = await fetch(`https://opencep.com/v1/${formattedCep}.json`);

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const result = await response.json();
      if (result.erro) {
        throw new Error("CEP inválido ou não encontrado");
      }
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError || new Error("Falha ao consultar o ViaCep após tentativas");
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
    const viaCepResponse: Address = await viaCep(cepFormatted);
    
    if (
      (viaCepResponse && viaCepResponse.localidade === "Cascavel") ||
      (viaCepResponse && viaCepResponse.localidade === "Curitiba")
    ) {
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
      if (response) {
        deleteCookie(req.headers, "vtex_segment");
        deleteCookie(req.headers, "vtex_session");
        const LIMIT_EXPIRE_HOURS = 23;

        const now = new Date();
        const expirationTime =
          now.getTime() + LIMIT_EXPIRE_HOURS * 60 * 60 * 1000;

        setCookie(ctx.response.headers, {
          value: viaCepResponse.localidade,
          name: "region",
          path: "/",
          expires: new Date(expirationTime),
          secure: true,
        });

        setCookie(ctx.response.headers, {
          value: new Date(expirationTime).toISOString(),
          name: "expires_at",
          path: "/",
          expires: new Date(expirationTime),
          secure: true,
        });

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
        saveCepToCookies(ctx, cep, LIMIT_EXPIRE_HOURS);
        return true;
      }
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

  function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  const regionPaths: Record<string, string> = {
    Cascavel: "/cac",
    Curitiba: "/cwb",
  };

  const regionsList = {
    Cascavel: "/cac",
    Curitiba: "/cwb",
  };

  type CurrentRegion = keyof typeof regionsList | null;

  const defaultRegions = {
    Cascavel: "cascavel",
    Curitiba: "curitiba",
  };

  function addUtmSourceParamToUrl(region: CurrentRegion | null) {
    const currentUrl = new URL(window.location.href);
    const queryParam = currentUrl.searchParams.get("utm_source");

    if (region && queryParam) {
      const currentRegion = defaultRegions[region as "Cascavel" | "Curitiba"];

      if (currentRegion !== queryParam) {
        // window.location.search =
        //   currentUrl.searchParams.size >= 1
        //     ? `${window.location.search}&utm_source=${currentRegion}`
        //     : `?utm_source=${currentRegion}`;
        currentUrl.searchParams.set("utm_source", currentRegion);
        window.location.search = currentUrl.search;
      }
    }

    if (region && !queryParam) {
      const currentRegion = defaultRegions[region as "Cascavel" | "Curitiba"];
      currentUrl.searchParams.append("utm_source", currentRegion);
      window.location.search = currentUrl.search;
    }
  }

  function redirect(region: CurrentRegion | null) {
    const url = new URL(window.location.href);
    const isHomePage = url.pathname === "/";

    const expiresAt = getCookie("expires_at");

    if (!expiresAt) {
      return;
    }

    const expiresAtDate = new Date(expiresAt);
    const currentDate = new Date();
    const isSessionExpired = currentDate.getTime() > expiresAtDate.getTime();

    if (isHomePage && region && !isSessionExpired) {
      window.location.replace(
        `${regionsList[region]}?utm_source=${defaultRegions[region]}`
      );
    } else {
      addUtmSourceParamToUrl(region);
    }
  }

  const lastRegion = localStorage.getItem("lastRegion");
  const isHomePage = window.location.pathname === "/";
  const cep = getCookie("vtex_last_session_cep");
  const vtex_segment_cookie = getCookie("vtex_last_segment");
  const vtex_segment = vtex_segment_cookie ? atob(vtex_segment_cookie) : null;
  const regionId = vtex_segment ? JSON.parse(vtex_segment)?.regionId : null;
  const modal = document.getElementById(id);
  const region = getCookie("region");

  redirect(region as CurrentRegion);

  if (cep && regionId) {
    modal?.classList.remove("modal-open");

    if (isHomePage && lastRegion && regionPaths[lastRegion]) {
      const targetPath = regionPaths[lastRegion];
      const alreadyRedirected = localStorage.getItem("redirected");
      if (!alreadyRedirected) {
        localStorage.setItem("redirected", "true");
        window.location.replace(window.location.origin + targetPath);
      }
    }
  } else {
    modal?.classList.add("modal-open");
    deleteCookie("vtex_last_session_cep");
    deleteCookie("vtex_last_segment");
  }
};

const onSubmit = (id: string, maxAttempts = 10, delay = 1000) => {
  let attempts = 0;

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  function hideElement(element: Element | null) {
    element?.classList.add("hidden");
  }

  function showElement(element: Element | null) {
    element?.classList.remove("hidden");
  }

  function shouldAddRegionPrefix(path: string): boolean {
    const noPrefixPaths = ["/s", "/p", "/api", "/pascoa"];
    const searchParams = new URLSearchParams(window.location.search);
    const isCategoryOrProduct = /\/[a-z0-9\-]+(\/[a-z0-9\-]+)?/.test(path);
    const hasMapParam = searchParams.has("map");
    const hasFilterParam = searchParams.has("filter.category-1");
    return (
      !noPrefixPaths.some((prefix) => path.startsWith(prefix)) &&
      !isCategoryOrProduct &&
      !hasMapParam &&
      !hasFilterParam
    );
  }

  const attemptSubmit = async () => {
    const modal = document.getElementById(id);
    if (!modal) return;

    const limeText = modal.querySelector(".text-lime-600");
    const redText = modal.querySelector(".text-red-700");
    const btnSubmit = modal.querySelector(".btn-submit");
    const loading = modal.querySelector(".loading");

    if (attempts === 0) {
      hideElement(redText); // Esconde erro ao iniciar tentativas
      hideElement(btnSubmit);
      showElement(loading);
    }

    let cep = getCookie("vtex_last_session_cep");
    const vtex_segment_cookie = getCookie("vtex_last_segment");
    const region = getCookie("region");
    let regionId: string | null = null;

    // Caso cep ou segmento não existam nos cookies, tenta buscar do orderForm VTEX
    if (!cep || !vtex_segment_cookie) {
      try {
        const orderForm = await (window as any).vtexjs?.checkout.getOrderForm();
        const address = orderForm?.shippingData?.address;
        cep = address?.postalCode || cep;
        regionId = orderForm?.storePreferencesData?.countryCode || regionId;
      } catch (err) {
        console.error("Erro ao consultar orderForm:", err);
      }
    } 

    const vtex_segment = vtex_segment_cookie ? atob(vtex_segment_cookie) : null;
    regionId =
      regionId || (vtex_segment ? JSON.parse(vtex_segment)?.regionId : null);

    if (cep && regionId) {
      showElement(limeText);
      hideElement(redText);

      setTimeout(() => {
        modal.classList.remove("modal-open");

        const regionPaths: Record<string, string> = {
          Cascavel: "/cac",
          Curitiba: "/cwb",
        };

        const utmSources: Record<string, string> = {
          Cascavel: "cascavel",
          Curitiba: "curitiba",
        };

        if (region && utmSources[region]) {
          localStorage.setItem("utm_source", utmSources[region]);
        }

        const targetPath = region ? regionPaths[region] : null;
        const currentPath = window.location.pathname;
        const searchParams = window.location.search;

        let newUrl = window.location.href;

        if (targetPath && shouldAddRegionPrefix(currentPath)) {
          newUrl = `${window.location.origin}${targetPath}${
            currentPath === "/" ? "" : currentPath
          }${searchParams}`;
        }

        localStorage.setItem("redirected", "true");
        if (region) localStorage.setItem("lastRegion", region);

        const isHomePage = window.location.pathname === "/";
        if (isHomePage) {
          window.location.replace(newUrl);
        } else {
          window.location.reload();
        }
      }, 1000);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(() => attemptSubmit(), delay);
    } else {
      showElement(redText);
      hideElement(limeText);
      showElement(btnSubmit);
      hideElement(loading);
      
      redText!.textContent = "Erro ao consultar o CEP. Tente novamente.";
    }
  };

  attemptSubmit();
};

// const onSubmit = (id: string, maxAttempts = 5, delay = 1000) => {
//   let attempts = 0;

//   function getCookie(name: string): string | null {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return parts.pop()?.split(";").shift() || null;
//     }
//     return null;
//   }

//   function attemptSubmit() {
//     const modal = document.getElementById(id);
//     const limeText = modal?.querySelector(".text-lime-600");
//     const redText = modal?.querySelector(".text-red-700");
//     const btnSubmit = modal?.querySelector(".btn-submit");
//     const loading = modal?.querySelector(".loading");

//     btnSubmit?.classList.add("hidden");
//     loading?.classList.remove("hidden");

//     const cep = getCookie("vtex_last_session_cep");
//     const vtex_segment_cookie = getCookie("vtex_last_segment");
//     const region = getCookie("region");
//     const vtex_segment = vtex_segment_cookie ? atob(vtex_segment_cookie) : null;
//     const regionId = vtex_segment ? JSON.parse(vtex_segment)?.regionId : null;

//     if (cep && regionId) {
//       limeText?.classList.remove("hidden");
//       redText?.classList.add("hidden");

//       setTimeout(() => {
//         modal?.classList.remove("modal-open");
//         if (region === "Cascavel") {
//           window.location.replace(window.location.origin + "/cac");
//         } else if (region === "Curitiba") {
//           window.location.replace(window.location.origin + "/cwb");
//         }
//       }, 1000);
//     } else if (attempts < maxAttempts) {
//       attempts += 1;
//       setTimeout(attemptSubmit, delay);
//     } else {
//       redText?.classList.remove("hidden");
//       limeText?.classList.add("hidden");
//       btnSubmit?.classList.remove("hidden");
//       loading?.classList.add("hidden");
//     }
//   }

//   attemptSubmit();
// };

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
  const finalWelcomeMessage = welcomeMessage ?? "Seja bem-vindo(a) ao";
  const finalLogo =
    logo ??
    "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/9188f318-f9a3-4e57-81be-78087c260c9b/logo.svg";
  const finalModalTitle =
    modalTitle ?? "Vamos conferir se atendemos a sua região:";
  const finalCepPlaceholder = cepPlaceholder ?? "CEP 00000-000";
  const finalSubmitButtonText = submitButtonText ?? "Salvar";
  const finalFindCepText = findCepText ?? "Não sei meu CEP";
  return (
    <div className={`modal`} id={id}>
      <div
        class="bg-base-100 absolute top-0 pt-5 pb-5 px-[30px] sm:px-[40px] modal-box rounded-lg flex flex-col gap-2.5"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        {finalWelcomeMessage && (
          <div>
            <h3 class="font-bold text-base text-center">
              {finalWelcomeMessage}
            </h3>
          </div>
        )}
        {finalLogo && (
          <div class="flex justify-center">
            <Image width={250} height={40} src={finalLogo} />
          </div>
        )}
        {finalModalTitle && (
          <h3 class="font-normal text-center text-[12.8px]">
            {finalModalTitle}
          </h3>
        )}

        <form
          hx-post={useComponent(import.meta.url)}
          hx-trigger="submit"
          hx-swap="none"
          hx-on:submit={useScript(onSubmit, id)}
          class="flex flex-col gap-2.5 w-full"
        >
          {finalCepPlaceholder && (
            <input
              name="cep"
              class="input input-bordered flex-grow text-center rounded-[5px]"
              type="text"
              inputmode="numeric"
              pattern="\d{5}-?\d{3}"
              placeholder={finalCepPlaceholder}
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
            {finalSubmitButtonText && (
              <span class="btn-submit inline">{finalSubmitButtonText}</span>
            )}

            <span class="inline hidden loading loading-spinner" />
          </button>
        </form>
        {finalFindCepText && (
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            class="link block text-xs underline text-center"
            style={{
              color: "#6495ed",
            }}
          >
            {finalFindCepText}
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