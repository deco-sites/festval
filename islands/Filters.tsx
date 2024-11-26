import { useSignal } from "@preact/signals";
import type { Filter, FilterToggle, FilterToggleValue, ProductListingPage } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { useEffect } from "preact/hooks";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle => filter["@type"] === "FilterToggle";

function ValueItem({
  url,
  selected,
  label,
  quantity,
  onChange,
}: FilterToggleValue & { onChange: (value: boolean) => void }) {
  const handleCheckboxChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const target = e.currentTarget as HTMLInputElement;
    onChange(target.checked);
  };

  return (
    <div class="flex items-center gap-2">
      <input type="checkbox" checked={selected} onChange={handleCheckboxChange} />
      <span class="text-sm">{label}</span>
      {quantity > 0 && <span class="text-sm text-base-400">({quantity})</span>}
    </div>
  );
}

const FilterValues = ({
  values,
  filterKey,
  onChange,
  selectedValues,
}: {
  values?: FilterToggleValue[];
  filterKey: string;
  onChange: (key: string, value: string, selected: boolean) => void;
  selectedValues: string[];
}) => {
  if (!values || !Array.isArray(values)) {
    return null;
  }

  return (
    <ul class="max-h-64 overflow-y-auto">
      {values.map((value) => (
        <li key={value.value}>
          <ValueItem
            {...value}
            selected={selectedValues.includes(value.value)}
            onChange={(selected) => onChange(filterKey, value.value, selected)}
          />
        </li>
      ))}
    </ul>
  );
};

function Filters({ filters }: Props) {
  const selectedFilters = useSignal<Record<string, string[]>>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters: Record<string, string[]> = {};

    urlParams.forEach((value, key) => {
      if (key.startsWith("filter.")) {
        const filterKey = key.replace("filter.", "");
        initialFilters[filterKey] = value.split(",");
      }
    });

    selectedFilters.value = initialFilters;
  }, []);

  const handleFilterChange = (filterKey: string, value: string, selected: boolean) => {
    const currentValues = selectedFilters.value[filterKey] || [];
    if (selected) {
      selectedFilters.value = {
        ...selectedFilters.value,
        [filterKey]: [...currentValues, value],
      };
    } else {
      selectedFilters.value = {
        ...selectedFilters.value,
        [filterKey]: currentValues.filter((v) => v !== value),
      };
    }
  };

  const applyFilters = () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Manter os parâmetros existentes que não são filtros
    const queryParams: Record<string, string> = {};
    urlParams.forEach((value, key) => {
      if (!key.startsWith("filter.")) {
        queryParams[key] = value;
      }
    });

    // Definir valores padrão se não existirem
    if (!queryParams["sort"]) queryParams["sort"] = "orders:desc";
    if (!queryParams["page"]) queryParams["page"] = "1";

    // Adiciona os filtros selecionados à query string
    Object.entries(selectedFilters.value).forEach(([key, values]) => {
      if (values.length > 0) {
        queryParams[`filter.${key}`] = values.join(",");
      }
    });

    // Gera a query string de forma adequada
    const queryString = new URLSearchParams(queryParams).toString();

    // Recarrega a página com a nova query string
    window.location.href = `?${queryString}`;
  };

  const clearFilters = () => {
    selectedFilters.value = {};

    const urlParams = new URLSearchParams(window.location.search);
    const nonFilterParams: Record<string, string> = {};

    urlParams.forEach((value, key) => {
      if (!key.startsWith("filter.")) {
        nonFilterParams[key] = value;
      }
    });

    const queryString = new URLSearchParams(nonFilterParams).toString();
    window.location.href = queryString ? `?${queryString}` : window.location.pathname;
  };

  return (
    <div>
      <ul class="flex flex-col gap-6 p-4 sm:p-0">
        {filters.map((filter) => {
          if (isToggle(filter)) {
            return (
              <li class="flex flex-col gap-4" key={filter.key}>
                <span class="font-semibold">{filter.label}</span>
                <FilterValues
                  values={filter.values || []}
                  filterKey={filter.key}
                  onChange={handleFilterChange}
                  selectedValues={selectedFilters.value[filter.key] || []}
                />
              </li>
            );
          }
          return null; // Para outros tipos de filtros que não são toggle
        })}
      </ul>
      <div class="flex gap-4 mt-4">
        <button class="btn-primary bg-black" onClick={applyFilters}>
          Aplicar Filtro
        </button>
        <button class="btn-secondary border border-black" onClick={clearFilters}>
          Limpar Filtros
        </button>
      </div>
    </div>
  );
}

export default Filters;
