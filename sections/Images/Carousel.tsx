import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description desktop otimized image */
  desktop: ImageWidget;

  /** @description mobile otimized image */
  mobile: ImageWidget;

  /** @description Image's alt text */
  alt: string;

  action?: {
    /** @description when user clicks on the image, go to this link */
    href: string;
    /** @description Image text title */
    title: string;
    /** @description Image text subtitle */
    subTitle: string;
    /** @description Button label */
    label: string;
  };
}

export interface Props {
  images?: Banner[];

  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
  const { alt, mobile, desktop, action } = image;
  const params = { promotion_name: image.alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  return (
    <a
      {...selectPromotionEvent}
      href={action?.href ?? "#"}
      aria-label={action?.label}
      class="relative block overflow-y-hidden w-full"
    >
      {action && (
        <div
          class={clx(
            "absolute h-full w-full top-0 left-0",
            "flex flex-col justify-center items-center",
            "px-5 sm:px-0",
            "sm:left-40 sm:items-start sm:max-w-100"
          )}
        >
          <span class="text-7xl font-bold text-base-100">{action.title}</span>
          <span class="font-normal text-base text-base-100 pt-4 pb-12">{action.subTitle}</span>
          <button class="btn btn-primary btn-outline border-0 bg-base-100 min-w-[180px]" aria-label={action.label}>
            {action.label}
          </button>
        </div>
      )}
      <Picture preload={lcp} {...viewPromotionEvent}>
        <Source media="(max-width: 767px)" fetchPriority={lcp ? "high" : "auto"} src={mobile} width={1080} height={1500} />
        <Source media="(min-width: 768px)" fetchPriority={lcp ? "high" : "auto"} src={desktop} width={1700} height={490} />
        <img class="object-contain rounded w-full h-full " loading={lcp ? "eager" : "lazy"} src={desktop} alt={alt} />
      </Picture>
    </a>
  );
}

function Carousel({ images = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div class="bg-[#f8f8f8] w-full overflow-hidden relative lg:mt-7 md:mt-0 py-4">
      <div class="relative custom-container mx-auto">
        <div id={id} class={clx("w-full")}>
          <div class="col-span-full row-span-full">
            <Slider class="carousel carousel-center w-full gap-6">
              {images.map((image, index) => (
                <Slider.Item index={index} class="carousel-item w-full">
                  <BannerItem image={image} lcp={index === 0 && preload} />
                </Slider.Item>
              ))}
            </Slider>
          </div>

          <div class="hidden sm:flex items-center justify-start z-10 absolute left-5 inset-y-0 row-start-2">
            <Slider.PrevButton
              class="btn btn-carousel border-none hover:!bg-transparent no-animation btn-sm color-white absolute left-0"
              disabled={false}
            >
              <Icon id="arrow-white" class="rotate-180" />
            </Slider.PrevButton>
          </div>

          <div class="hidden sm:flex items-center justify-end z-10 absolute right-5 inset-y-0 row-start-2">
            <Slider.NextButton
              class="btn btn-carousel border-none hover:!bg-transparent no-animation btn-sm color-white absolute right-0"
              disabled={false}
            >
              <Icon id="arrow-white" />
            </Slider.NextButton>
          </div>

          <ul class={clx("col-span-full absolute lg:bottom-0 md:-bottom-1 inset-x-0 z-10", "carousel justify-center gap-3")}>
            {images.map((_, index) => (
              <li class="carousel-item">
                <Slider.Dot
                  index={index}
                  class={clx(
                    " bg-gray-400 h-2 w-6 no-animation rounded-full",
                    "disabled:w-6 disabled:bg-black disabled:opacity-100 transition-[width]"
                  )}
                ></Slider.Dot>
              </li>
            ))}
          </ul>

          <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
        </div>
      </div>
    </div>
  );
}

export default Carousel;
