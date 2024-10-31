import type { SiteNavigationElement } from "apps/commerce/types.ts";
import { NAVBAR_HEIGHT_DESKTOP } from "../../constants.ts";
import Icon from "../../components/ui/Icon.tsx";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";

// const onClick = (menuId: string) => {
//   event!.stopPropagation();

//   const menu = document.getElementById(menuId);
//   if (menu) {
//     menu.classList.toggle("hidden");
//   }
//   const overlay = document.getElementById(`overlay-${menuId}`);
//   if (overlay) {
//     overlay.classList.toggle("hidden");
//   }
// };

// const onClickSubMenu = (subMenuId: string | null) => {
//   event!.stopPropagation();

//   const megaMenuItem = event!.currentTarget as HTMLButtonElement;

//   if (subMenuId) {
//     const megamenu = document.querySelector<HTMLDivElement>(".megamenu");
//     const megaMenuItems =
//       document.querySelector<HTMLUListElement>(".megamenu-items");

//     if (megamenu && megaMenuItems) {
//       const subMenuWidth = megamenu.offsetWidth - megaMenuItems.offsetWidth;

//       const megaMenuItemsBgRemove =
//         megaMenuItems.querySelectorAll<HTMLButtonElement>("button");

//       megaMenuItemsBgRemove.forEach((button) => {
//         button.style.backgroundColor = "#FFF";
//       });

//       megaMenuItem.style.backgroundColor = "#D8D8D8";

//       const allSubMenus = document.querySelectorAll<HTMLDivElement>(".submenu");
//       allSubMenus.forEach((menu) => {
//         if (!menu.classList.contains("hidden")) {
//           menu.classList.add("hidden");
//         }
//       });

//       const subMenu = document.getElementById(subMenuId);
//       if (subMenu) {
//         subMenu.style.width = subMenuWidth + "px";
//         subMenu.classList.toggle("hidden");
//       }
//     }
//   }
// };

function MegaMenu({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;
  const menuId = useId();

  return (
    <li
      class={[
        "flex items-center p-[0.625rem] pr-5 relative group",
        children && children.length > 0 ? "has-submenu" : "",
      ].join(" ")}
    >
      <button class="flex gap-[13px] bg-none border-none text-sm font-medium hover:opacity-80 ease-in-out duration-300 text-white cursor-pointer ">
        <Icon id="burguer-white" />
        {name}
      </button>

      {children && children.length > 0 && (
        <div class="hidden group-hover:flex">
          <div
            id={`overlay-${menuId}`}
            class="fixed left-0 w-full h-full bg-[#646072] opacity-30 z-30 pointer-events-none"
            style={{
              top: "10px",
              marginTop: "114px",
            }}
          ></div>
          <div
            id={menuId}
            class="megamenu custom-container p-0 absolute flex bg-base-100 z-40 gap-6 w-[940px]  h-[457px] 2xl:h-[607px]"
            style={{
              top: "40px",
              left: "9px",
              //transform: "translateX(-50%)",
            }}
          >
            <ul class="megamenu-items item border-r border-[#FBFBFB] w-[413px] max-h-[457px] 2xl:max-h-[607px] overflow-y-auto">
              {children.map((node) => (
                <li class="group-1">
                  <button
                    //hx-on:click={useScript(onClickSubMenu, node!.name || null)}
                    class="text-sm font-normal bg-none group-1-hover:bg-[#D8D8D8] flex justify-between items-center w-full px-[10px] py-[10px] border-b border-[#d8d8d8]"
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
                    class="submenu container-submenu absolute top-0 right-0 hidden flex justify-between p-[44px] pt-[30px] group-1-hover:flex"
                  >
                    <ul class="grid grid-cols-2 flex gap-36 flex-wrap max-h-[377px] 2xl:max-h-[532px] overflow-y-auto">
                      {node.children?.map((leaf) => (
                        <>
                          <li class="mr-4">
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
                    {/* {node.children &&
                      node.image &&
                      node.image.length > 0 &&
                      typeof node.image[0].url === "string" && (
                        <a href={node.image[0].contentUrl}>
                          <img
                            src={node.image[0].url}
                            class="w-full max-h-[377px] 2xl:max-h-[532px]"
                          />
                        </a>
                      )} */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default MegaMenu;
