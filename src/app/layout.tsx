import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game of 30",
  description: "A local scorekeeper and ranked-list generator for Game of 30.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
