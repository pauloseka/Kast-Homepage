"use client";

import { useState } from "react";
import { faq } from "@/lib/copy";
import { Reveal } from "./Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-28">
        <Reveal>
          <h2 className="text-[13px] tracking-[0.16em] text-mute">FAQ</h2>
          <ul className="mt-10">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-t border-line">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-8 py-6 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="text-[17px] tracking-[-0.02em] md:text-[19px]">
                      {item.q}
                    </span>
                    <span className="mt-1 text-[13px] text-mute">
                      {isOpen ? "Close" : "Open"}
                    </span>
                  </button>
                  {isOpen ? (
                    <p className="max-w-2xl pb-7 text-[15px] leading-7 text-mute">
                      {item.a}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
