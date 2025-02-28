import Pricing from "@/components/landing-page/Pricing";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Navigation from "@/components/landing-page/Navigation";
import HeroSection from "@/components/landing-page/HeroSection";
import Features from "@/components/landing-page/Features";
import Testimonials from "@/components/landing-page/Testimonials";
import Faqs from "@/components/landing-page/Faqs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing-page/Footer";

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
      <Faqs />
      <section className="w-full py-16 bg-muted">
        <div className="container px-6 xs:px-8 sm:px-0 sm:mx-8 lg:mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="subHeading font-bold">
              Ready to transform your photos?
            </h2>
            <p className="subText mt-4 text-center">
              Join thousands of users who are already creating amazing
              AI-generated images.
            </p>
            <Link href="/login?state=signup">
              <Button className="rounded-md text-base h-12">
                ✨Create Your First AI Model! ✨
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
