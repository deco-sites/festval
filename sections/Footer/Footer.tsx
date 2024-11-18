import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import { useDevice, useScript } from "@deco/deco/hooks";

/** @titleBy title */
interface Item {
  title: string;
  href: string;
}
interface Img {
  image: ImageWidget;
  href?: string;
  imageMbGoogle: ImageWidget;
  hrefGoogle?: string;
  imageMbIOS: ImageWidget;
  hrefIOS?: string;
}

interface SubItemInfos {
  href?: string;
  text?: string;
  linkWpp?: string;
}

/**
 * @titleBy title
 */
interface ItemInfos {
  title?: string;
  subItems?: SubItemInfos[];
}

/** @titleBy title */
interface TitleItemInfos {
  title?: string;
  href?: string;
}

/** @titleBy title */
interface Link extends Item {
  children: Item[];
}

/** @titleBy title */
interface Infos extends TitleItemInfos {
  children: ItemInfos[];
}

interface SocialItem {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

/** @titleBy title */
interface Social {
  title: string;
  socialItens?: SocialItem[];
}

/** @titleBy title */
interface Police {
  title: string;
  text: string;
}

interface Copyright {
  copy: string;
  developer: SocialItem;
}

interface Props {
  links?: Link[];
  infos?: Infos[];
  highlightedImage?: Img;
  social?: Social;
  security?: Social;
  paymentMethods?: Social;
  policies?: Police;
  copyright?: Copyright;
  underEighteen?: ImageWidget;
  underEighteenMobile?: ImageWidget;
  trademark?: string;
}

const onClick = () => {
  event?.stopPropagation();

  const button = event?.currentTarget as HTMLButtonElement;
  const span = button.querySelector<HTMLSpanElement>("span");
  const arrow = span?.querySelector<HTMLImageElement>("img");
  const li = button.closest<HTMLLIElement>("li");
  const ul = li?.querySelector<HTMLUListElement>("ul");

  if (ul) {
    if (ul.style.maxHeight) {
      ul.style.maxHeight = "";
      ul.classList.remove("opacity-100");
      ul.classList.add("opacity-0");
    } else {
      // Abrir o menu
      const scrollHeight = ul.scrollHeight + "px";
      ul.style.maxHeight = scrollHeight;
      ul.classList.remove("opacity-0");
      ul.classList.add("opacity-100");
    }

    if (arrow) {
      arrow.classList.toggle("rotate-[-180deg]");
    }
  }
};

function Footer({
  links = [],
  infos = [],
  social,
  security,
  policies,
  paymentMethods,
  copyright,
  underEighteen,
  underEighteenMobile,
  highlightedImage,
}: Props) {
  const device = useDevice();

  return (
    <footer class="sm:px-0 sm:mt-10 mt-[25px]" style={{ backgroundColor: "#111" }}>
      <div class="sm:custom-container flex flex-col pt-[45px] sm:pt-12">
        <div class="flex flex-col sm:flex-row md:gap-2 mb-14 justify-between md:px-0 px-[15px]">
          {/* Links Column */}
          {/* <ul class="flex md:flex-row flex-col sm:gap-9 md:px-0 px-[15px]">
           
          </ul> */}
          {device !== "mobile"
            ? links.map(({ title, href, children }) => (
                <li class="flex flex-col gap-2 md:min-w-[200px] mb-6">
                  <a class="lg:text-lg text-base-100 text-sm font-bold" href={href}>
                    {title}
                  </a>
                  <ul class="flex flex-col gap-2">
                    {children.map(({ title, href }) => (
                      <li>
                        <a class="lg:text-base text-xs text-base-100 font-normal " href={href}>
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            : links.map(({ title, href, children }) => (
                <li class=" pt-[10px] pb-[6px] flex flex-col gap-1 border-t border-base-100 ">
                  <div class="flex justify-between ">
                    <button
                      hx-on:click={useScript(onClick)}
                      class="lg:text-base items-center text-base-100 text-sm font-bold flex justify-between w-full"
                    >
                      {title}
                      <span>
                        <Image
                          src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/dcef9dcd-1722-464c-8b37-80a0330dd82b/Caminho-11.svg"
                          class="transition-transform duration-300 ease-in-out"
                          width={12}
                          height={7}
                        />
                      </span>
                    </button>
                  </div>

                  <ul class="flex flex-col gap-2 max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out">
                    {children.map(({ title, href }) => (
                      <li>
                        <a class="lg:text-sm text-xs font-normal text-base-100" href={href}>
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

          {/* Infos Column */}
          {device === "mobile" ? (
            <li class="list-none md:w-fit w-full pt-[10px] pb-[6px] border-t border-b border-base-100">
              <div class="flex flex-col gap-1">
                <button
                  hx-on:click={useScript(onClick)}
                  class="lg:text-lg text-base-100 text-sm items-center font-bold flex justify-between w-full"
                  aria-expanded="false"
                  aria-controls="info-content"
                >
                  Fale com o Festval
                  <span>
                    <Image
                      src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/festval/dcef9dcd-1722-464c-8b37-80a0330dd82b/Caminho-11.svg"
                      class="transition-transform duration-300 ease-in-out"
                      width={12}
                      height={7}
                      alt="Expandir"
                    />
                  </span>
                </button>
                <ul
                  id="info-content"
                  class="flex flex-col gap-2 max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out"
                >
                  {infos.map(({ title, href, children }, index) => (
                    <li key={index} class="list-none">
                      <div class="flex flex-col gap-1">
                        {/* <a class="lg:text-lg text-base-100 text-sm font-bold" href={href}>
                          {title}
                        </a> */}
                        <ul class="flex flex-col gap-2 pt-0">
                          {children.map(({ title, subItems }) => (
                            <li key={title}>
                              <p class="lg:text-base text-sm text-base-100 md:font-bold font-normal">{title}</p>
                              {subItems && subItems.length > 0 && (
                                <ul class="flex flex-col gap-1 mb-2">
                                  {subItems.map(({ href, text, linkWpp }) => (
                                    <li key={text}>
                                      {href ? (
                                        <a class="lg:text-base text-xs font-normal text-base-100 underline" href={href}>
                                          {text}
                                        </a>
                                      ) : (
                                        <span class="lg:text-base text-xs font-normal text-base-100">{text}</span>
                                      )}
                                      {linkWpp && (
                                        <div class="flex flex-col items-start mt-2">
                                          <p class="lg:text-base text-sm text-base-100 font-normal">Whatsapp</p>
                                          <a
                                            href={linkWpp}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="flex justify-center items-center hover:opacity-90"
                                          >
                                            <svg
                                              id="wpp"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="27.635"
                                              height="27.635"
                                              viewBox="0 0 27.635 27.635"
                                            >
                                              <path
                                                id="Caminho_2236"
                                                data-name="Caminho 2236"
                                                d="M0,0H27.635V27.635H0Z"
                                                fill="none"
                                              />
                                              <path
                                                id="Caminho_2237"
                                                data-name="Caminho 2237"
                                                d="M3,23.723l1.9-4.375a10.363,10.363,0,1,1,3.915,3.339L3,23.723"
                                                transform="translate(0.454 0.457)"
                                                fill="none"
                                                stroke="#fff"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                              />
                                              <path
                                                id="Caminho_2238"
                                                data-name="Caminho 2238"
                                                d="M9,10.227a.576.576,0,1,0,1.151,0V9.076A.576.576,0,1,0,9,9.076v1.151a5.757,5.757,0,0,0,5.757,5.757h1.151a.576.576,0,0,0,0-1.151H14.757a.576.576,0,0,0,0,1.151"
                                                transform="translate(1.363 1.287)"
                                                fill="none"
                                                stroke="#fff"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                              />
                                            </svg>
                                          </a>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ) : (
            // Renderização para desktop (listagem normal)
            infos.map(({ title, href, children }, index) => (
              <li key={index} class="list-none md:w-fit w-full">
                <div class="flex flex-col md:gap-4 gap-1 last:gap-0">
                  <a class="lg:text-lg text-base-100 text-sm font-bold" href={href}>
                    {title}
                  </a>
                  <ul class="flex flex-col gap-2">
                    {children.map(({ title, subItems }) => (
                      <li key={title}>
                        <p class="lg:text-base text-sm text-base-100 md:font-bold">{title}</p>
                        {subItems && subItems.length > 0 && (
                          <ul class="flex flex-col gap-1 mb-2">
                            {subItems.map(({ href, text, linkWpp }) => (
                              <li key={text}>
                                {href ? (
                                  <a class="lg:text-base text-xs font-normal text-base-100 underline" href={href}>
                                    {text}
                                  </a>
                                ) : (
                                  <span class="lg:text-base text-xs font-normal text-base-100">{text}</span>
                                )}
                                {linkWpp && (
                                  <div class="flex flex-col items-start mt-2">
                                    <p class="lg:text-base text-sm text-base-100 font-normal">Whatsapp</p>
                                    <a
                                      href={linkWpp}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="flex justify-center items-center hover:opacity-90"
                                    >
                                      <svg
                                        id="wpp"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="27.635"
                                        height="27.635"
                                        viewBox="0 0 27.635 27.635"
                                      >
                                        <path
                                          id="Caminho_2236"
                                          data-name="Caminho 2236"
                                          d="M0,0H27.635V27.635H0Z"
                                          fill="none"
                                        />
                                        <path
                                          id="Caminho_2237"
                                          data-name="Caminho 2237"
                                          d="M3,23.723l1.9-4.375a10.363,10.363,0,1,1,3.915,3.339L3,23.723"
                                          transform="translate(0.454 0.457)"
                                          fill="none"
                                          stroke="#fff"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                        />
                                        <path
                                          id="Caminho_2238"
                                          data-name="Caminho 2238"
                                          d="M9,10.227a.576.576,0,1,0,1.151,0V9.076A.576.576,0,1,0,9,9.076v1.151a5.757,5.757,0,0,0,5.757,5.757h1.151a.576.576,0,0,0,0-1.151H14.757a.576.576,0,0,0,0,1.151"
                                          transform="translate(1.363 1.287)"
                                          fill="none"
                                          stroke="#fff"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                        />
                                      </svg>
                                    </a>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  {index === 0 && social && social.socialItens && (
                    <div class="w-full mt-3">
                      <h2 class="lg:text-base text-sm text-base-100 font-normal mt-2 mb-2">{social.title}</h2>
                      <ul class="flex gap-4">
                        {social.socialItens.map(({ image, href, alt }) => (
                          <li>
                            <a href={href} target="_blank" rel="noopener noreferrer">
                              <Image
                                class="!w-full !h-full max-h-[30px]"
                                src={image}
                                alt={alt}
                                loading="lazy"
                                width={30}
                                height={30}
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))
          )}

          {device === "mobile" && social && social.socialItens && (
            <div class="w-fit m-w-[140px] mt-5">
              <h2 class="lg:text-base text-sm text-base-100 font-normal mt-2 mb-2">{social.title}</h2>
              <ul class="flex gap-4 m-w-[140px]">
                {social.socialItens.map(({ image, href, alt }) => (
                  <li>
                    <a class="w-fit flex" href={href} target="_blank" rel="noopener noreferrer">
                      <Image
                        class="!w-fit !h-full max-h-[30px] max-w-[44px]"
                        src={image}
                        alt={alt}
                        loading="lazy"
                        width={30}
                        height={30}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {highlightedImage && (
            <>
              <div class="lg:flex hidden">
                <a href={highlightedImage.href}>
                  <Image src={highlightedImage.image} alt="Imagem Destacada" loading="lazy" width={286} height={219} />
                </a>
              </div>
              <div class="w-full flex  lg:hidden flex-col gap-1 mt-7 md:px-0 ">
                <p className="text-sm text-base-100 font-normal">Baixe o novo App</p>
                <div className="flex flex-row gap-4">
                  <a href={highlightedImage.hrefGoogle}>
                    <Image
                      class="!w-full !h-auto rounded-md"
                      src={highlightedImage.imageMbGoogle}
                      alt="Google Play"
                      loading="lazy"
                      width={150}
                      height={55}
                    />
                  </a>
                  <a href={highlightedImage.hrefIOS}>
                    <Image
                      class="!w-full !h-auto rounded-md"
                      src={highlightedImage.imageMbIOS}
                      alt="App Store"
                      loading="lazy"
                      width={150}
                      height={55}
                    />
                  </a>
                </div>
              </div>
            </>
          )}

          {/* <div class="infos px-[15px] flex md:flex-row flex-col items-start gap-4 2xl:gap-7 md:px-0 ">
           
          </div> */}
        </div>

        {device !== "mobile" ? (
          <>
            <div class="flex flex-col sm:flex-row gap-10 justify-between items-start">
              <div className="wrapper flex flex-row gap-9">
                {paymentMethods && paymentMethods.socialItens && paymentMethods.socialItens.length > 0 && (
                  <div class="flex flex-col items-center sm:items-start">
                    <h2 class="text-center text-base-100 sm:text-left font-bold md:text-lg text-sm">
                      {paymentMethods.title}
                    </h2>
                    <ul class="flex gap-2 mt-4">
                      {paymentMethods.socialItens.map(({ image, href, alt }) => (
                        <li>
                          <a href={href}>
                            <Image src={image} alt={alt} loading="lazy" width={41} height={28} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {security && security.socialItens && security.socialItens.length > 0 && (
                  <div class="flex flex-col items-center sm:items-start">
                    <h2 class="text-center text-base-100 sm:text-left font-bold md:text-lg	text-sm">{security.title}</h2>
                    <ul class="flex gap-4 items-center">
                      {security.socialItens.map(({ image, href, alt }) => (
                        <li>
                          <a href={href}>
                            <Image src={image} alt={alt} loading="lazy" width={83} height={48} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 
              {social && social.socialItens && social.socialItens.length > 0 && (
                <div class="flex flex-col items-center sm:items-start">
                  <h2 class="text-center sm:text-left font-bold text-sm	">{social.title}</h2>
                  <ul class="flex gap-4 mt-4">
                    {social.socialItens.map(({ image, href, alt }) => (
                      <li>
                        <a href={href}>
                          <Image src={image} alt={alt} loading="lazy" width={36} height={36} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              <div className="wrapper flex flex-row gap-9">
                {underEighteen && (
                  <div class="flex flex-col items-center">
                    <Image
                      src={underEighteen}
                      alt="18 Anos de Segurança"
                      loading="lazy"
                      width={316}
                      height={58}
                      class="mt-4"
                    />
                  </div>
                )}
                {policies && (
                  <div>
                    <p class="mt-2 text-xs text-end text-[#B2B2B2] min-w-[456px] max-w-[556px]">{policies.text}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div class="px-[15px] flex flex-col sm:flex-row justify-between items-start">
              {paymentMethods && paymentMethods.socialItens && paymentMethods.socialItens.length > 0 && (
                <div class="flex flex-col items-start mb-[33px] ">
                  <h2 class="text-center sm:text-left font-bold text-sm	text-base-100">{paymentMethods.title}</h2>
                  <ul class="flex gap-2 mt-4">
                    {paymentMethods.socialItens.map(({ image, href, alt }) => (
                      <li>
                        <a href={href}>
                          <Image src={image} alt={alt} loading="lazy" width={41} height={28} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {security && security.socialItens && security.socialItens.length > 0 && (
                <div class="flex flex-col items-start mb-[26px] ">
                  <h2 class="text-left font-bold text-sm	text-base-100">{security.title}</h2>
                  <ul class="flex gap-4 items-center">
                    {security.socialItens.map(({ image, href, alt }) => (
                      <li>
                        <a href={href}>
                          <Image src={image} alt={alt} loading="lazy" width={83} height={48} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {policies && (
                <div class="grid grid-cols-1 sm:grid-cols-1 mb-[23px] pt-[23px] border-base-100 border-t">
                  <div>
                    <p class="mt-2 lg:text-sm text-xs text-[#B2B2B2]" style={{ maxWidth: 556 }}>
                      {policies.text}
                    </p>
                  </div>
                </div>
              )}

              {underEighteenMobile && (
                <div class="flex flex-col items-center mb-[34px]">
                  <Image
                    src={underEighteenMobile}
                    alt="18 Anos de Segurança"
                    loading="lazy"
                    width={323}
                    height={22}
                    class="mt-4"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {device !== "mobile" ? (
        <div class="" style={{ backgroundColor: "#111" }}>
          <div class="custom-container mt-2 py-2.5 border-t border-[#ffff] flex justify-between items-center">
            <div style={{ color: "#FFF" }}>
              <span class="text-sm">{copyright?.copy}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="self-end text-xs" style={{ color: "#FFF" }}>
                Desenvolvido por
              </span>
              {copyright?.developer && (
                <a href={copyright.developer.href}>
                  <Image
                    class="!w-full !max-w-[120px] !h-full"
                    src={copyright.developer.image}
                    alt={copyright.developer.alt ?? "Developer"}
                    loading="lazy"
                    width={52}
                    height={38}
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div class=" mt-[23px] pt-[23px] border-base-100 border-t pb-[17px]" style={{ backgroundColor: "#111" }}>
          <div class="container flex flex-col gap-[15px] items-center">
            <div class="flex justify-center" style={{ color: "#FFF" }}>
              <span class="text-xs text-center w-[290px]">{copyright?.copy}</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <span class="self-end text-[10px]" style={{ color: "#FFF" }}>
                Desenvolvido por
              </span>
              {copyright?.developer && (
                <a href={copyright.developer.href}>
                  <Image
                    class="!w-full !max-w-[120px] !h-full"
                    src={copyright.developer.image}
                    alt={copyright.developer.alt ?? "Developer"}
                    loading="lazy"
                    width={52}
                    height={38}
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
