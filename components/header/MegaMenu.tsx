import type {
  SiteNavigationElement,
  SiteNavigationElementLeaf,
} from "apps/commerce/types.ts";
import { ImageWidget } from "apps/admin/widgets.ts";

interface Props {
  item: SiteNavigationElement;
  /**
   * @description The URL for the promotional image
   */
  promoImageUrl?: ImageWidget;
  /**
   * @description The text for the "See more" link
   * @default "Ver mais"
   */
  seeMoreText?: string;
}

function MegaMenu({
  item,
  promoImageUrl = "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1818/6fe9404a-f69c-472a-b521-78f6c1f87326",
  seeMoreText = "Ver mais",
}: Props) {
  console.log(item);
  const categories =
    item.children?.filter(
      (child): child is SiteNavigationElement => !("url" in child)
    ) || [];
  const brands =
    item.children?.filter(
      (child): child is SiteNavigationElementLeaf => "url" in child
    ) || [];

  return (
    <div className="absolute left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto flex p-6">
        <div className="flex-1 pr-6">
          <div className="grid grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index}>
                <h3 className="font-bold mb-2">{category.name}</h3>
                <ul>
                  {category.children?.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      {"url" in subItem ? (
                        <a
                          href={subItem.url}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {subItem.name}
                        </a>
                      ) : (
                        <span className="text-gray-600">{subItem.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="w-64 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold mb-2">Marca</h3>
            <ul>
              {brands.map((brand, index) => (
                <li key={index} className="flex justify-between text-gray-600">
                  <a href={brand.url}>{brand.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <a href="#" className="text-blue-600 hover:underline mb-4">
            {seeMoreText}
          </a>
          <img
            src={promoImageUrl}
            alt="Promotional Image"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
export default MegaMenu;
