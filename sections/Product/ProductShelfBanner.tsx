import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductBannerSlider from "../../components/product/ProductBannerSlider.tsx";
import Section, { Props as SectionHeaderProps } from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
export interface Props extends SectionHeaderProps {
  products: Product[] | null;
  banner?: ImageWidget;
  hrer?: string;
  bannerMb?: ImageWidget;
}
export default function ProductShelf({ products, banner, bannerMb, hrer, title, cta }: Props) {
  if (!products || products.length === 0) {
    return null;
  }
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...useOffer(product.offers),
          })
        ),
      },
    },
  });
  return (
    <Section.Container class="custom-container relative sm:!py-12" {...viewItemListEvent}>
      <a href={hrer} class={`flex md:hidden ${!bannerMb ? "hidden" : ""}`}>
        <Image src={bannerMb || ""} class=" h-full w-full object-contain" width={1080} height={500} alt={bannerMb} />
      </a>
      <Section.Header title={title} cta={cta} />
      <div>
        <div className="flex flex-row gap-5 w-full">
          <a href={hrer} class="hidden md:block">
            <Image src={banner || ""} class=" h-full object-contain" width={310} height={586} alt={banner} />
          </a>
          <ProductBannerSlider hasBanner={!!banner} products={products} itemListName={title} />
        </div>
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = ({ title, cta }: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="471px" />;
  </Section.Container>
);
