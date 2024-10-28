import { type ComponentChildren } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
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

const onClick = (id: string) => {
  const input = document.getElementById(id) as HTMLInputElement | null;
  const drawer = document.getElementById(
    "sidemenu-drawer"
  ) as HTMLInputElement | null;
  if (!input || !drawer) {
    return;
  }
  input.checked = false;
  drawer.checked = false;
};

function SubDrawer({
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
            "drawer-side h-full z-50 overflow-hidden",
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

function SubAside({
  drawer,
  children,
  id,
}: {
  drawer: string;
  id: string;
  children: ComponentChildren;
}) {
  return (
    <div
      data-aside
      class="bg-base-100 w-full h-full "
      style={{ maxWidth: "100vw" }}
    >
      <div class="flex justify-end items-center h-[48px] bg-[#F6F6F6]">
        <button
          class="absolute top-[10.9px] right-[9.6px] hover:opacity-80 hover:bg-transparent"
          hx-on:click={useScript(onClick, id)}
        >
          <Image
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/6a112ec7-7e9f-4271-a8fd-c0af27b3b934/close.svg"
            width={25}
            height={25}
          />
        </button>
      </div>
      <div class="flex bg-[#EBEBEB]">
        <label
          for={drawer}
          aria-label="X"
          class="flex items-center gap-[10px] p-[15px] w-fit"
        >
          <span>
            <Image
              src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/6367b27c-92b8-4ff7-a9f9-689de3ff4f20/arrow-right-mobile.svg"
              width={9}
              height={13}
              class="rotate-180"
            />
          </span>
          <span class="text-sm text-black">Voltar ao menu</span>
        </label>
      </div>
      {children}
    </div>
  );
}

SubDrawer.SubAside = SubAside;

export default SubDrawer;
