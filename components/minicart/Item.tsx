import { useScript } from "@deco/deco/hooks";
import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import QuantitySelectorKgCart from "../ui/QuantitySelectorKgCart.tsx";
export type Item = AnalyticsItem & {
  listPrice: number;
  image: string;
  unitMultiplier: number;
  measurementUnit: string;
};
export interface Props {
  item: Item;
  index: number;
  locale: string;
  currency: string;
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

const onLoad = async (id: string, item: Item, quantity: number) => {
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

  const itemWithId = item as Item & { item_id: string };
  const productData = await getProductData(itemWithId.item_id);

  const container = document.getElementById(id);

  if (productData && productData.MeasurementUnit === "kg") {
    const divInput = document.getElementById(`input-${id}`);
    divInput?.setAttribute("data-product-data", JSON.stringify(productData));
    const input =
      divInput?.querySelector<HTMLInputElement>('input[type="text"]');
    divInput?.setAttribute("data-quantity-number", quantity.toString());
    input?.setAttribute("data-product-data", JSON.stringify(productData));
    input?.setAttribute("data-quantity-number", quantity.toString());

    if (productData && productData.UnitMultiplier) {
      const quantityForInput = (productData.UnitMultiplier * quantity).toFixed(
        3
      );
      if (input) {
        input.value = `${quantityForInput} kg`;
      }
    }
  }
};

const QUANTITY_MAX_VALUE = 100;
const removeItemHandler = (measurementUnit: string) => {
  const itemID = (event?.currentTarget as HTMLButtonElement | null)
    ?.closest("fieldset")
    ?.getAttribute("data-item-id");

  if (typeof itemID === "string") {
    if (measurementUnit === "kg") {
      window.STOREFRONT.CART.setQuantity(itemID, 0, true);
    } else {
      window.STOREFRONT.CART.setQuantity(itemID, 0, false);
    }

    const buttonsAddToCart = document.querySelectorAll<HTMLButtonElement>(
      'button[data-attribute="add-to-cart"]'
    );

    const matchingButtons = Array.from(buttonsAddToCart).filter(
      (button) => button.getAttribute("data-item-id") === itemID
    );

    matchingButtons.forEach((button) => {
      button.style.backgroundColor = "#5D7F3A";
      button.style.color = "#fff";
      button.style.border = "1px solid  #5D7F3A";
      button.innerText = "Adicionar";

      button.disabled = true;
    });
  }
};

function CartItem({ item, index, locale, currency }: Props) {
  const {
    image,
    listPrice,
    price = Infinity,
    quantity,
    unitMultiplier,
    measurementUnit,
  } = item;
  const isGift = price < 0.01;
  // deno-lint-ignore no-explicit-any
  const name = (item as any).item_name;
  const id = useId();

  return (
    <fieldset
      // deno-lint-ignore no-explicit-any
      id={id}
      data-item-id={(item as any).item_id}
      class="grid grid-rows-1 gap-2"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <Image
        alt={name}
        src={image.replace("55-55", "100-100")}
        width={100}
        height={100}
        class="object-center object-contain lg:w-[107px] lg:h-[107px] mix-blend-multiply"
      />
      {/* Info */}
      <div class="flex flex-col gap-2">
        {/* Name and Remove button */}
        <div class="flex justify-between items-center">
          <legend class="font-semibold">{name}</legend>
          <button
            class={clx(
              isGift && "hidden",
              "btn btn-ghost hover:bg-transparent hover:opacity-80 btn-square no-animation"
            )}
            hx-on:click={useScript(removeItemHandler, measurementUnit)}
          >
            <Icon id="trash" size={24} />
          </button>
        </div>

        {/* Price Block */}
        <div class="flex items-start gap-1 flex-col">
          {!isGift && listPrice && price && listPrice > price && (
            <span class="line-through text-sm list-price">
              {formatPrice(listPrice, currency, locale)}
            </span>
          )}
          <span class="text-lg font-medium text-[#282828] price">
            {isGift
              ? "Grátis"
              : measurementUnit === "kg"
              ? formatPrice(price * unitMultiplier * quantity, currency, locale)
              : formatPrice(price * quantity, currency, locale)}
          </span>
        </div>

        {/* Quantity Selector */}
        {/* {!isGift && ( */}
        <div>
          {measurementUnit === "kg" ? (
            <div id={`input-${id}`} class={clx("quantity-cart-kg")}>
              <QuantitySelectorKgCart
                id={`input-${id}`}
                min={0}
                max={QUANTITY_MAX_VALUE}
                value={quantity}
                name={`item::${index}`}
              />
            </div>
          ) : (
            <div id={`input-${id}`} class={clx("quantity-cart-normal")}>
              <QuantitySelector
                min={0}
                max={QUANTITY_MAX_VALUE}
                value={quantity}
                name={`item::${index}`}
              />
            </div>
          )}
        </div>
        {/* )} */}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, id, item, quantity),
        }}
      />
    </fieldset>
  );
}
export default CartItem;
