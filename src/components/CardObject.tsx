"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STARS = [
  [8, 12],
  [18, 28],
  [27, 9],
  [36, 34],
  [44, 16],
  [53, 41],
  [61, 11],
  [69, 37],
  [76, 22],
  [84, 8],
  [12, 48],
  [31, 54],
  [58, 58],
  [73, 51],
  [88, 44],
  [22, 18],
  [47, 7],
  [64, 26],
] as const;

const PAN = "5284 1902 7741 3360";
const EXPIRY = "07/29";

function useSequence(target: string, active: boolean, delayMs: number) {
  const blank = target.replace(/[0-9]/g, "0");
  const [value, setValue] = useState(active ? blank : target);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!active || reduce) {
      setValue(target);
      return;
    }

    const chars = [...target];
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const locked =
        elapsed < delayMs
          ? 0
          : Math.min(chars.length, Math.floor((elapsed - delayMs) / 52));

      setValue(
        chars
          .map((ch, i) => {
            if (ch === " " || ch === "/") return ch;
            if (i < locked) return ch;
            return String((Math.floor(now / 28) + i * 3) % 10);
          })
          .join(""),
      );

      if (locked < chars.length) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, delayMs, target]);

  return value;
}

const WIDTH = {
  default: "w-[300px] md:w-[400px] lg:w-[480px]",
  hero: "w-[300px] md:w-[560px] xl:w-[640px]",
} as const;

export function CardObject({
  className,
  stars = false,
  priority = false,
  intro = false,
  size = "default",
}: {
  className?: string;
  stars?: boolean;
  priority?: boolean;
  intro?: boolean;
  size?: keyof typeof WIDTH;
}) {
  const number = useSequence(PAN, intro, 420);
  const expiry = useSequence(EXPIRY, intro, 1380);

  return (
    <div className={`relative ${intro ? "" : "overflow-hidden"} ${className ?? ""}`}>
      {stars
        ? STARS.map(([x, y], i) => (
            <span
              key={`${x}-${y}-${i}`}
              className="absolute rounded-full bg-ink/50"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: i % 4 === 0 ? 2 : 1,
                height: i % 4 === 0 ? 2 : 1,
              }}
            />
          ))
        : null}
      <div className="flex h-full items-center justify-center [perspective:1400px]">
        <div className={intro ? "card-spin" : undefined}>
          <div className={`card-idle relative ${WIDTH[size]}`}>
            <Image
              src="/k-card.png"
              alt="KAST Platinum card"
              width={1600}
              height={1006}
              priority={priority}
              className="h-auto w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
            />
            {intro ? <div aria-hidden="true" className="card-sheen" /> : null}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[8%] left-[8%] flex h-[14.5%] flex-col justify-between"
            >
              <div className="relative">
                <p className="card-engrave-sink whitespace-nowrap font-mono text-[12px] leading-none tracking-[0.12em] tabular-nums md:text-[15px] md:tracking-[0.16em]">
                  {number}
                </p>
                <p className="card-engrave whitespace-nowrap font-mono text-[12px] leading-none tracking-[0.12em] tabular-nums md:text-[15px] md:tracking-[0.16em]">
                  {number}
                </p>
              </div>
              <div className="relative">
                <p className="card-engrave-sink flex items-end gap-1.5 whitespace-nowrap font-mono">
                  <span className="text-[5px] leading-[1.15] tracking-[0.14em] md:text-[6px]">
                    VALID
                    <br />
                    THRU
                  </span>
                  <span className="text-[11px] leading-none tracking-[0.1em] tabular-nums md:text-[13px]">
                    {expiry}
                  </span>
                </p>
                <p className="card-engrave flex items-end gap-1.5 whitespace-nowrap font-mono">
                  <span className="text-[5px] leading-[1.15] tracking-[0.14em] md:text-[6px]">
                    VALID
                    <br />
                    THRU
                  </span>
                  <span className="text-[11px] leading-none tracking-[0.1em] tabular-nums md:text-[13px]">
                    {expiry}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
