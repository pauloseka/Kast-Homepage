import { trust } from "@/lib/copy";

export function Trust() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <ul className="flex flex-col gap-3 md:flex-row md:gap-0">
          {trust.facts.map((fact, i) => (
            <li
              key={fact}
              className={`text-[14px] text-ink md:px-6 ${
                i === 0 ? "md:pl-0" : "md:border-l md:border-line"
              }`}
            >
              {fact}
            </li>
          ))}
        </ul>
        <p className="text-[13px] tracking-[0.14em] text-mute">
          {trust.marks.join("  ·  ")}
        </p>
      </div>
    </section>
  );
}
