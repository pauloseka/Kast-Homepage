"use client";

import { hero, links } from "@/lib/copy";
import { CardObject } from "./CardObject";
import { HeroStars } from "./HeroStars";

export function Hero() {
  return (
    <section className="h-svh px-3 pb-3 pt-16 md:px-4 md:pb-4">
      <div className="hero-frame relative h-full overflow-hidden rounded-[16px] border border-line bg-void">
        <HeroStars />
        <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-10">
          <div className="flex w-full max-w-[680px] flex-col items-center">
            <h1 className="hero-in hero-in-delay-1 display max-w-[14ch] text-center text-[clamp(2.4rem,5vw,4rem)] leading-[1.06] text-ink">
              {hero.title}
            </h1>

            <div className="relative mt-8 w-full md:mt-10">
              <div aria-hidden="true" className="hero-atmos">
                <div className="hero-atmos-rim" />
                <div className="hero-atmos-key" />
                <div className="hero-atmos-pool" />
              </div>
              <div className="hero-in hero-in-delay-2 relative z-10">
                <CardObject priority intro size="hero" />
              </div>
            </div>

            <div className="hero-in hero-in-delay-3 mt-8 flex flex-col items-center gap-5 sm:flex-row md:mt-10">
              <p className="max-w-[22rem] text-center text-[15px] leading-6 text-mute sm:text-left">
                {hero.sub}
              </p>
              <a
                href={links.getKast}
                className="inline-flex h-9 shrink-0 items-center rounded-full bg-ink px-4 text-[13px] text-void transition-opacity hover:opacity-80"
              >
                {hero.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
