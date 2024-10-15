import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /** @format rich-text */
  title?: string;
  /** @format textarea */
  description?: string;
  items?: {
    /** @format rich-text */
    title?: string;
    image?: ImageWidget;
    /** @format textarea */
    description?: string;
    /** @format color-input */
    backgroundColor?: string;
  }[];
  showNavigation?: boolean;
}

export default function CategoryGrid12({ title, description, items = [], showNavigation = true }: Props) {
  return (
    <div class="py-10">
      <div class="container mx-auto px-4">
        {title && <h2 class="text-3xl font-bold mb-4">{title}</h2>}
        {description && <p class="text-lg mb-8">{description}</p>}
        <div class="relative">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.slice(0, 12).map((item, index) => (
              <div key={index} class="bg-white rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: item.backgroundColor }}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={500}
                    class="w-full h-48 object-cover"
                  />
                )}
                <div class="p-4">
                  {item.title && <h3 class="text-xl font-semibold mb-2">{item.title}</h3>}
                  {item.description && <p class="text-gray-600">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
          {showNavigation && (
            <>
              <button class="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button class="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}