import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../ui/Icon.tsx";

interface Image {
  src?: ImageWidget;
  alt?: string;
  width?: number;
  height?: number;
}

function MyOrders() {
  return (
    <a href="/account#/orders">
      <Icon width={32} height={32} id="my_orders" />
    </a>
  );
}

export default MyOrders;
