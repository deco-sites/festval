import type { Filter, FilterToggle, FilterToggleValue, ProductListingPage } from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle => filter["@type"] === "FilterToggle";

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2">
      <div aria-checked={selected} class="rounded-sm w-4 h-4 checkbox " />
      <span class="text-sm">{label}</span>
      {quantity > 0 && <span class="text-sm text-base-400">({quantity})</span>}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";
  const maxVisibleItems = 11;

  return (
    <div class="max-h-64 overflow-y-scroll">
      {" "}
      {/* Define a área rolável para a lista */}
      <ul class={clx(`flex flex-wrap gap-2`, flexDirection)}>
        {values.slice(0, maxVisibleItems).map((item) => {
          const { url, selected, value } = item;

          if (avatars) {
            return (
              <a href={url} rel="nofollow">
                <Avatar content={value} variant={selected ? "active" : "default"} />
              </a>
            );
          }

          if (key === "price") {
            const range = parseRange(item.value);
            return range && <ValueItem {...item} label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`} />;
          }

          return <ValueItem {...item} />;
        })}
      </ul>
    </div>
  );
}

function Filters({ filters }: Props) {
  return (
    <ul class="flex flex-col gap-6 p-4 sm:p-0">
      {filters.filter(isToggle).map((filter) => (
        <li class="flex flex-col gap-4">
          <span class="font-semibold">{filter.label}</span>
          <FilterValues {...filter} />
        </li>
      ))}
    </ul>
  );
}

export default Filters;
