import { useState } from "preact/hooks";
import type { Filter, FilterToggle, FilterToggleValue, ProductListingPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

// Helper para verificar se o filtro é do tipo "FilterToggle"
const isToggle = (filter: Filter): filter is FilterToggle => filter["@type"] === "FilterToggle";

// Componente para renderizar um valor de filtro
function ValueItem({ url, selected, label }: FilterToggleValue) {
  return (
    <a
      href={url}
      rel="nofollow"
      class={`px-4 py-2 rounded-full border ${
        selected ? "bg-[#d8d8d8]  text-black border-gray-400" : "bg-white text-black border-gray-300"
      } text-sm hover:bg-gray-200`}
    >
      {label}
    </a>
  );
}

// Componente para renderizar os valores do filtro (FilterToggle)
function FilterValues({ values, isOpen }: FilterToggle & { isOpen: boolean }) {
  return (
    <ul
      class={`flex bg-base-100  flex-wrap flex-row gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[1000px] opacity-100 py-3" : "max-h-0 opacity-0"
      }`}
    >
      {values.map((item) => (
        <li>
          <ValueItem {...item} key={item.label} />
        </li>
      ))}
    </ul>
  );
}

// Componente principal de filtros
interface Props {
  filters: ProductListingPage["filters"];
}

function Filters({ filters }: Props) {
  console.log(filters.filter);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});

  const toggleFilter = (key: string) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div class="space-y-4">
      {filters.filter(isToggle).map((filter) => (
        <div key={filter.key} class="rounded-none p-4 bg-base-100">
          <button
            onClick={() => toggleFilter(filter.key)}
            class="lg:text-base items-center text-sm font-bold flex justify-between w-full"
          >
            <span class="text-black">{filter.label}</span>
            <span>
              <Image
                src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/dcef9dcd-1722-464c-8b37-80a0330dd82b/Caminho-11.svg"
                class={`transition-transform duration-300 ease-in-out ${openFilters[filter.key] ? "rotate-180" : ""}`}
                width={12}
                height={7}
              />
            </span>
          </button>

          <FilterValues {...filter} isOpen={openFilters[filter.key] || false} />
        </div>
      ))}
    </div>
  );
}

export default Filters;
