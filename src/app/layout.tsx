import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const uiFont = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui",
  display: "swap",
});

const displayFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Game of 30",
  description: "A local party game — guess what barely makes the Top 30.",
  // Enables fullscreen, no-Safari-chrome mode when added to the iOS Home Screen
  // (Share → Add to Home Screen → launch from the icon).
  appleWebApp: {
    capable: true,
    title: "Game of 30",
    statusBarStyle: "default",
  },
  // Next emits the modern `mobile-web-app-capable`; add the legacy Apple name
  // too so older iOS versions also launch fullscreen from the Home Screen.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  // Android: shrink the layout for the on-screen keyboard instead of panning
  // the page (which could leave the app stuck half-scrolled on dismiss).
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${uiFont.variable} ${displayFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
