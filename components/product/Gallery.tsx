import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "./ProductImageZoom.tsx";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

const WIDTH = 400;
const HEIGHT = 400;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();
  const zoomId = `${id}-zoom`;

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const {
    page: {
      product: { name, isVariantOf, image: pImages, productID },
    },
  } = props;

  const groupImages = isVariantOf?.image ?? pImages ?? [];
  const filtered = groupImages.filter((img) => name?.includes(img.alternateName || ""));
  const images = filtered.length > 0 ? filtered : groupImages;

  // Criar o item usando mapProductToAnalyticsItem
  const item = mapProductToAnalyticsItem({
    product: props.page.product,
  });

  return (
    <>
      <div id={id} class="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-[min-content_1fr] ">
        {/* Image Slider */}
        <div class="col-start-1 col-span-1 sm:col-start-2">
          <div class="relative  h-min flex-grow">
            <div className="absolute top-1 lg:right-[5rem] right-1">
              <WishlistButton item={item} />
            </div>

            <Slider class="carousel carousel-center gap-6 w-full">
              {images.map((img, index) => (
                <Slider.Item index={index} class="carousel-item justify-center w-full">
                  <Image
                    class="md:w-4/5 sm:w-full"
                    sizes="(max-width: 640px) 100vw, 100vw"
                    fit="contain"
                    src={img.url!}
                    alt={img.alternateName}
                    width={WIDTH}
                    height={HEIGHT}
                    preload={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </Slider.Item>
              ))}
            </Slider>

            <Slider.PrevButton
              class="no-animation absolute  left-1 lg:left-0 top-1/2 btn btn-circle hover:bg-transparent border-none shadow-inherit hover:opacity-80 hover:border-none bg-transparent disabled:invisible"
              disabled
            >
              <Icon id="chevron-right" class="rotate-180" />
            </Slider.PrevButton>

            <Slider.NextButton
              class="no-animation absolute right-1 lg:right-0 top-1/2 btn btn-circle hover:bg-transparent border-none shadow-inherit hover:opacity-80 hover:border-none bg-transparent disabled:invisible"
              disabled={images.length < 2}
            >
              <Icon id="chevron-right" />
            </Slider.NextButton>

            <ul class={clx("col-span-full absolute -bottom-2  inset-x-0 z-10", "carousel justify-center gap-3")}>
              {images.map((_, index) => (
                <li class="carousel-item">
                  <Slider.Dot
                    index={index}
                    class={clx(
                      " bg-gray-400 h-2 w-6 no-animation rounded-full",
                      "disabled:w-6 disabled:bg-black disabled:opacity-100 transition-[width]"
                    )}
                  ></Slider.Dot>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Slider.JS rootId={id} />
      </div>
      <ProductImageZoom id={zoomId} images={images} width={700} height={Math.trunc((700 * HEIGHT) / WIDTH)} />
    </>
  );
}
