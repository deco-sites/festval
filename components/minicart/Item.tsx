import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import Icon from "../ui/Icon.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { useScript } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";
import QuantitySelectorKg from "../ui/QuantitySelectorKg.tsx";
export type Item = AnalyticsItem & {
  listPrice: number;
  image: string;
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

// const onLoad = async (id: string, item: Item, quantity: number) => {
//   console.log("carregando...");
//   console.log(id, item);
//   async function getProductData(itemId: string): Promise<ProductData | null> {
//     const url = `https://www.integracaoiota.com.br/festval-deco-helpers/index.php?skuId=${itemId}`;

//     try {
//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Erro ao buscar o SKU: ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Erro ao buscar os dados:", error);
//       return null;
//     }
//   }

//   const itemID = item as AnalyticsItem;

//   const productData = await getProductData(
//     (itemID as { item_id: string }).item_id
//   );

//   console.log(productData);

//   const quantityKg =
//     document.querySelector<HTMLDivElement>(".quantity-cart-kg");
//   const quantityNormal = document.querySelector<HTMLDivElement>(
//     ".quantity-cart-normal"
//   );

//   if (productData && productData.MeasurementUnit == "kg") {
//     quantityKg?.classList.remove("hidden");
//     quantityNormal?.classList.add("hidden");
//     quantityNormal?.remove();
//   } else {
//     quantityNormal?.classList.remove("hidden");
//     quantityKg?.classList.add("hidden");
//     quantityKg?.remove();
//   }

//   const inputId = `input-${id}`;

//   const container = document.getElementById(inputId);
//   container?.setAttribute("data-product-data", JSON.stringify(productData));
//   const input =
//     productData?.MeasurementUnit == "kg"
//       ? container?.querySelector<HTMLInputElement>('input[type="text"]')
//       : container?.querySelector<HTMLInputElement>('input[type="number"]');
//   input?.setAttribute("data-product-data", JSON.stringify(productData));
//   if (!input) {
//     return;
//   }
//   let quantityForInput;
//   if (
//     productData?.MeasurementUnit == "kg" &&
//     !input.getAttribute("data-quantity-number")
//   ) {
//     input.setAttribute("data-quantity-number", `${quantity}`);
//     quantityForInput = quantity;
//   } else {
//     quantityForInput = Number(input.getAttribute("data-quantity-number"));
//   }

//   const quantityInput =
//     productData?.MeasurementUnit == "kg"
//       ? (productData!.UnitMultiplier * quantityForInput).toFixed(3)
//       : quantityForInput;

//   input.value =
//     productData?.MeasurementUnit == "kg"
//       ? `${quantityInput.toString()} Kg`
//       : quantityInput.toString();

//   if (productData?.MeasurementUnit == "kg") {
//     input.setAttribute("data-quantity-number", `${quantityForInput}`);
//   }
// };

const QUANTITY_MAX_VALUE = 100;
const removeItemHandler = () => {
  const itemID = (event?.currentTarget as HTMLButtonElement | null)
    ?.closest("fieldset")
    ?.getAttribute("data-item-id");

  if (typeof itemID === "string") {
    window.STOREFRONT.CART.setQuantity(itemID, 0);

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
  const { image, listPrice, price = Infinity, quantity } = item;
  const isGift = price < 0.01;
  // deno-lint-ignore no-explicit-any
  const name = (item as any).item_name;
  const id = useId();

  return (
    <fieldset
      // deno-lint-ignore no-explicit-any
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
            hx-on:click={useScript(removeItemHandler)}
          >
            <Icon id="trash" size={24} />
          </button>
        </div>

        {/* Price Block */}
        <div class="flex items-start gap-1 flex-col">
          {listPrice && price && listPrice > price && (
            <span class="line-through text-sm">
              {formatPrice(listPrice, currency, locale)}
            </span>
          )}
          <span class="text-lg font-medium text-[#282828]">
            {isGift ? "Grátis" : formatPrice(price, currency, locale)}
          </span>
        </div>

        {/* Quantity Selector */}
        {/* <div
          id={`input-${id}`}
          class={clx(isGift && "hidden", "quantity-cart-kg")}
        >
          <QuantitySelectorKg
            min={0}
            max={QUANTITY_MAX_VALUE}
            name={`item::${index}`}
          />
        </div> */}

        <div
          id={`input-${id}`}
          class={clx(isGift && "hidden", "quantity-cart-normal")}
        >
          <QuantitySelector
            min={0}
            max={QUANTITY_MAX_VALUE}
            value={quantity}
            name={`item::${index}`}
          />
        </div>
      </div>
      {/* <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, id, item, quantity),
        }}
      /> */}
    </fieldset>
  );
}
export default CartItem;
