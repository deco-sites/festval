import type {
  SiteNavigationElement,
  SiteNavigationElementLeaf,
} from "apps/commerce/types.ts";
import SubDrawer from "../ui/MenuMobileSubDrawer.tsx";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function SubMenuItem({ item }: { item: SiteNavigationElementLeaf }) {
  return (
    <div>
      <a
        href={item.url}
        class="flex justify-between items-center px-[15px] py-[16px] border-b border-[#D8D8D8]"
      >
        <div class="flex items-center gap-[5px]">
          {item.image && item.image.length > 0 && item.image[0].url && (
            <span>
              <Image src={item.image[0].url} width={25} height={25} />
            </span>
          )}
          <span>{item.name}</span>
        </div>
        <div>
          <Image
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/6367b27c-92b8-4ff7-a9f9-689de3ff4f20/arrow-right-mobile.svg"
            width={9}
            height={13}
          />
        </div>
      </a>
    </div>
  );
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  return (
    <div class="">
      {item.children && item.children.length > 0 ? (
        <>
          {item.name && (
            <SubDrawer
              id={item.name}
              aside={
                <SubDrawer.SubAside drawer={item.name} id={item.name}>
                  {item.children?.map((child) => (
                    <SubMenuItem item={child} />
                  ))}
                </SubDrawer.SubAside>
              }
            />
          )}

          <div class="title">
            <label
              for={item.name}
              class="flex justify-between items-center px-[15px] py-[16px] border-b border-[#D8D8D8]"
              aria-label="open menu"
            >
              <div class="flex items-center gap-[5px]">
                {item.image && item.image.length > 0 && item.image[0].url && (
                  <span>
                    <Image src={item.image[0].url} width={25} />
                  </span>
                )}
                <span>{item.name}</span>
              </div>
              <div>
                <Image
                  src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/6367b27c-92b8-4ff7-a9f9-689de3ff4f20/arrow-right-mobile.svg"
                  width={9}
                  height={13}
                />
              </div>
            </label>
          </div>
        </>
      ) : (
        <SubMenuItem item={item} />
      )}
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "100vw" }}
    >
      <ul class="flex-grow flex flex-col divide-y divide-base-200 overflow-y-auto">
        {navItems.map((item) => (
          <li>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
