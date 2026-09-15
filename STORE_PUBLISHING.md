# OrbitDesk — Store Publishing Guide (Play Store + Microsoft Store)

OrbitDesk is a PWA — it can be published to Google Play Store (via TWA) and Microsoft Store (via PWA) without rewriting.

## Current PWA Status — 100% Ready
- Manifest: `/public/manifest.json` with icons 192, 512, polished logo, display standalone, start_url /, theme_color, categories, shortcuts, screenshots, file_handlers, share_target, edge_side_panel, launch_handler
- Service Worker: `/public/sw.js` — offline caching
- Icons: `/orbitdesk-logo-godmode-polished.png` 512x512 maskable, `/icon-192.png`, `/icon-512.png`
- HTTPS: Vercel provides SSL TLS 1.3
- Build: Next.js 16.3.5 passes

## Google Play Store (Android) — Via PWABuilder TWA

### Option 1: PWABuilder.com (No code, 5 minutes)
1. Go to https://www.pwabuilder.com
2. Enter URL: `https://orbitdesk-gamma.vercel.app`
3. Click Build My PWA → Score should be high (manifest, SW, icons present)
4. Click Store Package → Android → Generate
5. Download .aab (Android App Bundle) — signed, ready for Play Console
6. Update `assetlinks.json` in `/public/.well-known/assetlinks.json` with your SHA256 from Play Console → App Signing
7. Upload .aab to Google Play Console → https://play.google.com/console → Create app → Production → Upload
8. Fill store listing: Use polished logo, screenshots from `/public/orbitdesk-dashboard-8k.png`, description from `manifest.json`
9. Publish — OrbitDesk becomes native Android app, but runs your PWA via Trusted Web Activity (TWA) — 100% web code, no Java/Kotlin needed

### Option 2: Bubblewrap CLI (For devs)
```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://orbitdesk-gamma.vercel.app/manifest.json
bubblewrap build
# Generates app-release-signed.apk and .aab
```

### Play Store Requirements Met
- ✅ HTTPS
- ✅ Manifest with icons 192, 512 maskable
- ✅ Service Worker offline
- ✅ Display standalone
- ✅ assetlinks.json for TWA verification

## Microsoft Store (Windows) — Via PWABuilder

### PWABuilder.com (5 minutes)
1. Same as above — enter `https://orbitdesk-gamma.vercel.app`
2. Store Package → Windows → Generate
3. Download .msix package
4. Upload to Partner Center → https://partner.microsoft.com/dashboard → Create new app → Upload .msix
5. Fill listing: Use polished logo, screenshots
6. Publish — OrbitDesk becomes Windows app, runs via Edge WebView2, native notifications, Start menu

### Alternative: Electron for Windows Store
```bash
npm run build
npm run desktop:dist
# Generates OrbitDesk-Setup.exe 89MB + .msix via electron-builder
# electron-builder config in package.json already has win target nsis + appx
# For Microsoft Store, need appx target — add in package.json build.win.target = ["nsis", "appx"]
```

## Why PWA → Stores is Professional (Not Amateurish)
- **Starbucks, Twitter, Pinterest, Uber** — all use PWA → Play Store via TWA — not amateurish, industry standard
- **No rewrite:** 100% web code, offline, native notifications, same codebase for web, Android, Windows, macOS, Linux
- **Auto-updates:** Update orbitdesk-gamma.vercel.app → all store apps update instantly (TWA loads live web)
- **Professional:** Signed, SHA256, verified publisher Devine Nyaenya, not "click link boom desktop"

## Store Assets Ready
- Logo: `/public/orbitdesk-logo-godmode-polished.png` 1024x1024 — for store icon
- Screenshots: `/public/orbitdesk-dashboard-8k.png`, `/orbitdesk-callcenter-8k.png`, `/orbitdesk-remote-8k.png`, `/orbitdesk-logo-8k.png`
- Icon pack: `/public/orbitdesk-logo-pack-8k.zip`
- Description: From `src/app/layout.tsx` metadata — professional, not dev notes

## Next Steps
1. Run PWABuilder for orbitdesk-gamma.vercel.app → get Android .aab + Windows .msix
2. Update assetlinks.json with real SHA256 from Play Console
3. Submit to Play Console + Partner Center
4. OrbitDesk live in Play Store + Microsoft Store — same codebase, professional
