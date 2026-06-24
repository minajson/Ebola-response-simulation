import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ebola Response: Contain or Collapse",
  description: "Occupational Health Ebola preparedness decision simulation for industrial sites",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
