import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
}

function ProductSlider({ products, itemListName }: Props) {
  const id = useId();

  return (
    <>
      <div
        id={id}
        class="grid grid-rows-1"
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="overflow-x-auto">
          <Slider class="carousel carousel-center sm:carousel-end gap-2 w-full">
            {products.map((product, index) => (
              <Slider.Item index={index} class={clx("carousel-item", "first:pl-5 first:sm:pl-0", "last:pr-5 last:sm:pr-0")}>
                <ProductCard
                  index={index}
                  product={product}
                  itemListName={itemListName}
                  class="w-[150px] sm:w-[180px] md:w-[200px] lg:w-[180px] xl:w-[260px]"
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="col-start-1 col-span-1 row-start-1 row-span-1 z-10 self-center lg:-left-8 md:left-0 p-2 relative bottom-[15%]">
          <Slider.PrevButton class="hidden sm:flex disabled:opacity-75   no-animation">
            <Icon id="chevron-right" class="rotate-180" />
          </Slider.PrevButton>
        </div>

        <div class="col-start-3 col-span-1 row-start-1 row-span-1 z-10 self-center lg:-right-8 md:right-0  p-2 relative bottom-[15%]">
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
