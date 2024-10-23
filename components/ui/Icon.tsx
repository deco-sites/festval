import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "search"
  | "shopping_bag"
  | "menu"
  | "account_circle"
  | "close"
  | "chevron-right"
  | "favorite"
  | "home_pin"
  | "call"
  | "local_shipping"
  | "pan_zoom"
  | "share"
  | "sell"
  | "check-circle"
  | "error"
  | "trash"
  | "arrow-white"
  | "cart-white"
  | "burguer-white"
  | "info";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  id: AvailableIcons;
  size?: number;
}

const customSizes: Record<AvailableIcons, number> = {
  "cart-white": 20,
  "burguer-white": 20,
  info: 20,
  search: 24,
  shopping_bag: 30,
  menu: 24,
  account_circle: 30,
  close: 24,
  "chevron-right": 24,
  favorite: 24,
  home_pin: 24,
  call: 24,
  local_shipping: 24,
  pan_zoom: 24,
  share: 24,
  sell: 24,
  "check-circle": 24,
  error: 24,
  trash: 24,
  "arrow-white": 24,
};

function Icon({ id, size = 24, width, height, ...otherProps }: Props) {
  const iconSize = id in customSizes ? customSizes[id] : size;

  return (
    <svg {...otherProps} width={width ?? iconSize} height={height ?? iconSize}>
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
