import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import Image from "apps/website/components/Image.tsx";

const onClick = (delta: number) => {
  // doidera!
  event!.stopPropagation();

  const button = event!.currentTarget as HTMLButtonElement;
  const input = button.parentElement?.querySelector<HTMLInputElement>(
    'input[type="number"]'
  )!;

  const min = Number(input.min) || -Infinity;
  const max = Number(input.max) || Infinity;

  input.value = `${Math.min(Math.max(input.valueAsNumber + delta, min), max)}`;

  const dataCartItem = input.closest("div[data-cart-item]");
  const dataFieldset = input.closest("fieldset");

  let productId = "";

  if (dataCartItem?.getAttribute("data-item-id")) {
    productId = dataCartItem.getAttribute("data-item-id")!;
  } else if (dataFieldset?.getAttribute("data-item-id")) {
    productId = dataFieldset.getAttribute("data-item-id")!;
  }

  if (productId) {
    window.STOREFRONT.CART.setQuantity(productId, Number(input.value));
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

function QuantitySelector({
  id = useId(),
  disabled,
  ...props
}: JSX.IntrinsicElements["input"]) {
  return (
    <div class="join flex-grow w-full h-[40px] flex gap-[7px]">
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
        data-tip={`Quantity must be between ${props.min} and ${props.max}`}
        class={clx(
          "flex-grow join-item",
          "flex justify-center items-center",
          "has-[:invalid]:tooltip has-[:invalid]:tooltip-error has-[:invalid]:tooltip-open has-[:invalid]:tooltip-bottom"
        )}
      >
        <input
          id={id}
          class={clx(
            "input text-center flex-grow [appearance:textfield] border border-[#E3E3E3] rounded-[6px] text-[17px] font-bold",
            "invalid:input-error"
          )}
          disabled={disabled}
          inputMode="numeric"
          type="number"
          {...props}
        />
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
    </div>
  );
}
export default QuantitySelector;
