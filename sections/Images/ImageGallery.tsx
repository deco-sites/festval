import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { type LoadingFallbackProps } from "@deco/deco";
import { SectionProps } from "@deco/deco";
import { getCookies, setCookie } from "std/http/cookie.ts";
import Section from "../../components/ui/Section.tsx";
import { AppContext } from "../../apps/site.ts";

/**
 * @titleBy alt
 */
interface Banner {
  mobile: ImageWidget;
  desktop?: ImageWidget;
  /** @description Image alt texts */
  alt: string;
  /** @description Adicione um link para o banner desktop */
  href: string;
  /** @description Adicione um link para o banner mobile */
  hrefMobile?: string;
  /** @description Show as main banner  */
  positionBanner: "Full" | "Left" | "Right";
  /** @description Region which banner will be shown  */
  region: "Cascavel" | "Curitiba" | "Mostrar em ambas";
  /** @description Activate deadline */
  activeTerm: boolean;

  /**
   * @description Initial date
   * @format date
   * @default	2024-01-02
   */
  initialDate: string;

  /**
   * @description Deadline date
   * @format date
   * @default	2024-01-02
   */
  deadLine: string;
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

interface Props {
  /**
   * @maxItems 9
   * @minItems 2
   */
  banners?: Banner[];
  /** @description Inverter o layout para mostrar o banner grande abaixo dos dois menores */
  inverted?: boolean;

  /**
   * @hide
   */
  region?: string;
}

export async function loader(
  { banners, inverted, region }: Props,
  req: Request,
  ctx: AppContext
) {
  const cookies = getCookies(req.headers);
  const cep = cookies["vtex_last_session_cep"];
  const regionCookie = cookies["region"];

  if (!regionCookie) {
    if (!cep) {
      region = undefined;

      return { banners, inverted, region };
    }

    const cepFormatted = cep.toString().replace("-", "").trim();

    const response = await fetch(
      `https://viacep.com.br/ws/${cepFormatted}/json`
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar endereço: ${response.statusText}`);
    }

    const address: Address = await response.json();

    region = address.localidade;

    const now = new Date();
    const expirationTime = now.getTime() + 23 * 60 * 60 * 1000;

    setCookie(ctx.response.headers, {
      value: region,
      name: "region",
      path: "/",
      expires: new Date(expirationTime),
      secure: true,
    });

    return { banners, inverted, region };
  } else {
    region = regionCookie;

    return { banners, inverted, region };
  }
}

function Banner({
  mobile,
  desktop,
  alt,
  href,
  hrefMobile,
  index,
  isSingleBanner,
}: Partial<Banner> & { index: number; isSingleBanner?: boolean }) {
  if (!mobile) {
    throw new Error("A propriedade 'mobile' é obrigatória.");
  }
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const bannerHref = isMobile && hrefMobile ? hrefMobile : href;

  return (
    <a href={bannerHref} className="overflow-hidden">
      <Picture>
        {/* Mobile Source */}
        {isSingleBanner ? (
          // Banner único, sem tamanhos fixos
          <>
            <Source
              width={528}
              height={465}
              media="(max-width: 767px)"
              src={mobile}
            />
            <Source
              width={840}
              height={320}
              media="(min-width: 768px)"
              src={desktop || mobile}
            />
          </>
        ) : index === 0 ? (
          // Primeiro banner (grande) com tamanhos diferentes
          <>
            <Source
              width={1080}
              height={465}
              media="(max-width: 767px)"
              src={mobile}
            />
            <Source
              width={1700}
              height={400}
              media="(min-width: 768px)"
              src={desktop || mobile}
            />
          </>
        ) : (
          // Demais banners
          <>
            <Source
              width={528}
              height={465}
              media="(max-width: 767px)"
              src={mobile}
            />
            <Source
              width={840}
              height={320}
              media="(min-width: 768px)"
              src={desktop || mobile}
            />
          </>
        )}

        {/* Fallback para o caso de <img> */}
        <img
          className="w-full h-full object-cover"
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
  banners = [],
  inverted = false,
  region,
}: SectionProps<typeof loader>) {
  const isValidDateRange = (banner: Banner) => {
    if (!banner.activeTerm) return true;

    const now = new Date();

    const initialDate = new Date(banner.initialDate);
    initialDate.setHours(0, 0, 0, 0);

    const deadLine = new Date(banner.deadLine);
    deadLine.setHours(23, 59, 59, 999);

    return now >= initialDate && now <= deadLine;
  };

  const filteredBanners = banners.filter((banner) => isValidDateRange(banner));

  const prioritizeByRegion = (banner: Banner) => {
    if (region) {
      if (banner.region === region) return 1;
      if (banner.region === "Mostrar em ambas") return 2;
      return 3;
    }
    return banner.region ? 3 : 2;
  };

  const sortedBanners = [...filteredBanners].sort(
    (a, b) => prioritizeByRegion(a) - prioritizeByRegion(b)
  );

  const fullBanner = sortedBanners.find(
    (banner) => banner.positionBanner === "Full"
  );
  const leftBanner = sortedBanners.find(
    (banner) => banner.positionBanner === "Left"
  );
  const rightBanner = sortedBanners.find(
    (banner) => banner.positionBanner === "Right"
  );

  return (
    <div className="bg-[#f8f8f8] py-4">
      <Section.Container className="custom-container md:p-2">
        {fullBanner ? (
          <div
            className={`flex flex-col gap-3 ${
              inverted ? "flex-col-reverse" : ""
            }`}
          >
            <div className="w-full">
              <Banner {...fullBanner} index={0} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[leftBanner, rightBanner]
                .filter(Boolean)
                .map((banner, index) => {
                  if (!banner?.mobile || !banner?.alt) {
                    console.warn(`Banner inválido na posição ${index}`, banner);
                    return null;
                  }

                  return (
                    <div key={index}>
                      <Banner
                        {...banner}
                        index={index + 1}
                        isSingleBanner={sortedBanners.length === 2}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[leftBanner, rightBanner].filter(Boolean).map((banner, index) => {
              if (!banner?.mobile || !banner?.alt) {
                console.warn(`Banner inválido na posição ${index}`, banner);
                return null;
              }

              return (
                <div key={index}>
                  <Banner
                    {...banner}
                    index={index + 1}
                    isSingleBanner={sortedBanners.length === 2}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Section.Container>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="322px" />;

export default Gallery;
