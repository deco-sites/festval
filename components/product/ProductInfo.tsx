import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import ShippingSimulationForm from "../shipping/Form.tsx";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { Product } from "apps/commerce/types.ts";
import { useDevice, useScript } from "@deco/deco/hooks";
import AddToCartMobileButton from "./AddToCartMobileButton.tsx";
import ModalAddToCartMobile from "./ModalAddToCartMobile.tsx";
import Drawer from "../ui/Drawer.tsx";
import Image from "apps/website/components/Image.tsx";
import QuantitySelectorKg from "../ui/QuantitySelectorKg.tsx";
interface Props {
  page: ProductDetailsPage | null;
}

interface AddToCartProps {
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

  const quantityKg = document.querySelector<HTMLDivElement>(".quantity-kg");
  const quantityNormal =
    document.querySelector<HTMLDivElement>(".quantity-normal");
  const measurementUnit =
    document?.querySelector<HTMLSpanElement>(`.measurement-unit`);
  const currentPriceElement =
    document?.querySelector<HTMLSpanElement>(`.current-price`);
  const listPriceElement =
    document?.querySelector<HTMLSpanElement>(`.list-price`);
  const discountElement =
    document?.querySelector<HTMLSpanElement>(`.discount-percent`);
  const loadingElement =
    currentPriceElement?.parentElement?.querySelector<HTMLSpanElement>(
      `.loading-spinner`
    );
  const priceQuantityElements = document.querySelector<HTMLDivElement>(
    ".price-quantity-elements"
  );

  if (productData && productData.MeasurementUnit == "kg") {
    const listPrice = product.offers?.offers[0].priceSpecification[0].price;
    const price = product.offers?.offers[0].priceSpecification[1].price;
    const percent =
      listPrice && price
        ? Math.round(((listPrice - price) / listPrice) * 100)
        : 0;
    if (window.innerWidth < 768 && priceQuantityElements) {
      priceQuantityElements.classList.remove("flex-row");
      priceQuantityElements.classList.add("flex-col", "gap-4");
    }
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
            discountElement && (discountElement.innerHTML = `-${percent}% OFF`);
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
            discountElement && (discountElement.innerHTML = `-${percent}% OFF`);
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
    }
    quantityKg?.classList.remove("hidden");
    measurementUnit?.classList.remove("hidden");
    quantityNormal?.classList.add("hidden");
    quantityNormal?.remove();
  } else {
    loadingElement?.classList.add("hidden");
    quantityNormal?.classList.remove("hidden");
    listPriceElement?.classList.remove("hidden");
    currentPriceElement?.classList.remove("hidden");
    measurementUnit?.classList.add("hidden");
    quantityKg?.classList.add("hidden");
    quantityKg?.remove();
  }

  window.STOREFRONT.CART.subscribe((sdk) => {
    const inputId = `input-${id}`;

    const container = document.getElementById(inputId);
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
        ? `${quantity.toString()} kg`
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
        const buttonAddToCart = document.querySelector<HTMLButtonElement>(
          '.add-cart-button-pdp button[data-attribute="add-to-cart"]'
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

function ProductInfo({ page }: Props) {
  const id = useId();
  const modalPreviewId = `modal-${useId()}`;

  const device = useDevice();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf, gtin } = product;
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;

  const { price = 0, listPrice, seller = "1", availability } = useOffer(offers);

  const percent =
    listPrice && price
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0;

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const platformProps = useAddToCart({ product, seller });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
  // const hasValidVariants =
  //   isVariantOf?.hasVariant?.some(
  //     (variant) =>
  //       variant?.name?.toLowerCase() !== "title" &&
  //       variant?.name?.toLowerCase() !== "default title"
  //   ) ?? false;

  return (
    <div {...viewItemEvent} class="flex flex-col" id={id}>
      {/* Product Name */}
      <span
        class={clx(
          "lg:text-xl sm:text-base font-bold text-[#373737]",
          "pt-4",
          "px-4 sm:px-0"
        )}
      >
        {title}
      </span>
      <div className="pt-1 text-[#646072] lg:text-lg text-sm px-4 sm:px-0">
        Ref.{gtin}
      </div>
      <div className="relative w-fit px-4 sm:px-0">
        <WishlistButton item={item} />
      </div>

      {/* Prices */}
      <div class="flex flex-col items-start gap-1 px-4 sm:px-0">
        <div className="flex flex-row w-full justify-between price-quantity-elements">
          <div className="flex flex-col">
            <div className="flex flex-row gap-3 items-center">
              {listPrice && price && listPrice > price && (
                <span class="list-price hidden line-through text-sm font-medium text-gray-400">
                  {formatPrice(listPrice, offers?.priceCurrency)}
                </span>
              )}
              {listPrice && price && listPrice > price && percent > 0 && (
                <span class="discount-percent hidden text-sm/4  text-[#F8F8F8] bg-[#E60201] text-center rounded px-3 py-1">
                  -{percent}% OFF
                </span>
              )}
            </div>
            <div>
              <span class="block loading loading-spinner" />
              <span class="current-price hidden text-xl font-bold text-base-400 hidden">
                {formatPrice(price, offers?.priceCurrency)}
              </span>
              <span class="measurement-unit hidden font-bold text-sm text-[#9f9f9f] ml-[2px]">
                /kg
              </span>
            </div>
          </div>

          <div
            id={`input-${id}`}
            class="hidden quantity-kg"
            data-item-id={product.productID}
            data-cart-item={encodeURIComponent(
              JSON.stringify({ item, platformProps })
            )}
          >
            <QuantitySelectorKg id={`input-${id}`} min={1} max={100} />
          </div>

          <div
            id={`input-${id}`}
            class="lg:w-2/4 hidden quantity-normal"
            data-item-id={product.productID}
            data-cart-item={encodeURIComponent(
              JSON.stringify({ item, platformProps })
            )}
          >
            <QuantitySelector min={1} max={100} />
          </div>
        </div>
      </div>

      {/* Sku Selector
      {hasValidVariants && ( 
        <div className="mt-4 sm:mt-8">
          <ProductSelector product={product} />
        </div>
      )} */}

      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-6 flex flex-col gap-2 px-4 sm:px-0">
        {availability === "https://schema.org/InStock" ? (
          <div class="add-cart-button-pdp">
            {device === "mobile" ? (
              <AddToCartMobileButton
                modalPreviewId={modalPreviewId}
                class="btn btn-primary no-animation rounded-[11px]"
                disabled={false}
              />
            ) : (
              <AddToCartButton
                item={item}
                seller={seller}
                product={product}
                inputId={`input-${id}`}
                class="btn btn-primary no-animation rounded-[11px]"
                disabled={false}
              />
            )}
          </div>
        ) : (
          <OutOfStock productID={productID} />
        )}
      </div>

      <ModalAddToCartMobile
        id={modalPreviewId}
        product={product}
        seller={seller}
        item={item}
      />

      {/* Shipping Simulation */}

      {/* Description card */}
      {device !== "mobile" ? (
        <div class="mt-4 sm:mt-6">
          <span className="lg:text-lg text-base font-bold text-[#373737]">
            Detalhes do produto
          </span>
          <span class="text-sm">
            {description && (
              <div
                class="mt-0"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </span>
        </div>
      ) : (
        <>
          <Drawer
            id={`detalhes-produto`}
            class="drawer-end z-50"
            aside={
              <Drawer.Aside
                title="Detalhes do produto"
                drawer={`detalhes-produto`}
              >
                <div class="h-full px-4 flex flex-col bg-base-100 overflow-auto">
                  <div class="mt-4 sm:mt-6">
                    <span class="text-sm">
                      {description && (
                        <div
                          class="mt-0"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      )}
                    </span>
                  </div>
                </div>
              </Drawer.Aside>
            }
          />

          <div className="flex w-full mt-3 bg-white">
            <label
              for={`detalhes-produto`}
              class="w-full flex justify-between items-center p-4"
              aria-label="open menu"
            >
              <span>Detalhes do produto</span>

              <span>
                <Image
                  src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/6367b27c-92b8-4ff7-a9f9-689de3ff4f20/arrow-right-mobile.svg"
                  width={9}
                  height={13}
                />
              </span>
            </label>
          </div>
        </>
      )}

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, id, productID, product),
        }}
      />
    </div>
  );
}

export default ProductInfo;
