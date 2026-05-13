import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://dropin.akellainmotion.com";
const SITE_NAME = "Dropin";
const TAGLINE = "Paste code. See page.";
const DESCRIPTION =
  "Paste AI-generated HTML or JSX and watch it render live. Pick from 111 ready-to-ship templates. No install, no terminal, no sign-in — just drop in code and ship.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Akella inMotion", url: "https://akellainmotion.com" }],
  creator: "Akella inMotion",
  publisher: "Akella inMotion",
  keywords: [
    "vibecoding",
    "AI code preview",
    "HTML preview",
    "JSX preview",
    "live code playground",
    "no-install code editor",
    "Tailwind preview",
    "landing page templates",
    "Dropin",
    "Akella inMotion",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/assets/logo.png", type: "image/png", sizes: "any" },
    ],
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: [
      {
        url: "/assets/logo.png",
        width: 1024,
        height: 1024,
        alt: "Dropin · paste code, see page",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F1EA",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="bg-paper text-ink">{children}</body>
    </html>
  );
}
