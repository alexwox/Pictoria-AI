import { fetchModels } from "@/app/actions/model-actions";
import React from "react";
import ModelsList from "./ModelsList";

async function ModelsPage() {
  const data = await fetchModels();
  return (
    <section className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Models</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your models
        </p>
      </div>
      <ModelsList models={data} />
    </section>
  );
}

export default ModelsPage;
