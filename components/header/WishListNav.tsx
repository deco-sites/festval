import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../ui/Icon.tsx";

interface Image {
  src?: ImageWidget;
  alt?: string;
  width?: number;
  height?: number;
}

export interface WishListNavProps {
  /**
   * @title Wish List Icon
   * @description Wish List Icon
   */
  icon?: Image;
}

function WishListNav({ icon }: WishListNavProps) {
  return (
    <>
      <a href="/wishlist">
        {icon?.src ? (
          <Image
            src={icon.src}
            alt={icon.alt}
            width={icon.width || 32}
            height={icon.height || 32}
          />
        ) : (
          <Icon id="favorite" />
        )}
      </a>
    </>
  );
}

export default WishListNav;
