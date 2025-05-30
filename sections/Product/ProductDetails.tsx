import type { Product } from "apps/commerce/types.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import ProductShelfSimilar from "./ProductShelfSimilar.tsx";
import { SectionProps } from "@deco/deco";
import { AppContext } from "../../apps/site.ts";
import { getCookies } from "std/http/cookie.ts";
import Separator from "../separator.tsx";
import { useScript } from "@deco/deco/hooks";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  /** @hide  */
  similarProducts: Product[] | null;
  /** @title Similar Products count */
  count: number;
  /** @title Similar Products title */
  titleSimilar?: string;
  /** @title Similar Products cta */
  ctaSimilar?: string;
  /**
   * @hide
   */
  region?: string;
}

function formatarString(category: string | undefined) {
  if (!category) return "";
  return category.toLowerCase().replace(/>/g, " ");
}

export const loader = async (
  { page, similarProducts, count, titleSimilar, ctaSimilar, region }: Props,
  req: Request,
  ctx: AppContext
) => {
  const cookies = getCookies(req.headers);
  const regionCookie = cookies["region"];

  region = regionCookie ?? "";

  if (!page) return { page, similarProducts, titleSimilar, ctaSimilar, region };

  const { product } = page;

  const category = formatarString(product.category);

  let props;

  if (category.includes("páscoa")) {
    props = {
      query: category,
      sort: "",
      count: count,
    };
  } else {
    props = {
      query: category,
      sort: "orders:desc",
      count: count,
    };
  }

  // deno-lint-ignore no-explicit-any
  const response = await (ctx as any).invoke(
    "vtex/loaders/intelligentSearch/productList.ts",
    {
      props: { ...props },
    }
  );

  similarProducts = response;

  return { page, similarProducts, titleSimilar, ctaSimilar, region };
};

const onLoad = (product: Product) => {
  const ccs_cc_args = [];

  // Página do Produto
  ccs_cc_args.push(["cpn", product.productID]);
  ccs_cc_args.push(["mf", product.brand?.name]);
  ccs_cc_args.push(["pn", product.gtin]);
  ccs_cc_args.push(["upcean", product.gtin]);
  ccs_cc_args.push(["ccid", product.sku]);
  ccs_cc_args.push(["lang", "PT"]);
  ccs_cc_args.push(["market", "BR"]);

  (function () {
    const o = ccs_cc_args;
    o.push(["_SKey", "692a8c55"]);
    o.push(["_ZoneId", "7885526c4e"]);
    const sc = document.createElement("script");
    sc.type = "text/javascript";
    sc.async = true;
    sc.src =
      ("https:" == document.location.protocol ? "https://" : "http://") +
      "cdn.cs.1worldsync.com/jsc/h1ws.js";
    const n = document.getElementsByTagName("script")[0];
    n.parentNode?.insertBefore(sc, n);
  })();
};

export default function ProductDetails({
  page,
  similarProducts,
  titleSimilar,
  ctaSimilar,
  region,
}: SectionProps<typeof loader>) {
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
    <div className="bg-[#FFF] pb-6">
      <div class="container custom-container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5">
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
          <div class="sm:col-span-5 lg:ml-7 ">
            <ProductInfo page={page} region={region} />
          </div>
        </div>
        <Separator />
        <div class="container custom-container">
          <ProductShelfSimilar
            products={similarProducts}
            title={titleSimilar}
            cta={ctaSimilar}
          />
        </div>
      </div>

      <div id="ccs-wsf-content"></div>
      <div id="ccs-logos"></div>
      <div id="ccs-wsi-content"></div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, page.product),
        }}
      />
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
