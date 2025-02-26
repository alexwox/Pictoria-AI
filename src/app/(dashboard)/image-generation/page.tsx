import { fetchModels } from "@/app/actions/model-actions";
import Configurations from "@/components/image-generation/Configurations";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

interface SearchParams {
  model_id?: string;
}

async function ImageGenerationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const model_id = (await searchParams).model_id;
  const { data: userModels } = await fetchModels();
  return (
    <section className="container mx-auto flex-1 grid grid-cols-3 gap-4 overflow-hidden">
      <div className="">
        <Configurations userModels={userModels || []} model_id={model_id} />
      </div>
      <div className="col-span-2 p-4 rounded-xl flex items-center justify-center h-fit">
        <GeneratedImages />
      </div>
    </section>
  );
}

export default ImageGenerationPage;
