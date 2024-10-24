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

function Banner({
  mobile,
  desktop,
  alt,
  href,
  index,
  isSingleBanner,
}: Banner & { index: number; isSingleBanner?: boolean }) {
  return (
    <a href={href} className="overflow-hidden">
      <Picture>
        {/* Mobile Source */}
        {isSingleBanner ? (
          // Banner único, sem tamanhos fixos
          <>
            <Source width={528} height={465} media="(max-width: 767px)" src={mobile} />
            <Source width={840} height={320} media="(min-width: 768px)" src={desktop || mobile} />
          </>
        ) : index === 0 ? (
          // Primeiro banner (grande) com tamanhos diferentes
          <>
            <Source width={1080} height={465} media="(max-width: 767px)" src={mobile} />
            <Source width={1700} height={400} media="(min-width: 768px)" src={desktop || mobile} />
          </>
        ) : (
          // Demais banners
          <>
            <Source width={528} height={465} media="(max-width: 767px)" src={mobile} />
            <Source width={840} height={320} media="(min-width: 768px)" src={desktop || mobile} />
          </>
        )}

        {/* Fallback para o caso de <img> */}
        <img className="w-full h-full object-cover" src={desktop || mobile} alt={alt} decoding="async" loading="lazy" />
      </Picture>
    </a>
  );
}

function Gallery({ banners = [] }: Props) {
  return (
    <div className="bg-[#f8f8f8] py-4">
      <Section.Container className="custom-container md:p-2">
        {banners.length === 2 ? (
          <div className="grid grid-cols-2 gap-3">
            {banners.map((banner, index) => (
              <div key={index}>
                <Banner {...banner} index={index} isSingleBanner={banners.length === 2} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Banner grande no topo */}
            <div className="w-full">
              <Banner {...banners[0]} index={0} />
            </div>

            {/* Dois banners menores embaixo */}
            <div className="grid grid-cols-2 gap-3">
              {banners.slice(1).map((banner, index) => (
                <div key={index}>
                  <Banner {...banner} index={index + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Section.Container>
    </div>
  );
}

export default Gallery;
