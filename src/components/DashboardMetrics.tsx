'use client';
import { Ticket } from '@/lib/ticketEngine';

interface Props {
  tickets: Ticket[];
}

export default function DashboardMetrics({ tickets }: Props) {
  const total = tickets.length;
  const p1 = tickets.filter(t => t.priority === 'P1').length;
  const p2 = tickets.filter(t => t.priority === 'P2').length;
  const breached = tickets.filter(t => t.slaBreach).length;
  const unassigned = tickets.filter(t => !t.assignedTo).length;
  const recurring = tickets.filter(t => t.isRecurring).length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  
  const slaCompliance = total > 0 ? Math.round(((total - breached) / total) * 100) : 100;
  const avgCSAT = 4.2;
  const csatTarget = 4.5;
  const avgFRT = 14;
  const frtTarget = 15;
  const avgMTTR = 42;

  const topTags = [
    { code: 'INTUNE-001', name: '0x80180024 Device already enrolled', count: 22, trend: '+12%', impact: 'High', client: 'NovaTech', color: 'violet' },
    { code: 'ENTRA-001', name: 'DeviceNotCompliant 53000', count: 18, trend: '+5%', impact: 'High', client: 'NovaTech + Apex', color: 'indigo' },
    { code: 'EXCH-001', name: 'Quarantine - Invoice', count: 12, trend: '-3%', impact: 'Medium', client: 'Bloom', color: 'emerald' },
    { code: 'ENTRA-003', name: 'MFA Authenticator loop', count: 8, trend: '+2%', impact: 'Medium', client: 'All', color: 'amber' },
  ];

  const clientHealth = [
    { name: 'NovaTech Enterprises', type: 'Enterprise 24/7', sla: 92, open: 12, p1: 2, status: 'at-risk', color: 'red' },
    { name: 'Bloom & Co Studio', type: 'SMB 9-5', sla: 98, open: 3, p1: 0, status: 'healthy', color: 'emerald' },
    { name: 'Apex Financial', type: 'Regulated', sla: 96, open: 8, p1: 1, status: 'healthy', color: 'blue' },
  ];

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Header — Clean, Quiet Chrome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-[16px] tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-[#0a0a0a] text-white rounded-xl flex items-center justify-center text-sm">📊</span>
            Operations Dashboard
            <span className="text-[11px] font-medium bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full">Live • {total} tickets • {p1} P1</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">SLA, CSAT, FRT, MTTR, client health, ticket trends — Team Lead view from JD</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px]">
          <span className="bg-zinc-900 text-white px-3 py-1.5 rounded-full">SLA Target 95%</span>
          <span className="bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full">CSAT Target 4.5</span>
          <span className="bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full">44h/week</span>
        </div>
      </div>

      {/* KPI Bento — 4 Cards, Clean, Consistent */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* SLA Compliance */}
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4 hover:border-zinc-300 transition group">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">SLA Compliance</div>
              <div className="text-[28px] font-bold tracking-tight mt-1">{slaCompliance}%</div>
              <div className="text-xs text-zinc-500 mt-1">Target 95% • {breached} breached • {total - breached} on track</div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${slaCompliance >= 95 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {slaCompliance >= 95 ? '✓' : '⚠'}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-zinc-500 mb-1.5">
              <span>0%</span>
              <span className="font-medium">95% target</span>
              <span>100%</span>
            </div>
            <div className="bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div className={`h-2 rounded-full transition-all ${slaCompliance >= 95 ? 'bg-emerald-600' : 'bg-red-600'}`} style={{ width: `${slaCompliance}%` }}></div>
            </div>
          </div>
          <div className="mt-3 flex gap-1.5">
            <span className="text-[10px] bg-zinc-900 text-white px-2 py-1 rounded-full">{p1} P1</span>
            <span className="text-[10px] bg-zinc-100 border border-zinc-200 px-2 py-1 rounded-full">{p2} P2</span>
            <span className={`text-[10px] px-2 py-1 rounded-full border ${breached > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{breached} breached</span>
          </div>
        </div>

        {/* CSAT Score */}
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4 hover:border-zinc-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">CSAT Score</div>
              <div className="text-[28px] font-bold tracking-tight mt-1 flex items-baseline gap-2">
                {avgCSAT}
                <span className="text-[16px] text-zinc-400">/5</span>
                <span className="text-sm">⭐</span>
              </div>
              <div className="text-xs mt-1 flex items-center gap-1.5">
                <span className="text-red-600 font-medium">↓ 4.6 → 4.2</span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-500">Drop! Quality vs speed?</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-sm">💬</div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-zinc-500 mb-1.5">
              <span>Target {csatTarget}</span>
              <span className="text-amber-600 font-medium">Needs attention</span>
            </div>
            <div className="bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(avgCSAT/5)*100}%` }}></div>
            </div>
          </div>
          <div className="mt-3 text-[11px] bg-amber-50 border border-amber-200/60 rounded-xl p-2.5 text-amber-800">
            <strong>Insight:</strong> SLA green but CSAT red = rushing, sacrificing quality. Check low CSAT comments + QA reviews.
          </div>
        </div>

        {/* FRT + MTTR */}
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4 hover:border-zinc-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Response & Resolve</div>
              <div className="flex items-baseline gap-3 mt-1">
                <div>
                  <div className="text-[20px] font-bold tracking-tight">{avgFRT}m</div>
                  <div className="text-[11px] text-zinc-500">FRT • Target &lt;{frtTarget}m</div>
                </div>
                <div className="w-px h-8 bg-zinc-200"></div>
                <div>
                  <div className="text-[20px] font-bold tracking-tight">{avgMTTR}m</div>
                  <div className="text-[11px] text-zinc-500">MTTR</div>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-200 flex items-center justify-center text-sm">⚡</div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1">
            <div className="bg-emerald-500 h-2 rounded-full"></div>
            <div className="bg-emerald-500 h-2 rounded-full"></div>
            <div className="bg-amber-500 h-2 rounded-full"></div>
          </div>
          <div className="mt-3 flex gap-1.5 text-[10px]">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">FRT on track</span>
            <span className="bg-zinc-100 border border-zinc-200 px-2 py-1 rounded-full">MTTR {avgMTTR}m avg</span>
          </div>
        </div>

        {/* Live Queue */}
        <div className="bg-[#0a0a0a] text-white rounded-2xl border border-zinc-800 shadow-sm p-4 hover:border-zinc-700 transition">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Live Queue</div>
              <div className="text-[28px] font-bold tracking-tight mt-1">{total}</div>
              <div className="text-xs text-zinc-400 mt-1">{unassigned} unassigned • {recurring} recurring • {resolved} resolved today</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm">🎫</div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-2 text-center">
              <div className="font-bold text-red-300">{p1}</div>
              <div className="text-red-400/70">P1</div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-2 text-center">
              <div className="font-bold text-amber-300">{unassigned}</div>
              <div className="text-amber-400/70">Unassigned</div>
            </div>
            <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl p-2 text-center">
              <div className="font-bold text-violet-300">{recurring}</div>
              <div className="text-violet-400/70">Recurring</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-zinc-500">Real-time • Updates every 8s • SLA timers tick every 1s</div>
        </div>
      </div>

      {/* Second Row — Client Health + Queue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Client Health */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span className="w-6 h-6 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-xs">🏢</span>
              Client Health — Multi-Client MSP
            </h3>
            <span className="text-[11px] bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full">3 clients • Per-client SLA</span>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {clientHealth.map(client => (
              <div key={client.name} className="border border-zinc-200/60 rounded-xl p-3 hover:border-zinc-300 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-xs leading-tight">{client.name}</div>
                    <div className="text-[11px] text-zinc-500">{client.type}</div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${client.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-500">SLA</span>
                    <span className={`font-bold ${client.sla >= 95 ? 'text-emerald-600' : 'text-red-600'}`}>{client.sla}%</span>
                  </div>
                  <div className="bg-zinc-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${client.sla >= 95 ? 'bg-emerald-600' : 'bg-red-600'}`} style={{ width: `${client.sla}%` }}></div>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5 text-[10px]">
                  <span className="bg-zinc-100 border border-zinc-200 px-2 py-1 rounded-full">{client.open} open</span>
                  <span className={`${client.p1 > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-zinc-50 text-zinc-500 border-zinc-200'} border px-2 py-1 rounded-full`}>{client.p1} P1</span>
                  <span className={`px-2 py-1 rounded-full border ${client.status === 'healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{client.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-violet-100 text-violet-600 border border-violet-200 rounded-lg flex items-center justify-center text-xs">⚡</span>
            Quick Actions — Team Lead
          </h3>
          <div className="space-y-2.5">
            <button className="w-full text-left p-3 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-black transition flex items-center justify-between">
              <span>🚨 Review {breached} breached tickets</span>
              <span>→</span>
            </button>
            <button className="w-full text-left p-3 bg-white border border-zinc-200 rounded-xl text-xs font-medium hover:border-zinc-300 transition flex items-center justify-between">
              <span>👨‍💻 Resolve Alex vs Jamal conflict</span>
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px]">SBI</span>
            </button>
            <button className="w-full text-left p-3 bg-white border border-zinc-200 rounded-xl text-xs font-medium hover:border-zinc-300 transition flex items-center justify-between">
              <span>📚 Coach Jamal — escalation checklist</span>
              <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-[10px]">GROW</span>
            </button>
            <button className="w-full text-left p-3 bg-white border border-zinc-200 rounded-xl text-xs font-medium hover:border-zinc-300 transition flex items-center justify-between">
              <span>🎙️ Listen to low CSAT calls</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">QA</span>
            </button>
          </div>
          <div className="mt-4 text-[11px] text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-xl p-2.5">
            💡 <strong>Tip:</strong> CSAT 4.2 ↓ needs attention — SLA green but quality red = rushing
          </div>
        </div>
      </div>

      {/* Ticket Trends — Clean Bento */}
      <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 text-amber-600 border border-amber-200 rounded-lg flex items-center justify-center text-xs">📈</span>
              Ticket Trends — Top Recurring Issues
              <span className="text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">ITIL Problem Management</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Recurring tags → Create Problem ticket + KB + automation script (Drive Quality & Improvement from JD)</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] bg-zinc-900 text-white px-3 py-1.5 rounded-full">{topTags.reduce((a,b) => a+b.count, 0)} total recurring</span>
          </div>
        </div>
        
        <div className="p-3 grid gap-2">
          {topTags.map(tag => (
            <div key={tag.code} className="group flex items-center gap-4 p-3 rounded-xl border border-zinc-200/60 hover:border-zinc-300 hover:bg-zinc-50/50 transition">
              <div className="hidden md:flex w-24 flex-col">
                <div className="text-xs font-mono font-bold text-zinc-900">{tag.code}</div>
                <div className="text-[11px] text-zinc-500">{tag.client}</div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm text-zinc-900 truncate">{tag.name}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tag.impact === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{tag.impact}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tag.trend.startsWith('+') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>{tag.trend}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="text-xs text-zinc-500">{tag.count} tickets this week</div>
                  <div className="flex-1 max-w-[120px] bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full bg-${tag.color}-600`} style={{ width: `${Math.min(100, tag.count * 4)}%`, backgroundColor: tag.color === 'violet' ? '#7c3aed' : tag.color === 'indigo' ? '#4f46e5' : tag.color === 'emerald' ? '#059669' : '#d97706' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-zinc-900">{tag.count}</div>
                  <div className="text-[11px] text-zinc-500">tickets</div>
                </div>
                <button className="text-xs px-3 py-1.5 bg-[#0a0a0a] text-white rounded-full font-medium hover:bg-black transition opacity-0 group-hover:opacity-100">
                  Create KB + Fix →
                </button>
                <button className="md:hidden text-xs px-3 py-1.5 bg-zinc-900 text-white rounded-full">Fix</button>
              </div>
            </div>
          ))}
        </div>

        <div className="m-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/60 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-violet-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 text-sm">💡</div>
            <div>
              <div className="font-semibold text-sm text-violet-900">Team Lead Action — Drive Quality & Improvement (From JD)</div>
              <div className="text-xs text-violet-800 mt-1 leading-relaxed">
                <strong>INTUNE-001 (0x80180024)</strong> — 22 tickets, +12% trend, High impact, NovaTech client. Root cause: Stale device records from old laptops blocking new enrollment, MDM URL still present.<br/>
                <strong className="text-violet-900">Propose as Problem Management per ITIL:</strong> PowerShell script to auto-clean stale Entra devices older than 90 days + KB article "How to fix 0x80180024" + raise device cap from 5 to 10 for NovaTech + pair Jamal with Priya for shadowing 2 tickets/day. This is not just Incident — it's Problem.
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-full font-medium hover:bg-violet-700">Create Problem Ticket</button>
                <button className="text-xs bg-white border border-violet-200 text-violet-700 px-3 py-1.5 rounded-full hover:bg-violet-50">Write KB Article</button>
                <button className="text-xs bg-white border border-violet-200 text-violet-700 px-3 py-1.5 rounded-full hover:bg-violet-50">Build Automation Script</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Tracker — Clean, Not Cluttered */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2 bg-[#0a0a0a] text-white rounded-2xl border border-zinc-800 p-5">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-violet-600 rounded-lg flex items-center justify-center text-xs">🎯</span>
            What Success Looks Like (6-12 months) — From JD
          </h3>
          <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs">
            <div className="flex gap-2.5">
              <span className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">✓</span>
              <span className="text-zinc-300"><strong className="text-white">Confident, well-supported team</strong> meeting service expectations — rosters 44h/week, workload allocation, coverage</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">✓</span>
              <span className="text-zinc-300"><strong className="text-white">Strong client relationships</strong> — reliable SLA performance, tech vs non-tech expectations, voice calls with different voices</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">✓</span>
              <span className="text-zinc-300"><strong className="text-white">Clear development plans</strong> — measurable growth, 1:1s GROW, coaching SBI, escalation checklists</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">✓</span>
              <span className="text-zinc-300"><strong className="text-white">Driven improvements</strong> — process/tooling/knowledge, Problem Management ITIL, KB, automation scripts</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">✓</span>
              <span className="text-zinc-300"><strong className="text-white">Trusted point of contact</strong> — for clients and team, incident comms with next update, audit logs</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">◐</span>
              <span className="text-zinc-300"><strong className="text-white">Current:</strong> SLA {slaCompliance}% (target 95%) | CSAT {avgCSAT} (target {csatTarget}) | FRT {avgFRT}m (target &lt;{frtTarget}m)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-xs">🔒</span>
            Security Posture — Live
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Encrypted Sessions</span>
              <span className="font-bold text-emerald-600">✓ Active</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Audit Logs</span>
              <span className="font-bold text-emerald-600">✓ Everywhere</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">RBAC Senior/Junior/Lead</span>
              <span className="font-bold text-emerald-600">✓ Enforced</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Break Glass Excluded from CA</span>
              <span className="font-bold text-emerald-600">✓ Yes</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Zero Trust + Compliance</span>
              <span className="font-bold text-emerald-600">✓ Per-client</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Security Headers</span>
              <span className="font-bold text-emerald-600">✓ CSP+HSTS</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">No Real Data</span>
              <span className="font-bold text-emerald-600">✓ LocalStorage</span>
            </div>
          </div>
          <div className="mt-4 p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-[11px] text-zinc-600">
            <strong>Threat Model:</strong> 8 vectors with mitigations — CA misconfig → P1, stale enrollment → recurring, quarantine false positive, BitLocker key loss, password spray, junior escalation without logs, no break glass lockout, remote without audit
          </div>
        </div>
      </div>
    </div>
  );
}
