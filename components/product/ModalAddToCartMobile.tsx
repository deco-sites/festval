import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { HEADER_HEIGHT_MOBILE } from "../../constants.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import { relative } from "../../sdk/url.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { clx } from "../../sdk/clx.ts";
import Image from "apps/website/components/Image.tsx";
import { formatPrice } from "../../sdk/format.ts";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import OutOfStock from "./OutOfStock.tsx";
import { useScript } from "@deco/deco/hooks";
import QuantitySelectorKg from "../ui/QuantitySelectorKg.tsx";

export interface Props {
  id: string;
  product: Product;
  seller: string;
  item: AnalyticsItem;
}

interface AddToCartProps {
  product: Product;
  seller: string;
}

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

const WIDTH = 150;
const HEIGHT = 150;

// const onLoad = (id: string) => {
//   window.STOREFRONT.CART.subscribe((sdk) => {
//     const inputId = `input-${id}`;
//     const container = document.getElementById(inputId);
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
//         const buttonAddToCart = document.querySelector<HTMLButtonElement>(
//           `.add-cart-button-modal-${id} button[data-attribute="add-to-cart"]`
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

  const container = document.getElementById(`modal-${id}`);

  const quantityKg =
    container?.querySelector<HTMLDivElement>(`.quantity-modal-kg`);
  const quantityNormal = container?.querySelector<HTMLDivElement>(
    `.quantity-modal-normal`
  );
  const measurementUnit =
    container?.querySelector<HTMLSpanElement>(`#measurement-unit`);
  const currentPriceElement =
    container?.querySelector<HTMLSpanElement>(`.current-price`);
  const listPriceElement =
    container?.querySelector<HTMLSpanElement>(`.list-price`);

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
            listPriceElement.innerHTML = `${listPriceFormatted}`;
            listPriceElement.classList.remove("hidden");
            currentPriceElement.innerHTML = `${priceFormatted}`;
            currentPriceElement.classList.remove("hidden");
          } else {
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
            listPriceElement.innerHTML = `${listPriceFormatted}`;
            listPriceElement.classList.remove("hidden");
            currentPriceElement.innerHTML = `${priceFormatted}`;
            currentPriceElement.classList.remove("hidden");
          } else {
            listPriceElement.classList.add("hidden");
            currentPriceElement.innerHTML = `${priceFormatted}`;
            currentPriceElement.classList.remove("hidden");
          }
        }
      }
    }
    quantityKg?.classList.remove("hidden");
    measurementUnit?.classList.remove("hidden");
    quantityNormal?.classList.add("hidden");
    quantityNormal?.remove();
  } else {
    quantityNormal?.classList.remove("hidden");
    currentPriceElement?.classList.remove("hidden");
    measurementUnit?.classList.add("hidden");
    quantityKg?.classList.add("hidden");
    quantityKg?.remove();
  }

  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(`input-${id}`);
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
            productData!.UnitMultiplier * (sdk.getQuantity(itemID) ?? 1)
          ).toFixed(3)
        : sdk.getQuantity(itemID) || 1;

    if (!input) {
      return;
    }
    input.value =
      productData?.MeasurementUnit == "kg"
        ? `${quantity.toString()} Kg`
        : quantity.toString();

    if (productData?.MeasurementUnit == "kg") {
      input.setAttribute(
        "data-quantity-number",
        `${sdk.getQuantity(itemID) || 1}`
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
          `.add-cart-button-modal-${id} button[data-attribute="add-to-cart"]`
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

const onClick = () => {
  event?.stopPropagation();

  const button = event?.currentTarget as HTMLButtonElement;
  const modal = button?.closest(".modal");
  const children = modal?.querySelector<HTMLDivElement>("div");

  if (children && !children.classList.contains("translate-y-[100%]")) {
    children.classList.add("translate-y-[100%]");
  }

  if (modal && modal.classList.contains("modal-open")) {
    modal.classList.remove("modal-open");
  }
};

const onClickOverlay = (id: string) => {
  event?.stopPropagation();

  const modal = document.getElementById(id);
  const children = modal?.querySelector<HTMLDivElement>("div");
  if (children && !children.classList.contains("translate-y-[100%]")) {
    children.classList.add("translate-y-[100%]");
  }
  if (modal && modal.classList.contains("modal-open")) {
    modal.classList.remove("modal-open");
  }
};

const useAddToCart = ({ product, seller }: AddToCartProps) => {
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

function ModalAddToCartMobile(props: Props) {
  const { id, product, seller, item } = props;
  const { productID, url, image: images, offers, isVariantOf, gtin } = product;
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;
  const [front] = images ?? [];
  const { listPrice, price, availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);
  const percent =
    listPrice && price
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0;

  const platformProps = useAddToCart({ product, seller });

  const idQuantity = id.replace("modal-", "").trim();

  return (
    <div
      id={id}
      class="modal fixed bottom inset-0 z-50 flex justify-center items-end"
      hx-on:click={useScript(onClickOverlay, id)}
    >
      <div
        class={clx(
          "bg-[#FAFAFA] rounded-none w-full max-w-lg",
          "transform transition-transform duration-300 ease-in-out",
          "translate-y-[100%]"
        )}
      >
        <div class="flex justify-center pt-[9px] pb-[33px]">
          <button type="button p-2" hx-on:click={useScript(onClick)}>
            <Image
              src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/a6c84a7f-c6b5-452d-b2bc-53aa91ee5efd/arrow-down.svg"
              width={13}
              height={7}
            />
          </button>
        </div>
        <div class="bg-white p-[16px] flex gap-[8px]">
          <figure class={clx("relative")}>
            {/* Product Images */}
            <a
              href={relativeUrl}
              aria-label="view product"
              class={clx("w-full", !inStock && "opacity-70")}
            >
              <Image
                src={front.url!}
                alt={front.alternateName}
                width={WIDTH}
                height={HEIGHT}
                class={clx("rounded")}
                // sizes="(max-width: 640px) 50vw, 20vw"
              />
            </a>
          </figure>

          <div class="flex flex-col justify-between">
            {/* Product Name */}
            <div>
              <span
                class={clx(
                  "lg:text-xl sm:text-base font-bold text-[#373737]",
                  "pt-4"
                )}
              >
                {title}
              </span>
              <div className="pt-1 text-[#646072] lg:text-lg text-sm">
                Ref.{gtin}
              </div>
            </div>
            {/* Prices */}
            <div className="flex flex-col border-t border-[#D9D9D9] pt-[8px]">
              <div className="flex flex-row gap-3 items-center">
                {listPrice && price && listPrice > price && (
                  <span class="list-price line-through text-[10px] font-normal text-gray-400">
                    {formatPrice(listPrice, offers?.priceCurrency)}
                  </span>
                )}
                {/* {listPrice && price && listPrice > price && percent > 0 && (
                  <span class="text-sm/4 font-bold text-[#F8F8F8] bg-[#966D34] text-center rounded px-3 py-1">
                    -{percent}% OFF
                  </span>
                )} */}
              </div>
              <div>
                <span class="current-price text-xs font-bold text-base-400">
                  {formatPrice(price, offers?.priceCurrency)}
                </span>
                <span
                  id="measurement-unit"
                  class="hidden font-bold text-[10px] text-[#9f9f9f] ml-[2px]"
                >
                  /Kg
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-[24px] px-[16px] py-[24px]">
          {/* Quantity Selector */}
          <div class="flex flex-col items-start gap-1 pt-4">
            <div className="flex flex-row w-full justify-center">
              <div
                id={`input-${idQuantity}`}
                class="hidden quantity-modal-kg"
                data-item-id={product.productID}
                data-cart-item={encodeURIComponent(
                  JSON.stringify({ item, platformProps })
                )}
              >
                <QuantitySelectorKg
                  id={`input-${idQuantity}`}
                  min={1}
                  max={100}
                />
              </div>

              <div
                id={`input-${idQuantity}`}
                class="lg:w-2/4 hidden quantity-modal-normal"
                data-item-id={product.productID}
                data-cart-item={encodeURIComponent(
                  JSON.stringify({ item, platformProps })
                )}
              >
                <QuantitySelector min={1} max={100} />
              </div>
            </div>
          </div>
          {/* Add to Cart and Favorites button */}
          <div class="mt-4 sm:mt-10 flex flex-col gap-2">
            {availability === "https://schema.org/InStock" ? (
              <div class={`add-cart-button-modal-${id}`}>
                <AddToCartButton
                  item={item}
                  seller={seller}
                  product={product}
                  inputId={`input-${idQuantity}`}
                  modalPreviewMobile={id}
                  class="btn btn-primary no-animation rounded-[11px]"
                  disabled={false}
                />
              </div>
            ) : (
              <OutOfStock productID={productID} />
            )}
          </div>
        </div>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, idQuantity, product.productID, product),
        }}
      />
    </div>
  );
}

export default ModalAddToCartMobile;
