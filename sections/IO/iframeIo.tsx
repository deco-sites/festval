import { useDevice } from "@deco/deco/hooks";
import Section from "../../components/ui/Section.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  url: string;
}

export default function SectionIframe({ url }: Props) {
  const device = useDevice();
  const id = useId();

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "0",
        paddingBottom: device === "mobile" ? "200%" : "56.25%",
        overflow: "hidden",
      }}
    >
      <iframe
        id={id}
        src={url}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          overflow: "auto",
        }}
        title="Iframe"
      />
    </section>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="645px" />;
