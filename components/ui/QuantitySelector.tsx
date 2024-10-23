import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
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
  const productId = input!
    .closest("div[data-cart-item]")!
    .getAttribute("data-item-id")!;
  window.STOREFRONT.CART.setQuantity(productId, Number(input.value));
  input.dispatchEvent(new Event("change", { bubbles: true }));
};
function QuantitySelector({
  id = useId(),
  disabled,
  ...props
}: JSX.IntrinsicElements["input"]) {
  return (
    <div class="join w-full h-[40px] flex gap-[7px]">
      <button
        type="button"
        class="w-[40px] h-[40px] bg-[#EBEAED] rounded-full	text-lg	"
        hx-on:click={useScript(onClick, -1)}
        disabled={disabled}
      >
        -
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
        class="w-[40px] h-[40px] bg-[#EBEAED] rounded-full	text-lg	"
        hx-on:click={useScript(onClick, 1)}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}
export default QuantitySelector;
