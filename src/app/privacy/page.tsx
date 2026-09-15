export default function PrivacyPage() {
 return (
 <div className="min-h-screen bg-[#fafafa] py-12 px-6">
 <div className="max-w-3xl mx-auto bg-white rounded-[20px] border border-zinc-200/60 p-8 shadow-sm">
  <div className="flex items-center gap-3 mb-8">
  <div className="w-10 h-10 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-white font-bold">◍</div>
  <div>
  <h1 className="font-bold text-xl tracking-tight">OrbitDesk - Privacy Policy</h1>
  <p className="text-xs text-zinc-500">Last updated: September 13, 2026 • No real data collected</p>
  </div>
  </div>

  <div className="prose prose-zinc prose-sm max-w-none space-y-6 text-[13px] leading-relaxed">
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-900">
  <strong>🔒 Privacy First:</strong> OrbitDesk runs 100% in your browser. We do NOT collect, store, or transmit any real personal data, credentials, Microsoft tenant data, or client data. All tickets and simulations are stored in LocalStorage on your device only and never sent to any server.
  </div>

  <section>
  <h2 className="font-semibold text-[15px]">1. No Real Data Collection</h2>
  <p>OrbitDesk does NOT collect:</p>
  <ul className="list-disc ml-5 space-y-1">
   <li>Real names, emails, or personal information (all simulated: Sarah Finance, etc. are fictional)</li>
   <li>Real Microsoft 365 credentials, tenant IDs, or Entra ID data</li>
   <li>Real client data or company information</li>
   <li>IP addresses, location, or device fingerprints beyond what Vercel hosting may log for basic hosting</li>
  </ul>
  </section>

  <section>
  <h2 className="font-semibold text-[15px]">2. Local Storage Only</h2>
  <p>All simulator state (tickets, resolved count, agent notes, chat messages) is stored in your browser's LocalStorage / IndexedDB. This data:</p>
  <ul className="list-disc ml-5 space-y-1">
   <li>Never leaves your device</li>
   <li>Is not sent to any server or third party</li>
   <li>Is deleted when you clear browser data</li>
   <li>Is not accessible by us or anyone else</li>
  </ul>
  </section>

  <section>
  <h2 className="font-semibold text-[15px]">3. No Cookies for Tracking</h2>
  <p>OrbitDesk does NOT use tracking cookies, advertising cookies, or analytics cookies. We may use essential cookies only for hosting (Vercel) to serve the site. No cross-site tracking.</p>
  </section>

  <section>
  <h2 className="font-semibold text-[15px]">4. Third-Party Services</h2>
  <p>OrbitDesk is hosted on Vercel. Vercel may collect basic hosting logs (IP, user agent) per their privacy policy for serving the site. We do NOT use Google Analytics, Facebook Pixel, or other trackers in the simulator itself. Mock portals (Entra, Intune, Exchange) are simulated UI, NOT real Microsoft API calls.</p>
  </section>

  <section>
  <h2 className="font-semibold text-[15px]">5. Simulated Communications</h2>
  <p>All client calls, chats, and remote desktop sessions are simulated. No real calls are made, no real remote access occurs. The "client" is an AI simulation with fictional personas. No real person is on the other end. Do NOT share real personal data in the simulator chat - it's for training only.</p>
  </section>

  <section>
  <h2 className="font-semibold text-[15px]">6. Children's Privacy</h2>
  <p>OrbitDesk is for IT professionals and not intended for children under 13. We do not knowingly collect data from children.</p>
  </section>

  <section>
  <h2 className="font-semibold text-[15px]">7. Your Rights</h2>
  <p>Since we collect no real data, there is no data to access, correct, or delete on our servers. To delete local simulator data, clear your browser's LocalStorage for this site (DevTools → Application → Local Storage → Clear).</p>
  </section>

  <section>
  <h2 className="font-semibold text-[15px]">8. Changes</h2>
  <p>If we ever add analytics or data collection (we have no plans to), we will update this policy and show a consent banner.</p>
  </section>

  <div className="bg-[#0a0a0a] text-white rounded-xl p-4 mt-8">
  <div className="font-semibold text-sm">🔒 Our Promise</div>
  <div className="text-xs text-zinc-400 mt-1">OrbitDesk was built to help you get hired without risking anyone's privacy. No real data, no tracking, no affiliation. Just pure training for Modern Workplace Support Team Lead roles.</div>
  </div>
  </div>

  <div className="mt-8 pt-6 border-t border-zinc-100 flex gap-3 text-xs">
  <a href="/" className="px-4 py-2 bg-[#0a0a0a] text-white rounded-full">← Back to Lab</a>
  <a href="/terms" className="px-4 py-2 bg-zinc-100 rounded-full">Terms</a>
  <a href="/disclaimer" className="px-4 py-2 bg-zinc-100 rounded-full">Disclaimer</a>
  </div>
 </div>
 </div>
 );
}
