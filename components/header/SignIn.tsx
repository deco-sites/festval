import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";

export interface SingInProps {
  /**
   * @title Sing In properties
   * @description Seleciona layout de SignIn
   * @default	desktop
   */
  variant?: "mobile" | "desktop";
}

const onLoad = (containerID: string) => {
  window.STOREFRONT.USER.subscribe((sdk) => {
    const container = document.getElementById(containerID) as HTMLDivElement;
    if (!container) return;
    const nodes = container.querySelectorAll<HTMLAnchorElement>("a");
    const login = nodes.item(0);
    const account = nodes.item(1);
    const user = sdk.getUser();
    if (user?.email) {
      login.classList.add("hidden");
      account.classList.remove("hidden");
    } else {
      login.classList.remove("hidden");
      account.classList.add("hidden");
    }
  });
};
function SignIn({ variant }: SingInProps) {
  const id = useId();
  return (
    <div id={id}>
      <a
        class={clx(
          "btn btn-sm bg-transparent font-thin hover:opacity-80 hover:bg-transparent shadow-inherit border-none no-animation",
          variant === "mobile" && "btn-square"
        )}
        href="/login"
        aria-label="Login"
      >
        <Icon id="account_circle" />
      </a>
      <a
        class={clx(
          "hidden",
          "btn btn-sm  bg-transparent font-thin hover:bg-transparent border-none  shadow-inherit no-animation",
          variant === "mobile" && "btn-square"
        )}
        href="/account"
        aria-label="Account"
      >
        <Icon id="account_circle" />
      </a>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}
export default SignIn;
