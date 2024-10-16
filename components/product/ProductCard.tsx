import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import { Ring } from "./ProductVariantSelector.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import Icon from "../ui/Icon.tsx";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

const onClick = () => {
  console.log("onClick");
};

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();

  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  // const inStock = availability === "https://schema.org/InStock";
  const inStock = true;
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  const percent =
    listPrice && price
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {
    /* Add click event to dataLayer */
  }
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

  //Added it to check the variant name in the SKU Selector later, so it doesn't render the SKU to "shoes size" in the Product Card
  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  return (
    <div {...event} class={clx("card card-compact group text-sm", _class)}>
      <figure class={clx("relative")} style={{ aspectRatio: ASPECT_RATIO }}>
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0",
            "grid grid-cols-1 grid-rows-1",
            "w-full",
            !inStock && "opacity-70"
          )}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded w-full",
              "col-span-full row-span-full"
            )}
            // sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded w-full",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100"
            )}
            // sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Wishlist button */}
        <div class="absolute top-0 left-0 w-full flex items-center justify-between">
          {/* Notify Me */}
          <span
            class={clx(
              "text-sm/4 font-normal text-black bg-error bg-opacity-15 text-center rounded-badge px-2 py-1",
              inStock && "opacity-0"
            )}
          >
            Avise-me
          </span>

          {/* Discounts */}
          <span
            class={clx(
              "text-sm/4 font-normal text-black bg-primary bg-opacity-15 text-center rounded-badge px-2 py-1",
              (percent < 1 || !inStock) && "opacity-0"
            )}
          >
            {percent} % off
          </span>
        </div>

        <div class="absolute top-0 right-0">
          <WishlistButton item={item} variant="icon" />
        </div>
      </figure>

      <a href={relativeUrl} class="pt-5">
        <span class="font-medium flex text-left">{title}</span>

        <div class="flex flex-col items-start  pt-2">
          {listPrice && (
            <span class="line-through text-xs font-normal text-gray-400">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-medium text-lg text-base-700">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>
      </a>

      {/* SKU Selector */}
      {variants.length > 1 && firstVariantName !== shoeSizeVariant && (
        <ul class="flex items-center justify-start gap-2 pt-4 pb-1 pl-1 overflow-x-auto">
          {variants
            .map(([value, link]) => [value, relative(link)] as const)
            .map(([value, link]) => (
              <li>
                <a href={link} class="cursor-pointer">
                  <input
                    class="hidden peer"
                    type="radio"
                    name={`${id}-${firstSkuVariations?.[0]}`}
                    checked={link === relativeUrl}
                  />
                  <Ring value={value} checked={link === relativeUrl} />
                </a>
              </li>
            ))}
        </ul>
      )}

      <div class="flex-grow" />

      <div>
        {inStock ? (
          // <AddToCartButton
          //   product={product}
          //   seller={seller}
          //   item={item}
          //   class={clx(
          //     "btn btn-md",
          //     "btn-primary justify-center mt-2 text-white border-none !text-sm  rounded-md  !font-medium px-0 no-animation w-full",
          //     "hover:opacity-80 ease-in-out duration-300"
          //   )}
          // />
          <button
            type="button"
            class={clx(
              "btn btn-md",
              "btn-primary justify-center mt-2 text-white border-none !text-sm  rounded-md  !font-medium px-0 no-animation w-full",
              "hover:opacity-80 ease-in-out duration-300"
            )}
            hx-on:click={useScript(onClick)}
          >
            <Icon id="shopping_bag" /> Adicionar ao carrinho
          </button>
        ) : (
          <a
            href={relativeUrl}
            class={clx(
              "btn btn-md",
              "btn-outline justify-center mt-2 text-slate-200 border-none bg-gray-500 !text-sm  rounded-md !font-medium px-0 no-animation w-full",

              "disabled:!bg-gray-500 disabled:!opacity-75",
              " hover:!bg-gray-500 hover:!text-slate-200 disabled:!text-error"
            )}
          >
            Esgotado
          </a>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
