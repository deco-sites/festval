interface Props {
  /**
   * @description The color of the separator
   * @format color-input
   */
  color?: string;
}

export default function Separator({ color = "#F8F8F8" }: Props) {
  return (
    <div
      class="w-full h-5"
      style={{ backgroundColor: color }}
    />
  );
}