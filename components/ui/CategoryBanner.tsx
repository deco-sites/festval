import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { SectionProps } from "@deco/deco";
import Section from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { getCookies } from "std/http/cookie.ts";

/**
 * Widget para configurar o banner no admin Deco
 */
export interface BannerImage {
  desktop: ImageWidget;
  mobile: ImageWidget;
  alt?: string;
  href: string;
  hrefMobile?: string;
  activeTerm?: boolean;
  initialDate?: string;
  deadLine?: string;
  
  /** @description Região onde o banner será exibido */
  region?: "Cascavel" | "Curitiba"; 
}

export interface Banner {
  matcher: string[];
  images: BannerImage[];
}

export const bannerSchema = {
  title: "Banner",
  type: "object",
  properties: {
    matcher: {
      type: "array",
      items: { type: "string" },
      title: "Matchers",
      description: "Palavras para disparar esse banner",
    },
    images: {
      type: "array",
      title: "Imagens do banner",
      items: {
        type: "object",
        properties: {
          desktop: { $ref: "ImageWidget" },
          mobile: { $ref: "ImageWidget" },
          alt: { type: "string", title: "Texto alternativo" },
          href: { type: "string", title: "Link do banner" },
          hrefMobile: { type: "string", title: "Link mobile (opcional)" },
          activeTerm: { type: "boolean", title: "Ativar controle de data" },
          initialDate: { type: "string", title: "Data inicial (dd/mm/yyyy)" },
          deadLine: { type: "string", title: "Data final (dd/mm/yyyy)" },
          region: {
            type: "string",
            title: "Região",
            enum: ["Cascavel", "Curitiba"],
            description: "Região onde o banner será exibido",
          },
        },
        required: ["desktop", "mobile", "href"],
      },
    },
  },
  required: ["matcher", "images"],
}; 

const DEFAULT_PROPS: { banners: Banner[] } = {
  banners: [
    {
      matcher: ["adega"],
      images: [
        {
          mobile: "https://link-mobile-1.jpg",
          desktop: "https://link-desktop-1.jpg",
          alt: "Banner 1",
          href: "#",
          activeTerm: true,
          initialDate: "01/01/2024",
          deadLine: "31/12/2024",
          region: "Curitiba",
        },
        {
          mobile: "https://link-mobile-2.jpg",
          desktop: "https://link-desktop-2.jpg",
          alt: "Banner 2",
          href: "#",
          activeTerm: false,
          region: "Cascavel",
        },
      ],
    },
  ],
};

function BannerItem({ image }: { image: Banner["images"][0] }) {
  return (
    <a href={image.href} className="overflow-hidden block">
      <Picture>
        <Source src={image.mobile} media="(max-width: 767px)" width={1080} height={465} />
        <Source src={image.desktop} media="(min-width: 768px)" width={1920} height={490} />
        <img src={image.desktop} alt={image.alt} className="w-full h-full object-cover" />
      </Picture>
    </a>
  );
}

export function loader(props: { banners: Banner[] }, req: Request) {
  const { banners } = props;
  const cookies = getCookies(req.headers);
  const cep = cookies["vtex_last_session_cep"];
  let region = cookies["region"];

  if (!region) {
    if (!cep) {
      region = "Curitiba";
    } else {
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
    }
  }

  const url = new URL(req.url);
  const contextToMatch = `${url.pathname.toLowerCase()} ${url.searchParams.get("q")?.toLowerCase() || ""}`;

  const bannerSet = banners.find(({ matcher }) =>
    matcher.some((pattern) => new RegExp(`\\b${pattern.toLowerCase()}\\b`, "i").test(contextToMatch))
  );

  if (!bannerSet) {
    return { images: [], region };
  }

  const now = new Date();

  const filteredImages = bannerSet.images.filter((image) => {
    const initialDate = image.initialDate
      ? new Date(image.initialDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
      : null;
    const deadLine = image.deadLine
      ? new Date(image.deadLine.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
      : null;

    const isActiveDate =
      !image.activeTerm || (initialDate && deadLine && now >= initialDate && now <= deadLine);

    const isRegionMatch = !image.region || image.region === region;

    return isActiveDate && isRegionMatch;
  });

  return { images: filteredImages, region };
}

export default function BannerCarousel(props: SectionProps<ReturnType<typeof loader>>) {
  const { images = [] } = props;
  const id = useId();

  if (images.length === 0) return null;

  return (
    <div className="w-full overflow-hidden relative pb-4 max-w-[1920px] mx-auto">
      <Slider className="carousel carousel-center w-full gap-6" rootId={id} interval={5000} infinite>
        {images.map((image, index) => (
          <Slider.Item index={index} key={index} className="carousel-item w-full">
            <BannerItem image={image} />
          </Slider.Item>
        ))}
      </Slider>

      {images.length > 1 && (
        <ul className="carousel justify-center gap-3 mt-4">
          {images.map((_, index) => (
            <li key={index} className="carousel-item">
              <Slider.Dot index={index} className="bg-gray-400 h-2 w-6 rounded-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="490px" />;
