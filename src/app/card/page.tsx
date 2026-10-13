import type { Metadata } from "next";
import { Spending } from "@/components/Spending";

export const metadata: Metadata = {
  title: "Card · KAST",
};

export default function CardPage() {
  return (
    <main className="pt-14">
      <Spending />
    </main>
  );
}
