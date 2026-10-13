import type { Metadata } from "next";
import { Membership } from "@/components/Membership";
import { Reserve } from "@/components/Reserve";

export const metadata: Metadata = {
  title: "Reserve · KAST",
};

export default function ReservePage() {
  return (
    <main className="pt-14">
      <Reserve />
      <Membership />
    </main>
  );
}
