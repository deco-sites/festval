import type { ProductListingPage, PageInfo } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import AddAllProductsToCartButton from "../../components/product/AddAllProductsToCartButton.tsx";
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
import { getCookies } from "std/http/cookie.ts";
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
  /**
   * @hide
   */
  region?: string;
}
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
  const btnFoward = container?.querySelector(
    ".btn-next"
  ) as HTMLButtonElement | null;

  function validateGoNext(): boolean {
    const totalRecords = record ?? 0;
    const recordsPerPage = pageInfo.recordPerPage ?? 12;
    const currentPage = pageInfo.currentPage;

    // Calcula o número total de páginas necessárias
    const totalPages =
      totalRecords < 13 ? 0 : Math.ceil(totalRecords / recordsPerPage);

    // Retorna false se já estiver na última página ou se atingir o limite de 50 páginas
    return currentPage < totalPages && currentPage < 50;
  }

  if (!container || !sentinel || !btnFoward) {
    console.warn("Elementos necessários não encontrados.");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && validateGoNext()) {
          if (!btnFoward.disabled) {
            btnFoward.click();
          }
        }
      });
    },
    { rootMargin: "100px" }
  );

  observer.observe(sentinel);
};

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial, region } = props;
  const page = props.page!;
  const { products, pageInfo } = page;

  const produtosEmEstoque = products.filter((product) => {
    const { offers } = product;
    const { availability } = useOffer(offers);
    return availability === "https://schema.org/InStock";
    //return product;
  });

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
  return (
    <div id={id} class="grid grid-flow-row grid-cols-1 place-items-center ">
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
        {produtosEmEstoque?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            region={region}
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

            {device === "mobile" && filters.length > 0 && (
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

            <div
              class={`grid md:gap-4 grid-cols-1 ${
                filters.length > 0
                  ? "sm:grid-cols-[250px_1fr] place-items-center"
                  : "sm:grid-cols-[1fr]"
              }`}
            >
              {device === "desktop" && filters.length > 0 && (
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
                {device === "desktop" && props.page?.products.length && (
                  <>
                    <div class="flex justify-between items-center">
                      {results}
                      <div>{sortBy}</div>
                    </div>
                    {/* <div>
                      <AddAllProductsToCartButton
                        product={props.page?.products[0]}
                        seller={1},
                        item={}
                      />
                      ;
                    </div> */}
                  </>
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
  const searchTerm = url.searchParams.get("q") || ""; // Extrai o termo de busca da URL

  const cookies = getCookies(req.headers);
  const regionCookie = cookies["region"];

  props.region = regionCookie ?? "";

  return {
    ...props,
    url: req.url,
    searchTerm,
  };
};

export default SearchResult;
