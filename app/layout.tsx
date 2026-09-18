import type React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seeker | Developer Portfolio",
  description:
    "Backend systems engineer focused on AI-powered data systems and automation. I build web scrapers, smart extraction pipelines, RAG systems, research and monitoring tools, lead intelligence systems, and the backend infrastructure that powers them.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WGCLC6L2PZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WGCLC6L2PZ');
          `}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
