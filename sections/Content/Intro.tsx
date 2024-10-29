import { TextArea } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { RichText } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";

export interface IntroProps {
  text: TextArea;

  content?: RichText;
  imagem: ImageWidget;
}

export default function Intro({ text = "", content, imagem }: IntroProps) {
  return (
    <section class="bg-base-100">
      <div class="custom-container mx-auto flex flex-row gap-5 justify-between">
        <div className="wrapper">
          <h1 class="font-bold text-base-content text-[40px]">{text}</h1>
          {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
        <div className="w-fit">
          <Image width={300} height={300} src={imagem} />
        </div>
      </div>
    </section>
  );
}
