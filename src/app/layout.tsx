import type { Metadata } from "next";
import { DM_Sans, Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Expa",
  description:
    "Expa combines design expertise, operational support, and capital to turn bold ideas into category-defining companies.",
  openGraph: {
    type: "website",
    title: "Expa",
    description:
      "Expa combines design expertise, operational support, and capital to turn bold ideas into category-defining companies.",
    images: [
      "https://cdn.sanity.io/images/1n0ik1v2/production/303fba84c2e193ea128a8936dc1e24b96f60d017-2400x1260.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expa",
    description:
      "Expa combines design expertise, operational support, and capital to turn bold ideas into category-defining companies.",
    images: [
      "https://cdn.sanity.io/images/1n0ik1v2/production/303fba84c2e193ea128a8936dc1e24b96f60d017-2400x1260.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-black text-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
