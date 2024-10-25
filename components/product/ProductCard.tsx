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
import { useDevice, useScript } from "@deco/deco/hooks";
import Icon from "../ui/Icon.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import ModalAddToCart from "./ModalAddToCart.tsx";
import AddToCartMobileButton from "./AddToCartMobileButton.tsx";
import ModalAddToCartMobile from "./ModalAddToCartMobile.tsx";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;

  seller?: string;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    const input = container?.querySelector<HTMLInputElement>(
      'input[type="number"]'
    );
    const itemID = container?.getAttribute("data-item-id")!;
    const quantity = sdk.getQuantity(itemID) || 1;
    if (!input) {
      return;
    }
    input.value = quantity.toString();
    // enable interactivity
    container
      ?.querySelectorAll<HTMLButtonElement>("button")
      .forEach((node) => (node.disabled = false));
    container
      ?.querySelectorAll<HTMLButtonElement>("input")
      .forEach((node) => (node.disabled = false));

    const cart = window.STOREFRONT.CART.getCart();
    if (cart) {
      // deno-lint-ignore no-explicit-any
      const item = cart.items.find((i) => (i as any).item_id === itemID);

      if (item) {
        const buttonAddToCart = container!.querySelector<HTMLButtonElement>(
          'button[data-attribute="add-to-cart"]'
        );

        if (buttonAddToCart) {
          buttonAddToCart.style.backgroundColor = "#fff";
          buttonAddToCart.style.color = "#3E3D41";
          buttonAddToCart.style.border = "1px solid  #989898";
          buttonAddToCart.innerText = "Adicionado ao carrinho";

          buttonAddToCart.disabled = true;
        }
      }
    }
  });
};

const onClick = (id: string) => {
  const modalPreview = document.getElementById(id);

  if (modalPreview) {
    if (!modalPreview.classList.contains("modal-open")) {
      modalPreview.classList.add("modal-open");
    }
  }
};

// const onChange = () => {
//   const input = event!.currentTarget as HTMLInputElement;
//   console.log("Product Card:", input);
//   // const productID = input!
//   //   .closest("div[data-cart-item]")!
//   //   .getAttribute("data-item-id")!;
//   // const quantity = Number(input.value);
//   // if (!input.validity.valid) {
//   //   return;
//   // }
//   // window.STOREFRONT.CART.setQuantity(productID, quantity);
// };

const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  // deno-lint-ignore no-unused-vars
  const { additionalProperty = [], isVariantOf, productID } = product;
  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }
  return null;
};

function expandPromoText(text: string): string | null {
  const promoMap: { [key: string]: string } = {
    L12P8: "Leve 12 Pague 8",
    L12P10: "Leve 12 Pague 10",
    L10P8: "Leve 10 Pague 8",
    L10P6: "Leve 10 Pague 6",
    L10P5: "Leve 10 Pague 5",
    L8P6: "Leve 8 Pague 6",
    L6P5: "Leve 6 Pague 5",
    L6P4: "Leve 6 Pague 4",
    L5P4: "Leve 5 Pague 4",
    L4P3: "Leve 4 Pague 3",
    L4P2: "Leve 4 Pague 2",
    L3P2: "Leve 3 Pague 2",
    L2P1: "Leve 2 Pague 1",
    // Promoções de 50% off
    "50off na 3": "50% Off na 3ª unidade",
    "50off na 3°": "50% Off na 3ª unidade",
    "50off Na 3": "50% Off na 3ª unidade",
    "50off Na 3°": "50% Off na 3ª unidade",
    "50%Off na 2": "50% Off na 2ª unidade",
    "50%Off na 2°": "50% Off na 2ª unidade",
    "50%Off Na 2°": "50% Off na 2ª unidade",
    "50%Off Na 2": "50% Off na 2ª unidade",

    // Promoções de 40% off
    "40off na 2": "40% Off na 2ª unidade",
    "40off na 2°": "40% Off na 2ª unidade",
    "40off Na 2": "40% Off na 2ª unidade",
    "40off Na 2°": "40% Off na 2ª unidade",

    // Promoções de 30% off
    "30off na 2": "30% Off na 2ª unidade",
    "30off na 2°": "30% Off na 2ª unidade",
    "30off Na 2": "30% Off na 2ª unidade",
    "30off Na 2°": "30% Off na 2ª unidade",

    // Promoções de 25% off
    "25off na 3": "25% Off na 3ª unidade",
    "25off na 3°": "25% Off na 3ª unidade",
    "25off Na 3": "25% Off na 3ª unidade",
    "25off Na 3°": "25% Off na 3ª unidade",

    // Promoções de 20% off
    "20off na 2": "20% Off na 2ª unidade",
    "20off na 2°": "20% Off na 2ª unidade",
    "20off Na 2": "20% Off na 2ª unidade",
    "20off Na 2°": "20% Off na 2ª unidade",

    // Promoções de 15% off
    "15off na 2": "15% Off na 2ª unidade",
    "15off na 2°": "15% Off na 2ª unidade",
    "15off Na 2": "15% Off na 2ª unidade",
    "15off Na 2°": "15% Off na 2ª unidade",

    // Promoções de 10% off
    "10off na 2": "10% Off na 2ª unidade",
    "10off na 2°": "10% Off na 2ª unidade",
    "10off Na 2": "10% Off na 2ª unidade",
    "10off Na 2°": "10% Off na 2ª unidade",
  };

  for (const [promoCode, promoText] of Object.entries(promoMap)) {
    if (text.includes(promoCode)) {
      return (text = promoText);
    }
  }

  return null;
}

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();
  const modalPreviewId = `modal-${useId()}`;
  const device = useDevice();

  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  const percent =
    listPrice && price
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });
  const platformProps = useAddToCart({ product, seller });

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

  if (!inStock) {
    return null;
  }

  //Added it to check the variant name in the SKU Selector later, so it doesn't render the SKU to "shoes size" in the Product Card
  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  const textTag: string[] = [];

  if (product.offers?.offers[0].teasers) {
    product.offers?.offers[0].teasers.forEach((promo) => {
      const expandedPromo = expandPromoText(promo.name);

      if (expandedPromo !== null) {
        textTag.push(expandedPromo);
      }
    });
  }

  return (
    <div
      {...event}
      class={clx(
        "card gap-[19px] card-compact rounded-none group text-sm",
        _class
      )}
    >
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
        <div class="absolute top-1 left-0 w-full flex items-center justify-between">
          {/* Discounts */}
          <span
            class={clx(
              "text-[10px] sm:text-xs font-normal text-white bg-[#E60201] text-center rounded-[4px] py-[3px] px-[5px]",
              (percent < 1 || !inStock) && "opacity-0"
            )}
          >
            -{percent}%
          </span>
        </div>

        <div class="absolute bottom-0 left-0 w-full flex items-center justify-between">
          {/* Discounts */}
          {textTag &&
            textTag.length > 0 &&
            textTag.map((text, index) => (
              <span
                key={index}
                class="text-[10px] sm:text-xs font-normal text-white bg-[#6279e8] text-center rounded-[4px] p-[4px] sm:py-[5px] sm:px-[12px]"
              >
                {text}
              </span>
            ))}
        </div>

        <div class="absolute top-0 right-0">
          <WishlistButton item={item} variant="icon" />
        </div>
      </figure>

      <div>
        <a href={relativeUrl} class="pt-5">
          <span class="text-xs sm:text-sm font-normal flex text-left">
            {title}
          </span>
        </a>
      </div>

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

      {/* Quantity Input */}
      <div
        id={id}
        class="flex-grow flex flex-col justify-end gap-[15px]"
        data-item-id={product.productID}
        data-cart-item={encodeURIComponent(
          JSON.stringify({ item, platformProps })
        )}
      >
        <div class="flex justify-between items-end">
          <div class="flex flex-col items-start  pt-2">
            {listPrice && price && listPrice > price && (
              <span class="line-through text-[10px] sm:text-xs font-bold text-[#5F5F5F]">
                {formatPrice(listPrice, offers?.priceCurrency)}
              </span>
            )}
            <span class="font-bold text-base sm:text-lg text-[#1A1A1A]">
              {formatPrice(price, offers?.priceCurrency)}
            </span>
          </div>

          <div class="opacity-0 sm:group-hover:opacity-100">
            <button
              class="flex items-center gap-[5.2px] pl-[7px] pr-[12px] py-[12.8px]  border border-[#A3A3A3] border-dashed rounded-[9px] text-xs font-normal text-[#55535D]"
              hx-on:click={useScript(onClick, modalPreviewId)}
            >
              <span>
                <Image
                  src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/ad838ede-6496-44de-8f52-2414c9b82028/preview.svg"
                  width={18}
                  height={10}
                />
              </span>
              <span>Pré-visualizar</span>
            </button>
          </div>
        </div>

        {device != "mobile" && <QuantitySelector min={1} max={100} />}

        <div>
          {device === "mobile" ? (
            <AddToCartMobileButton
              modalPreviewId={modalPreviewId}
              class={clx(
                " bg-[#5D7F3A] flex justify-center items-center text-white border-none gap-2 sm:gap-[12.8px] h-[32px] sm:h-[48px] text-sm sm:text-base font-normal rounded-[11px] no-animation w-full",
                "hover:opacity-80 ease-in-out duration-300"
              )}
            />
          ) : (
            <AddToCartButton
              product={product}
              seller={seller}
              item={item}
              inputId={id}
              class={clx(
                " bg-[#5D7F3A] flex justify-center items-center text-white border-none gap-2 sm:gap-[12.8px] h-[32px] sm:h-[48px] text-sm sm:text-base font-normal rounded-[11px] no-animation w-full",
                "hover:opacity-80 ease-in-out duration-300"
              )}
            />
          )}
        </div>
      </div>

      {device === "mobile" ? (
        <ModalAddToCartMobile
          id={modalPreviewId}
          product={product}
          seller={seller}
          item={item}
        />
      ) : (
        <ModalAddToCart
          id={modalPreviewId}
          product={product}
          seller={seller}
          item={item}
        />
      )}

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default ProductCard;
