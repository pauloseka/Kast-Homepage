"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { reserve } from "@/lib/copy";
import { Reveal } from "./Reveal";
import { VaultObject, type VaultPhase } from "./VaultObject";

const FX = Object.fromEntries(
  reserve.currencies.map((item) => [item.id, item.rate]),
) as Record<(typeof reserve.currencies)[number]["id"], number>;

function yearly(balance: number, tierId: string) {
  const tier = reserve.tiers.find((item) => item.id === tierId);
  if (!tier) return 0;
  if (tier.cap) {
    return (
      Math.min(balance, tier.cap) * tier.rate +
      Math.max(0, balance - tier.cap) * 0.08
    );
  }
  return balance * tier.rate;
}

function money(n: number, currency: (typeof reserve.currencies)[number]["id"]) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatAmount(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseDraft(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned || cleaned === ".") return 0;
  return Number(cleaned) || 0;
}

const MAX_CENTS = 99_999_999_999;

function toCents(n: number) {
  return Math.round(n * 100);
}

function fromCents(cents: number) {
  return Math.max(0, Math.min(MAX_CENTS, Math.round(cents))) / 100;
}

function caretInInteger(value: string, caret: number) {
  const dot = value.indexOf(".");
  return dot !== -1 && caret < dot;
}

function integerDigitIndex(value: string, caret: number) {
  const dot = value.indexOf(".");
  const head = value.slice(0, dot === -1 ? caret : Math.min(caret, dot));
  return head.replace(/\D/g, "").length;
}

function caretAfterIntegerDigit(value: string, index: number) {
  const dot = value.indexOf(".");
  const limit = dot === -1 ? value.length : dot;
  let seen = 0;
  for (let i = 0; i < limit; i += 1) {
    if (/\d/.test(value[i])) {
      seen += 1;
      if (seen === index) return i + 1;
    }
  }
  return limit;
}

function useCount(
  target: number,
  currency: (typeof reserve.currencies)[number]["id"],
) {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  const frame = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = shownRef.current;
    if (reduce || from === target) {
      shownRef.current = target;
      setShown(target);
      return;
    }

    const started = performance.now();
    const duration = Math.min(640, Math.max(360, Math.abs(target - from) * 0.18));

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      const next = from + (target - from) * eased;
      shownRef.current = next;
      setShown(next);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      shownRef.current = target;
      setShown(target);
    };

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target]);

  return money(shown, currency);
}

export function Reserve() {
  const root = useRef<HTMLElement>(null);
  const [tier, setTier] = useState<(typeof reserve.tiers)[number]["id"]>(
    "premium",
  );
  const [currency, setCurrency] =
    useState<(typeof reserve.currencies)[number]["id"]>("USD");
  const [usd, setUsd] = useState<number>(reserve.defaultBalance);
  const [draft, setDraft] = useState(() => formatAmount(reserve.defaultBalance));
  const [phase, setPhase] = useState<VaultPhase>("ready");
  const balanceRef = useRef<HTMLInputElement>(null);
  const pointerFocus = useRef(false);
  const earnedUsd = useMemo(() => yearly(usd, tier), [usd, tier]);
  const earnedView = earnedUsd * FX[currency];
  const earnedLabel = useCount(earnedView, currency);
  const active = reserve.tiers.find((item) => item.id === tier);
  const bars = Math.round((active?.rate ?? 0) * 100);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("open");
      return;
    }

    const visible = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.78 && r.bottom > 140;
    };

    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    let started = false;
    let io: IntersectionObserver;
    const enter = () => {
      if (started) return;
      started = true;
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      void (async () => {
        setPhase("unlock");
        await wait(2500);
        setPhase("open");
      })();
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
      timers.forEach((id) => window.clearTimeout(id));
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const setView = (amount: number, caret?: number) => {
    const next = fromCents(toCents(amount));
    const label = formatAmount(next);
    setDraft(label);
    setUsd(next / FX[currency]);
    requestAnimationFrame(() => {
      const el = balanceRef.current;
      if (!el) return;
      const pos = caret ?? label.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const onBalanceKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const caret = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? caret;
    const selectedAll = caret === 0 && end === draft.length && draft.length > 0;
    const forward = !selectedAll && caretInInteger(draft, caret);
    const dot = draft.indexOf(".");
    const centsPart = (dot === -1 ? "00" : draft.slice(dot + 1))
      .replace(/\D/g, "")
      .padEnd(2, "0")
      .slice(0, 2);

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const digit = Number(e.key);
      if (selectedAll || draft === formatAmount(0)) {
        setView(digit / 100);
        return;
      }
      if (!forward) {
        setView(fromCents(toCents(parseDraft(draft)) * 10 + digit));
        return;
      }
      const ints = draft.slice(0, dot === -1 ? draft.length : dot).replace(/\D/g, "");
      const at = integerDigitIndex(draft, caret);
      const nextInt = `${ints.slice(0, at)}${e.key}${ints.slice(at)}` || "0";
      const next = Number(`${nextInt}.${centsPart}`);
      const label = formatAmount(fromCents(toCents(next)));
      setDraft(label);
      setUsd(fromCents(toCents(next)) / FX[currency]);
      requestAnimationFrame(() => {
        balanceRef.current?.setSelectionRange(
          caretAfterIntegerDigit(label, at + 1),
          caretAfterIntegerDigit(label, at + 1),
        );
      });
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      if (selectedAll) {
        setView(0);
        return;
      }
      if (!forward) {
        setView(fromCents(Math.floor(toCents(parseDraft(draft)) / 10)));
        return;
      }
      const at = integerDigitIndex(draft, caret);
      if (at === 0) return;
      const ints = draft.slice(0, dot === -1 ? draft.length : dot).replace(/\D/g, "");
      const nextInt = `${ints.slice(0, at - 1)}${ints.slice(at)}` || "0";
      const next = Number(`${nextInt}.${centsPart}`);
      const label = formatAmount(fromCents(toCents(next)));
      setDraft(label);
      setUsd(fromCents(toCents(next)) / FX[currency]);
      requestAnimationFrame(() => {
        const pos = caretAfterIntegerDigit(label, at - 1);
        balanceRef.current?.setSelectionRange(pos, pos);
      });
      return;
    }

    if ((e.metaKey || e.ctrlKey) && ["a", "c", "x", "v"].includes(e.key)) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Tab"].includes(e.key)) {
      return;
    }
    if (e.key.length === 1) e.preventDefault();
  };

  const onBalancePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setView(parseDraft(e.clipboardData.getData("text")));
  };

  const onBalanceFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (pointerFocus.current) {
      pointerFocus.current = false;
      return;
    }
    const el = e.currentTarget;
    requestAnimationFrame(() => {
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const onBalanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits === draft.replace(/\D/g, "")) return;
    setView((Number(digits) || 0) / 100);
  };

  const onBalanceClick = (e: MouseEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const caret = el.selectionStart ?? el.value.length;
    if (caretInInteger(el.value, caret)) return;
    el.setSelectionRange(el.value.length, el.value.length);
  };

  const onBalanceBlur = () => {
    setView(parseDraft(draft));
  };

  const onCurrency = (id: (typeof reserve.currencies)[number]["id"]) => {
    setCurrency(id);
    setDraft(formatAmount(usd * FX[id]));
  };

  return (
    <section ref={root} data-vault-phase={phase} className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <div className="order-2 md:order-1">
          <VaultObject phase={phase} bars={bars} />
        </div>

        <div className="order-1 md:order-2">
          <Reveal>
            <p className="text-[12px] tracking-[0.16em] text-mute">
              {reserve.kicker}
            </p>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)]">
              {reserve.title}
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-7 text-mute">
              {reserve.body}
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-2">
            {reserve.tiers.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTier(item.id)}
                className={`h-8 rounded-full px-3 text-[12px] ${
                  tier === item.id
                    ? "bg-ink text-void"
                    : "border border-line text-mute hover:text-ink"
                }`}
              >
                {item.label} · {Math.round(item.rate * 100)}%
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] text-mute">Reserve balance</span>
              <span className="flex gap-1">
                {reserve.currencies.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onCurrency(item.id)}
                    className={`h-7 rounded-full px-2.5 text-[11px] ${
                      currency === item.id
                        ? "bg-ink text-void"
                        : "border border-line text-mute hover:text-ink"
                    }`}
                  >
                    {item.id}
                  </button>
                ))}
              </span>
            </div>
            <input
              ref={balanceRef}
              value={draft}
              onChange={onBalanceChange}
              onKeyDown={onBalanceKeyDown}
              onPaste={onBalancePaste}
              onFocus={onBalanceFocus}
              onMouseDown={() => {
                pointerFocus.current = true;
              }}
              onClick={onBalanceClick}
              onBlur={onBalanceBlur}
              inputMode="decimal"
              aria-label="Reserve balance"
              className="mt-2 w-full border-b border-line bg-transparent py-2 text-[28px] tracking-[-0.03em] text-ink outline-none tabular-nums"
            />
          </div>

          <p className="mt-8 text-[12px] text-mute">In one year</p>
          <p className="mt-3 text-[clamp(2.8rem,7vw,5rem)] tracking-[-0.04em] tabular-nums">
            {earnedLabel}
          </p>
          <p className="mt-4 max-w-md text-[13px] leading-6 text-mute">
            {active?.id === "premium"
              ? "10% on the first $50,000, then 8% above it. Estimate assumes one year at the 2026 introductory rate with no withdrawals."
              : "Estimate assumes one year at the 2026 introductory rate with no withdrawals."}{" "}
            {reserve.viewNote}
          </p>
          <Link
            href={reserve.href}
            className="mt-8 inline-block text-[13px] text-ink underline decoration-line underline-offset-4 hover:text-mute"
          >
            {reserve.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
