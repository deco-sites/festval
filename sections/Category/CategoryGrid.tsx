import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section, { type Props as SectionHeaderProps } from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { LoadingFallbackProps } from "deco/mod.ts";
import { useDevice } from "@deco/deco/hooks";

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
  return (
    <a href={href} class="flex flex-col items-center justify-center gap-2">
      <Image class="rounded-xl" src={image} alt={label} width={120} height={120} loading="lazy" />

      <span class="font-medium text-sm">{label}</span>
    </a>
  );
}
function CategoryGrid({ title, items }: Props) {
  const device = useDevice();
  return (
    <Section.Container class="custom-container realtive">
      <Section.Header title={title} />

      {device === "desktop" ? (
        <div class="grid grid-cols-12 gap-5">
          {items.map((i) => (
            <Card {...i} />
          ))}
        </div>
      ) : (
        <Slider class="carousel carousel-center sm:carousel-end gap-5 w-full">
          {items.map((i, index) => (
            <Slider.Item index={index} class={clx("carousel-item", "first:pl-5 first:sm:pl-0", "last:pr-5 last:sm:pr-0")}>
              <Card {...i} />
            </Slider.Item>
          ))}
        </Slider>
      )}
    </Section.Container>
  );
}

export const LoadingFallback = ({ title }: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} />
    <Section.Placeholder height="212px" />;
  </Section.Container>
);
export default CategoryGrid;
