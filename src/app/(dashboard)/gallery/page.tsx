import { getImages } from "@/app/actions/image-actions";
import GalleryComponent from "@/components/gallery/GalleryComponent";
import React from "react";

async function GalleryPage() {
  const { data: images } = await getImages();
  console.log("@GalleryPage", images);
  return (
    <section className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-2">My Images</h1>
      <p className="text-muted-foreground mb-6">
        Here you can see all the images you have generated. Click on an image to
        view the details.
      </p>
      <GalleryComponent images={images || []} />
    </section>
  );
}

export default GalleryPage;
