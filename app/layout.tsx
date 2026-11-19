import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northern Lights Installation | Kansas City Holiday Lighting",
  description:
    "Premium holiday lighting installation for homes and businesses throughout the Kansas City area. Request a complimentary estimate.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
