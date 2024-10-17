import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import PoweredByDeco from "apps/website/components/PoweredByDeco.tsx";
import Section from "../../components/ui/Section.tsx";

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
  trademark?: string;
}

function Footer({
  links = [],
  infos = [],
  social,
  security,
  policies,
  paymentMethods,
  copyright,
  underEighteen,
}: Props) {
  return (
    <footer
      class="px-5 sm:px-0 mt-5 sm:mt-10"
      style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #D8D8D8" }}
    >
      <div class="container flex flex-col gap-10 py-12">
        <ul class="grid grid-cols-5 sm:grid-cols-5 gap-10">
          {links.map(({ title, href, children }) => (
            <li class="flex flex-col gap-4">
              <a class="text-base font-bold" href={href}>
                {title}
              </a>
              <ul class="flex flex-col gap-2">
                {children.map(({ title, href }) => (
                  <li>
                    <a class="text-sm font-normal text-base-400" href={href}>
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {infos.map(({ title, href, children }) => (
            <li class="flex flex-col gap-4">
              <a class="text-base font-bold" href={href}>
                {title}
              </a>
              <ul class="flex flex-col gap-2">
                {children.map(({ title, subItems }) => (
                  <li>
                    <p>{title}</p>
                    {subItems && subItems.length > 0 && (
                      <ul class="flex flex-col gap-2">
                        {subItems.map(({ href, text }) => (
                          <li>
                            {href ? (
                              <a
                                class="text-sm font-bold text-base-400"
                                href={href}
                              >
                                {text}
                              </a>
                            ) : (
                              <span class="text-sm font-normal text-base-400">
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
            </li>
          ))}
        </ul>

        <div class="flex flex-col sm:flex-row gap-8 justify-between items-start">
          {paymentMethods &&
            paymentMethods.socialItens &&
            paymentMethods.socialItens.length > 0 && (
              <div class="flex flex-col items-center sm:items-start">
                <h2 class="text-center sm:text-left font-bold">
                  {paymentMethods.title}
                </h2>
                <ul class="flex gap-4 mt-4">
                  {paymentMethods.socialItens.map(({ image, href, alt }) => (
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
                  ))}
                </ul>
              </div>
            )}

          {security &&
            security.socialItens &&
            security.socialItens.length > 0 && (
              <div class="flex flex-col items-center sm:items-start">
                <h2 class="text-center sm:text-left font-bold">
                  {security.title}
                </h2>
                <ul class="flex gap-4 mt-4 items-center">
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

          {social && social.socialItens && social.socialItens.length > 0 && (
            <div class="flex flex-col items-center sm:items-start">
              <h2 class="text-center sm:text-left font-bold">{social.title}</h2>
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
                width={250}
                height={140}
                class="mt-4"
              />
            </div>
          )}
        </div>

        <hr class="w-full text-base-400 mt-10" />

        {policies && (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 class="font-bold">{policies.title}</h2>
              <p class="mt-2">{policies.text}</p>
            </div>
          </div>
        )}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
          <div>
            <span>{copyright?.copy}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>Desenvolvido por:</span>
            {copyright?.developer && (
              <a href={copyright.developer.href}>
                <Image
                  src={copyright.developer.image}
                  alt={copyright.developer.alt ?? "Developer"}
                  loading="lazy"
                  width={41}
                  height={28}
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
