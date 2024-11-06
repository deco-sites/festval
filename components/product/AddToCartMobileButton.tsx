import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  modalPreviewId: string;
}

const onClick = (modalPreviewId: string) => {
  event?.stopPropagation();

  const modal = document.getElementById(modalPreviewId);
  const children = modal?.querySelector<HTMLDivElement>("div");
  if (modal && children) {
    modal.classList.toggle("modal-open");
    children.classList.toggle("translate-y-[100%]");
  }
};

const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    container
      ?.querySelectorAll<HTMLButtonElement>("button")
      .forEach((node) => (node.disabled = false));
  });

  // const cart = window.STOREFRONT.CART.getCart();
  // if (cart) {
  //   // deno-lint-ignore no-explicit-any
  //   const item = cart.items.find((i) => (i as any).item_id === itemID);

  //   if (item) {
  //     const buttonAddToCart = container?.querySelector<HTMLButtonElement>(
  //       'button[data-attribute="add-to-cart"]'
  //     );

  //     if (buttonAddToCart) {
  //       buttonAddToCart.style.backgroundColor = "#fff";
  //       buttonAddToCart.style.color = "#3E3D41";
  //       buttonAddToCart.style.border = "1px solid  #989898";
  //       buttonAddToCart.innerText = "Adicionado ao carrinho";

  //       buttonAddToCart.disabled = true;
  //     }
  //   }
  // }
};

function AddToCartMobileButton(props: Props) {
  const { class: _class, modalPreviewId } = props;
  const id = useId();
  return (
    <div
      id={id}
      class="flex"
      //   data-item-id={product.productID}
      //   data-cart-item={encodeURIComponent(
      //     JSON.stringify({ item, platformProps })
      //   )}
    >
      {/* <input type="checkbox" class="hidden peer" /> */}

      <button
        disabled
        // data-item-id={product.productID}
        data-attribute="add-to-cart"
        class={clx("flex-grow", _class?.toString())}
        hx-on:click={useScript(onClick, modalPreviewId)}
      >
        <Image
          src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/d4f85472-4e59-4bc7-a533-792824538320/Repeticao-de-grade-2.svg"
          alt="carrinho"
          width={16}
          height={16}
        />
        Adicionar
      </button>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}
export default AddToCartMobileButton;
