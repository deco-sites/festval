import type { SiteNavigationElement } from "apps/commerce/types.ts";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;

  return (
    <li
      class={[
        "group flex items-center p-[0.625rem] pr-5",
        children && children.length > 0 ? "has-submenu" : "",
      ].join(" ")}
    >
      <a
        href={url}
        class=" text-sm font-medium hover:opacity-80 ease-in-out duration-300 text-white"
      >
        {name}
      </a>

      {children && children.length > 0 && (
        <div
          class="fixed hidden hover:flex group-hover:flex bg-base-100 z-40 items-start justify-center gap-6 border-t-2 border-b-2 border-base-200 w-screen"
          style={{
            top: "0px",
            left: "0px",
            marginTop: HEADER_HEIGHT_DESKTOP,
          }}
        >
          <ul class="flex items-start justify-start gap-7 custom-container w-full">
            {children.map((node) => (
              <li class="p-6 pl-0">
                <a class="hover:opacity-80" href={node.url}>
                  <span>{node.name}</span>
                </a>

                <ul class="flex flex-col gap-1 mt-4">
                  {node.children?.map((leaf) => (
                    <li>
                      <a class="hover:opacity-80 " href={leaf.url}>
                        <span class="text-xs ">{leaf.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NavItem;
