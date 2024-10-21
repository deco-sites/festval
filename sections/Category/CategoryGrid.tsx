import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section, { type Props as SectionHeaderProps } from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
import Icon from "../../components/ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";

/** @titleBy label */
export interface Item {
  image: ImageWidget;
  href: string;
  label: string;
}

export interface Props extends SectionHeaderProps {
  items: Item[];
}

function Card({ image, href, label }: Item) {
  const device = useDevice(); // Detecta se é mobile ou desktop

  const size = device === "mobile" ? 90 : 121; // Tamanhos dinâmicos
  return (
    <a href={href} class="flex flex-col items-center justify-center gap-2">
      <Image class="rounded-xl" src={image} alt={label} width={size} height={size} loading="lazy" />
      <span class="font-medium text-sm">{label}</span>
    </a>
  );
}

function CategorySlider({ title, items }: Props) {
  const device = useDevice();
  const id = useId();

  const hasArrows = items.length > 12;

  return (
    <Section.Container class="custom-container pr-0 md:p-2">
      <Section.Header title={title} />

      <div
        id={id}
        class=" relative"
        style={{
          gridTemplateColumns: hasArrows ? "min-content 1fr min-content" : "1fr",
        }}
      >
        <div class="overflow-x-auto">
          <Slider class="carousel carousel-center sm:carousel-end gap-5 w-full">
            {items.map((item, index) => (
              <Slider.Item index={index} class={clx("carousel-item", "first:pl-5 first:sm:pl-0", "last:pr-5 last:sm:pr-0")}>
                <Card {...item} />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        {hasArrows && (
          <>
            <div class=" z-10 self-center lg:-left-8 md:left-0  p-2 absolute inset-y-0  ">
              <Slider.PrevButton class="hidden sm:flex disabled:opacity-75 no-animation">
                <Icon id="chevron-right" class="rotate-180" />
              </Slider.PrevButton>
            </div>

            <div class=" z-10 self-center lg:-right-8 sm:right-0   p-2 absolute inset-y-0 ">
              <Slider.NextButton class="hidden sm:flex disabled:opacity-75 no-animation">
                <Icon id="chevron-right" />
              </Slider.NextButton>
            </div>
          </>
        )}
      </div>

      <Slider.JS rootId={id} />
    </Section.Container>
  );
}

export const LoadingFallback = ({ title }: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} />
    <Section.Placeholder height="212px" />
  </Section.Container>
);

export default CategorySlider;
