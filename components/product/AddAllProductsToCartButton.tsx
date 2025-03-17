import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  // product: Product;
  // seller: string;
  // item: AnalyticsItem;
  // inputId: string;
  // modalPreviewMobile?: string;
}

interface AddToCartWishItem {
  id: string;
  quantity: number;
  seller: string;
}

// Dispara a função ao clicar no botão
const onClick = () => {
  const productCards = document.querySelectorAll(".product-card-wishlist");
  const productsToAdd: AddToCartWishItem[] = [];
  productCards.forEach((card) => {
    const dataItemElement = card.querySelector(".data-product-item");
    if (!dataItemElement) {
      return;
    }
    const { item, platformProps } = JSON.parse(
      decodeURIComponent(dataItemElement.getAttribute("data-cart-item") ?? "")
    );
    const inputTypeText =
      card.querySelector<HTMLInputElement>("input[type=text]");
    const inputTypeNumber =
      card!.querySelector<HTMLInputElement>("input[type=number]");

    let quantity = 1;

    if (inputTypeText) {
      quantity = parseInt(
        inputTypeText.getAttribute("data-quantity-number") ?? "1"
      );
    }

    if (inputTypeNumber) {
      quantity = parseInt(inputTypeNumber.value);
    }

    const productToAdd: AddToCartWishItem = {
      id: item.item_id,
      quantity: quantity,
      seller: platformProps.orderItems[0].seller,
    };
    productsToAdd.push(productToAdd);
  });
  if (productsToAdd.length > 0) {
    // Altere para sua loja
    let cartUrl = `${window.location.origin}/checkout/cart/add?`;

    productsToAdd.forEach((product, index) => {
      cartUrl += `sku=${product.id}&qty=${product.quantity}&seller=${product.seller}`;
      if (index < productsToAdd.length - 1) {
        cartUrl += "&";
      }
    });

    window.location.href = cartUrl;
  }
};

function AddAllProductsToCartButton(props: Props) {
  const { class: _class } = props;
  const id = useId();

  return (
    <div id={id} class="flex">
      {/* <input type="checkbox" class="hidden peer" /> */}

      <button
        type="button"
        data-attribute="add-to-cart"
        class={clx(_class?.toString())}
        hx-on:click={useScript(onClick)}
      >
        <Image
          src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/d4f85472-4e59-4bc7-a533-792824538320/Repeticao-de-grade-2.svg"
          alt="carrinho"
          width={16}
          height={16}
          //class="mt-[-3px]"
        />
        Adicionar Todos os Produtos
      </button>
    </div>
  );
}
export default AddAllProductsToCartButton;
