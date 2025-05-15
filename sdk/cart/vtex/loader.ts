import type { Product } from "apps/commerce/types.ts";
import { itemToAnalyticsItem } from "apps/vtex/hooks/useCart.ts";
import type a from "apps/vtex/loaders/cart.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { getCookies } from "std/http/cookie.ts";
import { Minicart } from "../../../components/minicart/Minicart.tsx";

export type Cart = Awaited<ReturnType<typeof a>>;

export const cartFrom = async (
  form: Cart,
  url: string,
  ctx?: AppContext,
  products?: Product[]
): Promise<Minicart> => {
  const { items, totalizers } = form ?? { items: [] };
  const total = totalizers?.find((item) => item.id === "Items")?.value || 0;
  const discounts =
    (totalizers?.find((item) => item.id === "Discounts")?.value || 0) * -1;
  const locale = form?.clientPreferencesData.locale ?? "pt-BR";
  const currency = form?.storePreferencesData.currencyCode ?? "BRL";
  const coupon = form?.marketingData?.coupon ?? undefined;

  // Deno.writeTextFileSync("b.json", JSON.stringify(items));

  let minicart: Minicart;

  if (ctx) {
    const ids = items.map((item) => item.id);
    if (ids.length > 0) {
      const products: Product[] | null = await cartMiddleware2(ids, ctx);

      minicart = {
        platformCart: form as unknown as Record<string, unknown>,
        storefront: {
          items: items.map((item, index) => {
            const detailUrl = new URL(item.detailUrl, url).href;

            // if (!item.isGift) {
            if (item.measurementUnit === "kg") {
              if (products) {
                const correctListPrice = Number(
                  products[index]?.offers?.offers[0].priceSpecification[0].price
                    .toFixed(2)
                    .toString()
                    .replace(".", "")
                    .trim()
                );
                const correctPrice = Number(
                  products[index]?.offers?.offers[0].priceSpecification[1].price
                    .toFixed(2)
                    .toString()
                    .replace(".", "")
                    .trim()
                );

                item.price = correctPrice;
                item.sellingPrice = correctPrice;
                item.listPrice = correctListPrice;

                return {
                  ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
                  image: item.imageUrl,
                  listPrice: correctListPrice / 100,
                  unitMultiplier: item.unitMultiplier,
                  measurementUnit: item.measurementUnit,
                };
              }
              return {
                ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
                image: item.imageUrl,
                listPrice: item.listPrice / 100,
                unitMultiplier: item.unitMultiplier,
                measurementUnit: item.measurementUnit,
              };
            }

            if (products) {
              const correctListPrice = Number(
                products[index]?.offers?.offers?.[0].priceSpecification[0].price
                  .toFixed(2)
                  .toString()
                  .replace(".", "")
                  .trim() || ""
              );
              const correctPrice = Number(
                products[index]?.offers?.offers?.[0].priceSpecification[1].price
                  .toFixed(2)
                  .toString()
                  .replace(".", "")
                  .trim() || ""
              );

              item.price = correctPrice;
              item.sellingPrice = correctPrice;
              item.listPrice = correctListPrice;

              return {
                ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
                image: item.imageUrl,
                listPrice: correctListPrice / 100,
                unitMultiplier: item.unitMultiplier,
                measurementUnit: item.measurementUnit,
              };
            }
            // }
            return {
              ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
              image: item.imageUrl,
              unitMultiplier: item.unitMultiplier,
              listPrice: item.listPrice / 100,
            };
          }),

          total: (total - discounts) / 100,
          subtotal: total / 100,
          discounts: discounts / 100,
          coupon,
          locale,
          currency,
          freeShippingTarget: 1000,
          checkoutHref: "/checkout",
        },
      };
    }
  }

  minicart = {
    platformCart: form as unknown as Record<string, unknown>,
    storefront: {
      items: items.map((item, index) => {
        const detailUrl = new URL(item.detailUrl, url).href;

        // if (!item.isGift) {
        if (item.measurementUnit === "kg") {
          if (products) {
            const correctListPrice = Number(
              products[index]?.offers?.offers[0].priceSpecification[0].price
                .toFixed(2)
                .toString()
                .replace(".", "")
                .trim()
            );
            const correctPrice = Number(
              products[index]?.offers?.offers[0].priceSpecification[1].price
                .toFixed(2)
                .toString()
                .replace(".", "")
                .trim()
            );

            item.price = correctPrice;
            item.sellingPrice = correctPrice;
            item.listPrice = correctListPrice;

            return {
              ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
              image: item.imageUrl,
              listPrice: correctListPrice / 100,
              unitMultiplier: item.unitMultiplier,
              measurementUnit: item.measurementUnit,
            };
          }
          return {
            ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
            image: item.imageUrl,
            listPrice: item.listPrice / 100,
            unitMultiplier: item.unitMultiplier,
            measurementUnit: item.measurementUnit,
          };
        }

        if (products) {
          const correctListPrice = Number(
            products[index]?.offers?.offers[0].priceSpecification[0].price
              .toFixed(2)
              .toString()
              .replace(".", "")
              .trim()
          );
          const correctPrice = Number(
            products[index]?.offers?.offers[0].priceSpecification[1].price
              .toFixed(2)
              .toString()
              .replace(".", "")
              .trim()
          );

          item.price = correctPrice;
          item.sellingPrice = correctPrice;
          item.listPrice = correctListPrice;

          return {
            ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
            image: item.imageUrl,
            listPrice: correctListPrice / 100,
          };
        }
        // }

        return {
          ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
          image: item.imageUrl,
          listPrice: item.listPrice / 100,
        };
      }),

      total: (total - discounts) / 100,
      subtotal: total / 100,
      discounts: discounts / 100,
      coupon,
      locale,
      currency,
      freeShippingTarget: 1000,
      checkoutHref: "/checkout",
    },
  };

  let correctTotal: number = 0;

  minicart.storefront.items.forEach((item) => {
    const itemPrice = Math.round((item.price || 0) * 100);
    if (item.measurementUnit === "kg") {
      correctTotal += itemPrice * item.unitMultiplier * item.quantity;
    } else {
      correctTotal += itemPrice * item.quantity;
    }
  });

  if (
    Array.isArray(minicart.platformCart.totalizers) &&
    typeof minicart.platformCart.totalizers[0]?.value === "number"
  ) {
    minicart.platformCart.totalizers[0].value = correctTotal - discounts;
  } else {
    console.error("Totalizers não está no formato esperado.");
  }

  if (Array.isArray(minicart.platformCart.items)) {
    minicart.platformCart.items.map((item, index) => {
      item.priceDefinition.calculatedSellingPrice = Math.round(
        (minicart.storefront.items[index].price || 0) * 100
      );
      item.priceDefinition.total = Math.round(
        (minicart.storefront.items[index].price || 0) * 100
      );
      item.priceDefinition.sellingPrices[0].value = Math.round(
        (minicart.storefront.items[index].price || 0) * 100
      );
      return item;
    });
  }

  minicart.storefront.total = Math.floor(correctTotal - discounts) / 100;
  minicart.storefront.subtotal = Math.floor(correctTotal) / 100;

  return minicart;
};

export const cartMiddleware = async (
  form: Cart,
  ctx: AppContext
): Promise<Product[] | null> => {
  const { items } = form ?? { items: [] };
  const ids = items.map((item) => item.id);
  if (ids.length > 0) {
    const responseProductList = await ctx.invoke(
      "vtex/loaders/intelligentSearch/productList.ts",
      { props: { ids } }
    );
    return responseProductList;
  }
  return null;
};

export const cartMiddleware2 = async (
  ids: string[],
  ctx: AppContext
): Promise<Product[] | null> => {
  const responseProductList = await ctx.invoke(
    "vtex/loaders/intelligentSearch/productList.ts",
    { props: { ids } }
  );
  // console.log(ids, responseProductList);
  return responseProductList;
};

const setPostalCode = async (req: Request, platformCart: any) => {
  const cookies = getCookies(req.headers);
  const postalCode = cookies["vtex_last_session_cep"];

  if (!postalCode) return;

  try {
    const url = `https://meufestval.vtexcommercestable.com.br/api/checkout/pub/orderForm/${platformCart.orderFormId}/attachments/shippingData`;

    const payload = {
      address: {
        postalCode,
        country: "BRA",
        city: null,
        state: null,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to set postal code: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

async function loader(
  _props: unknown,
  req: Request,
  ctx: AppContext
): Promise<Minicart> {
  const response = await ctx.invoke("vtex/loaders/cart.ts");
  const products: Product[] | null = await cartMiddleware(response, ctx);
  setPostalCode(req, response);
  return cartFrom(response, req.url, undefined, products ?? undefined);
}

export default loader;
