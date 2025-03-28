import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useOffer } from "../../../sdk/useOffer.ts";
import { useSendEvent } from "../../../sdk/useSendEvent.ts";
import { relative } from "../../../sdk/url.ts";
import { useVariantPossibilities } from "../../../sdk/useVariantPossiblities.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
  product: Product;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the suggestion item in the list */
  index?: number;
}

function SuggestionItem({ product, itemListName, index }: Props) {
  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";

  if (!inStock) return null;

  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  return (
    <div {...event} class="">
      <a href={relativeUrl} aria-label="view product">
        <div class="flex gap-2 items-center">
          <div>
            <figure>
              <Image
                src={front.url!}
                alt={front.alternateName}
                width={60}
                height={60}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
          <div>
            <p>{title}</p>
          </div>
        </div>
      </a>
    </div>
  );
}

export default SuggestionItem;
