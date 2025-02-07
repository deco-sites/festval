import type {
  ProductListingPage,
  PageInfo,
  Product,
} from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import Filters from "./Filters.tsx";
import FiltersMb from "../../islands/FiltersMb.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/MenuMobileDrawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import { type SectionProps } from "@deco/deco";
import Image from "apps/website/components/Image.tsx";
export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}
export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  layout?: Layout;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /** @hidden */
  partial?: "hideMore" | "hideLess";
  /** @description Termo de busca */
  searchTerm?: string;
}

let accumulatedProducts: Product[] = [];

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Nenhum produto encontrado!</span>
    </div>
  );
}
const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};

const onLoad = (id: string, record: number, pageInfo: PageInfo) => {
  const container = document.getElementById(id);
  const sentinel = document.getElementById("sentinel");
  const btnFoward = container?.querySelector(".btn-next") as HTMLButtonElement;

  function validateGoNext(): boolean {
    if (
      pageInfo.currentPage * (pageInfo.recordPerPage ?? 12) >= record - 1 ||
      pageInfo.currentPage === 50
    ) {
      return false;
    } else {
      return true;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (validateGoNext()) {
            if (window.location.href.includes("discount%3Adesc")) {
              const productsCards = document.querySelectorAll(".product-card");
              productsCards.forEach((card) => {
                card.remove();
              });
            }
            btnFoward.click();
          }
        }
      });
    },
    { rootMargin: "100px" }
  );

  if (sentinel) observer.observe(sentinel);
};

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";
  const id = useId();
  const isDiscountSorted = url.includes("discount%3Adesc");

  console.log(accumulatedProducts);

  return (
    <>
      {isDiscountSorted && products.length > 12 ? (
        <div>
          <div
            data-product-list
            className={clx(
              "grid items-center",
              "grid-cols-2 gap-2",
              "sm:grid-cols-4 sm:gap-10",
              "w-full"
            )}
          >
            {products?.map((product, index) => (
              <ProductCard
                key={`product-card-${product.productID}`}
                product={product}
                preload={index === 0}
                index={offset + index}
                class="h-full min-w-[160px] max-w-[300px] product-card"
              />
            ))}
          </div>

          <div className={clx("w-full")}>
            {infinite ? (
              <div className="flex justify-center [&_section]:contents">
                <a
                  rel="next"
                  className={clx(
                    "btn btn-ghost btn-next",
                    (!nextPageUrl || partial === "hideMore") && "hidden"
                  )}
                  hx-swap="outerHTML show:parent:top"
                  hx-get={partialNext}
                >
                  <span className="inline [.htmx-request_&]:hidden"></span>
                  <span className="loading loading-spinner hidden [.htmx-request_&]:block" />
                </a>
              </div>
            ) : (
              <div className={clx("join", infinite && "hidden")}>
                <a
                  rel="prev"
                  aria-label="previous page link"
                  href={prevPageUrl ?? "#"}
                  disabled={!prevPageUrl}
                  className="btn btn-ghost join-item"
                >
                  <Icon id="chevron-right" className="rotate-180" />
                </a>
                <span className="btn btn-ghost join-item">
                  Page {zeroIndexedOffsetPage + 1}
                </span>
                <a
                  rel="next"
                  aria-label="next page link"
                  href={nextPageUrl ?? "#"}
                  disabled={!nextPageUrl}
                  className="btn btn-ghost join-item"
                >
                  <Icon id="chevron-right" />
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          id={id}
          class="grid grid-flow-row grid-cols-1 place-items-center page-result"
        >
          <div
            class={clx(
              "pb-2 sm:pb-10",
              (!prevPageUrl || partial === "hideLess") && "hidden"
            )}
          >
            <a
              rel="prev"
              class="btn btn-ghost"
              hx-swap="outerHTML show:parent:top"
              hx-get={partialPrev}
            >
              <span class="inline [.htmx-request_&]:hidden">Show Less</span>
              <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
            </a>
          </div>

          <div
            data-product-list
            class={clx(
              "grid items-center",
              "grid-cols-2 gap-2",
              "sm:grid-cols-4 sm:gap-10",
              "w-full"
            )}
          >
            {products?.map((product, index) => (
              <ProductCard
                key={`product-card-${product.productID}`}
                product={product}
                preload={index === 0}
                index={offset + index}
                class="h-full min-w-[160px] max-w-[300px] product-card"
              />
            ))}
          </div>

          <div class={clx("pt-2 sm:pt-10 w-full", "")}>
            {infinite ? (
              <div class="flex justify-center [&_section]:contents">
                <a
                  rel="next"
                  class={clx(
                    "btn btn-ghost btn-next",
                    (!nextPageUrl || partial === "hideMore") && "hidden"
                  )}
                  hx-swap="outerHTML show:parent:top"
                  hx-get={partialNext}
                >
                  <span class="inline [.htmx-request_&]:hidden"></span>
                  <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
                </a>
              </div>
            ) : (
              <div class={clx("join", infinite && "hidden")}>
                <a
                  rel="prev"
                  aria-label="previous page link"
                  href={prevPageUrl ?? "#"}
                  disabled={!prevPageUrl}
                  class="btn btn-ghost join-item"
                >
                  <Icon id="chevron-right" class="rotate-180" />
                </a>
                <span class="btn btn-ghost join-item">
                  Page {zeroIndexedOffsetPage + 1}
                </span>
                <a
                  rel="next"
                  aria-label="next page link"
                  href={nextPageUrl ?? "#"}
                  disabled={!nextPageUrl}
                  class="btn btn-ghost join-item"
                >
                  <Icon id="chevron-right" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const setPageQuerystring = (page: string, id: string) => {
  const element = document
    .getElementById(id)
    ?.querySelector("[data-product-list]");
  if (!element) {
    return;
  }
  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial, searchTerm } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...useOffer(product.offers),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });
  const results = (
    <span className="text-sm font-normal">
      {page?.pageInfo?.recordPerPage && page?.pageInfo?.records
        ? page.pageInfo.recordPerPage >= page.pageInfo.records
          ? page.pageInfo.records
          : page.pageInfo.recordPerPage
        : 0}{" "}
      de {page?.pageInfo?.records ?? 0} resultados
    </span>
  );
  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );
  return (
    <>
      <div id={container} {...viewItemListEvent} class="w-full ">
        {partial ? (
          <PageResult {...props} />
        ) : (
          <div class="container  custom-container  flex flex-col gap-4 sm:gap-5 w-full py-2 sm:py-2 px-2 sm:px-0">
            {!searchTerm && (
              <div class="flex md:gap-10 items-center">
                <Breadcrumb itemListElement={breadcrumb?.itemListElement} />
              </div>
            )}
            {searchTerm && (
              <div class="text-sm text-[#646072] flex flex-col  lg:hidden">
                Você buscou por{" "}
                <span class="font-normal capitalize text-[#282828] md:text-lg text-3xl">
                  {searchTerm}
                </span>
              </div>
            )}

            {device === "mobile" && (
              <Drawer
                id={controls}
                aside={
                  <div class="bg-[#f8f8f8] flex flex-col w-full  gap-4 h-full overflow-y-hidden">
                    <div class="bg-base-100 flex justify-between items-center">
                      <h1 class="px-4 py-3">
                        <span class="font-medium text-lg">Filtros</span>
                      </h1>
                      <label
                        class="btn btn-ghost hover:opacity-80 hover:bg-transparent"
                        for={controls}
                      >
                        <Icon id="close" />
                      </label>
                    </div>
                    <div class="flex-grow overflow-auto">
                      <FiltersMb filters={filters} />
                    </div>
                  </div>
                }
              >
                <div class="flex sm:hidden justify-between items-end">
                  <div class="flex flex-col">
                    {results}
                    <label
                      class="flex gap-1 mt-2 text-sm items-center border justify-center px-2 min-h-[36px]"
                      for={controls}
                    >
                      Filtrar
                      <Image
                        src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/9b4294b4-6379-478d-96e8-6199311b7dec/Filtro.svg"
                        width={16}
                        height={16}
                      />
                    </label>
                  </div>
                  <div className="w-fit border px-2">{sortBy}</div>
                </div>
              </Drawer>
            )}

            <div class="grid md:gap-4 place-items-center grid-cols-1 sm:grid-cols-[250px_1fr]">
              {device === "desktop" && (
                <aside class="place-self-start flex flex-col gap-9">
                  <span class="text-base font-semibold h-12 flex items-center">
                    Filtros
                  </span>

                  <Filters filters={filters} />
                </aside>
              )}

              <div class="flex flex-col gap-5">
                {searchTerm && (
                  <div class="text-sm text-[#646072] flex-col hidden lg:flex">
                    Você buscou por
                    <span class="font-normal capitalize text-[#282828] md:text-3xl text-lg">
                      {searchTerm}
                    </span>
                  </div>
                )}
                {device === "desktop" && (
                  <div class="flex justify-between items-center">
                    {results}
                    <div>{sortBy}</div>
                  </div>
                )}
                <PageResult {...props} />
                <div id="sentinel" />
              </div>
            </div>
          </div>
        )}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            onLoad,
            container,
            pageInfo.records || products.length,
            pageInfo
          ),
        }}
      />
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container
          ),
        }}
      />
    </>
  );
}

function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }
  return <Result {...props} page={page} />;
}

export const loader = (props: Props, req: Request) => {
  const url = new URL(req.url);
  const searchTerm = url.searchParams.get("q") || "";
  const page = props.page!;

  if (url.search.includes("discount%3Adesc")) {
    accumulatedProducts = [...accumulatedProducts, ...page.products];
    accumulatedProducts.sort((a, b) => {
      const listPriceA = a.offers?.offers[0].priceSpecification[0].price || 0;
      const priceA = a.offers?.offers[0].priceSpecification[1].price || 0;
      const discountA = listPriceA
        ? Math.round(((listPriceA - priceA) / listPriceA) * 100)
        : 0;

      const listPriceB = b.offers?.offers[0].priceSpecification[0].price || 0;
      const priceB = b.offers?.offers[0].priceSpecification[1].price || 0;
      const discountB = listPriceB
        ? Math.round(((listPriceB - priceB) / listPriceB) * 100)
        : 0;

      return discountB - discountA;
    });
    return {
      ...props,
      url: req.url,
      searchTerm,
      page: {
        ...page,
        products: accumulatedProducts,
      },
    };
  } else {
    accumulatedProducts = [];
  }

  return {
    ...props,
    url: req.url,
    searchTerm,
  };
};

// export const loader = (props: Props, req: Request) => {
//   const url = new URL(req.url);
//   const searchTerm = url.searchParams.get("q") || ""; // Extrai o termo de busca da URL

//   return {
//     ...props,
//     url: req.url,
//     searchTerm,
//   };
// };

export default SearchResult;
