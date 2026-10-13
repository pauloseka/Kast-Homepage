"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { spending } from "@/lib/copy";

const PASSES = ["standard", "premium", "private"] as const;

const CARD_ART = {
  standard: { src: "/k-card.png", width: 1600, height: 1006 },
  premium: { src: "/k-card-x.png", width: 3080, height: 1938 },
  private: { src: "/k-card-gold.png", width: 3080, height: 1938 },
} as const;

export function Spending() {
  const root = useRef<HTMLElement>(null);
  const privateRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const privateCard = privateRef.current;
    const pad = padRef.current;
    if (!el || !privateCard || !pad) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("tap-ready");

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

    const peek = async (id: (typeof PASSES)[number]) => {
      const card = el.querySelector<HTMLElement>(`[data-pass="${id}"]`);
      if (!card || !alive) return;
      card.classList.add("is-peek");
      await wait(700);
      if (!alive) return;
      await wait(2000);
      if (!alive) return;
      card.classList.remove("is-peek");
      await wait(700);
    };

    const play = async () => {
      const cr = privateCard.getBoundingClientRect();
      const pr = pad.getBoundingClientRect();
      const dx = pr.left + pr.width / 2 - (cr.left + cr.width / 2);
      const dy =
        pr.top +
        pr.height / 2 -
        (cr.top + cr.height / 2) -
        (cr.width * 0.88) / 2 +
        8;
      privateCard.style.setProperty("--tap-x", `${dx}px`);
      privateCard.style.setProperty("--tap-y", `${dy}px`);

      privateCard.classList.add("is-draw");
      await wait(800);
      if (!alive) return;
      privateCard.classList.add("is-front", "is-tap");
      await wait(800);
      if (!alive) return;
      el.classList.add("is-ring");
      await wait(800);
      if (!alive) return;
      privateCard.classList.remove("is-tap");
      await wait(800);
      if (!alive) return;
      privateCard.classList.remove("is-front", "is-draw");
      await wait(800);
      if (!alive) return;
      el.classList.remove("is-ring");

      while (alive) {
        for (const id of PASSES) {
          await peek(id);
          if (!alive) return;
        }
      }
    };

    let started = false;
    let io: IntersectionObserver;
    const enter = () => {
      if (started) return;
      started = true;
      el.classList.add("is-in");
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
        <div className="tap-stage order-2 md:order-1">
          <div className="wallet" aria-hidden="true">
            <div className="wallet-back" />
            <span className="wallet-well wallet-well-1" />
            <span className="wallet-well wallet-well-2" />
            <span className="wallet-well wallet-well-thumb" />
            {PASSES.map((id) => (
              <div
                key={id}
                data-pass={id}
                ref={id === "private" ? privateRef : undefined}
                className={`wallet-card wallet-card-${id}`}
              >
                <Image
                  src={CARD_ART[id].src}
                  alt=""
                  width={CARD_ART[id].width}
                  height={CARD_ART[id].height}
                  className="h-auto w-full"
                />
                {id !== "standard" ? (
                  <span className="wallet-card-logo" aria-hidden />
                ) : null}
              </div>
            ))}
            <span className="wallet-leather wallet-crown" />
            <span className="wallet-leather wallet-bar wallet-bar-1" />
            <span className="wallet-leather wallet-bar wallet-bar-2" />
            <span className="wallet-leather wallet-foot">
              <span className="wallet-mark">
                <span className="wallet-mark-sink" />
                <span className="wallet-mark-face" />
              </span>
            </span>
            <span className="wallet-leather wallet-rail wallet-rail-l" />
            <span className="wallet-leather wallet-rail wallet-rail-r" />
            <div className="wallet-skin">
              <svg className="wallet-grain" aria-hidden>
                <filter id="wallet-leather-noise">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.78"
                    numOctaves="4"
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect
                  width="100%"
                  height="100%"
                  filter="url(#wallet-leather-noise)"
                />
              </svg>
            </div>
            <svg
              className="wallet-stitch wallet-stitch-top"
              viewBox="0 0 300 198"
              aria-hidden
            >
              <path
                d="M5,13 A8,8 0 0 1 13,5 H287 A8,8 0 0 1 295,13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeDasharray="1.8 3.1"
                strokeLinecap="round"
              />
            </svg>
            <svg
              className="wallet-stitch wallet-stitch-rim"
              viewBox="0 0 300 198"
              aria-hidden
            >
              <path
                d="M5,13 V185 A8,8 0 0 0 13,193 H287 A8,8 0 0 0 295,185 V13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeDasharray="1.8 3.1"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div ref={padRef} className="tap-reader">
            <span className="tap-ring" />
            <span className="tap-plate">
              <svg
                className="tap-mark"
                viewBox="0 0 40 24"
                width="28"
                height="17"
                fill="none"
              >
                <path
                  d="M6 18c9-10 19-10 28 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M12 18c6-6 10-6 16 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M18 18c2.2-2.2 4.8-2.2 7 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="spend-copy order-1 md:order-2">
          <p className="text-[12px] tracking-[0.16em] text-mute">
            {spending.kicker}
          </p>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)]">
            {spending.title}
          </h2>
          <p className="mt-6 max-w-sm text-[16px] leading-7 text-mute">
            {spending.body}
          </p>
          <Link
            href={spending.href}
            className="mt-8 inline-block text-[13px] text-ink underline decoration-line underline-offset-4 hover:text-mute"
          >
            {spending.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
