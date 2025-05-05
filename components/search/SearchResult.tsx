import { type SectionProps } from "@deco/deco";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import type { PageInfo, ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { getCookies } from "std/http/cookie.ts";
import FiltersMb from "../../islands/FiltersMb.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import AddAllProductsToCartButton from "../product/AddAllProductsToCartButton.tsx";
import ProductCard from "../product/ProductCard.tsx";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Icon from "../ui/Icon.tsx";
import Drawer from "../ui/MenuMobileDrawer.tsx";
import Filters from "./Filters.tsx";
import Sort from "./Sort.tsx";
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
  url?: string;
  /**
   * @hide
   */
  region?: string;
  /**
   * @hide
   */
  isWishList?: boolean;
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

const onLoad = (record: number | undefined, pageInfo: PageInfo) => {
  const container = document.querySelector(".search-result-wrapper");
  const sentinel = document.getElementById("sentinel");
  const btnFoward = container?.querySelector(
    ".btn-next",
  ) as HTMLButtonElement | null;

  function validateGoNext(): boolean {
    const totalRecords = record ?? 0;
    const recordsPerPage = pageInfo.recordPerPage ?? 12;
    const currentPage = pageInfo.currentPage;

    // Calcula o número total de páginas necessárias
    const totalPages = totalRecords < 13
      ? 0
      : Math.ceil(totalRecords / recordsPerPage);

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
            btnFoward.disabled = true;
          }
          observer.disconnect();
        }
      });
    },
    { rootMargin: "100px" },
  );

  observer.observe(sentinel);
};

const onHandlePagination = (
  id: string,
  records: number,
  partial: string | undefined,
) => {
  if (partial && partial === "hideLess") {
    // Seleciona o container pelo id
    const container = document.getElementById(id);
    // A section é o elemento pai do container
    const section = container?.parentElement;
    if (container && section && section.parentNode) {
      // Seleciona o elemento pai da section
      const parent = section.parentNode;
      // Enquanto houver filhos dentro do container, move-os para o parent,
      // posicionando-os antes da section (que é filho direto do parent)
      while (container.firstChild) {
        parent.insertBefore(container.firstChild, section);
      }
      // Remove a section vazia
      section.remove();
    }

    const btnsNext = document.querySelectorAll(".btn-next");
    if (btnsNext.length >= 2) {
      // Seleciona o botão na posição 0 e 1
      const btn0 = btnsNext[1];
      const btn1 = btnsNext[0];

      // Substitui btn0 por btn1 no mesmo elemento pai
      if (btn0 && btn0.parentNode) btn0.parentNode.replaceChild(btn1, btn0);

      if (records > 0) {
        // Atualiza a query string incrementando o parâmetro "page"
        const url = new URL(window.location.href);
        // Obtém o valor atual de "page" ou usa 1 se não existir
        const currentPage = Number(url.searchParams.get("page") || "1");
        const newPage = currentPage + 1;
        url.searchParams.set("page", newPage.toString());

        // Atualiza a URL sem recarregar a página
        history.replaceState(null, "", url.href);
      }
    }
  } else if (partial && partial === "hideMore") {
    const container = document.getElementById(id);
    const section = container?.parentElement;
    if (container && section && section.parentNode) {
      // Seleciona o elemento pai da section
      const parent = section.parentNode;
      // Enquanto houver filhos dentro do container, move-os para o parent,
      // posicionando-os antes da section (que é filho direto do parent)
      while (container.firstChild) {
        parent.insertBefore(container.firstChild, section);
      }
      // Remove a section vazia
      section.remove();
    }

    const btnsPrev = document.querySelectorAll(".btn-prev");
    if (btnsPrev.length >= 2) {
      // Atualiza a query string incrementando o parâmetro "page"
      const url = new URL(window.location.href);

      // Seleciona o botão na posição 0 e 1
      const btn0 = btnsPrev[0];
      const btn1 = btnsPrev[1];
      const btnCurrentPage = Number(btn1!.getAttribute("data-prev-page"));

      if (btnCurrentPage && btnCurrentPage > 2) {
        // Substitui btn0 por btn1 no mesmo elemento pai
        if (btn0 && btn0.parentNode) btn0.parentNode.replaceChild(btn1, btn0);

        if (records > 0) {
          const newPage = btnCurrentPage - 1 > 0 ? btnCurrentPage : 1;
          url.searchParams.set("page", newPage.toString());

          // Atualiza a URL sem recarregar a página
          history.replaceState(null, "", url.href);
        }
      } else {
        btnsPrev.forEach((btn) => {
          const btnElement = btn as HTMLButtonElement;
          if (btnElement) {
            const parent = btn.parentElement;
            if (parent && parent.classList.contains(".btn-prev-wrapper")) {
              parent.style.display = "none";
            }
            btnElement.style.display = "none";
          }
          if (records > 0) {
            const newPage = btnCurrentPage - 1 > 0 ? btnCurrentPage : 1;
            url.searchParams.set("page", newPage.toString());

            // Atualiza a URL sem recarregar a página
            history.replaceState(null, "", url.href);
          }
        });
      }
    }
  }
};

function PartialPageResult(props: Props) {
  const id = useId();
  const { startingPage = 0, partial, url, region } = props;
  const page = props.page!;
  const { products, pageInfo } = page;

  const produtosEmEstoque = products.filter((product) => {
    const { offers } = product;
    const { availability } = useOffer(offers);
    return availability === "https://schema.org/InStock";
    //return product;
  });


  const perPage = pageInfo?.recordPerPage || produtosEmEstoque.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url ?? "");
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url ?? "");
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });

  return (
    <div id={id}>
      {partial && partial === "hideMore" && (
        <a
          rel="prev"
          class="btn btn-ghost btn-prev"
          //hx-swap="outerHTML show:parent:top"
          hx-target="[data-product-list]"
          hx-swap="afterbegin"
          hx-get={partialPrev}
          data-prev-page={pageInfo.currentPage}
        >
          <span class="inline [.htmx-request_&]:hidden">Mostrar menos</span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      )}

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

      {partial && partial === "hideLess" && (
        <a
          rel="next"
          class={clx("btn btn-ghost btn-next")}
          hx-target="[data-product-list]"
          //hx-swap="outerHTML show:parent:top"
          hx-swap="beforeend"
          hx-get={partialNext}
          data-next-page={pageInfo.currentPage}
        >
          <span class="inline [.htmx-request_&]:hidden"></span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      )}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            onHandlePagination,
            id,
            produtosEmEstoque.length,
            partial,
          ),
        }}
      />
      {partial && partial === "hideLess" && (
        <script
          type="module"
          class="script-go-next"
          dangerouslySetInnerHTML={{
            __html: useScript(onLoad, pageInfo.records, pageInfo),
          }}
        />
      )}
    </div>
  );
}

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
  
  const perPage = pageInfo?.recordPerPage || produtosEmEstoque.length;
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
          "pb-2 sm:pb-10 btn-prev-wrapper",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="btn btn-ghost btn-prev"
          //hx-swap="outerHTML show:parent:top"
          hx-target="[data-product-list]"
          hx-swap="afterbegin"
          hx-get={partialPrev}
          data-prev-page={pageInfo.currentPage}
        >
          <span class="inline [.htmx-request_&]:hidden">Mostrar menos</span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-2",
          "sm:grid-cols-4 sm:gap-10",
          "w-full",
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
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "btn btn-ghost btn-next",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-target="[data-product-list]"
                //hx-swap="outerHTML show:parent:top"
                hx-swap="beforeend"
                hx-get={partialNext}
                data-next-page={pageInfo.currentPage}
              >
                <span class="inline [.htmx-request_&]:hidden"></span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
            </div>
          )
          : (
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
  const { startingPage = 0, url, partial, searchTerm, isWishList } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;

  const produtosEmEstoque = products.filter((product) => {
    const { offers } = product;
    const { availability } = useOffer(offers);
    return availability === "https://schema.org/InStock";
    //return product;
  });
  
  const urlParams = new URL(props.url);
  const collectionid = urlParams.pathname.split("/").pop() || undefined;

  const collectionName = collectionid && produtosEmEstoque[0]?.additionalProperty?.find(p => p.name === "cluster" && p.propertyID === collectionid)?.value;

  function getBrandName() {
    return decodeURIComponent(String(collectionid))
  }
  
  const categoryName = breadcrumb.itemListElement?.at(-1)?.name ||
                        collectionName ||
                        getBrandName() ||
                        "Categoria não especificada";

  const perPage = pageInfo?.recordPerPage || produtosEmEstoque.length;
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
      {pageInfo.records ?? 0} resultado{pageInfo.records! > 1 && 's'}
    </span>
  );
  const sortBy = sortOptions.length > 0 && (
    <div>
      <Sort sortOptions={sortOptions} url={url} />
    </div>
  );

  return (
    <>
      {partial ? <PartialPageResult {...props} /> : (
        <div
          id={container}
          {...viewItemListEvent}
          class="w-full search-result-wrapper"
        >
          <div class="container custom-container  flex flex-col gap-4 sm:gap-5 w-full py-2 sm:py-2 px-2 sm:px-0">
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
                <div class="text-sm text-[#646072] flex-col hidden lg:flex">
                  {searchTerm
                    ? (
                      <>
                        Você buscou por
                        <span class="font-normal capitalize text-[#282828] md:text-3xl text-lg">
                          {searchTerm}
                        </span>
                      </>
                    )
                    : (
                      <>
                        Você está em:
                        <span class="font-normal capitalize text-[#282828] md:text-3xl text-lg">
                          {categoryName}
                        </span>
                      </>
                    )}
                </div>
                {device === "desktop" && props.page?.products.length && (
                  <>
                    <div class="flex flex-col md:flex-row justify-between items-center">
                      {results}
                      {isWishList && (
                        <AddAllProductsToCartButton
                          class={clx(
                            " bg-[#5D7F3A] flex justify-center items-center text-white border-none gap-2 sm:gap-[12.8px] h-[32px] sm:h-[48px] text-sm sm:text-base font-normal rounded-[11px] no-animation w-full px-2 md:my-2",
                            "hover:opacity-80 ease-in-out duration-300",
                          )}
                        />
                      )}
                      {sortBy}
                    </div>
                  </>
                )}
                {device === "mobile" &&
                  isWishList &&
                  props.page?.products.length && (
                  <div class="flex justify-center">
                    <AddAllProductsToCartButton
                      class={clx(
                        "bg-[#5D7F3A] flex justify-center items-center text-white border-none gap-2 sm:gap-[12.8px] h-[32px] sm:h-[48px] text-sm sm:text-base font-normal rounded-[11px] no-animation px-2 my-2",
                        "hover:opacity-80 ease-in-out duration-300",
                      )}
                    />
                  </div>
                )}
                <PageResult {...props} />
                <div id="sentinel" />
              </div>
            </div>
          </div>
          <script
            type="module"
            dangerouslySetInnerHTML={{
              __html: useScript(
                onLoad,
                pageInfo.records || produtosEmEstoque.length,
                pageInfo,
              ),
            }}
          />
          <script
            type="module"
            class="script-go-next"
            dangerouslySetInnerHTML={{
              __html: useScript(
                setPageQuerystring,
                `${pageInfo.currentPage}`,
                container,
              ),
            }}
          />
        </div>
      )}
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
