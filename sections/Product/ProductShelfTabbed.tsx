import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { SectionProps } from "@deco/deco";
import { AppContext } from "../../apps/site.ts";
import { getCookies } from "std/http/cookie.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
/** @titleBy title */
interface Tab {
  title: string;
  products: Product[] | null;
}
export interface Props extends SectionHeaderProps {
  tabs: Tab[];
  /** @hide true */
  tabIndex?: number;
  /**
   * @hide
   */
  region?: string;
}

export const loader = (
  { tabs, title, cta, tabIndex, region }: Props,
  req: Request,
  _ctx: AppContext
) => {
  const cookies = getCookies(req.headers);
  const regionCookie = cookies["region"];

  region = regionCookie ?? "";

  return { tabs, title, cta, tabIndex, region };
};

export default function TabbedProductShelf({
  tabs,
  title,
  cta,
  tabIndex,
  region,
}: SectionProps<typeof loader>) {
  const ti =
    typeof tabIndex === "number"
      ? Math.min(Math.max(tabIndex, 0), tabs.length)
      : 0;
  const { products } = tabs[ti];
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items:
          products?.map((product, index) =>
            mapProductToAnalyticsItem({
              index,
              product,
              ...useOffer(product.offers),
            })
          ) ?? [],
      },
    },
  });
  return (
    <Section.Container {...viewItemListEvent}>
      <Section.Header title={title} cta={cta} />

      <Section.Tabbed>
        {!products?.length ? (
          <div class="flex justify-center items-center">No Products found</div>
        ) : (
          <ProductSlider
            products={products}
            itemListName={title}
            region={region}
          />
        )}
      </Section.Tabbed>
    </Section.Container>
  );
}
export const LoadingFallback = ({
  title,
  cta,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />

    <Section.Tabbed>
      <>
        <Section.Placeholder height="471px" />;
      </>
    </Section.Tabbed>
  </Section.Container>
);
