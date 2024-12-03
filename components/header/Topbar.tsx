import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { useDevice } from "@deco/deco/hooks";

interface Props {
  mobile?: ImageWidget;
  desktop?: ImageWidget;
  /** @description Image alt texts */
  alt?: string;
  /** @description Adicione um link para o banner desktop */
  href?: string;
  /** @description Adicione um link para o banner mobile */
  hrefMobile?: string;
  /** @hide */
  width?: number;
  /** @hide */
  height?: number;
}

export interface TopBarProps {
  topBarProps: Props;
}

function Banner({
  mobile,
  desktop,
  alt,
  href,
  hrefMobile,
  width,
  height,
}: Partial<Props>) {
  if (!mobile) {
    throw new Error("A propriedade 'mobile' é obrigatória.");
  }
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const bannerHref = isMobile && hrefMobile ? hrefMobile : href;

  return (
    <a href={bannerHref} className="overflow-hidden">
      <Picture>
        <>
          <Source
            width={1080}
            height={159}
            media="(max-width: 767px)"
            src={mobile}
          />
          <Source
            width={1920}
            height={50}
            media="(min-width: 768px)"
            src={desktop || mobile}
          />
        </>
        {/* Fallback para o caso de <img> */}
        <img
          className="w-full h-full object-cover"
          width={width}
          height={height}
          src={desktop || mobile}
          alt={alt}
          decoding="async"
          loading="lazy"
        />
      </Picture>
    </a>
  );
}

function Topbar({ topBarProps }: TopBarProps) {
  const { mobile, desktop, alt, href, hrefMobile } = topBarProps;
  const device = useDevice();
  const isMobile = device === "mobile";
  const width = isMobile ? 1080 : 1920;
  const height = isMobile ? 159 : 50;

  return (
    <div class="w-full flex justify-center">
      <div style={`width:${width}px; height:${height}px;`}>
        <Banner
          mobile={mobile ?? undefined}
          desktop={desktop ?? undefined}
          alt={alt ?? undefined}
          href={href ?? undefined}
          hrefMobile={hrefMobile ?? undefined}
          width={width ?? undefined}
          height={height ?? undefined}
        />
      </div>
    </div>
  );
}

export default Topbar;
