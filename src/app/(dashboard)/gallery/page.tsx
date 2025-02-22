import GalleryComponent from "@/components/gallery/GalleryComponent";
import React from "react";

function GalleryPage() {
  return (
    <section className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-2">My Images</h1>
      <p className="text-muted-foreground mb-6">
        Here you can see all the images you have generated. Click on an image to
        view the details.
      </p>
      <GalleryComponent />
    </section>
  );
}

export default GalleryPage;
