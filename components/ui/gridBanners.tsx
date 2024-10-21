import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { type SectionProps } from "@deco/deco";

/**
 * @titleBy matcher
 */
export interface Banner {
  /** @description RegExp to enable this banner on the current URL. */
  matcher: string;
  /** @description Text to be rendered on top of the image */
  title?: string;
  /** @description Text to be rendered on top of the image */
  subtitle?: string;
  image: {
    /** @description Image for big screens */
    desktop: ImageWidget;
    /** @description Image for small screens */
    mobile: ImageWidget;
    /** @description Image alt text */
    alt?: string;
  };
}

const DEFAULT_PROPS = {
  banners: [
    {
      image: {
        mobile:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/91102b71-4832-486a-b683-5f7b06f649af",
        desktop:
          "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/ec597b6a-dcf1-48ca-a99d-95b3c6304f96",
        alt: "Banner 1",
      },
      matcher: "/promo/*",
    },
    {
      image: {
        mobile: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/fake-url-mobile.png",
        desktop: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/fake-url-desktop.png",
        alt: "Banner 2",
      },
      matcher: "/promo/*",
    },
  ],
};

export interface Props {
  banners?: Banner[];
}

export const loader = (props: Props, req: Request) => {
  const { banners } = { ...DEFAULT_PROPS, ...props };
  const activeBanners = banners.filter(({ matcher }) => new URLPattern({ pathname: matcher }).test(req.url));
  return { activeBanners };
};

function BannerGrid(props: SectionProps<ReturnType<typeof loader>>) {
  const { activeBanners } = props;

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  return (
    <div class="custom-container grid grid-cols-2 gap-5">
      {activeBanners.map((banner, index) => (
        <Picture preload key={index} class="col-span-1 row-span-1">
          <Source src={banner.image.mobile} width={840} height={320} media="(max-width: 767px)" />
          <Source src={banner.image.desktop} width={840} height={320} media="(min-width: 767px)" />
          <img class="w-full" src={banner.image.desktop} alt={banner.image.alt} />
        </Picture>
      ))}
    </div>
  );
}

export default BannerGrid;
