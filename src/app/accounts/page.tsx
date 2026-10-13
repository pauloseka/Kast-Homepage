import type { Metadata } from "next";
import { GettingPaid } from "@/components/GettingPaid";
import { Sending } from "@/components/Sending";

export const metadata: Metadata = {
  title: "Accounts · KAST",
};

export default function AccountsPage() {
  return (
    <main className="pt-14">
      <GettingPaid />
      <Sending />
    </main>
  );
}
