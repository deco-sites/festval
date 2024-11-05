import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useScript } from "@deco/deco/hooks";
import Image from "apps/website/components/Image.tsx";

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

const onLoad = (id: string | null, maxAttempts = 5, delay = 1000) => {
  let attempts = 0;

  function attemptLoad() {
    if (!id) return;

    const input = document.getElementById(id);

    const productData: ProductData = JSON.parse(
      input?.getAttribute("data-product-data") ?? "{}"
    );

    if (Object.keys(productData).length === 0 && attempts < maxAttempts) {
      attempts += 1;
      setTimeout(attemptLoad, delay);
    } else if (
      Object.keys(productData).length > 0 &&
      productData.MeasurementUnit === "kg"
    ) {
      if (input instanceof HTMLInputElement) {
        const unitMultiplierMsg = input!.nextSibling as HTMLSpanElement;
        const unitQuantityMsg = unitMultiplierMsg!
          .nextSibling as HTMLSpanElement;
        const quantity = input.getAttribute("data-quantity-number");
        if (unitMultiplierMsg) {
          unitMultiplierMsg.classList.remove("hidden");
          unitQuantityMsg.classList.remove("hidden");
          unitMultiplierMsg.innerHTML = `Aprox. ${productData.UnitMultiplier.toFixed(
            3
          )} kg/unidade`;
          unitQuantityMsg.innerHTML = `Aprox. ${quantity} unidade(s) selecionada(s)`;
        }
      } else if (input instanceof HTMLDivElement) {
        const inputElement = input!.querySelector<HTMLInputElement>(
          'input[type="text"].input-kg'
        );
        const unitMultiplierMsg = inputElement!.nextSibling as HTMLSpanElement;
        const unitQuantityMsg = unitMultiplierMsg!
          .nextSibling as HTMLSpanElement;
        const quantity = inputElement!.getAttribute("data-quantity-number");
        if (unitMultiplierMsg) {
          unitMultiplierMsg.classList.remove("hidden");
          unitQuantityMsg.classList.remove("hidden");
          unitMultiplierMsg.innerHTML = `Aprox. ${productData.UnitMultiplier.toFixed(
            3
          )} kg/unidade`;
          unitQuantityMsg.innerHTML = `Aprox. ${quantity} unidade(s) selecionada(s)`;
        }
      }
    } else if (
      attempts == maxAttempts &&
      productData.MeasurementUnit === "kg"
    ) {
      console.error(
        "Erro: Limite máximo de tentativas atingido. Falha ao carregar productData."
      );
    }
  }

  attemptLoad();
};

const onClick = (delta: number) => {
  event!.stopPropagation();

  const button = event!.currentTarget as HTMLButtonElement;
  const input =
    button.parentElement?.querySelector<HTMLInputElement>(
      'input[type="text"]'
    )!;

  const productData: ProductData = JSON.parse(
    input.getAttribute("data-product-data") ?? "{}"
  );

  const productQuantityHandler: number = parseInt(
    input.getAttribute("data-quantity-number") ?? "1",
    10
  );

  const min = productData.UnitMultiplier * Number(input.min) || -Infinity;
  const max = productData.UnitMultiplier * Number(input.max) || Infinity;

  const inputValueAsNumber = parseFloat(productData.UnitMultiplier.toFixed(3));

  input.value = `${Math.min(
    Math.max(inputValueAsNumber * (productQuantityHandler + delta), min),
    max
  ).toFixed(3)} kg`;

  if (productQuantityHandler + delta <= 0) return;

  input.setAttribute(
    "data-quantity-number",
    (productQuantityHandler + delta).toString()
  );

  console.log();

  const unitQuantityMsg = input!.nextSibling?.nextSibling as HTMLSpanElement;
  unitQuantityMsg!.innerHTML = `Aprox. ${
    productQuantityHandler + delta
  } unidade(s) selecionada(s)`;

  const dataCartItem = input.closest("div[data-cart-item]");
  const dataFieldset = input.closest("fieldset");

  let productId = "";

  if (dataCartItem?.getAttribute("data-item-id")) {
    productId = dataCartItem.getAttribute("data-item-id")!;
  } else if (dataFieldset?.getAttribute("data-item-id")) {
    productId = dataFieldset.getAttribute("data-item-id")!;
  }

  if (productId) {
    window.STOREFRONT.CART.setQuantity(
      productId,
      Number(input.getAttribute("data-quantity-number") || "1")
    );
  }

  input.dispatchEvent(new Event("change", { bubbles: true }));
};

// const onChange = () => {
//   const input = event!.currentTarget as HTMLInputElement;
//   console.log("Product Card:", input);
//   // // doidera!
//   // const input = event!.currentTarget as HTMLInputElement;
//   // const productId = input!
//   //   .closest("div[data-cart-item]")!
//   //   .getAttribute("data-item-id")!;
//   // const quantity = Number(input.value);
//   // if (!input.validity.valid) {
//   //   return;
//   // }
//   // window.STOREFRONT.CART.setQuantity(productId, quantity);
// };

function QuantitySelectorKg({
  id,
  disabled,
  ...props
}: JSX.IntrinsicElements["input"]) {
  return (
    <div class="join w-full flex gap-[7px]">
      <button
        type="button"
        class="w-[40px] h-[40px] bg-[#EBEAED] rounded-full	text-lg	flex justify-center items-center hover:opacity-80 ease-in-out duration-300"
        hx-on:click={useScript(onClick, -1)}
        disabled={disabled}
      >
        <Image
          src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/ebdd17e3-35f9-42a7-80ec-6489fae4aa14/menos.svg"
          width={20}
          height={20}
        />
      </button>
      <div
        //data-tip={`Quantity must be between ${props.min} and ${props.max}`}
        class={clx(
          "flex-grow join-item",
          "flex flex-col justify-center items-center",
          "has-[:invalid]:tooltip has-[:invalid]:tooltip-error has-[:invalid]:tooltip-open has-[:invalid]:tooltip-bottom"
        )}
      >
        <input
          id={id}
          class={clx(
            "input w-[100%] h-[40px] p-0 text-center flex-grow [appearance:textfield] border border-[#E3E3E3] rounded-[6px] text-[17px] font-bold",
            "invalid:input-error",
            "input-kg"
          )}
          disabled={disabled}
          type="text"
          readonly
          {...props}
        />
        <span
          id="unit-multiplier-msg"
          class="hidden text-xs text-[#646072] mt-1 text-center"
        >
          Aprox. 800g/unidade
        </span>
        <span
          id="unit-quantity-msg"
          class="hidden text-xs text-[#646072] text-center"
        >
          Aprox. 1 unidade(s) selecionada(s)
        </span>
      </div>
      <button
        type="button"
        class="w-[40px] h-[40px] bg-[#EBEAED] rounded-full	text-lg flex justify-center items-center hover:opacity-80 ease-in-out duration-300"
        hx-on:click={useScript(onClick, 1)}
        disabled={disabled}
      >
        <Image
          src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/dbd42389-3ec3-4160-946e-2370117e9b95/mais.svg"
          width={20}
          height={20}
        />
      </button>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, typeof id === "string" ? id : null),
        }}
      />
    </div>
  );
}
export default QuantitySelectorKg;
