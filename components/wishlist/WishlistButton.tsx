import { AnalyticsItem } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
interface Props {
  variant?: "full" | "icon";
  item: AnalyticsItem;
}
const onLoad = (id: string, productID: string) =>
  window.STOREFRONT.WISHLIST.subscribe((sdk) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    const inWishlist = sdk.inWishlist(productID);
    button.disabled = false;
    button.classList.remove("htmx-request");
    button.querySelector("svg")?.setAttribute("fill", inWishlist ? "black" : "none");
    const span = button.querySelector("span");
    if (span) {
      span.innerHTML = inWishlist ? "Remover dos favoritos" : "Tornar Favorito";
    }
  });
const onClick = (productID: string, productGroupID: string) => {
  const button = event?.currentTarget as HTMLButtonElement;
  const user = window.STOREFRONT.USER.getUser();
  if (user?.email) {
    button.classList.add("htmx-request");
    window.STOREFRONT.WISHLIST.toggle(productID, productGroupID);
  } else {
    window.alert(`Por favor, faça login para adicionar o produto à sua lista de desejos.`);
  }
};
function WishlistButton({ item, variant = "full" }: Props) {
  // deno-lint-ignore no-explicit-any
  const productID = (item as any).item_id;
  const productGroupID = item.item_group_id ?? "";
  const id = useId();
  const addToWishlistEvent = useSendEvent({
    on: "click",
    event: {
      name: "add_to_wishlist",
      params: { items: [item] },
    },
  });
  return (
    <>
      <button
        id={id}
        data-wishlist-button
        disabled
        {...addToWishlistEvent}
        aria-label="Tornar Favorito"
        hx-on:click={useScript(onClick, productID, productGroupID)}
        class={clx(
          "btn no-animation",
          variant === "icon"
            ? "btn-circle border-none shadow-inherit btn-sm bg-white opacity-90 hover:opacity-100 hover:bg-white hover:border-none"
            : "rounded btn-accent p-0 bg-transparent opacity-100 hover:opacity-90 hover:bg-transparent  border-none shadow-inherit font-normal gap-2 w-full text-[#646072]"
        )}
      >
        <Icon id="favorite" class="[.htmx-request_&]:hidden" fill="none" />
        {variant === "full" && <span class="[.htmx-request_&]:hidden">Tornar Favorito</span>}

        <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
      </button>
      <script type="module" dangerouslySetInnerHTML={{ __html: useScript(onLoad, id, productID) }} />
    </>
  );
}
export default WishlistButton;
