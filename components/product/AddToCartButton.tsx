import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Image from "apps/website/components/Image.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  inputId: string;
}
const onClick = (inputId: string) => {
  event?.stopPropagation();

  const input = document.getElementById(inputId);
  const inputValue =
    input!.querySelector<HTMLInputElement>("input[type=number]");
  const container = input!.closest<HTMLDivElement>("div[data-cart-item]")!;

  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!)
  );
  if (!inputValue) return;
  item.quantity = Number(inputValue.value);
  window.STOREFRONT.CART.addToCart(item, platformProps, item.quantity);

  const button = event?.currentTarget as HTMLButtonElement | null;

  if (button) {
    button.style.backgroundColor = "#fff";
    button.style.color = "#3E3D41";
    button.style.border = "1px solid  #989898";
    button.innerText = "Adicionado ao carrinho";

    button.disabled = true;
  }
};

// Copy cart form values into AddToCartButton
const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    // const checkbox = container?.querySelector<HTMLInputElement>(
    //   'input[type="checkbox"]'
    // );
    //const itemID = container?.getAttribute("data-item-id")!;
    // const quantity = sdk.getQuantity(itemID) || 0;
    // if (!checkbox) {
    //   return;
    // }
    // checkbox.checked = quantity > 0;
    // enable interactivity
    container
      ?.querySelectorAll<HTMLButtonElement>("button")
      .forEach((node) => (node.disabled = false));
    container
      ?.querySelectorAll<HTMLButtonElement>("input")
      .forEach((node) => (node.disabled = false));
  });
};
const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;
  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }
  if (platform === "shopify") {
    return { lines: { merchandiseId: productID } };
  }
  if (platform === "vnda") {
    return {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value])
      ),
    };
  }
  if (platform === "wake") {
    return {
      productVariantId: Number(productID),
      quantity: 1,
    };
  }
  if (platform === "nuvemshop") {
    return {
      quantity: 1,
      itemId: Number(productGroupID),
      add_to_cart_enhanced: "1",
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value])
      ),
    };
  }
  if (platform === "linx") {
    return {
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: 1,
    };
  }
  return null;
};
function AddToCartButton(props: Props) {
  const { product, item, class: _class, inputId } = props;
  const platformProps = useAddToCart(props);
  const id = useId();

  return (
    <div
      id={id}
      class="flex"
      data-item-id={product.productID}
      data-cart-item={encodeURIComponent(
        JSON.stringify({ item, platformProps })
      )}
    >
      {/* <input type="checkbox" class="hidden peer" /> */}

      <button
        disabled
        data-item-id={product.productID}
        data-attribute="add-to-cart"
        class={clx("flex-grow", _class?.toString())}
        hx-on:click={useScript(onClick, inputId)}
      >
        <Image
          src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/d4f85472-4e59-4bc7-a533-792824538320/Repeticao-de-grade-2.svg"
          alt="carrinho"
          width={16}
          height={16}
          //class="mt-[-3px]"
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
export default AddToCartButton;
