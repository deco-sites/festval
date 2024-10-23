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

interface Props {
  page: ProductDetailsPage | null;
}

function ProductInfo({ page }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;

  const { price = 0, listPrice, seller = "1", availability } = useOffer(offers);

  const percent = listPrice && price ? Math.round(((listPrice - price) / listPrice) * 100) : 0;

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
  const hasValidVariants =
    isVariantOf?.hasVariant?.some(
      (variant) => variant?.name?.toLowerCase() !== "title" && variant?.name?.toLowerCase() !== "default title"
    ) ?? false;

  return (
    <div {...viewItemEvent} class="flex flex-col" id={id}>
      {/* Product Name */}
      <span class={clx("text-xl font-bold text-[#373737]", "pt-4")}>{title}</span>

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
            <span class="text-xl font-bold text-base-400">{formatPrice(price, offers?.priceCurrency)}</span>
          </div>

          <div class="w-2/4">{/* <QuantitySelector min={1} max={100} /> */}</div>
        </div>
      </div>

      {/* Sku Selector */}
      {hasValidVariants && (
        <div className="mt-4 sm:mt-8">
          <ProductSelector product={product} />
        </div>
      )}

      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-10 flex flex-col gap-2">
        {availability === "https://schema.org/InStock" ? (
          <>
            <AddToCartButton
              item={item}
              seller={seller}
              product={product}
              class="btn btn-primary no-animation rounded-[11px]"
              disabled={false}
            />
            {/* <WishlistButton item={item} /> */}
          </>
        ) : (
          <OutOfStock productID={productID} />
        )}
      </div>

      {/* Shipping Simulation */}

      {/* Description card */}
      <div class="mt-4 sm:mt-6">
        <span className="text-lg font-bold text-[##373737]">Detalhes do produto</span>
        <span class="text-sm">{description && <div class="mt-2" dangerouslySetInnerHTML={{ __html: description }} />}</span>
      </div>
    </div>
  );
}

export default ProductInfo;
