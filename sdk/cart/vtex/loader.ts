import { itemToAnalyticsItem } from "apps/vtex/hooks/useCart.ts";
import type a from "apps/vtex/loaders/cart.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { Minicart } from "../../../components/minicart/Minicart.tsx";
import type { Product } from "apps/commerce/types.ts";

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

  if (ctx) {
    const ids = items.map((item) => item.id);
    if (ids.length > 0) {
      const products: Product[] | null = await cartMiddleware2(ids, ctx);

      return {
        platformCart: form as unknown as Record<string, unknown>,
        storefront: {
          items: items.map((item, index) => {
            const detailUrl = new URL(item.detailUrl, url).href;

            if (item.measurementUnit == "kg") {
              if (products) {
                const correctListPrice = Number(
                  products[index].offers?.offers[0].priceSpecification[0].price
                    .toFixed(2)
                    .toString()
                    .replace(".", "")
                    .trim()
                );
                const correctPrice = Number(
                  products[index].offers?.offers[0].priceSpecification[1].price
                    .toFixed(2)
                    .toString()
                    .replace(".", "")
                    .trim()
                );

                item.sellingPrice = correctPrice;

                return {
                  ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
                  image: item.imageUrl,
                  listPrice: correctListPrice / 100,
                  measurementUnit: item.measurementUnit,
                };
              }
              return {
                ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
                image: item.imageUrl,
                listPrice: item.listPrice / 100,
                measurementUnit: item.measurementUnit,
              };
            }

            return {
              ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
              image: item.imageUrl,
              listPrice: item.listPrice / 100,
            };
          }),

          total: (total - discounts) / 100,
          subtotal: total / 100,
          discounts: discounts / 100,
          coupon: coupon,
          locale,
          currency,
          freeShippingTarget: 1000,
          checkoutHref: "/checkout",
        },
      };
    }
  }

  return {
    platformCart: form as unknown as Record<string, unknown>,
    storefront: {
      items: items.map((item, index) => {
        const detailUrl = new URL(item.detailUrl, url).href;

        if (item.measurementUnit == "kg") {
          if (products) {
            const correctListPrice = Number(
              products[index].offers?.offers[0].priceSpecification[0].price
                .toFixed(2)
                .toString()
                .replace(".", "")
                .trim()
            );
            const correctPrice = Number(
              products[index].offers?.offers[0].priceSpecification[1].price
                .toFixed(2)
                .toString()
                .replace(".", "")
                .trim()
            );

            item.sellingPrice = correctPrice;

            return {
              ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
              image: item.imageUrl,
              listPrice: correctListPrice / 100,
              measurementUnit: item.measurementUnit,
            };
          }
          return {
            ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
            image: item.imageUrl,
            listPrice: item.listPrice / 100,
            measurementUnit: item.measurementUnit,
          };
        }

        // console.log(item);
        // console.log({
        //   ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
        //   image: item.imageUrl,
        //   listPrice: item.listPrice / 100,
        // });

        return {
          ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
          image: item.imageUrl,
          listPrice: item.listPrice / 100,
        };
      }),

      total: (total - discounts) / 100,
      subtotal: total / 100,
      discounts: discounts / 100,
      coupon: coupon,
      locale,
      currency,
      freeShippingTarget: 1000,
      checkoutHref: "/checkout",
    },
  };
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
      { props: { ids: ids } }
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
    { props: { ids: ids } }
  );
  return responseProductList;
};

async function loader(
  _props: unknown,
  req: Request,
  ctx: AppContext
): Promise<Minicart> {
  const response = await ctx.invoke("vtex/loaders/cart.ts");

  const products: Product[] | null = await cartMiddleware(response, ctx);

  return cartFrom(response, req.url, undefined, products ?? undefined);
}

export default loader;
