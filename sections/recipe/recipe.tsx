import { type ImageWidget } from "apps/admin/widgets.ts";

import Iframe from "../../components/ui/iframe.tsx";
import Image from "apps/website/components/Image.tsx";

interface RecipeDisplayProps {
  headerImage: ImageWidget;
  headerImageMb?: ImageWidget;
  videoUrl: string;
  recipeImage: ImageWidget;
  recipeImageMb?: ImageWidget;
}

export default function Component({ headerImage, recipeImageMb, videoUrl, headerImageMb, recipeImage }: RecipeDisplayProps) {
  return (
    <div className="custom-container w-full  mx-auto md:space-y-3 space-y-2 ">
      {/* Header Banner */}
      <div className="relative w-full md:flex hidden">
        <Image src={headerImage} alt="imagem" width={1920} height={130} className="object-contain rounded-none" />
      </div>
      <div className="relative w-full md:hidden flex">
        <Image src={headerImageMb || ""} alt="imagem" width={1080} height={130} className="object-contain rounded-none" />
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 md:gap-3 gap-2">
        <Iframe videoId={videoUrl} />

        {/* Recipe Image */}
        <div className="relative md:flex hidden">
          <Image
            src={recipeImage}
            alt="Recipe details"
            width={950}
            height={490}
            className="object-contain rounded-none !h-full !w-full"
          />
        </div>
        <div className="relative md:hidden flex">
          <Image
            src={recipeImageMb || ""}
            alt="Recipe details"
            width={1080}
            height={500}
            className="object-contain rounded-none !w-full"
          />
        </div>
      </div>
    </div>
  );
}
