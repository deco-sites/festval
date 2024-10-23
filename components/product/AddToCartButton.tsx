import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
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
  // const button = event?.currentTarget as HTMLButtonElement | null;
  // const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;

  const input = document.getElementById(inputId);
  const inputValue = input!.querySelector<HTMLInputElement>("input[type=number]");
  const container = input!.closest<HTMLDivElement>("div[data-cart-item]")!;

  const { item, platformProps } = JSON.parse(decodeURIComponent(container.getAttribute("data-cart-item")!));
  if (!inputValue) return;
  item.quantity = Number(inputValue.value);
  console.log("Add to cart", item, item.quantity);
  const productId = inputValue!.closest("div[data-cart-item]")!.getAttribute("data-item-id")!;
  window.STOREFRONT.CART.addToCart(item, platformProps);
  window.STOREFRONT.CART.setQuantity(item.item_id, item.quantity);
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
    container?.querySelectorAll<HTMLButtonElement>("button").forEach((node) => (node.disabled = false));
    container?.querySelectorAll<HTMLButtonElement>("input").forEach((node) => (node.disabled = false));
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
      attributes: Object.fromEntries(additionalProperty.map(({ name, value }) => [name, value])),
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
      attributes: Object.fromEntries(additionalProperty.map(({ name, value }) => [name, value])),
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
      data-cart-item={encodeURIComponent(JSON.stringify({ item, platformProps }))}
    >
      {/* <input type="checkbox" class="hidden peer" /> */}

      <button disabled class={clx("flex-grow", _class?.toString())} hx-on:click={useScript(onClick, inputId)}>
        <Icon id="cart-white" />
        Adicionar ao carrinho
      </button>
      <script type="module" dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }} />
    </div>
  );
}
export default AddToCartButton;
