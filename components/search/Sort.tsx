import { ProductListingPage } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
import Icon from "../ui/Icon.tsx";
const SORT_QUERY_PARAM = "sort";
const PAGE_QUERY_PARAM = "page";
export type Props = Pick<ProductListingPage, "sortOptions"> & {
  url: string;
};
const getUrl = (href: string, value: string) => {
  const url = new URL(href);
  url.searchParams.delete(PAGE_QUERY_PARAM);
  url.searchParams.set(SORT_QUERY_PARAM, value);
  return url.href;
};
const labels: Record<string, string> = {
  "relevance:desc": "Relevância",
  "price:desc": "Maior Preço",
  "price:asc": "Menor Preço",
  "orders:desc": "Mais vendidos",
  "name:desc": "Nome - de Z a A",
  "name:asc": "Nome - de A a Z",
  "release:desc": "Lançamento",
  "discount:desc": "Maior desconto",
};
function Sort({ sortOptions, url }: Props) {
  const current = getUrl(url, new URL(url).searchParams.get(SORT_QUERY_PARAM) ?? "");
  const options = sortOptions?.map(({ value, label }) => ({
    value: getUrl(url, value),
    label,
  }));
  return (
    <>
      <div className="relative w-full max-w-sm">
        <label for="sort" class="sr-only">
          Sort by
        </label>
        <select
          name="sort"
          class=" w-fit  text-base py-2 rounded-none flex items-center justify-center  lg:m-2  cursor-pointer outline-none text-[#282828] bg-[] border-none lg:text-xs leading-normal tracking-one  lg:px-2"
          hx-on:change={useScript(() => {
            const select = event!.currentTarget as HTMLSelectElement;
            window.location.href = select.value;
          })}
        >
          {options.map(({ value, label }) => (
            <option label={labels[label] ?? label} value={value} selected={value === current}>
              {label}
            </option>
          ))}
        </select>
        {/* <div class="absolute top-1/2 right-0">
          <Icon id="chevron-right" class="rotate-90 w-2" />
        </div> */}
      </div>
    </>
  );
}
export default Sort;
