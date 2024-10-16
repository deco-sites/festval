import { useState } from "preact/hooks";

interface Props {
  categories?: {
    name: string;
    /** @format image */
    image?: string;
  }[];
  itemsPerRow?: number;
}

export default function CategoryGrid({ categories = [], itemsPerRow = 4 }: Props) {
  const [startIndex, setStartIndex] = useState(0);
  const endIndex = startIndex + 12;
  const displayedCategories = categories.slice(startIndex, endIndex);

  const handlePrevClick = () => {
    setStartIndex(Math.max(startIndex - 12, 0));
  };

  const handleNextClick = () => {
    setStartIndex(Math.min(startIndex + 12, categories.length - 12));
  };

  return (
    <div class="relative">
      <div class={`grid grid-cols-${itemsPerRow} gap-4`}>
        {displayedCategories.map(({ name, image }) => (
          <div key={name} class="card bordered">
            {image && (
              <figure class="px-5 pt-5">
                <img src={image} alt={name} class="rounded-xl" />
              </figure>
            )}
            <div class="card-body">
              <h2 class="card-title">{name}</h2>
            </div>
          </div>
        ))}
      </div>

      {categories.length > 12 && (
        <div class="absolute inset-y-0 flex items-center">
          <button class="btn btn-circle btn-outline absolute left-0" disabled={startIndex === 0} onClick={handlePrevClick}>
            ❮
          </button>
          <button
            class="btn btn-circle btn-outline absolute right-0"
            disabled={endIndex >= categories.length}
            onClick={handleNextClick}
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}
