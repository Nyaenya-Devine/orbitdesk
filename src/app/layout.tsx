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
  title: "OrbitDesk — Modern Workplace Operations Lab | MSP Team Lead Simulator",
  description: "The finest MSP Team Lead Simulator — Real-time endless tickets (16 types), live voice calls with clients who talk back and do actions, remote PC access with encrypted RDP, per-client CA/Compliance policies, 5 agents with conflicts, 6 mock admin portals, tech experts conference. 100% real feel, security hardened, desktop installable.",
  applicationName: "OrbitDesk",
  authors: [{ name: "Devine Nyaenya", url: "https://github.com/Nyaenya-Devine" }],
  creator: "Devine Nyaenya",
  publisher: "OrbitDesk",
  keywords: ["MSP", "Modern Workplace", "Team Lead", "Entra ID", "Intune", "M365", "Conditional Access", "Service Desk", "Simulator", "PWA", "Desktop App", "Voice Calls", "Remote PC"],
  category: "Business",
  classification: "MSP Team Lead Simulator",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://orbitdesk.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "OrbitDesk — Modern Workplace Operations Lab",
    description: "Real-time tickets, live voice calls where clients talk and do actions, remote PC access, per-client policies, tech experts. Security hardened, desktop installable.",
    url: "https://orbitdesk.vercel.app",
    siteName: "OrbitDesk",
    type: "website",
    locale: "en_US",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "OrbitDesk Icon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OrbitDesk — Modern Workplace Operations Lab",
    description: "MSP Team Lead Simulator with real voice calls, remote PC, per-client policies, security hardened",
    images: ["/icon-512.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
  appleWebApp: {
    capable: true,
    title: "OrbitDesk",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#0a0a0a",
    "msapplication-config": "/browserconfig.xml",
    "google-site-verification": "2fc201988ef60e66",
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
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
              // PWA install prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('OrbitDesk installable');
                // Show custom install button if needed
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
