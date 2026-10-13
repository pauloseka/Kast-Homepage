"use client";

import { useState } from "react";
import { quotes } from "@/lib/copy";
import { Reveal } from "./Reveal";

const rest = quotes.items.slice(0, 2);
const extra = quotes.items.slice(2);

export function Quotes() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-[12px] tracking-[0.16em] text-mute">
            {quotes.kicker}
          </p>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)]">
            {quotes.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-16 md:grid-cols-2">
          {rest.map((quote) => (
            <Reveal key={quote.name}>
              <blockquote className="text-[clamp(1.35rem,2.6vw,1.85rem)] leading-snug tracking-[-0.025em]">
                {quote.text}
              </blockquote>
              <p className="mt-6 text-[13px] text-mute">{quote.name}</p>
            </Reveal>
          ))}
        </div>

        <div className={`quotes-more${open ? " is-open" : ""}`}>
          <div className="quotes-more-inner">
            <div className="quotes-more-grid">
              {extra.map((quote) => (
                <div key={quote.name} className="quotes-more-item">
                  <blockquote className="text-[clamp(1.35rem,2.6vw,1.85rem)] leading-snug tracking-[-0.025em]">
                    {quote.text}
                  </blockquote>
                  <p className="mt-6 text-[13px] text-mute">{quote.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="mt-10 text-[13px] text-ink underline decoration-line underline-offset-4 hover:text-mute"
        >
          {open ? quotes.less : quotes.more}
        </button>
      </div>
    </section>
  );
}
