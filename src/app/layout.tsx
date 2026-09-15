import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "OrbitDesk — Modern Workplace Operations Lab",
 description: "Professional helpdesk simulator for Microsoft 365 — practice Entra ID, Intune, Exchange, Teams with real tickets, voice calls, remote desktop, and team collaboration. Built for IT support training.",
 applicationName: "OrbitDesk",
 authors: [{ name: "Devine Nyaenya", url: "https://github.com/Nyaenya-Devine" }],
 creator: "Devine Nyaenya",
 publisher: "OrbitDesk",
 keywords: ["IT Support", "Helpdesk Simulator", "Microsoft 365", "Entra ID", "Intune", "Exchange", "Teams", "MSP", "Training Lab", "Service Desk"],
 category: "Education",
 classification: "IT Support Training",
 referrer: "strict-origin-when-cross-origin",
 formatDetection: { email: false, address: false, telephone: false },
 metadataBase: new URL("https://orbitdesk-gamma.vercel.app"),
 alternates: { canonical: "/" },
 openGraph: {
 title: "OrbitDesk — Modern Workplace Operations Lab",
 description: "Practice real IT support scenarios — Entra ID Conditional Access, Intune compliance, Exchange mail flow, Teams troubleshooting with voice calls and remote desktop.",
 url: "https://orbitdesk-gamma.vercel.app",
 siteName: "OrbitDesk",
 type: "website",
 locale: "en_US",
 images: [
 { url: "/orbitdesk-logo-godmode-polished.png", width: 1024, height: 1024, alt: "OrbitDesk Logo" },
 { url: "/orbitdesk-dashboard-8k.png", width: 1200, height: 630, alt: "OrbitDesk Dashboard" },
 ],
 },
 twitter: {
 card: "summary_large_image",
 title: "OrbitDesk — Modern Workplace Operations Lab",
 description: "Professional helpdesk simulator for Microsoft 365 training",
 images: ["/orbitdesk-logo-godmode-polished.png"],
 },
 manifest: "/manifest.json",
 icons: {
 icon: [
 { url: "/orbitdesk-logo-godmode-polished.png", sizes: "512x512", type: "image/png" },
 { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
 { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
 ],
 apple: [{ url: "/orbitdesk-logo-godmode-polished.png", sizes: "512x512" }],
 },
 appleWebApp: {
 capable: true,
 title: "OrbitDesk",
 statusBarStyle: "black-translucent",
 },
 other: {
 "msapplication-TileColor": "#0a0a0a",
 "google-site-verification": "C8QKXRUtAMh_JjAo8WCH8HExLcd-7Z8lJbVslXkxo7I",
 },
};

export const viewport: Viewport = {
 themeColor: "#0a0a0a",
 colorScheme: "dark",
 width: "device-width",
 initialScale: 1,
 maximumScale: 5,
 userScalable: true,
 viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
 <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
 <head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#0a0a0a" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="OrbitDesk" />
  <link rel="apple-touch-icon" href="/orbitdesk-logo-godmode-polished.png" />
  <meta name="mobile-web-app-capable" content="yes" />
  <link rel="icon" href="/orbitdesk-logo-godmode-polished.png" />
 </head>
 <body className="min-h-full flex flex-col bg-[#050507] text-zinc-100">
  {children}
  <script
  dangerouslySetInnerHTML={{
  __html: `
   if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
   navigator.serviceWorker.register('/sw.js').catch(()=>{});
   });
   }
  `,
  }}
  />
 </body>
 </html>
 );
}
