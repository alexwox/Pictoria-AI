import Pricing from "@/components/landing-page/Pricing";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Navigation from "@/components/landing-page/Navigation";
import HeroSection from "@/components/landing-page/HeroSection";
import Features from "@/components/landing-page/Features";
import Testimonials from "@/components/landing-page/Testimonials";

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
      <Navigation />
      <HeroSection />
      <Features />
      <Testimonials />
      <Pricing products={products ?? []} />
    </main>
  );
}
