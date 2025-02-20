import Configurations from "@/components/image-generation/Configurations";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

function ImageGenerationPage() {
  return (
    <section className="container mx-auto flex-1 grid grid-cols-3 gap-4 overflow-hidden">
      <div className="">
        <Configurations />
      </div>
      <div className="col-span-2 p-4 rounded-xl flex items-center justify-center h-fit">
        <GeneratedImages />
      </div>
    </section>
  );
}

export default ImageGenerationPage;
