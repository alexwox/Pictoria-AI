import React from "react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { cn } from "@/lib/utils";

function Faqs() {
  return (
    <section
      id="faqs"
      className="w-full bg-muted py-32 flex flex-col items-center justify-center"
    >
      <AnimatedGradientText className="bg-background backdrop-blur-0">
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] 
        bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
          )}
        >
          Frequently Asked Questions
        </span>
      </AnimatedGradientText>
      <h2 className="subHeading mt-4">What our users say</h2>
      <p className="subText mt-4 text-center">
        Discover why thousands are choosing Pictoria AI for effortless,
        high-quality photo generation, from LinkedIn headshots to vibrant social
        media content.
      </p>
    </section>
  );
}

export default Faqs;
