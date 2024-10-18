import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";
import { type LoadingFallbackProps } from "@deco/deco";

/**
 * @titleBy alt
 */
interface Banner {
  mobile: ImageWidget;
  desktop?: ImageWidget;
  /** @description Image alt texts */
  alt: string;
  /** @description Adicione um link */
  href: string;
}

interface Props {
  /**
   * @maxItems 3
   * @minItems 2
   */
  banners?: Banner[];
}

function Banner({ mobile, desktop, alt, href }: Banner) {
  return (
    <a href={href} class="overflow-hidden">
      <Picture>
        <img
          width={1700}
          class="w-full h-full object-cover rounded-lg"
          src={desktop || mobile}
          alt={alt}
          decoding="async"
          loading="lazy"
        />
      </Picture>
    </a>
  );
}

function Gallery({
  banners = [
    {
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/b531631b-8523-4feb-ac37-5112873abad2",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/b531631b-8523-4feb-ac37-5112873abad2",
      alt: "Fashion",
      href: "/",
    },
    {
      alt: "Fashion",
      href: "/",
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/1125d938-89ff-4aae-a354-63d4241394a6",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/1125d938-89ff-4aae-a354-63d4241394a6",
    },
    {
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/dd1e2acb-ff80-49f9-8f56-1deac3b7a42d",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/dd1e2acb-ff80-49f9-8f56-1deac3b7a42d",
      href: "/",
      alt: "Fashion",
    },
  ],
}: Props) {
  return (
    <Section.Container class="custom-container ">
      {banners.length === 2 ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {banners.map((banner, index) => (
            <div key={index}>
              <Banner {...banner} />
            </div>
          ))}
        </div>
      ) : (
        <div class="flex flex-col gap-3">
          <div class="w-full">
            <Banner {...banners[0]} />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {banners.slice(1).map((banner, index) => (
              <div key={index}>
                <Banner {...banner} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Section.Container>
  );
}

export default Gallery;
