import type { Metadata, Viewport } from "next";
import { Permanent_Marker, Kalam, Boogaloo } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import MobileGate from "@/components/MobileGate";
import PWAUpdater from "@/components/PWAUpdater";
import "./globals.css";

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
});

const boogaloo = Boogaloo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-boogaloo",
  display: "swap",
});

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GenZ Voter – Tokea na Mbogi 2027",
  description:
    "Register. Vote. Change Kenya. If you can queue for Nyege Nyege, you can queue once to vote.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/assets/icon-72.png",   sizes: "72x72",   type: "image/png" },
      { url: "/assets/icon-128.png",  sizes: "128x128", type: "image/png" },
      { url: "/assets/icon-144.png",  sizes: "144x144", type: "image/png" },
      { url: "/assets/icon-192.png",  sizes: "192x192", type: "image/png" },
      { url: "/assets/icon-384.png",  sizes: "384x384", type: "image/png" },
      { url: "/assets/icon-512.png",  sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/assets/_icon-1024.png" },
      { url: "/assets/icon-192.png", sizes: "192x192" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GenZVoter",
  },
  openGraph: {
    title: "GenZ Voter – 2027 Tokea na Mbogi",
    description: "Sisi ndio majority. Register to vote before 2027.",
    type: "website",
    images: [{ url: "/assets/icon-512.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a3a10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${marker.variable} ${kalam.variable} ${boogaloo.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" href="/assets/_icon-1024.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/assets/icon-192.png" />
        {/* Prevent flash of wrong theme — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('genz-theme');document.documentElement.setAttribute('data-theme',t||'light');})();`,
          }}
        />
      </head>
      <body>
        <PWAUpdater />
        <MobileGate>
          <ThemeProvider>{children}</ThemeProvider>
        </MobileGate>
      </body>
    </html>
  );
}
