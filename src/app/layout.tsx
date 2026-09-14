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
  title: "OrbitDesk v6.0 — Queen Elizabeth 👑 Level Excellence | Voice-to-Voice Calls, Remote PC, 8k Logo",
  description: "World-class expert Modern Workplace Operations Lab — MSP Team Lead Simulator: voice-to-voice calls mouth-to-ear no texting (you speak with mouth, caller hears voice, caller speaks voice you hear via ear, even baby understands), real-time endless tickets 16 types, remote PC access encrypted RDP 100% real feel, per-client policies NovaTech/Bloom/Apex different, ability to execute actions that seem real, bento clean dashboard, livery background related to project good nasty work, thread humor trending. Human premium not AI basic, inspired by top 20 sites combined, clear expectations like Influx, experience 100% real. God mode polished logo — orbit on top of PC with round wooden stand, PC on wood, orbit fixing things with enticing details. 8k advanced images, downloadable logo pack.",
  applicationName: "OrbitDesk",
  authors: [{ name: "Devine Nyaenya", url: "https://github.com/Nyaenya-Devine" }],
  creator: "Devine Nyaenya",
  publisher: "OrbitDesk",
  keywords: ["MSP", "Modern Workplace", "Team Lead", "Entra ID", "Intune", "M365", "Conditional Access", "Service Desk", "Simulator", "PWA", "Desktop App", "Voice Calls Mouth-to-Ear", "Remote PC", "8k Logo", "Queen Elizabeth Excellence"],
  category: "Business",
  classification: "MSP Team Lead Simulator",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://orbitdesk-gamma.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "OrbitDesk v6.0 — Queen Elizabeth 👑 Level | Voice-to-Voice, No Texting, Orbit Fixing PC on Wooden Stand",
    description: "Voice-to-voice calls mouth-to-ear — you speak with mouth caller hears, caller speaks you hear via ear, no texting back after talk like real phone. Orbit on top of PC with round wooden stand, orbit fixing things with enticing details M365, Entra, Intune, voice waveform, remote cursor. 8k advanced images, downloadable logo pack.",
    url: "https://orbitdesk-gamma.vercel.app",
    siteName: "OrbitDesk",
    type: "website",
    locale: "en_US",
    images: [
      { url: "/orbitdesk-logo-godmode-polished.png", width: 1024, height: 1024, alt: "OrbitDesk God Mode Polished Logo — Orbit on top of PC with wooden stand, Queen Elizabeth excellence" },
      { url: "/orbitdesk-dashboard-8k.png", width: 1200, height: 630, alt: "OrbitDesk Dashboard 8k — Bento clean, voice calls, remote PC" },
      { url: "/orbitdesk-callcenter-8k.png", width: 1200, height: 630, alt: "OrbitDesk Voice Call Center 8k — Mouth-to-Ear, No Texting" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OrbitDesk v6.0 — Queen Elizabeth 👑 Excellence | Voice-to-Voice Calls",
    description: "Mouth-to-ear voice calls no texting, orbit fixing PC on wooden stand, 8k logo pack downloadable",
    images: ["/orbitdesk-logo-godmode-polished.png", "/orbitdesk-dashboard-8k.png"],
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
    "msapplication-config": "/browserconfig.xml",
    "google-site-verification": "C8QKXRUtAMh_JjAo8WCH8HExLcd-7Z8lJbVslXkxo7I",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  colorScheme: "dark light",
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
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OrbitDesk" />
        <link rel="apple-touch-icon" href="/orbitdesk-logo-godmode-polished.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/orbitdesk-logo-godmode-polished.png" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('OrbitDesk PWA SW registered', reg.scope))
                    .catch(err => console.log('SW failed', err));
                });
              }
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('OrbitDesk installable');
                const event = new CustomEvent('orbitdesk-installable', { detail: deferredPrompt });
                window.dispatchEvent(event);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
