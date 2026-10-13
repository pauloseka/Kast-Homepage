import { Close } from "@/components/Close";
import { Faq } from "@/components/Faq";
import { GettingPaid } from "@/components/GettingPaid";
import { Hero } from "@/components/Hero";
import { Membership } from "@/components/Membership";
import { Quotes } from "@/components/Quotes";
import { Reserve } from "@/components/Reserve";
import { Sending } from "@/components/Sending";
import { Spending } from "@/components/Spending";
import { Trust } from "@/components/Trust";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Trust />
      <GettingPaid />
      <Spending />
      <Reserve />
      <Sending />
      <Membership />
      <Quotes />
      <Faq />
      <Close />
    </main>
  );
}
