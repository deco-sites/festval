import { type ComponentChildren } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import type { ImageObject } from "apps/commerce/types.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Image from "apps/website/components/Image.tsx";
export interface Props {
  open?: boolean;
  class?: string;
  children?: ComponentChildren;
  aside: ComponentChildren;
  id?: string;
}
const script = (id: string) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Escape" && e.keyCode !== 27) {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (!input) {
      return;
    }
    input.checked = false;
  };
  addEventListener("keydown", handler);
};

const onLoad = () => {
  const user = window.STOREFRONT.USER.getUser();
  const loginMessage = document.getElementById("login-message");
  const myAccount = document.getElementById(
    "my-account-mobile"
  ) as HTMLAnchorElement;
  if (user) {
    if (loginMessage) {
      const loginWelcome =
        loginMessage?.querySelector<HTMLSpanElement>("h1 span");

      if (loginWelcome && user.givenName) {
        loginWelcome.textContent = `Olá, ${user.givenName}`;
      }

      loginMessage?.classList.remove("hidden");
    }
    if (myAccount) {
      myAccount.href = "/account#/profile";
    }
  }
};

function MenuMobileDrawer({
  children,
  aside,
  open,
  class: _class = "",
  id = useId(),
}: Props) {
  return (
    <>
      <div class={clx("drawer", _class)}>
        <input
          id={id}
          name={id}
          checked={open}
          type="checkbox"
          class="drawer-toggle"
          aria-label={open ? "open drawer" : "closed drawer"}
        />

        <div class="drawer-content">{children}</div>

        <aside
          data-aside
          class={clx(
            "drawer-side h-full z-40 overflow-hidden",
            "[[data-aside]&_section]:contents"
          )}
        >
          <label for={id} class="drawer-overlay" />
          {aside}
        </aside>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(script, id) }}
      />
    </>
  );
}

function Aside({
  banner,
  drawer,
  children,
}: {
  banner?: ImageObject | null;
  drawer: string;
  children: ComponentChildren;
}) {
  return (
    <div data-aside class="bg-base-100 h-full" style={{ maxWidth: "100vw" }}>
      <div class="bg-[#F6F6F6] flex justify-between items-center relative p-[15px] h-[209px]">
        {banner && banner.url && (
          <div class="absolute bottom-0 right-0 z-10">
            <Picture preload>
              <Source
                src={banner?.url}
                width={154}
                height={209}
                media="(max-width: 767px)"
              />
              <img src={banner?.url} width={154} height={209} />
            </Picture>
          </div>
        )}

        <div class="z-30 flex flex-col gap-[33px]">
          <div id="login-message">
            <h1>
              <span class="font-bold text-[20px]">Olá!</span>
            </h1>
            <span class="text-xs text-black">
              Pronto para aproveitar nossa loja ?
            </span>
          </div>

          <div>
            <a
              id="my-account-mobile"
              href="/account#/profile"
              class="flex gap[16px] items-center"
            >
              <span class="text-xs font-bold text-black">Minha conta</span>
              <span>
                <Image
                  src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/20d08bc3-5426-43f6-a32c-57ff89678d22/Caminho-15.svg"
                  width={6}
                  height={10}
                />
              </span>
            </a>
          </div>
        </div>

        <label
          for={drawer}
          aria-label="X"
          class="absolute top-[10.9px] right-[9.6px] z-50 hover:opacity-80 hover:bg-transparent"
        >
          <Image
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/6a112ec7-7e9f-4271-a8fd-c0af27b3b934/close.svg"
            width={25}
            height={25}
          />
        </label>
      </div>
      {children}
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      />
    </div>
  );
}

MenuMobileDrawer.Aside = Aside;

export default MenuMobileDrawer;
