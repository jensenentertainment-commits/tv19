import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Geist } from "next/font/google";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://tv19.no"),

  title: {
    default: "TV19 – Sist med det første",
    template: "%s – TV19",
  },

  description:
    "TV19 er en satirisk nyhetsportal som følger utviklingen, vurderingene og situasjonene som omtales som pågående.",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "TV19 – Sist med det første",
    description:
      "TV19 er en satirisk nyhetsportal som følger utviklingen, vurderingene og situasjonene som omtales som pågående.",
    url: "https://tv19.no",
    siteName: "TV19",
    locale: "no_NO",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "TV19 – Sist med det første",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TV19 – Sist med det første",
    description:
      "TV19 er en satirisk nyhetsportal som følger utviklingen, vurderingene og situasjonene som omtales som pågående.",
    images: ["/og-default.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#183A66",
};

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={geist.variable}>
      <body className="bg-[rgb(var(--paper))] text-black antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}