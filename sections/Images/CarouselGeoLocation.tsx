import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { SectionProps } from "@deco/deco";
import { getCookies, setCookie } from "std/http/cookie.ts";
import Section from "../../components/ui/Section.tsx";
import { AppContext } from "../../apps/site.ts";

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

  /** @description Region which banner will be shown  */
  region?: "Cascavel" | "Curitiba";

  action?: {
    /** @description when user clicks on the image, go to this link */
    href: string;
    /** @description Image text title */
    title?: string;
    /** @description Image text subtitle */
    subTitle?: string;
    /** @description Button label */
    label?: string;
  };
}

export interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
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

  /**
   * @hide
   */
  region?: string;
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
      class="relative flex overflow-hidden w-full"
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
          <span class="font-normal text-base text-base-100 pt-4 pb-12">
            {action.subTitle}
          </span>
          <button
            class="btn hidden btn-primary btn-outline border-0 bg-base-100 min-w-[180px]"
            aria-label={action.label}
          >
            {action.label}
          </button>
        </div>
      )}
      <Picture preload={lcp} {...viewPromotionEvent}>
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={1080}
          height={1500}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={1920}
          height={490}
        />
        <img
          class="object-contain w-full h-full "
          loading={lcp ? "eager" : "lazy"}
          src={desktop}
          alt={alt}
        />
      </Picture>
    </a>
  );
}

export function loader(
  { images, preload, interval, region }: Props,
  req: Request,
  ctx: AppContext
) {
  const cookies = getCookies(req.headers);
  const cep = cookies["vtex_last_session_cep"];
  const regionCookie = cookies["region"];

  if (!regionCookie) {
    if (!cep) {
      region = "Curitiba";

      return { images, preload, interval, region };
    }
    const curitibaMin = 80000000;
    const curitibaMax = 83800999;
    const cascavelMin = 85800001;
    const cascavelMax = 85824999;

    const cepInt = parseInt(cep, 10);

    if (cepInt >= curitibaMin && cepInt <= curitibaMax) {
      region = "Curitiba";
    } else if (cepInt >= cascavelMin && cepInt <= cascavelMax) {
      region = "Cascavel";
    } else {
      region = "Curitiba";
    }

    const now = new Date();
    const expirationTime = now.getTime() + 23 * 60 * 60 * 1000;

    setCookie(ctx.response.headers, {
      value: region,
      name: "region",
      path: "/",
      expires: new Date(expirationTime),
      secure: true,
    });

    return { images, preload, interval, region };
  } else {
    region = regionCookie;

    return { images, preload, interval, region };
  }
}

function CarouselGeoLocation({
  images = [],
  preload,
  interval,
  region,
}: SectionProps<typeof loader>) {
  const id = useId();

  const filteredImages = images.filter((image) => {
    if (region) {
      return image.region === region || !image.region;
    }
    return !image.region;
  });

  const showNavigation = filteredImages.length > 1;

  return (
    <div class=" w-full overflow-hidden relative pb-2">
      <div class="relative max-w-[1920px] mx-auto">
        <div id={id} class={clx("w-full")}>
          <div class="col-span-full row-span-full">
            <Slider class="carousel carousel-center w-full gap-6">
              {filteredImages.map((image, index) => (
                <Slider.Item index={index} class="carousel-item w-full">
                  <BannerItem image={image} lcp={index === 0 && preload} />
                </Slider.Item>
              ))}
            </Slider>
          </div>

          {showNavigation && (
            <>
              <div className="hidden sm:flex items-center justify-start z-10 absolute left-5 inset-y-0 row-start-2">
                <Slider.PrevButton className="btn btn-carousel border-none hover:!bg-transparent no-animation btn-sm color-white absolute left-0">
                  <Icon id="arrow-white" className="rotate-180" />
                </Slider.PrevButton>
              </div>

              <div className="hidden sm:flex items-center justify-end z-10 absolute right-5 inset-y-0 row-start-2">
                <Slider.NextButton className="btn btn-carousel border-none hover:!bg-transparent no-animation btn-sm color-white absolute right-0">
                  <Icon id="arrow-white" />
                </Slider.NextButton>
              </div>
            </>
          )}

          {showNavigation && (
            <ul
              className={clx(
                "col-span-full absolute lg:-bottom-1 md:-bottom-1 inset-x-0 z-10",
                "carousel justify-center gap-3"
              )}
            >
              {filteredImages.map((_, index) => (
                <li key={index} className="carousel-item">
                  <Slider.Dot
                    index={index}
                    className={clx(
                      "bg-gray-400 h-2 w-6 no-animation rounded-full",
                      "disabled:w-6 disabled:bg-black disabled:opacity-100 transition-[width]"
                    )}
                  />
                </li>
              ))}
            </ul>
          )}

          <Slider.JS
            rootId={id}
            interval={interval && interval * 1e3}
            infinite
          />
        </div>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="322px" />;

export default CarouselGeoLocation;
