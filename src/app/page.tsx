import Pricing from "@/components/landing-page/Pricing";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();

  const [user, products] = await Promise.all([
    getUser(supabase), //Gets the currently authenticated users
    getProducts(supabase), // Gets all the active products with prices
  ]);

  // if(user){
  //   return redirect("/dashboard")
  // }
  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <Pricing products={products ?? []} />
    </main>
  );
}
