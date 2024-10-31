import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  image: {
    mobile: ImageWidget;
    desktop?: ImageWidget;
    altText: string;
  };
  text?: {
    content?: string;
    layout?: {
      position?: "text-center" | "text-left" | "text-right" | "text-start";
    };
  };
  title?: {
    content?: string;
    layout?: {
      position?: "justify-start" | "justify-center" | "justify-end";
    };
  };
  reverseOrder?: boolean;
}

const DEFAULT_PROPS: Props = {
  title: {
    layout: {
      position: "justify-center",
    },
    content: "Collection",
  },
  text: {
    layout: {
      position: "text-start",
    },
    content: "Your text",
  },
  image: {
    mobile:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/cac2dc1c-48ac-4274-ad42-4016b0bbe947",
    altText: "Fashion",
  },
  reverseOrder: false,
};

function ShoppableBanner(props: Props) {
  const { title, text, image, reverseOrder } = { ...DEFAULT_PROPS, ...props };

  return (
    <div class="custom-container mb-5 mt-3">
      <div
        class={`card lg:card-side rounded grid grid-cols-1 lg:grid-cols-2 ${
          reverseOrder ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        <div
          class={`flex flex-col justify-center gap-0 md:gap-3  md:px-8 px-2 ${reverseOrder ? "lg:order-2" : "lg:order-1"}`}
        >
          <p class={`md:text-3xl text-lg flex mb-1 lg:mb-3 font-semibold ${title?.layout?.position}`}>{title?.content}</p>
          <p className={`md:text-base mb-3 lg:mb-0 text-xs ${text?.layout?.position}`}>{text?.content}</p>
        </div>
        <figure class={`flex w-full h-auto relative ${reverseOrder ? "lg:order-1" : "lg:order-2"}`}>
          <Picture>
            <Source media="(max-width: 767px)" src={image.mobile} width={768} height={400} />
            <Source media="(min-width: 768px)" src={image.desktop || image.mobile} width={768} height={400} />
            <img
              class="rounded-[20px] w-full max-w-[800px] md:px-0 px-2"
              sizes="(max-width: 640px) 100vw, 100vw"
              src={image.mobile}
              alt={image.altText}
              decoding="async"
              loading="lazy"
            />
          </Picture>
        </figure>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export default ShoppableBanner;
