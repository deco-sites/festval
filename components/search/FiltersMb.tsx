import type { Filter, FilterToggle, FilterToggleValue, ProductListingPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

import { useScript } from "@deco/deco/hooks";

// Helper para verificar se o filtro é do tipo "FilterToggle"
const isToggle = (filter: Filter): filter is FilterToggle => filter["@type"] === "FilterToggle";

// Função de controle do acordeon (baseado no código fornecido)
const onClick = () => {
  console.log("clique");
  event?.stopPropagation();

  const button = event?.currentTarget as HTMLButtonElement;
  const span = button.querySelector<HTMLSpanElement>("span");
  const arrow = span?.querySelector<HTMLImageElement>("img");
  const li = button.closest<HTMLLIElement>("li");
  const ul = li?.querySelector<HTMLUListElement>("ul");
  console.log(ul);

  if (ul) {
    console.log("lista");
    if (ul.style.maxHeight) {
      ul.style.maxHeight = "";
      ul.classList.remove("opacity-100");
      ul.classList.add("opacity-0");
    } else {
      // Abrir o menu
      const scrollHeight = ul.scrollHeight + "px";
      ul.style.maxHeight = scrollHeight;
      ul.classList.remove("opacity-0");
      ul.classList.add("opacity-100");
    }

    if (arrow) {
      arrow.classList.toggle("rotate-[-180deg]");
      console.log("roda");
    }
  }
};

// Componente para renderizar um valor de filtro
function ValueItem({ url, selected, label }: FilterToggleValue) {
  return (
    <a
      href={url}
      rel="nofollow"
      class={`px-4 py-2 rounded-full border ${
        selected ? "bg-primary text-white border-primary" : "bg-white text-black border-gray-300"
      } text-sm hover:bg-gray-200`}
    >
      {label}
    </a>
  );
}

// Componente para renderizar os valores do filtro (FilterToggle)

function FilterValues({ values }: FilterToggle) {
  return (
    <ul class="flex flex-col gap-2 max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out">
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
  return (
    <div class="space-y-4">
      {filters.filter(isToggle).map((filter) => (
        <div key={filter.key} class="border rounded-md p-4">
          {/* Botão de controle do acordeon */}

          <button
            hx-on:click={useScript(onClick)}
            class="lg:text-base items-center text-base-100 text-sm font-bold flex justify-between w-full"
          >
            {filter.label}
            <span>
              <Image
                src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/dcef9dcd-1722-464c-8b37-80a0330dd82b/Caminho-11.svg"
                class="transition-transform duration-300 ease-in-out"
                width={12}
                height={7}
              />
            </span>
          </button>

          {/* Valores do filtro */}

          <FilterValues {...filter} />
        </div>
      ))}
    </div>
  );
}

export default Filters;
