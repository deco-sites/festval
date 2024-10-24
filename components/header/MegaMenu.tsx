import type { SiteNavigationElement } from "apps/commerce/types.ts";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";
import Icon from "../../components/ui/Icon.tsx";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";

const onClick = (menuId: string) => {
  event!.stopPropagation();

  const menu = document.getElementById(menuId);
  if (menu) {
    menu.classList.toggle("hidden");
  }
};

const onClickSubMenu = (subMenuId: string | null) => {
  event!.stopPropagation();

  if (subMenuId) {
    const megamenu = document.querySelector<HTMLDivElement>(".megamenu");
    const megaMenuItems =
      document.querySelector<HTMLUListElement>(".megamenu-items");

    if (megamenu && megaMenuItems) {
      const subMenuWidth = megamenu.offsetWidth - megaMenuItems.offsetWidth;

      const allSubMenus = document.querySelectorAll<HTMLDivElement>(".submenu");
      allSubMenus.forEach((menu) => {
        if (!menu.classList.contains("hidden")) {
          menu.classList.add("hidden");
        }
      });

      const subMenu = document.getElementById(subMenuId);
      if (subMenu) {
        subMenu.style.width = subMenuWidth + "px";
        subMenu.classList.toggle("hidden");
      }
    }
  }
};

function MegaMenu({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;
  const menuId = useId();

  return (
    <li
      class={[
        "flex items-center pr-5 relative",
        children && children.length > 0 ? "has-submenu" : "",
      ].join(" ")}
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <button
        hx-on:click={useScript(onClick, menuId)}
        class="flex gap-[13px] bg-none border-none text-sm font-medium hover:opacity-80 ease-in-out duration-300 text-white cursor-pointer"
      >
        <Icon id="burguer-white" />
        {name}
      </button>

      {children && children.length > 0 && (
        <div
          id={menuId}
          class="megamenu custom-container p-0 fixed hidden flex bg-base-100 z-40 gap-6 border-t-2 border-b-2 border-base-200 w-screen h-full max-h-[607px]"
          style={{
            top: "10px",
            marginTop: "131px",
          }}
        >
          <ul class="megamenu-items item border-r border-[#707070] w-[413px]">
            {children.map((node) => (
              <li class="px-[13px] py-[15px]">
                <button
                  hx-on:click={useScript(onClickSubMenu, node!.name || null)}
                  class="hover:opacity-80 bg-none border-none flex justify-between items-center"
                  href={node.url}
                >
                  <span>{node.name}</span>
                  <span>{">"}</span>
                </button>

                <div
                  id={node.name}
                  class="submenu absolute top-[10px] right-0 hidden flex justify-between p-[44px] pt-[30px]"
                >
                  <ul class="flex gap-36 flex-wrap max-h-[532px] overflow-y-scroll">
                    {node.children?.map((leaf) => (
                      <>
                        <li>
                          <a class="hover:opacity-80" href={leaf.url}>
                            <span class="text-xs">{leaf.name}</span>
                          </a>

                          {leaf.children &&
                            leaf.children.map((subleaf) => (
                              <ul>
                                <li>
                                  <a
                                    class="hover:opacity-80"
                                    href={subleaf.url}
                                  >
                                    <span class="text-xs">{subleaf.name}</span>
                                  </a>
                                </li>
                              </ul>
                            ))}
                        </li>
                      </>
                    ))}
                  </ul>
                  {node.children &&
                    node.image &&
                    node.image.length > 0 &&
                    typeof node.image[0].url === "string" && (
                      <Image src={node.image[0].url} width={347} />
                    )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default MegaMenu;
