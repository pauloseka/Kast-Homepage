import Link from "next/link";
import { gettingPaid } from "@/lib/copy";
import { AccountFrame } from "./AccountFrame";
import { Reveal } from "./Reveal";

export function GettingPaid() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-24 md:grid-cols-2 md:items-center md:px-8 md:py-32">
        <Reveal>
          <p className="text-[12px] tracking-[0.16em] text-mute">
            {gettingPaid.kicker}
          </p>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)]">
            {gettingPaid.title}
          </h2>
          <p className="mt-6 max-w-sm text-[16px] leading-7 text-mute">
            {gettingPaid.body}
          </p>
          <Link
            href={gettingPaid.href}
            className="mt-8 inline-block text-[13px] text-ink underline decoration-line underline-offset-4 hover:text-mute"
          >
            {gettingPaid.link}
          </Link>
        </Reveal>
        <Reveal>
          <AccountFrame />
        </Reveal>
      </div>
    </section>
  );
}
