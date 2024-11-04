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

const WIDTH = 326;
const HEIGHT = 326;
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

const onLoad = async (id: string, itemId: string) => {
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

  if (productData && productData.MeasurementUnit == "kg") {
    quantityKg?.classList.remove("hidden");
    quantityNormal?.classList.add("hidden");
    quantityNormal?.remove();
  } else {
    quantityNormal?.classList.remove("hidden");
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

// const onLoad = (id: string) => {
//   window.STOREFRONT.CART.subscribe((sdk) => {
//     const inputId = `input-${id}`;
//     const container = document.getElementById(inputId);
//     const input = container?.querySelector<HTMLInputElement>('input[type="number"]');
//     const itemID = container?.getAttribute("data-item-id")!;
//     const quantity = sdk.getQuantity(itemID) || 1;
//     if (!input) {
//       return;
//     }
//     input.value = quantity.toString();
//     // enable interactivity
//     container?.querySelectorAll<HTMLButtonElement>("button").forEach((node) => (node.disabled = false));
//     container?.querySelectorAll<HTMLButtonElement>("input").forEach((node) => (node.disabled = false));

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

const onClick = () => {
  event?.stopPropagation();

  const button = event?.currentTarget as HTMLButtonElement;
  const modal = button?.closest(".modal");

  if (modal && modal.classList.contains("modal-open")) {
    modal.classList.remove("modal-open");
  }
};

const onClickOverlay = (id: string) => {
  event?.stopPropagation();

  const modal = document.getElementById(id);
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

function ModalAddToCart(props: Props) {
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
    <div id={id} hx-on:click={useScript(onClickOverlay, id)} class="modal">
      <div
        class="bg-base-100 absolute top-0 px-[85px] py-[60px] modal-box max-w-[1088px] rounded-lg flex gap-[70px]"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div
          class="absolute top-[11px] right-[11px]"
          hx-on:click={useScript(onClick)}
        >
          <button type="button">
            <Image
              src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/2a8a1f1a-e676-44e1-b918-eb3c22226498/close-modal.svg"
              width={21}
              height={21}
            />
          </button>
        </div>
        <div>
          <figure class="w-[326px]">
            {/* Product Images */}
            <a href={relativeUrl} aria-label="view product" class="w-full">
              <Image
                src={front.url!}
                alt={front.alternateName}
                width={WIDTH}
                height={HEIGHT}
                // sizes="(max-width: 640px) 50vw, 20vw"
              />
            </a>
          </figure>
        </div>

        <div class="flex flex-col">
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
          <div class="flex flex-col items-start gap-1 pt-4">
            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-col">
                <div className="flex flex-row gap-3 items-center">
                  {listPrice && price && listPrice > price && (
                    <span class="line-through text-sm font-medium text-gray-400">
                      {formatPrice(listPrice, offers?.priceCurrency)}
                    </span>
                  )}
                  {listPrice && price && listPrice > price && percent > 0 && (
                    <span class="text-sm/4 font-bold text-[#F8F8F8] bg-[#966D34] text-center rounded px-3 py-1">
                      -{percent}% OFF
                    </span>
                  )}
                </div>
                <span class="text-xl font-bold text-base-400">
                  {formatPrice(price, offers?.priceCurrency)}
                </span>
              </div>

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
                  class="btn btn-primary no-animation rounded-[11px]"
                  disabled={false}
                />
              </div>
            ) : (
              <OutOfStock productID={productID} />
            )}
          </div>
          {/* Description card */}
          <div class="mt-4  sm:mt-6">
            <span className="lg:text-lg text-base font-bold text-[#373737]">
              Detalhes do produto
            </span>
            <span class="text-sm ">
              {description && (
                <div
                  class="mt-2 max-h-[290px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, idQuantity, product.productID),
        }}
      />
    </div>
  );
}

export default ModalAddToCart;
