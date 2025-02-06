import { Download, Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "./ui/button";

type ImageGenerationProps = {
  data?: { image: string; prompt: string };
};

export default function ImageGeneration({ data }: ImageGenerationProps) {
  if (!data) {
    return (
      <div className="size-[400px] bg-secondary flex justify-center items-center rounded-md">
        <Loader2 className="animate-spin size-8 text-muted-foreground z-20" />
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(data.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <figure>
        <Image src={data.image} alt={data.prompt} height={400} width={400} className="rounded-md" />

        <figcaption className="text-sm text-muted-foreground mt-1 sr-only">{data.prompt}.</figcaption>
      </figure>

      <div>
        <Button onClick={handleDownload} className="w-full md:w-auto">
          <Download className="size-4 mr-2" />
          Fazer download
        </Button>
      </div>
    </div>
  );
}
