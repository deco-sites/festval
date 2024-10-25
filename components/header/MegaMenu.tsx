import type { SiteNavigationElement } from "apps/commerce/types.ts";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";
import Icon from "../../components/ui/Icon.tsx";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import { Picture, Source } from "apps/website/components/Picture.tsx";

const onClick = (menuId: string) => {
  event!.stopPropagation();

  const menu = document.getElementById(menuId);
  if (menu) {
    menu.classList.toggle("hidden");
  }
};

const onClickSubMenu = (subMenuId: string | null) => {
  event!.stopPropagation();

  const megaMenuItem = event!.currentTarget as HTMLButtonElement;

  if (subMenuId) {
    const megamenu = document.querySelector<HTMLDivElement>(".megamenu");
    const megaMenuItems =
      document.querySelector<HTMLUListElement>(".megamenu-items");

    if (megamenu && megaMenuItems) {
      const subMenuWidth = megamenu.offsetWidth - megaMenuItems.offsetWidth;

      const megaMenuItemsBgRemove =
        megaMenuItems.querySelectorAll<HTMLButtonElement>("button");

      megaMenuItemsBgRemove.forEach((button) => {
        button.style.backgroundColor = "#FFF";
      });

      megaMenuItem.style.backgroundColor = "#D8D8D8";

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
          class="megamenu custom-container p-0 fixed hidden flex bg-base-100 z-40 gap-6 border-t-2 border-b-2 border-base-200 w-screen h-full max-h-[507px]  2xl:max-h-[607px]"
          style={{
            top: "10px",
            marginTop: "118px",
          }}
        >
          <ul class="megamenu-items item border-r border-[#FBFBFB] w-[413px]  max-h-[507px]  2xl:max-h-[607px] overflow-y-scroll">
            {children.map((node) => (
              <li>
                <button
                  hx-on:click={useScript(onClickSubMenu, node!.name || null)}
                  class="text-base font-normal bg-none flex justify-between items-center w-full px-[13px] py-[15px] border-b border-[#d8d8d8]"
                  href={node.url}
                >
                  <span>{node.name}</span>
                  <span>
                    <Image
                      src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/c9248193-966b-4090-b793-af09d677027a/arrow-right.svg"
                      width={7}
                      height={13}
                    />
                  </span>
                </button>

                <div
                  id={node.name}
                  class="submenu absolute top-[10px] right-0 hidden flex justify-between p-[44px] pt-[30px] "
                >
                  <ul class="grid grid-cols-2 gap-36 flex-wrap max-h-[407px] 2xl:max-h-[532px] overflow-y-scroll">
                    {node.children?.map((leaf) => (
                      <>
                        <li>
                          <h2 class="text-lg font-bold">{leaf.name}</h2>

                          {leaf.children &&
                            leaf.children.map((subleaf, index) => (
                              <ul>
                                <li>
                                  {leaf.children &&
                                  index !== leaf.children.length - 1 &&
                                  subleaf.name !== "Ver mais" ? (
                                    <a
                                      class="text-base font-normal"
                                      href={subleaf.url}
                                    >
                                      <span class="text-xs">
                                        {subleaf.name}
                                      </span>
                                    </a>
                                  ) : (
                                    <a
                                      class="text-base font-normal underline text-[#827E8F]"
                                      href={subleaf.url}
                                    >
                                      <span class="text-xs">
                                        {subleaf.name}
                                      </span>
                                    </a>
                                  )}
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
                      <a href={node.image[0].contentUrl}>
                        <img
                          src={node.image[0].url}
                          class="w-full max-h-[407px] 2xl:max-h-[532px]"
                        />
                      </a>
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
