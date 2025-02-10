import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
  hasBanner?: boolean;
  /**
   * @hide
   */
  region?: string;
}

function ProductSlider({ products, hasBanner, itemListName, region }: Props) {
  const id = useId();

  return (
    <>
      <div
        id={id}
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
        class={clx(hasBanner ? "lg:w-4/5 w-full" : "w-full")}
      >
        <div class="overflow-x-auto ">
          <Slider class="carousel carousel-center sm:carousel-end gap-5 w-full">
            {products.map((product, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  "first:pl-5 first:sm:pl-0",
                  "last:pr-5 last:sm:pr-0"
                )}
              >
                <ProductCard
                  index={index}
                  product={product}
                  itemListName={itemListName}
                  region={region}
                  class="w-[150px] sm:w-[180px] md:w-[200px] lg:w-[180px] xl:w-[320px]"
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div
          class={clx(
            "col-start-1 col-span-1 row-start-1 row-span-1 z-10 self-center p-2 absolute inset-y-0",
            hasBanner
              ? "xl:left-[315px] lg:left-[315px] md:left-[315px]"
              : "xl:left-0 lg:left-0 md:left-0"
          )}
        >
          <Slider.PrevButton class="hidden sm:flex disabled:opacity-75 no-animation">
            <Icon id="chevron-right" class="rotate-180" />
          </Slider.PrevButton>
        </div>

        <div class="col-start-3 col-span-1 row-start-1 row-span-1 z-10 self-center xl:right-0 lg:right-0 md:right-0  p-2 absolute inset-y-0">
          <Slider.NextButton class="hidden sm:flex disabled:opacity-75 no-animation">
            <Icon id="chevron-right" />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} />
    </>
  );
}

export default ProductSlider;
