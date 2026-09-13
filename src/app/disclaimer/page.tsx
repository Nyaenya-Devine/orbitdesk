export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-[20px] border border-zinc-200/60 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-white font-bold">◍</div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">OrbitDesk - Disclaimer & Legal</h1>
            <p className="text-xs text-zinc-500">Educational Simulator • No Affiliation • Fair Use</p>
          </div>
        </div>

        <div className="space-y-6 text-[13px] leading-relaxed">
          <div className="bg-[#0a0a0a] text-white rounded-xl p-5">
            <h2 className="font-bold text-[15px] mb-3">⚠️ OrbitDesk is an Educational Training Simulator</h2>
            <div className="space-y-2 text-zinc-300 text-xs leading-relaxed">
              <p>OrbitDesk is an <strong className="text-white">independent, open-source training lab</strong> created by Devine Nyaenya to practice Modern Workplace Support Team Lead skills. It is NOT a real help desk, NOT a real MSP platform, and does NOT provide real IT support.</p>
              <p>It simulates: Ticket queue with SLA timers, Entra ID sign-in logs, Intune compliance, Exchange Message Trace, Teams, Service Health, What If tool, Report-Only mode, dsregcmd, remote PC access, client calls, agent conflicts - all for learning.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2">🚫 No Affiliation</h3>
              <div className="text-xs text-zinc-600 space-y-2">
                <p><strong>NOT affiliated with:</strong></p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Influx (Support as a Service)</li>
                  <li>Microsoft (M365, Entra ID, Intune, Exchange, Teams, Defender, Windows)</li>
                  <li>Any simulated clients (NovaTech, Bloom & Co, Apex Financial are fictional)</li>
                  <li>Zendesk, ServiceNow, Freshservice, ConnectWise, etc.</li>
                </ul>
                <p className="text-[11px] text-zinc-500 mt-2">All trademarks are property of their respective owners. Mentioned for educational identification only.</p>
              </div>
            </div>

            <div className="border border-zinc-200 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2">🎓 Fair Use - Educational</h3>
              <div className="text-xs text-zinc-600 space-y-2">
                <p>Use of product names and error codes (e.g., 53000 DeviceNotCompliant, 0x80180024, Entra ID, Intune) is under <strong>fair use for educational purposes</strong>:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Teaching Modern Workplace troubleshooting</li>
                  <li>Training for Team Lead interviews</li>
                  <li>Non-commercial, transformative use (simulator, not real product)</li>
                  <li>No market harm - does not replace real Microsoft products</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2 text-amber-900">🔒 No Real Access - Simulated Only</h3>
            <div className="text-xs text-amber-800 space-y-1">
              <p>• <strong>Remote PC Access</strong> is a mock Windows 11 UI - does NOT actually remote into any real computer. Commands like dsregcmd /status show simulated output.</p>
              <p>• <strong>Client Calls</strong> are simulated conversations with fictional personas - no real person is called, no real phone system used.</p>
              <p>• <strong>Admin Portals</strong> (Entra, Intune, Exchange) are simulated viewers with fake data - NOT real Microsoft API calls, NOT connected to any tenant.</p>
              <p>• <strong>Do NOT</strong> enter real credentials, tenant IDs, or client data. This is a safe training sandbox.</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[15px] mb-3">📋 What OrbitDesk Teaches (From Real JD)</h3>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                <strong>Provide Technical Oversight</strong><br/>
                <span className="text-zinc-600">M365, Entra ID (sign-in logs, CA, What If, Report-Only, MFA, Audit logs), Intune (enrollment 0x80180024, compliance BitLocker, dsregcmd, Company Portal Sync), Exchange (Message Trace, Quarantine), Teams, Windows, Defender</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                <strong>Lead & Develop Team</strong><br/>
                <span className="text-zinc-600">Rosters, workload allocation, coverage across multiple clients, 44h/week compliance, 1:1s with GROW, coaching with SBI, conflict resolution (Alex vs Jamal), performance expectations SMART</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                <strong>Manage Clients & Service Delivery</strong><br/>
                <span className="text-zinc-600">Day-to-day contact, tech vs non-tech comms (prioritize listener), incident comms with next update time, SLA (Service Level Agreement) 95%, tech enterprise vs SMB handling</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                <strong>Drive Quality & Improvement</strong><br/>
                <span className="text-zinc-600">Monitor SLA, CSAT (Customer Satisfaction), FRT (First Response Time), MTTR (Mean Time To Resolve), QA (Quality Assurance), ticket trends, Problem Management per ITIL, KB (Knowledge Base), automation, tooling</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[15px] mb-2">⚖️ Legal Protection for You</h3>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-xs space-y-2">
              <p><strong>To avoid trouble with anyone:</strong></p>
              <ul className="list-disc ml-5 space-y-1 text-zinc-600">
                <li>OrbitDesk is named generically - does NOT use "Influx" or "Microsoft" in title or domain (orbitdesk.vercel.app is safe)</li>
                <li>All clients are fictional (NovaTech, Bloom & Co, Apex Financial) - no real company names</li>
                <li>All agents are fictional personas - no real persons</li>
                <li>All tickets are simulated - error codes are real Microsoft codes used for education (fair use)</li>
                <li>Source code is original, © 2026 Devine Nyaenya, MIT licensed for portfolio</li>
                <li>Design inspired by top SaaS (Linear, Stripe, Slack, Intercom, Superhuman, Notion) but original implementation - no copying</li>
                <li>No tracking, no real data collection - privacy safe</li>
                <li>Clear disclaimer on every page footer: "Educational simulator, not affiliated"</li>
              </ul>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2 text-violet-900">💎 Why This is a Masterpiece for Hiring</h3>
            <div className="text-xs text-violet-800 leading-relaxed">
              Most candidates show a to-do app. You show a <strong>real MSP Team Lead workspace</strong> with live SLA timers, multi-client policies, agent conflicts, client calls with different voices, remote PC access that feels real, and admin portals that teach Entra ID sign-in logs CA tab, Intune dsregcmd, Exchange quarantine. It proves you understand: Provide Technical Oversight, Lead & Develop Team, Manage Clients, Drive Quality - exactly from JD. And you built it with top 1% SaaS polish (Linear dark-first + violet accent, Stripe polish, Slack channels, Intercom human chat, Superhuman speed).
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 border-t border-zinc-100 pt-4">
            <p>© 2026 OrbitDesk • Built by Devine Nyaenya • Educational Simulator • Not affiliated with Influx, Microsoft, or any simulated client • All trademarks property of respective owners • For training only • Use at your own risk, always follow official Microsoft Learn docs and employer procedures in real work • MIT License for original code • Hosted on Vercel</p>
          </div>
        </div>

        <div className="mt-8 flex gap-3 text-xs">
          <a href="/" className="px-5 py-2.5 bg-[#0a0a0a] text-white rounded-full font-medium">← Back to OrbitDesk Lab</a>
          <a href="/terms" className="px-4 py-2.5 bg-zinc-100 rounded-full">Terms</a>
          <a href="/privacy" className="px-4 py-2.5 bg-zinc-100 rounded-full">Privacy</a>
        </div>
      </div>
    </div>
  );
}
