"use client";

import { useEffect, useRef, useState } from "react";
import { membership } from "@/lib/copy";
import { MemberPlate } from "./MemberPlate";

const TIERS = membership.tiers.map((item) => item.id);

export function Membership() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<(typeof TIERS)[number] | null>(null);
  const [hover, setHover] = useState<(typeof TIERS)[number] | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const timers: number[] = [];
    let alive = true;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const visible = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.78 && r.bottom > 140;
    };

    const play = async () => {
      await wait(520);
      let index = 0;
      while (alive) {
        setActive(TIERS[index % TIERS.length]);
        await wait(2000);
        if (!alive) return;
        index += 1;
      }
    };

    let started = false;
    let io: IntersectionObserver;
    const enter = () => {
      if (started) return;
      started = true;
      setInView(true);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      void play();
    };

    const onScroll = () => {
      if (visible()) enter();
    };

    io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        enter();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={root}
      className={`border-t border-line${inView ? " is-in" : ""}`}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-32">
        <h2 className="text-[12px] tracking-[0.16em] text-mute">
          {membership.kicker}
        </h2>
        <div className="member-plates mt-10">
          {membership.tiers.map((tier, index) => (
            <div
              key={tier.id}
              onMouseEnter={() => setHover(tier.id)}
              onMouseLeave={() => setHover(null)}
            >
              <MemberPlate
                tier={tier}
                index={index}
                active={hover === tier.id || (hover === null && active === tier.id)}
              />
            </div>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-mute">{membership.note}</p>
      </div>
    </section>
  );
}
