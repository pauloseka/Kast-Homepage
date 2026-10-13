"use client";

import { useRef, useState } from "react";

const rails = {
  us: {
    method: "ACH · Wires",
    fields: [
      { label: "Account holder", value: "In your name" },
      { label: "Routing number", value: "028417" },
      { label: "Account number", value: "1192" },
    ],
  },
  eu: {
    method: "SEPA",
    fields: [
      { label: "Account holder", value: "In your name" },
      { label: "IBAN", value: "DE89 3704 0044 0532 0130 00" },
    ],
  },
} as const;

const tabs = [
  { id: "home", label: "Home" },
  { id: "accounts", label: "Accounts" },
  { id: "pay", label: "Pay" },
  { id: "cards", label: "Cards" },
  { id: "wealth", label: "Wealth" },
] as const;

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  receive: "M12 4v12m0 0-4-4m4 4 4-4M5 19h14",
  pay: "M12 20V8m0 0 4 4m-4-4-4 4M5 5h14",
  qr: "M7 7h3v3H7V7Zm7 0h3v3h-3V7ZM7 14h3v3H7v-3Zm7 2h1v1h-1v-1Zm2-2h1v3h-3v-1",
  more: "M6 12h.01M12 12h.01M18 12h.01",
  rewards: "M12 7v10m0 0-3-3m3 3 3-3M8 5h8l1 3H7l1-3Z",
  refer: "M16 11a3 3 0 1 0-3-3m-1 10v-2a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v2m16 0v-2a3 3 0 0 0-2-2.83",
  home: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-7.5Z",
  accounts: "M8 7h8M6 11h12M8 15h5M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  cards: "M4 8h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Zm0 0 1.2-2.4A1 1 0 0 1 6.1 5h11.8a1 1 0 0 1 .9.6L20 8",
  wealth: "M6 19V9m6 10V5m6 14v-7",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  eyeOff: "M3 5l18 14M10 10.2A2.5 2.5 0 0 0 13.8 14M7 8.2C4.6 9.6 3 12 3 12s3.5 6 10 6c1.5 0 2.9-.3 4.1-.8M10.2 6.2C10.8 6.1 11.4 6 12 6c6.5 0 10 6 10 6s-.8 1.4-2.3 2.8",
  person: "M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Zm-7 8v-1.2A4.8 4.8 0 0 1 9.8 14h4.4A4.8 4.8 0 0 1 19 18.8V20",
};

function Field({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="flex w-full items-start justify-between gap-3 py-3 text-left"
      onClick={() => {
        void navigator.clipboard.writeText(value.replace(/\s/g, ""));
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      <span>
        <span className="block text-[10px] text-mute">{label}</span>
        <span className="mt-1 block font-mono text-[12px] tracking-[0.04em] text-ink">
          {value}
        </span>
      </span>
      <span className="mt-0.5 text-[10px] text-mute">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[11px] text-ink">
      <span className="w-10 tabular-nums">9:41</span>
      <div className="account-island h-[21px] w-[90px]" />
      <span className="flex w-10 items-center justify-end gap-1">
        <span className="flex items-end gap-px">
          <span className="h-1 w-0.5 bg-ink/45" />
          <span className="h-1.5 w-0.5 bg-ink/65" />
          <span className="h-2 w-0.5 bg-ink/80" />
          <span className="h-2.5 w-0.5 bg-ink" />
        </span>
        <svg width="13" height="10" viewBox="0 0 13 10" fill="currentColor" aria-hidden>
          <path d="M6.5 7.4a2 2 0 0 1-1.4-.6L2.2 3.8A5.6 5.6 0 0 1 6.5 2c1.7 0 3.2.7 4.3 1.8L7.9 6.8a2 2 0 0 1-1.4.6Z" />
        </svg>
        <span className="h-[8px] w-[18px] rounded-[2px] border border-ink/80 p-px">
          <span className="block h-full w-[70%] rounded-[1px] bg-ink" />
        </span>
      </span>
    </div>
  );
}

const ACTIVITY = [
  { name: "ACH", detail: "US account", amount: "+$2,400.00", when: "Today", in: true },
  { name: "SEPA", detail: "EU IBAN", amount: "+$1,150.00", when: "Yesterday", in: true },
  { name: "Apple", detail: "Card · 3360", amount: "-$12.80", when: "22 Sep", in: false },
  { name: "Stripe", detail: "US account", amount: "+$840.00", when: "21 Sep", in: true },
] as const;

function HomePager({
  hidden,
  onHide,
  onAccounts,
}: {
  hidden: boolean;
  onHide: () => void;
  onAccounts: () => void;
}) {
  const [page, setPage] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<"x" | "y" | null>(null);
  const width = useRef(1);
  const pageRef = useRef(0);
  const dragRef = useRef(0);
  const skipClick = useRef(false);
  const live = useRef(false);
  pageRef.current = page;
  dragRef.current = drag;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    axis.current = null;
    live.current = true;
    width.current = e.currentTarget.clientWidth;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!live.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (!axis.current) {
      if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (axis.current !== "x") return;
    let offset = dx;
    if (pageRef.current === 0 && offset > 0) offset *= 0.22;
    if (pageRef.current === 1 && offset < 0) offset *= 0.22;
    setDrag(offset);
  };

  const onPointerUp = () => {
    const moved = Math.abs(dragRef.current);
    skipClick.current = moved > 8;
    const next =
      dragRef.current < -width.current * 0.16
        ? 1
        : dragRef.current > width.current * 0.16
          ? 0
          : pageRef.current;
    setPage(next);
    setDrag(0);
    setDragging(false);
    live.current = false;
    axis.current = null;
  };

  const shift = -page * 100 + (drag / width.current) * 100;

  return (
    <div
      className="account-pager"
      data-dragging={dragging}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(e) => {
        if (!skipClick.current) return;
        e.preventDefault();
        e.stopPropagation();
        skipClick.current = false;
      }}
    >
      <div
        className="account-pager-track"
        data-dragging={dragging}
        style={{ transform: `translate3d(${shift}%, 0, 0)` }}
      >
        <div className="account-pager-page">
          <div className="mt-6 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[10px] tracking-[0.16em] text-mute"
              onClick={onHide}
            >
              TOTAL BALANCE
              <Icon d={hidden ? ICONS.eyeOff : ICONS.eye} size={12} />
            </button>
            <p className="mt-2 text-[34px] leading-none tracking-[-0.04em] text-ink">
              {hidden ? "••••••" : "$12,480.00"}
            </p>
            <div className="mt-3 flex justify-center gap-1">
              <span className="size-1 rounded-full bg-ink" />
              <button
                type="button"
                aria-label="Show activity"
                className="size-1 rounded-full bg-ink/25"
                onClick={() => setPage(1)}
              />
            </div>
            <button
              type="button"
              onClick={() => setPage(1)}
              className="mt-3 text-[11px] text-mute"
            >
              View transactions
            </button>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-3">
            {(
              [
                ["Receive", ICONS.receive],
                ["Pay", ICONS.pay],
                ["QR", ICONS.qr],
                ["More", ICONS.more],
              ] as const
            ).map(([label, d]) => (
              <button
                key={label}
                type="button"
                onClick={label === "Receive" ? onAccounts : undefined}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-[#171717] text-ink">
                  <Icon d={d} size={16} />
                </span>
                <span className="text-[9px] text-mute">{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#171717] text-ink">
                <Icon d={ICONS.rewards} size={16} />
              </span>
              <span className="text-[9px] text-mute">Rewards</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#171717] text-ink">
                <Icon d={ICONS.refer} size={16} />
              </span>
              <span className="text-[9px] text-mute">Refer</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onAccounts}
            className="account-drop-card mt-4 w-full rounded-2xl bg-[#121212] px-4 py-3 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-[10px] text-mute">USD account</span>
                <span className="mt-1 block text-[13px] text-ink">
                  US 1192 · EU IBAN
                </span>
              </span>
              <span className="account-drop-chevron text-mute" aria-hidden>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5 6 7.5 9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
            <div className="account-drop">
              <div className="account-drop-inner">
                <div className="mt-2 space-y-1.5 border-t border-white/5 pt-2">
                  <p className="flex justify-between text-[10px]">
                    <span className="text-mute">Routing</span>
                    <span className="font-mono text-ink">028417</span>
                  </p>
                  <p className="flex justify-between text-[10px]">
                    <span className="text-mute">Account</span>
                    <span className="font-mono text-ink">1192</span>
                  </p>
                  <p className="flex justify-between gap-2 text-[10px]">
                    <span className="shrink-0 text-mute">IBAN</span>
                    <span className="min-w-0 truncate font-mono text-ink">
                      DE89 3704 0044 0532 0130 00
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="account-pager-page">
          <div className="mt-5 flex items-end justify-between">
            <p className="text-[16px] text-ink">Activity</p>
            <div className="mb-1 flex justify-center gap-1">
              <button
                type="button"
                aria-label="Show balance"
                className="size-1 rounded-full bg-ink/25"
                onClick={() => setPage(0)}
              />
              <span className="size-1 rounded-full bg-ink" />
            </div>
          </div>
          <ul className="mt-4">
            {ACTIVITY.map((row) => (
              <li
                key={`${row.name}-${row.when}`}
                className="flex items-start justify-between gap-3 border-t border-line py-3 first:border-t-0"
              >
                <span>
                  <span className="block text-[13px] text-ink">{row.name}</span>
                  <span className="mt-0.5 block text-[10px] text-mute">
                    {row.detail} · {row.when}
                  </span>
                </span>
                <span
                  className={`text-[13px] tabular-nums ${
                    row.in ? "text-teal" : "text-ink"
                  }`}
                >
                  {hidden ? "••••" : row.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TabBar({
  active,
  onChange,
}: {
  active: (typeof tabs)[number]["id"];
  onChange: (id: (typeof tabs)[number]["id"]) => void;
}) {
  const paths = {
    home: ICONS.home,
    accounts: ICONS.accounts,
    pay: ICONS.pay,
    cards: ICONS.cards,
    wealth: ICONS.wealth,
  };

  return (
    <div className="mt-auto border-t border-white/5 px-2 pb-2 pt-1.5">
      <div className="grid grid-cols-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-1 text-[8px] ${
              active === tab.id ? "text-ink" : "text-mute"
            }`}
          >
            <Icon d={paths[tab.id]} size={16} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center pt-1">
        <span className="h-[4px] w-[108px] rounded-full bg-ink/25" />
      </div>
    </div>
  );
}

export function AccountFrame() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("home");
  const [rail, setRail] = useState<keyof typeof rails>("us");
  const [hidden, setHidden] = useState(false);
  const active = rails[rail];
  const screen = tab === "accounts" ? "accounts" : "home";

  return (
    <div className="relative mx-auto w-[min(100%,290px)]">
      <div className="account-phone">
        <div className="account-screen">
          <StatusBar />

          {screen === "home" ? (
            <div className="flex min-h-0 flex-1 flex-col px-5 pt-4">
              <div className="flex items-center justify-between">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#1b1b1b] text-ink">
                  <Icon d={ICONS.person} size={14} />
                </span>
                <span className="text-mute">
                  <Icon d={ICONS.person} size={16} />
                </span>
              </div>
              <HomePager
                hidden={hidden}
                onHide={() => setHidden((v) => !v)}
                onAccounts={() => setTab("accounts")}
              />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col px-5 pt-5">
              <p className="text-[16px] text-ink">Accounts</p>
              <p className="mt-5 text-[10px] tracking-[0.16em] text-mute">
                Available
              </p>
              <p className="mt-1 text-[28px] leading-none tracking-[-0.04em] text-ink">
                {hidden ? "••••••" : "$12,480.00"}
              </p>

              <div className="mt-5 flex gap-1 rounded-full bg-[#141414] p-1">
                {(Object.keys(rails) as (keyof typeof rails)[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRail(id)}
                    className={`h-7 flex-1 rounded-full text-[11px] ${
                      rail === id ? "bg-ink text-void" : "text-mute"
                    }`}
                  >
                    {id === "us" ? "US" : "EU"}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[10px] text-mute">{active.method}</p>
              <div className="divide-y divide-line">
                {active.fields.map((field) => (
                  <Field key={field.label} {...field} />
                ))}
              </div>
            </div>
          )}

          <TabBar
            active={screen === "accounts" ? "accounts" : "home"}
            onChange={setTab}
          />
        </div>
      </div>
    </div>
  );
}
