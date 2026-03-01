import type { Metadata, Viewport } from "next";
import { Permanent_Marker, Kalam, Boogaloo } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
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
  title: "GenZ Voter – Toke na Mbogi 2027",
  description:
    "Register. Vote. Change Kenya. If you can queue for Nyege Nyege, you can queue once to vote.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GenZVoter",
  },
  openGraph: {
    title: "GenZ Voter – 2027 Toke na Mbogi",
    description: "Sisi ndio majority. Register to vote before 2027.",
    type: "website",
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Prevent flash of wrong theme — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('genz-theme');document.documentElement.setAttribute('data-theme',t||'light');})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
