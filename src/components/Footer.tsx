import Image from "next/image";
import Link from "next/link";
import { footer, links, nav } from "@/lib/copy";

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className = "text-[13px] text-ink transition-colors hover:text-mute";
  if (external) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function SocialMark({ id }: { id: (typeof footer.social)[number]["id"] }) {
  if (id === "x") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === "instagram") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4.5"
          y="4.5"
          width="15"
          height="15"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16.6" cy="7.4" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  if (id === "linkedin") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4.5"
          y="4.5"
          width="15"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M8.2 10.2v6.2M8.2 7.6v.2M11.6 16.4v-3.7c0-1.3.8-2.1 1.9-2.1 1.2 0 1.8.8 1.8 2.1v3.7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === "youtube") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3.5"
          y="6.5"
          width="17"
          height="11"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M10.5 9.6v4.8L14.8 12 10.5 9.6z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "tiktok") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M14.2 4.5v8.1c0 2.2-1.7 3.9-3.9 3.9S6.4 14.8 6.4 12.6 8.1 8.7 10.3 8.7c.3 0 .6 0 .9.1V11c-.3-.1-.6-.2-.9-.2-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8V4.5h2.1c.3 2 1.8 3.5 3.8 3.8v2.1c-1.4-.2-2.6-.8-3.8-1.7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "telegram") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20.2 5.2 3.8 11.4c-1 .4-.9 1.8.1 2.1l4.2 1.3 1.6 5c.3.9 1.5 1.1 2.1.3l2.3-2.8 4.4 3.3c.8.6 1.9.1 2.1-.9L21.4 6c.2-1-.8-1.8-1.2-.8z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.2 16.8c1.1.7 2.4 1.1 3.8 1.1s2.7-.4 3.8-1.1M7.2 8.8C6 10 5.4 11.5 5.4 13.2c0 .7.1 1.3.3 1.9.4 1.2 1.2 1.6 2.4 1.6h.4M16.8 8.8c1.2 1.2 1.8 2.7 1.8 4.4 0 .7-.1 1.3-.3 1.9-.4 1.2-1.2 1.6-2.4 1.6h-.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="9.2" cy="13.4" r="0.8" fill="currentColor" />
      <circle cx="14.8" cy="13.4" r="0.8" fill="currentColor" />
      <path
        d="M8.6 7.2c.8-1.5 2-2.4 3.4-2.4s2.6.9 3.4 2.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-mesh" aria-hidden>
        <Image
          src="/k-card.png"
          alt=""
          width={1600}
          height={1006}
          className="footer-mesh-art"
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24">
        <Link
          href={links.home}
          className="display text-[clamp(2.4rem,6vw,4.2rem)] leading-none"
        >
          {nav.wordmark}
        </Link>
        <p className="mt-6 max-w-sm text-[13px] leading-6 text-mute">
          {footer.legal}
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] tracking-[0.16em] text-mute">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <FooterLink
                      href={item.href}
                      label={item.label}
                      external={"external" in item && item.external}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[12px] text-mute">{footer.copyright}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {footer.legalLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-[12px] text-mute transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap items-center gap-3">
            {footer.social.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
                >
                  <SocialMark id={item.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
