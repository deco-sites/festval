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
import QuantitySelectorKg from "../ui/QuantitySelectorKg.tsx";

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

interface ProductData {
  ActivateIfPossible: boolean;
  CommercialConditionId: number;
  CreationDate: string;
  CubicWeight: number;
  EstimatedDateArrival: string | null;
  Height: number | null;
  Id: number;
  IsActive: boolean;
  IsKit: boolean;
  KitItensSellApart: boolean;
  Length: number | null;
  ManufacturerCode: string;
  MeasurementUnit: string;
  ModalType: string | null;
  Name: string;
  PackagedHeight: number;
  PackagedLength: number;
  PackagedWeightKg: number;
  PackagedWidth: number;
  ProductId: number;
  RefId: string;
  RewardValue: number | null;
  UnitMultiplier: number;
  Videos: Array<unknown>;
  WeightKg: number | null;
  Width: number | null;
}

const onLoad = async (id: string, itemId: string, product: Product) => {
  async function getProductData(itemId: string): Promise<ProductData | null> {
    const url = `https://www.integracaoiota.com.br/festval-deco-helpers/index.php?skuId=${itemId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro ao buscar o SKU: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      return null;
    }
  }

  const productData = await getProductData(itemId);

  const container = document.getElementById(id);

  const quantityKg =
    container?.querySelector<HTMLDivElement>(`.quantity-card-kg`);
  const quantityNormal = container?.querySelector<HTMLDivElement>(
    `.quantity-card-normal`
  );
  const measurementUnit =
    container?.querySelector<HTMLSpanElement>(`#measurement-unit`);
  const currentPriceElement =
    container?.querySelector<HTMLSpanElement>(`.current-price`);
  const listPriceElement =
    container?.querySelector<HTMLSpanElement>(`.list-price`);
  const discountElement =
    container?.parentElement?.querySelector<HTMLSpanElement>(
      `.discount-percent`
    );
  const loadingElement =
    container?.querySelector<HTMLSpanElement>(`.loading-price`);

  if (productData && productData.MeasurementUnit == "kg") {
    const listPrice = product.offers?.offers[0].priceSpecification[0].price;
    const price = product.offers?.offers[0].priceSpecification[1].price;
    const percent =
      listPrice && price
        ? Math.round(((listPrice - price) / listPrice) * 100)
        : 0;
    if (productData.UnitMultiplier < 1) {
      if (price && listPrice) {
        const priceFormatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price);
        const listPriceFormatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(listPrice);

        if (currentPriceElement && listPriceElement) {
          if (price < listPrice) {
            loadingElement?.classList.add("hidden");
            listPriceElement.innerHTML = `${listPriceFormatted}`;
            listPriceElement.classList.remove("hidden");
            discountElement && (discountElement.innerHTML = `-${percent}%`);
            discountElement?.classList.remove("hidden");
            currentPriceElement.innerHTML = `${priceFormatted}`;
            currentPriceElement.classList.remove("hidden");
          } else {
            loadingElement?.classList.add("hidden");
            discountElement?.classList.add("hidden");
            listPriceElement.classList.add("hidden");
            currentPriceElement.innerHTML = `${priceFormatted}`;
            currentPriceElement.classList.remove("hidden");
          }
        }
      }
    } else {
      const listPrice = product.offers?.offers[0].priceSpecification[0].price;
      const price = product.offers?.offers[0].priceSpecification[1].price;
      if (price && listPrice) {
        const priceFormatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price);
        const listPriceFormatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(listPrice);

        if (currentPriceElement && listPriceElement) {
          if (price < listPrice) {
            loadingElement?.classList.add("hidden");
            listPriceElement.innerHTML = `${listPriceFormatted}`;
            listPriceElement.classList.remove("hidden");
            discountElement && (discountElement.innerHTML = `-${percent}%`);
            discountElement?.classList.remove("hidden");
            currentPriceElement.innerHTML = `${priceFormatted}`;
            currentPriceElement.classList.remove("hidden");
          } else {
            loadingElement?.classList.add("hidden");
            discountElement?.classList.add("hidden");
            listPriceElement.classList.add("hidden");
            currentPriceElement.innerHTML = `${priceFormatted}`;
            currentPriceElement.classList.remove("hidden");
          }
        } else if (currentPriceElement) {
          loadingElement?.classList.add("hidden");
          discountElement?.classList.add("hidden");
          listPriceElement?.classList.add("hidden");
          currentPriceElement.innerHTML = `${priceFormatted}`;
          currentPriceElement.classList.remove("hidden");
        }
      }
    }
    quantityKg?.classList.remove("hidden");
    measurementUnit?.classList.remove("hidden");
    quantityNormal?.classList.add("hidden");
    quantityNormal?.remove();
  } else {
    loadingElement?.classList.add("hidden");
    quantityNormal?.classList.remove("hidden");
    if (quantityNormal && quantityKg) {
      quantityKg.style.display = "block";
      quantityKg.style.position = "absolute";
      quantityKg.style.visibility = "hidden";
      const unitMultiplierMsg = quantityKg!.querySelector<HTMLSpanElement>(
        "#unit-multiplier-msg"
      );
      const unitQuantityMsg =
        quantityKg!.querySelector<HTMLSpanElement>("#unit-quantity-msg");
      if (unitMultiplierMsg && unitQuantityMsg) {
        quantityNormal.style.marginTop = `${
          unitMultiplierMsg?.offsetHeight + unitQuantityMsg?.offsetHeight
        }px`;
      }
    }
    listPriceElement?.classList.remove("hidden");
    currentPriceElement?.classList.remove("hidden");
    measurementUnit?.classList.add("hidden");
    quantityKg?.classList.add("hidden");
    quantityKg?.remove();
  }

  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    container?.setAttribute("data-product-data", JSON.stringify(productData));
    const input =
      productData?.MeasurementUnit == "kg"
        ? container?.querySelector<HTMLInputElement>('input[type="text"]')
        : container?.querySelector<HTMLInputElement>('input[type="number"]');
    input?.setAttribute("data-product-data", JSON.stringify(productData));

    const itemID = container?.getAttribute("data-item-id")!;
    const quantity =
      productData?.MeasurementUnit == "kg"
        ? (
            productData!.UnitMultiplier *
            (sdk.getQuantity(itemID, productData?.MeasurementUnit) ?? 1)
          ).toFixed(3)
        : sdk.getQuantity(itemID, productData?.MeasurementUnit) || 1;

    if (!input) {
      return;
    }
    input.value =
      productData?.MeasurementUnit == "kg"
        ? `${quantity.toString()} kg`
        : quantity.toString();

    if (productData?.MeasurementUnit == "kg") {
      input.setAttribute(
        "data-quantity-number",
        `${sdk.getQuantity(itemID, productData?.MeasurementUnit) || 1}`
      );
    }

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

  if (window.innerWidth < 768) {
    const cart = window.STOREFRONT.CART.getCart();
    if (cart) {
      // deno-lint-ignore no-explicit-any
      const item = cart.items.find((i) => (i as any).item_id === itemId);
      if (item) {
        const buttonAddToCart = container!.querySelector<HTMLButtonElement>(
          'button[data-attribute="add-to-cart"]'
        );

        if (buttonAddToCart) {
          buttonAddToCart.style.backgroundColor = "#fff";
          buttonAddToCart.style.color = "#3E3D41";
          buttonAddToCart.style.border = "1px solid  #989898";
          buttonAddToCart.innerText = "Adicionado";

          buttonAddToCart.disabled = true;
        }
      }
    }
  }
};

// const onLoad = (id: string) => {
//   window.STOREFRONT.CART.subscribe((sdk) => {
//     const container = document.getElementById(id);
//     const input = container?.querySelector<HTMLInputElement>(
//       'input[type="number"]'
//     );
//     const itemID = container?.getAttribute("data-item-id")!;
//     const quantity = sdk.getQuantity(itemID) || 1;
//     if (!input) {
//       return;
//     }
//     input.value = quantity.toString();
//     // enable interactivity
//     container
//       ?.querySelectorAll<HTMLButtonElement>("button")
//       .forEach((node) => (node.disabled = false));
//     container
//       ?.querySelectorAll<HTMLButtonElement>("input")
//       .forEach((node) => (node.disabled = false));

//     const cart = window.STOREFRONT.CART.getCart();
//     if (cart) {
//       // deno-lint-ignore no-explicit-any
//       const item = cart.items.find((i) => (i as any).item_id === itemID);

//       if (item) {
//         const buttonAddToCart = container!.querySelector<HTMLButtonElement>(
//           'button[data-attribute="add-to-cart"]'
//         );

//         if (buttonAddToCart) {
//           buttonAddToCart.style.backgroundColor = "#fff";
//           buttonAddToCart.style.color = "#3E3D41";
//           buttonAddToCart.style.border = "1px solid  #989898";
//           buttonAddToCart.innerText = "Adicionado ao carrinho";

//           buttonAddToCart.disabled = true;
//         }
//       }
//     }
//   });
// };

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

function expandPromoText(promo: string): string | null {
  if (promo.includes("FLAG")) {
    if (promo.includes("|")) {
      const [beforePipe] = promo.split("|");
      return beforePipe.trim();
    }
    return promo.replace("FLAG", "").trim();
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

  // if (!inStock) {
  //   return null;
  // }

  //Added it to check the variant name in the SKU Selector later, so it doesn't render the SKU to "shoes size" in the Product Card
  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  const textTag: string[] = [];

  if (product.offers?.offers[0].teasers) {
    product.offers?.offers[0].teasers.forEach((promo) => {
      const expandedPromo = expandPromoText(promo.name);

      if (expandedPromo) {
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
              "discount-percent text-[10px] sm:text-xs font-normal text-white bg-[#E60201] text-center rounded-[4px] py-[3px] px-[5px]",
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
              <span class="list-price hidden line-through text-[10px] sm:text-xs font-bold text-[#5F5F5F]">
                {formatPrice(listPrice, offers?.priceCurrency)}
              </span>
            )}
            <div>
              <span class="block loading loading-spinner loading-price" />
              <span class="current-price hidden font-bold text-base sm:text-lg text-[#1A1A1A]">
                {formatPrice(price, offers?.priceCurrency)}
              </span>
              <span
                id="measurement-unit"
                class="hidden font-bold text-sm text-[#9f9f9f] ml-[2px]"
              >
                /kg
              </span>
            </div>
          </div>

          <div class="opacity-0 hidden sm:flex sm:group-hover:opacity-100">
            <button
              class="flex items-center gap-[5.2px] px-[8px] py-[11px] bg-[#ededed] hover:opacity-80 border-none rounded-[9px] text-xs font-normal text-[#55535D]"
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

        {device != "mobile" && (
          <>
            <div
              class="lg:w-full hidden quantity-card-kg"
              data-item-id={product.productID}
              data-cart-item={encodeURIComponent(
                JSON.stringify({ item, platformProps })
              )}
            >
              <QuantitySelectorKg id={`input-${id}`} min={1} max={100} />
            </div>

            <div
              class="lg:w-full hidden quantity-card-normal"
              data-item-id={product.productID}
              data-cart-item={encodeURIComponent(
                JSON.stringify({ item, platformProps })
              )}
            >
              <QuantitySelector min={1} max={100} />
            </div>
          </>
        )}

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
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, id, product.productID, product),
        }}
      />
    </div>
  );
}

export default ProductCard;
