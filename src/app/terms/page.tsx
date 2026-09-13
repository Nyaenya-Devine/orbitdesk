export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-[20px] border border-zinc-200/60 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-white font-bold">◍</div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">OrbitDesk - Terms & Conditions</h1>
            <p className="text-xs text-zinc-500">Last updated: September 13, 2026 • Educational Simulator</p>
          </div>
        </div>

        <div className="prose prose-zinc prose-sm max-w-none space-y-6 text-[13px] leading-relaxed">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900">
            <strong>⚠️ Important:</strong> OrbitDesk is an independent educational training simulator. It is NOT affiliated with, endorsed by, or connected to Influx, Microsoft, Entra ID, Intune, or any other company. All trademarks belong to their respective owners. This tool is for learning Modern Workplace Support concepts only.
          </div>

          <section>
            <h2 className="font-semibold text-[15px]">1. Educational Purpose Only</h2>
            <p>OrbitDesk is a training simulator designed to help IT support professionals practice Modern Workplace troubleshooting (Microsoft 365, Entra ID, Intune, Exchange Online, Teams, Windows). It simulates tickets, client interactions, and admin portals for educational purposes. It does NOT provide real IT support, does NOT connect to real Microsoft tenants, and does NOT access real client data.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">2. No Affiliation Disclaimer</h2>
            <p>OrbitDesk is NOT affiliated with:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Influx / Support as a Service companies</li>
              <li>Microsoft Corporation (Microsoft 365, Entra ID, Intune, Exchange Online, Teams, Windows, Defender)</li>
              <li>Any client companies simulated (NovaTech, Bloom & Co, Apex Financial are fictional)</li>
            </ul>
            <p>All product names, logos, and trademarks are property of their respective owners. Use of these names is for educational identification only under fair use for training.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">3. Simulated Data</h2>
            <p>All tickets, clients, agents, error codes (e.g., 53000 DeviceNotCompliant, 0x80180024), logs, and policies are simulated and fictional. Any resemblance to real persons, companies, or incidents is coincidental. Do NOT use real credentials, real tenant IDs, or real client data in this simulator.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">4. No Warranty</h2>
            <p>This simulator is provided "as is" without warranty. While we strive for accuracy in Modern Workplace concepts (Entra ID sign-in logs, Intune compliance, Message Trace, What If tool, Report-Only mode, dsregcmd), procedures may change as Microsoft updates its platforms. Always refer to official Microsoft Learn documentation for production work.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">5. Acceptable Use</h2>
            <p>You may use OrbitDesk to:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Practice troubleshooting for interviews and skill development</li>
              <li>Train junior agents in a safe environment</li>
              <li>Demonstrate Team Lead skills (roster management, SLA/CSAT tracking, coaching via SBI/GROW)</li>
            </ul>
            <p>You may NOT:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Use it to provide real support to real clients without proper training</li>
              <li>Claim affiliation with Influx, Microsoft, or any simulated client</li>
              <li>Use it to access real systems or bypass security</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">6. Privacy - No Real Data Collected</h2>
            <p>OrbitDesk runs entirely in your browser (LocalStorage). We do NOT collect, store, or transmit real personal data, credentials, or client data. Simulated tickets are stored locally only. See Privacy Policy for details.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">7. Intellectual Property</h2>
            <p>OrbitDesk simulator code and original content are © 2026 Devine Nyaenya. You may use it for personal learning and portfolio demonstration. If you fork or reuse, please credit and include this disclaimer. Microsoft product names and error codes are used under fair use for educational purposes.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">8. Limitation of Liability</h2>
            <p>OrbitDesk is a training tool, not production software. The creator is not liable for any decisions made based on simulator training. Always follow your employer's official procedures and Microsoft's official documentation in real work.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[15px]">9. Contact</h2>
            <p>For questions about this simulator, contact via portfolio: https://devine-nyaenya-portfolio.vercel.app</p>
          </section>

          <div className="bg-[#0a0a0a] text-white rounded-xl p-4 mt-8">
            <div className="font-semibold text-sm">💎 Why OrbitDesk exists</div>
            <div className="text-xs text-zinc-400 mt-1 leading-relaxed">Built to master Team Lead - Modern Workplace Support: Provide Technical Oversight (M365, Entra ID, Intune, Exchange, Teams, Windows), Lead & Develop Team (rosters, workload, 1:1s, coaching), Manage Clients & Service Delivery (SLA, CSAT, tech vs non-tech comms), Drive Quality & Improvement (ticket trends, QA, Problem Management, KB, automation). Inspired by top SaaS design: Linear, Stripe, Slack, Intercom, Superhuman, Notion.</div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex gap-3 text-xs">
          <a href="/" className="px-4 py-2 bg-[#0a0a0a] text-white rounded-full">← Back to Lab</a>
          <a href="/privacy" className="px-4 py-2 bg-zinc-100 rounded-full">Privacy Policy</a>
          <a href="/disclaimer" className="px-4 py-2 bg-zinc-100 rounded-full">Disclaimer</a>
        </div>
      </div>
    </div>
  );
}
