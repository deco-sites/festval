import { useEffect } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface VideoProps {
  UrlVideo: string;
  receita: ImageWidget;
  ImgDestaque: ImageWidget;
}

const Receita = ({ UrlVideo, receita, ImgDestaque }: VideoProps) => {
  const videoSrc = `${UrlVideo}`;

  useEffect(() => {
    // Add a comment explaining the purpose of this useEffect.
    const lazyIframes = document.querySelectorAll(".lazy-iframe");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target as HTMLIFrameElement;
            const src = iframe.getAttribute("data-src") ?? "";
            iframe.setAttribute("src", src);
            iframe.style.opacity = "1";
            console.log(iframe);
            observer.unobserve(iframe);
          }
        });
      },
      { rootMargin: "0px 0px 100px 0px" } // Adjust the rootMargin as needed
    );

    lazyIframes.forEach((lazyIframe) => {
      observer.observe(lazyIframe);
    });
  }, []);

  return (
    <div class="custom-container">
      <div className="flex">
        <Image width={1920} height={130} src={ImgDestaque} alt="Intro image" class="h-auto" />
        <div class="video-container flex w-[950] lg:h-[490] m-auto relative">
          <div class="video-overlay"></div>
          <iframe
            class="lazy-iframe w-full h-full"
            data-src={videoSrc}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="image">
          <Image width={950} height={490} src={receita} alt="Intro image" class="h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Receita;
