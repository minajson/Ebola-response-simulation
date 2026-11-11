import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import { PreferencesProvider } from "@/lib/preferences";

// Fonts are downloaded at build time and self-hosted — no runtime font requests.
const sans = Public_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ebola Response: Contain or Collapse",
  description:
    "A high-stakes Ebola preparedness decision simulation for industrial site health emergency response training.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
