import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FluentPro AI",
  description:
    "AI-powered spoken English learning app for Indian professionals.",

  applicationName: "FluentPro AI",

  manifest: "/manifest.json",

  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],

    apple: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  },

  appleWebApp: {
    capable: true,
    title: "FluentPro AI",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#020617"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
