import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section, { type Props as SectionHeaderProps } from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { LoadingFallbackProps } from "deco/mod.ts";

/** @titleBy label */
export interface Item {
  image: ImageWidget;
  href: string;
  label: string;
}

export interface Props extends SectionHeaderProps {
  items?: Item[];
}

function Card({ image, href, label }: Item) {
  return (
    <a href={href} class="flex flex-col items-center justify-center gap-2">
      <Image class="rounded-xl" src={image} alt={label} width={120} height={120} loading="lazy" />
      <span class="font-medium text-sm">{label}</span>
    </a>
  );
}

function CategoryGrid({ items = [] }: Props) {
  const showNavigation = items.length > 12;

  return (
    <Section.Container class="custom-container relative">
      <Slider class="carousel carousel-center sm:carousel-end gap-4 col-span-full row-start-2 row-end-5">
        {items.map((item, index) => {
          const itemClasses = clx(
            "carousel-item first:pl-6 sm:first:pl-0 last:pr-0",
            index === items.length - 1 ? "sm:pr-0" : ""
          );
          return (
            <div key={index} class={itemClasses}>
              <Card {...item} />
            </div>
          );
        })}
      </Slider>

      {showNavigation && (
        <>
          <div class="flex items-center justify-start z-10 absolute left-0 top-1/2 transform -translate-y-1/2">
            <Slider.PrevButton class="btn" aria-label="Previous item">
              <Icon id="chevron-right" class="rotate-180" />
            </Slider.PrevButton>
          </div>
          <div class="flex items-center justify-end z-10 absolute right-0 top-1/2 transform -translate-y-1/2">
            <Slider.NextButton class="btn" aria-label="Next item">
              <Icon id="chevron-right" />
            </Slider.NextButton>
          </div>
        </>
      )}
    </Section.Container>
  );
}

export const LoadingFallback = ({ title, cta }: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="212px" />
  </Section.Container>
);

export default CategoryGrid;
