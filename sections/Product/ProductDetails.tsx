import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDetails({ page }: Props) {
  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] pb-6">
      <div class="container custom-container flex flex-col gap-4 sm:gap-5 w-full sm:py-4 sm:py-5">
        <div class="px-4 sm:px-0">
          <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
        </div>

        <div
          class={clx(
            "container custom-conatiner grid",
            "grid-cols-1 gap-2 py-0",
            "sm:grid-cols-12 sm:gap-8"
          )}
        >
          <div class="sm:col-span-6 px-4 sm:px-0">
            <ImageGallerySlider page={page} />
          </div>
          <div class="sm:col-span-4 lg:ml-7 ">
            <ProductInfo page={page} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
