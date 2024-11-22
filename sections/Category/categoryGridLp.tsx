import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useDevice } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";

/** @titleBy label */
export interface Item {
  image: ImageWidget;
  href: string;
  label?: string;
}

export interface Props {
  items: Item[];
}

function CardLp({ image, href, label }: Item) {
  const device = useDevice();
  const size = device === "mobile" ? 400 : 200;

  return (
    <a href={href} class="flex flex-col items-center justify-center gap-2">
      <Image
        class="rounded-xl hover:opacity-90 ease-in-out w-full md:h-full h-[150px]"
        src={image}
        alt={label}
        width={size}
        height={size}
        loading="lazy"
      />
    </a>
  );
}

function CategorySliderLp({ items }: Props) {
  const id = useId();
  const device = useDevice();

  return (
    <div className="custom-container">
      <div id={id} class="relative">
        <div class="overflow-x-auto scrollbar-hidden">
          <Slider class={`carousel ${device === "mobile" ? "carousel-center" : "grid grid-cols-5"} gap-3`}>
            {items.map((item, index) => (
              <Slider.Item key={index} index={index} class={clx("carousel-item", "first:pl-2", "last:pr-2")}>
                <CardLp {...item} />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        {/* {device !== "mobile" && device !== "desktop" && (
          <>
            <div class="absolute inset-y-0 left-0 flex items-center">
              <Slider.PrevButton class="hidden sm:flex disabled:opacity-50">◀</Slider.PrevButton>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center">
              <Slider.NextButton class="hidden sm:flex disabled:opacity-50">▶</Slider.NextButton>
            </div>
          </>
        )} */}
      </div>
      <Slider.JS rootId={id} />
    </div>
  );
}

export default CategorySliderLp;
