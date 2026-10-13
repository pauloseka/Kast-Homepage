"use client";

import { useEffect, useRef, useState } from "react";
import { sending } from "@/lib/copy";
import { Reveal } from "./Reveal";
import { SendSheet, type SendPhase, type SendRailId } from "./SendSheet";

const RAILS = sending.rails.map((item) => item.id);

export function Sending() {
  const root = useRef<HTMLElement>(null);
  const [rail, setRail] = useState<SendRailId>("dollars");
  const [phase, setPhase] = useState<SendPhase>("ready");
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRail("dollars");
      setPhase("rest");
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
      let index = 0;
      while (alive) {
        const id = RAILS[index % RAILS.length];
        setSwap(false);
        setRail(id);
        setPhase("ready");
        await wait(900);
        if (!alive) return;
        setPhase("quote");
        await wait(900);
        if (!alive) return;
        setPhase("confirm");
        await wait(900);
        if (!alive) return;
        setSwap(true);
        await wait(500);
        if (!alive) return;
        index += 1;
      }
    };

    let started = false;
    let io: IntersectionObserver;
    const enter = () => {
      if (started) return;
      started = true;
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
    <section ref={root} className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <div className="order-2 md:order-1">
          <SendSheet rail={rail} phase={phase} swap={swap} />
        </div>

        <div className="order-1 md:order-2">
          <Reveal>
            <p className="text-[12px] tracking-[0.16em] text-mute">
              {sending.kicker}
            </p>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)]">
              {sending.title}
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-7 text-mute">
              {sending.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
