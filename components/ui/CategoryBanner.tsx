import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { type SectionProps } from "@deco/deco";
import Section from "../../components/ui/Section.tsx";

/**
 * @titleBy matcher
 */
export interface Banner {
  /** @description Array de palavras-chave para habilitar este banner quando estiverem presentes na URL */
  matcher: string[];
  images: {
    /** @description Imagem para tela desktop */
    desktop: ImageWidget;
    /** @description Imagem para tela mobile */
    mobile: ImageWidget;
    /** @description Texto alternativo para a imagem */
    alt?: string;
    /** @description Link do banner para desktop */
    href: string;
    /** @description Link do banner para mobile */
    hrefMobile?: string;
  }[];
}

const DEFAULT_PROPS = {
  banners: [
    {
      matcher: ["churrasco", "acougue"],
      images: [
        {
          mobile: "https://link-imagem-mobile-1.jpg",
          desktop: "https://link-imagem-desktop-1.jpg",
          alt: "Banner 1",
          href: "#",
          hrefMobile: "#",
        },
        {
          mobile: "https://link-imagem-mobile-2.jpg",
          desktop: "https://link-imagem-desktop-2.jpg",
          alt: "Banner 2",
          href: "#",
          hrefMobile: "#",
        },
        {
          mobile: "https://link-imagem-mobile-3.jpg",
          desktop: "https://link-imagem-desktop-3.jpg",
          alt: "Banner 3",
          href: "#",
          hrefMobile: "#",
        },
      ],
    },
  ],
};

function SingleBanner({ image, size }: { image: Banner["images"][0]; size: "large" | "medium" | "small" }) {
  const dimensions = {
    large: { desktopWidth: 1700, desktopHeight: 400, mobileWidth: 1080, mobileHeight: 465 },
    medium: { desktopWidth: 840, desktopHeight: 320, mobileWidth: 528, mobileHeight: 465 },
    small: { desktopWidth: 528, desktopHeight: 320, mobileWidth: 360, mobileHeight: 120 },
  };

  const { desktopWidth, desktopHeight, mobileWidth, mobileHeight } = dimensions[size];

  return (
    <a href={image.href} className="overflow-hidden">
      <Picture>
        <Source src={image.mobile} width={mobileWidth} height={mobileHeight} media="(max-width: 767px)" />
        <Source src={image.desktop} width={desktopWidth} height={desktopHeight} media="(min-width: 768px)" />
        <img className="w-full h-full object-cover" src={image.desktop} alt={image.alt} />
      </Picture>
    </a>
  );
}

function Gallery({ images }: { images: Banner["images"] }) {
  if (images.length === 1) {
    // Renderiza um único banner com tamanho grande
    return <SingleBanner image={images[0]} size="large" />;
  } else if (images.length === 2) {
    // Renderiza dois banners em uma grade de duas colunas, tamanho médio
    return (
      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <SingleBanner key={index} image={image} size="medium" />
        ))}
      </div>
    );
  } else if (images.length >= 3) {
    // Renderiza um banner grande e dois menores
    return (
      <div className="flex flex-col gap-3 custom-container">
        <div className="w-full">
          <SingleBanner image={images[0]} size="large" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {images.slice(1, 3).map((image, index) => (
            <SingleBanner key={index} image={image} size="medium" />
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export interface Props {
  banners?: Banner[];
}

export const loader = (props: Props, req: Request) => {
  const { banners } = { ...DEFAULT_PROPS, ...props };
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("q") || "";

  const bannerSet = banners.find(({ matcher }) =>
    matcher.some((pattern) => searchQuery.toLowerCase().includes(pattern.toLowerCase()))
  );

  return { bannerSet };
};

export default function BannerGallery(props: SectionProps<ReturnType<typeof loader>>) {
  const { bannerSet } = props;
  if (!bannerSet) return null;
  return <Gallery images={bannerSet.images} />;
}
export const LoadingFallback = () => <Section.Placeholder height="145px" />;
