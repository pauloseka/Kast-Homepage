export const links = {
  home: "/",
  accounts: "/accounts",
  card: "/card",
  reserve: "/reserve",
  business: "https://www.kast.xyz/en/business",
  getKast: "https://web.kast.xyz",
  appStore: "https://apps.apple.com/app/kast",
  playStore: "https://play.google.com/store/apps/details?id=xyz.kast.app",
  blog: "https://www.kast.xyz/en/blog",
  newsroom: "https://www.kast.xyz/en/newsroom",
  careers: "https://www.kast.xyz/en/careers",
  contact: "https://www.kast.xyz/en/contact",
  help: "https://concierge.kast.xyz/hc/en-us",
  concierge: "https://concierge.kast.xyz/",
  learn: "https://www.kast.xyz/en/blog/learn",
  mediaKit: "https://www.kast.xyz/en/media-kit",
  about: "https://www.kast.xyz/en/about",
  events: "https://www.kast.xyz/en/events",
  promotions: "https://www.kast.xyz/en/promotions",
  payouts: "https://www.kast.xyz/en/global-payouts",
  earn: "https://www.kast.xyz/en/earn",
  membership: "https://www.kast.xyz/en/membership",
  cryptoCards: "https://www.kast.xyz/en/crypto-cards",
  solana: "https://www.kast.xyz/en/solana",
  pudgy: "https://www.kast.xyz/en/pudgy-penguins",
  bitcoin: "https://www.kast.xyz/en/bitcoin",
  businessAccounts: "https://www.kast.xyz/en/business/global-accounts",
  corporateCards: "https://www.kast.xyz/en/business/corporate-cards",
  businessUpgrade: "https://www.kast.xyz/en/business/upgrade",
  kyb: "https://www.kast.xyz/en/business/kyb-checklist",
  cloud: "https://www.kast.xyz/en/business/cloud",
  converter: "https://www.kast.xyz/en/currency-converter",
  roi: "https://www.kast.xyz/en/roi-calculator",
  tools: "https://www.kast.xyz/en/tools",
  legalHub: "https://www.kast.xyz/en/legal",
  verify: "https://www.kast.xyz/en/verify",
  lawEnforcement: "mailto:lawenforcement@kast.xyz",
  risk: "https://www.kast.xyz/en/legal/kast-risk-disclosure",
  privacy: "https://www.kast.xyz/en/legal/privacy-policy",
  terms: "https://www.kast.xyz/en/legal/terms-and-conditions-of-service",
  esign: "https://www.kast.xyz/en/legal/e-sign-consent",
  x: "https://x.com/KASTxyz",
  instagram: "https://www.instagram.com/kast.xyz/",
  linkedin: "https://www.linkedin.com/company/kastxyz",
  youtube: "https://www.youtube.com/@KASTxyz",
  tiktok: "https://www.tiktok.com/@kastxyz",
  telegram: "https://t.me/KASTCommunity",
  discord: "https://discord.gg/kast",
} as const;

export const nav = {
  wordmark: "KAST",
  items: [
    { label: "Accounts", href: links.accounts },
    { label: "Card", href: links.card },
    { label: "Reserve", href: links.reserve },
    { label: "Business", href: links.business, external: true },
  ],
  cta: { label: "Get KAST", href: links.getKast },
} as const;

export const hero = {
  title: "Still dollars when you get there.",
  sub: "Open a US account and an EU IBAN from where you already are. Both in your name.",
  cta: "Get KAST",
} as const;

export const trust = {
  facts: ["170+ countries", "150 million merchants", "30+ currencies"],
  marks: ["Visa", "Stripe"],
} as const;

export const gettingPaid = {
  kicker: "Accounts",
  title: "The invoice lands in dollars.",
  body: "ACH, SEPA, and wires. Share the details with whoever pays you.",
  href: links.accounts,
  link: "Accounts",
} as const;

export const spending = {
  kicker: "Card",
  title: "You spend what is in the wallet.",
  body: "Up to 3% back on every tap. Apple Wallet or Google Wallet.",
  href: links.card,
  link: "Card",
} as const;

export const reserve = {
  kicker: "Reserve",
  title: "What you leave pays 8, 10, or 12%.",
  body: "Rewards, not interest. The 2026 rate holds through 1 July 2027.",
  href: links.reserve,
  link: "Reserve",
  tiers: [
    { id: "standard", label: "Standard", rate: 0.08, cap: null },
    { id: "premium", label: "Premium", rate: 0.1, cap: 50_000 },
    { id: "private", label: "Private", rate: 0.12, cap: null },
  ],
  defaultBalance: 16388,
  currencies: [
    { id: "USD", rate: 1 },
    { id: "EUR", rate: 0.92 },
    { id: "GBP", rate: 0.79 },
  ],
  viewNote: "View of a dollar reserve.",
} as const;

export const sending = {
  kicker: "Send",
  title: "2am is a fine time to send it.",
  body: "Dollars, local currency, or crypto. If it goes to a bank, you see the fee and the arrival time first.",
  rails: [
    {
      id: "dollars",
      rail: "Dollars",
      amount: "$840.00",
      to: "US account · 1192",
      fee: "$2.00",
      arrives: "Today 11:40",
    },
    {
      id: "local",
      rail: "Local",
      amount: "€772.80",
      to: "IBAN · DE89 3704 0044 0532 0130 00",
      fee: "€1.50",
      arrives: "Today 16:20",
    },
    {
      id: "crypto",
      rail: "On-chain",
      amount: "840.00 USDC",
      to: "0x4f2a…1192",
      fee: "0.12 USDC",
      arrives: "A few minutes",
    },
  ],
} as const;

export const membership = {
  kicker: "Membership",
  note: "Reserve rates hold through 1 July 2027.",
  tiers: [
    {
      id: "standard",
      label: "Standard",
      price: "Free",
      back: "1.5%",
      reserve: "8%",
      card: "Visa Platinum",
      points: "—",
      perks: "2 free cards, virtual or physical",
      src: "/k-card.png",
    },
    {
      id: "premium",
      label: "Premium",
      price: "$1,000 a year",
      back: "2%",
      reserve: "10%",
      card: "Visa Infinite",
      points: "+1% on all spend",
      perks: "1 free Premium card, virtual and physical, plus Standard allowance",
      src: "/k-card-x.png",
    },
    {
      id: "private",
      label: "Private",
      price: "$10,000 a year",
      back: "3%",
      reserve: "12%",
      card: "Visa Infinite",
      points: "+2% on all spend",
      perks: "1 free plated Gold card, plus 2 free cards from any other tier",
      src: "/k-card-gold.png",
    },
  ],
} as const;

export const quotes = {
  kicker: "Press",
  title: "They said it.",
  more: "See more",
  less: "See less",
  items: [
    {
      name: "Luca Netz",
      text: "KAST is one of those partnerships that's an evergreen champion for us.",
    },
    {
      name: "Solana",
      text: "Meet KAST, the card that lets you spend stablecoins across borders on Solana.",
    },
    {
      name: "Stripe",
      text: "Stripe gives shoutout to KAST in 2025 annual letter.",
    },
    {
      name: "Blockworks",
      text: "Blockworks report: Defining the emerging stablecoin-native category.",
    },
  ],
} as const;

export const faq = [
  {
    q: "Is KAST a bank?",
    a: "No. KAST is not a bank and does not take deposits as one. Cards and accounts are issued with licensed partners.",
  },
  {
    q: "Does KAST support cryptocurrency?",
    a: "Yes. USDT, USDC, and 25+ other coins across 10+ chains. Spend from the card. No extra conversion step.",
  },
  {
    q: "Who is KAST designed for?",
    a: "People paid in one country who live and spend in another.",
  },
  {
    q: "Can I use my KAST card anywhere in the world?",
    a: "Yes. 150 million merchants and ATMs in 170+ countries. Apple Wallet and Google Wallet too.",
  },
  {
    q: "What fees should I expect?",
    a: "Sending between KAST accounts is free. Outbound to a bank shows the amount, the cost, and the arrival time before you confirm.",
  },
  {
    q: "How does KAST keep my account and funds secure?",
    a: "Identity checks, encryption, device security, and fraud monitoring. Services run through licensed partners. Biometrics and two-factor live in the app.",
  },
] as const;

export const close = {
  title: "Still dollars when you get there.",
  cta: "Get KAST",
  line: "Standard is free.",
  stores: [
    { id: "app-store", label: "App Store", href: links.appStore },
    { id: "play", label: "Google Play", href: links.playStore },
  ],
} as const;

export const footer = {
  legal:
    "KAST is a financial technology company, not a bank. Virtual accounts, payment cards, custody, and on/off ramp services are provided by licensed partners. Availability of services may vary by jurisdiction.",
  copyright: "2026 KAST. All rights reserved.",
  columns: [
    {
      title: "Product",
      items: [
        { label: "Accounts", href: links.accounts },
        { label: "Card", href: links.card },
        { label: "Reserve", href: links.reserve },
        { label: "Membership", href: links.membership, external: true },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: links.about, external: true },
        { label: "Business", href: links.business, external: true },
        { label: "Careers", href: links.careers, external: true },
        { label: "Newsroom", href: links.newsroom, external: true },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Blog", href: links.blog, external: true },
        { label: "Tools", href: links.tools, external: true },
        { label: "Concierge", href: links.concierge, external: true },
        { label: "Contact", href: links.contact, external: true },
        { label: "Verify", href: links.verify, external: true },
      ],
    },
  ],
  legalLinks: [
    { label: "Risk Disclosure", href: links.risk },
    { label: "Privacy Policy", href: links.privacy },
    { label: "E-Sign Consent", href: links.esign },
    { label: "Terms & Conditions", href: links.terms },
  ],
  social: [
    { id: "x", label: "X", href: links.x },
    { id: "instagram", label: "Instagram", href: links.instagram },
    { id: "linkedin", label: "LinkedIn", href: links.linkedin },
    { id: "youtube", label: "YouTube", href: links.youtube },
    { id: "tiktok", label: "TikTok", href: links.tiktok },
    { id: "telegram", label: "Telegram", href: links.telegram },
    { id: "discord", label: "Discord", href: links.discord },
  ],
} as const;
