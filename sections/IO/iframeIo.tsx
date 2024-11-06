import Section from "../../components/ui/Section.tsx";
interface Props {
  url: string;
}

export default function SectionIframe({ url }: Props) {
  return (
    <section class="custom-container">
      <iframe src={url} style={{ width: "100%", height: "auto", border: "none" }} />
    </section>
  );
}
export const LoadingFallback = () => <Section.Placeholder height="645px" />;
