"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { close, links, membership } from "@/lib/copy";
import { Reveal } from "./Reveal";

const CARD_SIZE = {
  standard: { width: 1600, height: 1006, slot: "plat" },
  premium: { width: 3080, height: 1938, slot: "x" },
  private: { width: 3080, height: 1938, slot: "gold" },
} as const;

const FAN = ["premium", "private", "standard"] as const;

function StoreMark({ id }: { id: (typeof close.stores)[number]["id"] }) {
  if (id === "app-store") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="8.25"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M12 6.6 8.15 16.2M12 6.6l3.85 9.6M9.15 13.15h5.7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5.2 4.1v15.8L18.9 12 5.2 4.1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 4.1 14.6 13.3M5.2 19.9 14.6 10.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Close() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }

    const visible = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.78 && r.bottom > 140;
    };

    let started = false;
    let io: IntersectionObserver;
    const enter = () => {
      if (started) return;
      started = true;
      setOpen(true);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };

    const onScroll = () => {
      if (visible()) enter();
    };

    io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        enter();
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={root} className="border-t border-line">
      <div className="mx-auto grid min-h-[50vh] max-w-[1400px] items-center gap-10 px-5 py-24 md:grid-cols-2 md:px-8">
        <Reveal>
          <h2 className="display max-w-[14ch] text-[clamp(2rem,5vw,3.4rem)]">
            {close.title}
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={links.getKast}
              className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[14px] text-void transition-opacity hover:opacity-80"
            >
              {close.cta}
            </a>
            {close.stores.map((store) => (
              <a
                key={store.id}
                href={store.href}
                className="inline-flex h-10 items-center gap-2.5 rounded-full border border-line px-5 text-[14px] text-ink transition-colors hover:border-ink"
              >
                <StoreMark id={store.id} />
                {store.label}
              </a>
            ))}
          </div>
          <p className="mt-6 text-[16px] text-mute">{close.line}</p>
        </Reveal>
        <Reveal>
          <div className={`close-fan${open ? " is-open" : ""}`}>
            {FAN.map((id) => {
              const tier = membership.tiers.find((item) => item.id === id);
              if (!tier) return null;
              const size = CARD_SIZE[id];
              return (
                <div
                  key={id}
                  className={`close-fan-card close-fan-${size.slot}`}
                >
                  <Image
                    src={tier.src}
                    alt={`KAST ${tier.label} card`}
                    width={size.width}
                    height={size.height}
                  />
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
