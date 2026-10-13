"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { links, nav } from "@/lib/copy";

export function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        stuck ? "bg-void" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <Link
          href={links.home}
          className="nav-in text-[13px] tracking-[0.18em] text-ink"
          style={{ animationDelay: "0.08s" }}
        >
          {nav.wordmark}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.items.map((item, i) =>
            "external" in item && item.external ? (
              <a
                key={item.label}
                href={item.href}
                className="nav-in text-[13px] text-mute transition-colors hover:text-ink"
                style={{ animationDelay: `${0.18 + i * 0.07}s` }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="nav-in text-[13px] text-mute transition-colors hover:text-ink"
                style={{ animationDelay: `${0.18 + i * 0.07}s` }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={nav.cta.href}
            className="nav-in inline-flex h-8 items-center rounded-full bg-ink px-3 text-[12px] text-void transition-opacity hover:opacity-80"
            style={{ animationDelay: "0.48s" }}
          >
            {nav.cta.label}
          </a>
          <button
            type="button"
            className="nav-in text-[13px] text-mute md:hidden"
            style={{ animationDelay: "0.48s" }}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-line bg-void px-5 py-6 md:hidden"
        >
          <nav className="flex flex-col gap-5">
            {nav.items.map((item) =>
              "external" in item && item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[16px] text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[16px] text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
