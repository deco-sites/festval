import Section from "../components/ui/Section.tsx";
interface Props {
  /**
   * @description The color of the separator
   * @format color-input
   */
  color?: string;
}

export default function Separator({ color = "#fff" }: Props) {
  return <div class="w-full h-5 !bg-white " style={{ backgroundColor: color }} />;
}
export const LoadingFallback = () => <Section.Placeholder height="20px" />;
