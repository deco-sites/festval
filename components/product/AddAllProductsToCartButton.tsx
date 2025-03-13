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
  modalPreviewMobile?: string;
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
const onClick = (inputId: string, modalPreviewMobile?: string) => {
  event?.stopPropagation();

  const input = document.getElementById(inputId);
  const productData: ProductData = JSON.parse(
    input!.getAttribute("data-product-data") ?? "{}"
  );
  const inputValue =
    productData.MeasurementUnit == "kg"
      ? input!.querySelector<HTMLInputElement>("input[type=text]")
      : input!.querySelector<HTMLInputElement>("input[type=number]");
  const container = input!.closest<HTMLDivElement>("div[data-cart-item]")!;

  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!)
  );

  if (!inputValue) return;
  item.quantity =
    productData.MeasurementUnit == "kg"
      ? Number(inputValue.getAttribute("data-quantity-number"))
      : Number(inputValue.value);
  window.STOREFRONT.CART.addToCart(item, platformProps, item.quantity);

  const button = event?.currentTarget as HTMLButtonElement | null;

  if (button) {
    button.style.backgroundColor = "#fff";
    button.style.color = "#3E3D41";
    button.style.border = "1px solid  #989898";
    button.innerText = "Adicionado ao carrinho";

    button.disabled = true;
  }

  if (modalPreviewMobile) {
    const modal = document.getElementById(modalPreviewMobile);
    const children = modal?.querySelector<HTMLDivElement>("div");
    if (children && !children.classList.contains("translate-y-[100%]")) {
      children.classList.add("translate-y-[100%]");
    }
    if (modal && modal.classList.contains("modal-open")) {
      modal.classList.remove("modal-open");
    }
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
function AddAllProductsToCartButton(props: Props) {
  const { product, item, class: _class, inputId, modalPreviewMobile } = props;
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
        hx-on:click={useScript(onClick, inputId, modalPreviewMobile)}
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
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}
export default AddAllProductsToCartButton;
