import Configurations from "@/components/image-generation/Configurations";
import React from "react";

function ImageGenerationPage() {
  return (
    <section className="container mx-auto grid gap-4 grid-cols-4 overflow-hidden">
      <Configurations />
      <div className="col-span-2 p-4 rounded-xl flex items-center justify-center">
        Output images
      </div>
    </section>
  );
}

export default ImageGenerationPage;
