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
    <footer
      class="sm:px-0 sm:mt-10"
      style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #D8D8D8" }}
    >
      <div class="sm:custom-container flex flex-col pt-[30px] sm:pt-12">
        {device === "mobile" ? (
          <>
            {social && social.socialItens && social.socialItens.length > 0 && (
              <div class="flex flex-col items-end px-[15px] mb-[38px]">
                <h2 class="text-center sm:text-left font-bold text-sm	">
                  {social.title}
                </h2>
                <ul class="flex gap-4 mt-2">
                  {social.socialItens.map(({ image, href, alt }) => (
                    <li>
                      <a href={href}>
                        <Image
                          src={image}
                          alt={alt}
                          loading="lazy"
                          width={36}
                          height={36}
                        />
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
                        <a
                          class="lg:text-sm text-xs font-normal text-base-400"
                          href={href}
                        >
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
                        <a
                          class="lg:text-sm text-xs font-normal text-base-400"
                          href={href}
                        >
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

          {infos.map(({ title, href, children }, index) => (
            <li
              class={`px-[16px] sm:p-0 ${
                device === "mobile" ? "bg-[#F8F8F8]" : ""
              } ${
                index === 0 && device === "mobile" ? "pt-[16px]" : "pb-[16px]"
              }`}
            >
              <div class="flex flex-col gap-4">
                <a
                  class={`lg:text-base text-sm font-bold ${
                    index === 1 ? "opacity-0" : ""
                  } ${device === "mobile" ? "hidden" : ""}`}
                  href={href}
                >
                  {title}
                </a>
                <ul
                  class={`flex flex-col gap-2 ${
                    index === 0 && device === "mobile"
                      ? "border-b border-[#D8D8D8] pb-[15px]"
                      : "pt-[15px]"
                  }`}
                >
                  {children.map(({ title, subItems }) => (
                    <li>
                      <p class="lg:text-base text-sm  font-bold text-base-400">
                        {title}
                      </p>
                      {subItems && subItems.length > 0 && (
                        <ul class="flex flex-col gap-2">
                          {subItems.map(({ href, text }) => (
                            <li>
                              {href ? (
                                <a
                                  class="lg:text-sm text-xs font-normal text-base-400 underline"
                                  href={href}
                                >
                                  {text}
                                </a>
                              ) : (
                                <span class="lg:text-sm text-xs font-normal text-base-400">
                                  {text}
                                </span>
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
              {paymentMethods &&
                paymentMethods.socialItens &&
                paymentMethods.socialItens.length > 0 && (
                  <div class="flex flex-col items-center sm:items-start">
                    <h2 class="text-center sm:text-left font-bold text-base ">
                      {paymentMethods.title}
                    </h2>
                    <ul class="flex gap-4 mt-4">
                      {paymentMethods.socialItens.map(
                        ({ image, href, alt }) => (
                          <li>
                            <a href={href}>
                              <Image
                                src={image}
                                alt={alt}
                                loading="lazy"
                                width={41}
                                height={28}
                              />
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {security &&
                security.socialItens &&
                security.socialItens.length > 0 && (
                  <div class="flex flex-col items-center sm:items-start">
                    <h2 class="text-center sm:text-left font-bold text-sm	">
                      {security.title}
                    </h2>
                    <ul class="flex gap-4 items-center">
                      {security.socialItens.map(({ image, href, alt }) => (
                        <li>
                          <a href={href}>
                            <Image
                              src={image}
                              alt={alt}
                              loading="lazy"
                              width={83}
                              height={48}
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {social &&
                social.socialItens &&
                social.socialItens.length > 0 && (
                  <div class="flex flex-col items-center sm:items-start">
                    <h2 class="text-center sm:text-left font-bold text-sm	">
                      {social.title}
                    </h2>
                    <ul class="flex gap-4 mt-4">
                      {social.socialItens.map(({ image, href, alt }) => (
                        <li>
                          <a href={href}>
                            <Image
                              src={image}
                              alt={alt}
                              loading="lazy"
                              width={36}
                              height={36}
                            />
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
              {paymentMethods &&
                paymentMethods.socialItens &&
                paymentMethods.socialItens.length > 0 && (
                  <div class="flex flex-col items-start mb-[33px]">
                    <h2 class="text-center sm:text-left font-bold text-sm	">
                      {paymentMethods.title}
                    </h2>
                    <ul class="flex gap-4 mt-4">
                      {paymentMethods.socialItens.map(
                        ({ image, href, alt }) => (
                          <li>
                            <a href={href}>
                              <Image
                                src={image}
                                alt={alt}
                                loading="lazy"
                                width={41}
                                height={28}
                              />
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {security &&
                security.socialItens &&
                security.socialItens.length > 0 && (
                  <div class="flex flex-col items-start mb-[26px]">
                    <h2 class="text-left font-bold text-sm	">
                      {security.title}
                    </h2>
                    <ul class="flex gap-4 items-center">
                      {security.socialItens.map(({ image, href, alt }) => (
                        <li>
                          <a href={href}>
                            <Image
                              src={image}
                              alt={alt}
                              loading="lazy"
                              width={83}
                              height={48}
                            />
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
                    <p
                      class="mt-2 lg:text-sm text-xs"
                      style={{ maxWidth: 556 }}
                    >
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
              <span class="text-xs text-center w-[290px]">
                {copyright?.copy}
              </span>
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
