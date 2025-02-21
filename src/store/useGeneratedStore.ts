import { create } from "zustand";
import { ImageGenerationFormSchema } from "@/components/image-generation/Configurations";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { generateImageAction, storeImages } from "@/app/actions/image-actions";

interface GenerateState {
  loading: boolean;
  images: Array<{ url: string }>;
  error: string | null;
  generateImage: (
    values: z.infer<typeof ImageGenerationFormSchema>
  ) => Promise<void>;
}

const useGeneratedStore = create<GenerateState>((set) => ({
  loading: false,
  images: [],
  error: null,

  generateImage: async (values: z.infer<typeof ImageGenerationFormSchema>) => {
    set({ loading: true, error: null });
    try {
      const { error, success, data } = await generateImageAction(values);

      if (!success) {
        set({ error: error, loading: false });
        return;
      }

      const dataWithUrl = data.map((url: string) => {
        return {
          url,
          ...values,
        };
      });

      set({ images: dataWithUrl, loading: false });
      await storeImages(dataWithUrl);
    } catch (error: any) {
      console.error(error);
      set({
        error: "Failed to generate image, please try again",
        loading: false,
      });
    }
  },
}));

export default useGeneratedStore;
