import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import { useDevice, useScript } from "@deco/deco/hooks";

/** @titleBy title */
interface Item {
  title: string;
  href: string;
}

interface SubItemInfos {
  href?: string;
  text?: string;
}

/**
 * @titleBy title
 */
interface ItemInfos {
  title?: string;
  subItems?: SubItemInfos[];
  linkWpp?: string;
  textoBtn?: string;
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
}: Props) {
  const device = useDevice();

  return (
    <footer class="sm:px-0 sm:mt-10" style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #D8D8D8" }}>
      <div class="sm:custom-container flex flex-col pt-[30px] sm:pt-12">
        {device === "mobile" ? (
          <>
            {social && social.socialItens && social.socialItens.length > 0 && (
              <div class="flex flex-col items-end px-[15px] mb-[38px]">
                <h2 class="text-center sm:text-left font-bold text-sm	">{social.title}</h2>
                <ul class="flex gap-4 mt-2">
                  {social.socialItens.map(({ image, href, alt }) => (
                    <li>
                      <a href={href}>
                        <Image src={image} alt={alt} loading="lazy" width={36} height={36} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : null}

        <ul class="grid grid-cols-1 sm:grid-cols-5 sm:gap-10 mb-14">
          {device !== "mobile"
            ? links.map(({ title, href, children }) => (
                <li class="flex flex-col gap-4">
                  <a class="lg:text-base text-sm font-bold" href={href}>
                    {title}
                  </a>
                  <ul class="flex flex-col gap-2">
                    {children.map(({ title, href }) => (
                      <li>
                        <a class="lg:text-sm text-xs font-normal text-base-400" href={href}>
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            : // deno-lint-ignore no-unused-vars
              links.map(({ title, href, children }) => (
                <li class="px-[15px] mb-[20px] flex flex-col gap-2">
                  <div class="flex justify-between ">
                    <button
                      hx-on:click={useScript(onClick)}
                      class="lg:text-base text-sm font-bold flex justify-between w-full"
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
                        <a class="lg:text-sm text-xs font-normal text-base-400" href={href}>
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

          {infos.map(({ title, href, children }, index) => (
            <li
              class={`px-[16px] sm:p-0 ${device === "mobile" ? "bg-[#F8F8F8]" : ""} ${
                index === 0 && device === "mobile" ? "pt-[16px]" : "pb-[16px]"
              }`}
            >
              <div class="flex flex-col gap-4">
                <a
                  class={`lg:text-base text-sm font-bold ${index === 1 ? "opacity-0" : ""} ${
                    device === "mobile" ? "hidden" : ""
                  }`}
                  href={href}
                >
                  {title}
                </a>
                <ul
                  class={`flex flex-col gap-2 ${
                    index === 0 && device === "mobile" ? "border-b border-[#D8D8D8] pb-[15px]" : "pt-[15px]"
                  }`}
                >
                  {children.map(({ title, subItems, linkWpp, textoBtn }) => (
                    <li>
                      <p class="lg:text-base text-sm  font-bold text-base-400">{title}</p>
                      {linkWpp && (
                        <a
                          href={linkWpp}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="flex justify-center items-center gap-3 mt-2 font-semibold w-full py-2 bg-base-200 text-sm border rounded-md hover:opacity-90"
                        >
                          <svg
                            id="wpp"
                            xmlns="http://www.w3.org/2000/svg"
                            width="19.004"
                            height="19"
                            viewBox="0 0 19.004 19"
                          >
                            <path
                              id="Caminho_2158"
                              data-name="Caminho 2158"
                              d="M22.5,13a9.5,9.5,0,0,0-7.949,14.706l-1.224,4.145,4.305-1.193A9.5,9.5,0,1,0,22.5,13Z"
                              transform="translate(-13 -13)"
                              fill="#25d366"
                            />
                            <path
                              id="Caminho_2159"
                              data-name="Caminho 2159"
                              d="M132.907,142.094a.345.345,0,0,0-.2-.285l-2.3-1.056a.216.216,0,0,0-.254.055l-1.04,1.173a.285.285,0,0,1-.325.078,7.386,7.386,0,0,1-2-1.232,7.462,7.462,0,0,1-1.685-2.092,1.822,1.822,0,0,0,.716-.935.014.014,0,0,1,0-.008,1.585,1.585,0,0,0-.035-1.032,11.019,11.019,0,0,0-.782-1.783c-.027-.027-.059-.055-.059-.055a.69.69,0,0,0-.43-.172c-.055,0-.113,0-.176,0a3.272,3.272,0,0,0-.457.012,1.18,1.18,0,0,0-.727.457,3.093,3.093,0,0,0-.547.993c-.012.039-.023.074-.035.113a2.8,2.8,0,0,0,.063,1.7,9.236,9.236,0,0,0,.837,1.767,9.781,9.781,0,0,0,1.889,2.229,9.024,9.024,0,0,0,2.334,1.666,8.1,8.1,0,0,0,2.538.739,2.8,2.8,0,0,0,1.24-.172,2.618,2.618,0,0,0,.61-.328,1.965,1.965,0,0,0,.817-1.3v-.012A2.341,2.341,0,0,0,132.907,142.094Z"
                              transform="translate(-118.185 -129.984)"
                              fill="#fff"
                            />
                          </svg>
                          {textoBtn}
                        </a>
                      )}
                      {subItems && subItems.length > 0 && (
                        <ul class="flex flex-col gap-2">
                          {subItems.map(({ href, text }) => (
                            <li>
                              {href ? (
                                <a class="lg:text-sm text-xs font-normal text-base-400 underline" href={href}>
                                  {text}
                                </a>
                              ) : (
                                <span class="lg:text-sm text-xs font-normal text-base-400">{text}</span>
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

        {device !== "mobile" ? (
          <>
            <div class="flex flex-col sm:flex-row gap-10 justify-between items-start">
              {paymentMethods && paymentMethods.socialItens && paymentMethods.socialItens.length > 0 && (
                <div class="flex flex-col items-center sm:items-start">
                  <h2 class="text-center sm:text-left font-bold text-base ">{paymentMethods.title}</h2>
                  <ul class="flex gap-4 mt-4">
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
                  <h2 class="text-center sm:text-left font-bold text-sm	">{security.title}</h2>
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
              )}

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
            </div>

            {policies && (
              <div class="grid grid-cols-1 sm:grid-cols-1 mb-12">
                <div>
                  <h2 class="text-sm font-bold">{policies.title}</h2>
                  <p class="mt-2 text-xs" style={{ maxWidth: 556 }}>
                    {policies.text}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div class="px-[15px] flex flex-col sm:flex-row justify-between items-start">
              {paymentMethods && paymentMethods.socialItens && paymentMethods.socialItens.length > 0 && (
                <div class="flex flex-col items-start mb-[33px]">
                  <h2 class="text-center sm:text-left font-bold text-sm	">{paymentMethods.title}</h2>
                  <ul class="flex gap-4 mt-4">
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
                <div class="flex flex-col items-start mb-[26px]">
                  <h2 class="text-left font-bold text-sm	">{security.title}</h2>
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
                <div class="grid grid-cols-1 sm:grid-cols-1 mb-[23px]">
                  <div>
                    <h2 class="text-sm font-bold">{policies.title}</h2>
                    <p class="mt-2 lg:text-sm text-xs" style={{ maxWidth: 556 }}>
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
        <div class=" py-2.5 " style={{ backgroundColor: "#3B3B3B" }}>
          <div class="custom-container p-0 flex justify-between items-center">
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
        <div class="pt-[11px] pb-[17px]" style={{ backgroundColor: "#3B3B3B" }}>
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
