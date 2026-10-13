import Image from "next/image";
import type { CSSProperties } from "react";
import type { membership } from "@/lib/copy";

const CARD = {
  standard: { width: 1600, height: 1006 },
  premium: { width: 3080, height: 1938 },
  private: { width: 3080, height: 1938 },
} as const;

type Tier = (typeof membership.tiers)[number];

export function MemberPlate({
  tier,
  index,
  active,
}: {
  tier: Tier;
  index: number;
  active: boolean;
}) {
  const art = CARD[tier.id];

  return (
    <article
      className={`member-plate${active ? " is-active" : ""}`}
      style={{ "--plate-delay": `${index * 140}ms` } as CSSProperties}
      data-tier={tier.id}
    >
      <div className="member-plate-card">
        <Image
          src={tier.src}
          alt=""
          width={art.width}
          height={art.height}
          className="h-auto w-full"
        />
      </div>
      <h3 className="member-plate-name">{tier.label}</h3>
      <dl className="member-plate-rows">
        <div className="member-plate-row">
          <dt>Price</dt>
          <dd>{tier.price}</dd>
        </div>
        <div className="member-plate-row">
          <dt>Cashback</dt>
          <dd>{tier.back}</dd>
        </div>
        <div className="member-plate-row">
          <dt>Reserve</dt>
          <dd>{tier.reserve}</dd>
        </div>
        <div className="member-plate-row">
          <dt>Card</dt>
          <dd>{tier.card}</dd>
        </div>
        <div className="member-plate-row">
          <dt>Points</dt>
          <dd>{tier.points}</dd>
        </div>
        <div className="member-plate-row">
          <dt>Perks</dt>
          <dd>{tier.perks}</dd>
        </div>
      </dl>
    </article>
  );
}
