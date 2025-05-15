import { AppContext } from "../../apps/site.ts";
import { MINICART_DRAWER_ID, MINICART_FORM_ID } from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useComponent } from "../../sections/Component.tsx";
import Icon from "../ui/Icon.tsx";
import FreeShippingProgressBar from "./FreeShippingProgressBar.tsx";
import CartItem, { Item } from "./Item.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Minicart {
  /** Cart from the ecommerce platform */
  platformCart: Record<string, unknown>;
  /** Cart from storefront. This can be changed at your will */
  storefront: {
    items: Item[];
    total: number;
    subtotal: number;
    discounts: number;

    locale: string;
    currency: string;

    freeShippingTarget: number;
    checkoutHref: string;
  };
}
const onLoad = (formID: string) => {
  const form = document.getElementById(formID) as HTMLFormElement;
  window.STOREFRONT.CART.dispatch(form);
  // view_cart event
  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver((items, observer) => {
      for (const item of items) {
        if (item.isIntersecting && item.target === form) {
          window.DECO.events.dispatch({
            name: "view_cart",
            params: window.STOREFRONT.CART.getCart(),
          });
          observer?.unobserve(item.target);
        }
      }
    }).observe(form);
  }
  // Disable form interactivity while cart is being submitted
  document.body.addEventListener(
    "htmx:before-send", // deno-lint-ignore no-explicit-any
    ({ detail: { elt } }: any) => {
      if (elt !== form) {
        return;
      }
      // Disable addToCart button interactivity
      document.querySelectorAll("div[data-cart-item]").forEach((container) => {
        container?.querySelectorAll("button").forEach((node) => (node.disabled = true));
        container?.querySelectorAll("input").forEach((node) => (node.disabled = true));
      });
    }
  );
};
const sendBeginCheckoutEvent = () => {
  window.DECO.events.dispatch({
    name: "being_checkout",
    params: window.STOREFRONT.CART.getCart(),
  });
};
export const action = async (_props: unknown, req: Request, ctx: AppContext) =>
  req.method === "PATCH"
    ? { cart: await ctx.invoke("site/loaders/minicart.ts") } // error fallback
    : { cart: await ctx.invoke("site/actions/minicart/submit.ts") };
export function ErrorFallback(){

  return (
    <div class="flex flex-col flex-grow justify-center items-center overflow-hidden w-full gap-2">
      <div class="flex flex-col gap-1 p-6 justify-center items-center">
        <span class="font-semibold">Erro ao atualizar carrinho</span>
        <span class="text-sm text-center">Clique no botão abaixo para tentar novamente ou atualizar a página</span>
      </div>

      <button class="btn btn-primary" hx-patch={useComponent(import.meta.url)} hx-swap="outerHTML" hx-target="closest div">
        Tentar novamente
      </button>
    </div>
  );
}
export default function Cart({
  cart: {
    platformCart,
    storefront: {
      items,
      total,
      subtotal,

      discounts,
      locale,
      currency,

      freeShippingTarget,
      checkoutHref,
    },
  },
}: {
  cart: Minicart;
}) {
  const count = items.length;

  return (
    <>
      <form
        class="contents"
        id={MINICART_FORM_ID}
        hx-sync="this:replace"
        hx-trigger="submit, change delay:300ms"
        hx-target="this"
        hx-indicator="this"
        hx-disabled-elt="this"
        hx-post={useComponent(import.meta.url)}
        hx-swap="outerHTML"
      >
        {/* Button to submit the form */}
        <button hidden autofocus />

        {/* Add to cart controllers */}
        <input name="add-to-cart" type="hidden" />
        <button hidden name="action" value="add-to-cart" />

        {/* This contains the STOREFRONT cart. */}
        <input
          type="hidden"
          name="storefront-cart"
          value={encodeURIComponent(JSON.stringify({ currency, value: total, items }))}
        />

        {/* This contains the platformCart cart from the commerce platform. Integrations usually use this value, like GTM, pixels etc */}
        <input type="hidden" name="platform-cart" value={encodeURIComponent(JSON.stringify(platformCart))} />

        <div
          class={clx(
            "flex flex-col flex-grow justify-center items-center overflow-hidden w-full",
            "[.htmx-request_&]:pointer-events-none [.htmx-request_&]:opacity-60 [.htmx-request_&]:cursor-wait transition-opacity duration-300"
          )}
        >
          {count === 0 ? (
            <div class="flex flex-col gap-6">
              <span class="font-medium text-2xl">Seu carrinho está vazio</span>
              <label for={MINICART_DRAWER_ID} class="btn btn-outline no-animation">
                Escolha produtos
              </label>
            </div>
          ) : (
            <>
              {/* Free Shipping Bar
              <div class="p-4 w-full">
                <FreeShippingProgressBar
                  total={total}
                  locale={locale}
                  currency={currency}
                  target={freeShippingTarget}
                />
              </div> */}

              {/* Cart Items */}
              <ul role="list" class="mt-6 px-2 flex-grow overflow-y-auto flex flex-col gap-6 w-full">
                {items.map((item, index) => (
                  <li>
                    <CartItem item={item} index={index} locale={locale} currency={currency} />
                  </li>
                ))}
              </ul>

              {/* Cart Footer */}
              <footer class="w-full border-t border-[#d8d8d886]">
                {/* Subtotal */}
                <div class="border-t border-base-200 py-2 flex flex-col gap-3">
                  <div class="w-full flex justify-between px-4 text-sm ">
                    <span>Subtotal</span>
                    <output form={MINICART_FORM_ID}>{formatPrice(subtotal, currency, locale)}</output>
                  </div>
                  {discounts > 0 && (
                    <div class="flex justify-between items-center px-4">
                      <span class="text-sm">Descontos</span>
                      <span class="text-sm">-{formatPrice(discounts, currency, locale)}</span>
                    </div>
                  )}
                  <div class="w-full flex justify-between px-4 text-base  text-lg sm:text-xl">
                    <span class="font-semibold">Total</span>
                    <output form={MINICART_FORM_ID}>{formatPrice(total, currency, locale)}</output>
                  </div>
                </div>

                {/* Total */}
                {/* <div class="border border-[#d8d8d8] p-2 flex flex-row justify-end  items-center gap-3 mx-4">
                  <Icon id="info" class="w-5" />
                  <span class="text-sm text-base-300 w-11/12">
                    A troca de CEP ou forma de entraga pode alterar os preços e disponibulidade dos produtos
                  </span>
                </div> */}

                <div class="p-4">
                  <a
                    class="btn btn-primary rounded  items-center  px-2 w-full no-animation"
                    href={checkoutHref}
                    hx-on:click={useScript(sendBeginCheckoutEvent)}
                  >
                    <span class="[.htmx-request_&]:hidden font-medium flex justify-center w-full items-center">
                      Fechar pedido
                    </span>
                    <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
                  </a>
                </div>
              </footer>
            </>
          )}
        </div>
      </form>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, MINICART_FORM_ID),
        }}
      />
    </>
  );
}
