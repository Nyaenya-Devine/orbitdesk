'use client';
import { Ticket } from '@/lib/ticketEngine';

interface Props {
  tickets: Ticket[];
}

export default function DashboardMetrics({ tickets }: Props) {
  const total = tickets.length;
  const p1 = tickets.filter(t => t.priority === 'P1').length;
  const breached = tickets.filter(t => t.slaBreach).length;
  const unassigned = tickets.filter(t => !t.assignedTo).length;
  const recurring = tickets.filter(t => t.isRecurring).length;
  
  const slaCompliance = total > 0 ? Math.round(((total - breached) / total) * 100) : 100;
  const avgCSAT = 4.2;
  const avgFRT = 14;
  const avgMTTR = 42;

  const topTags = [
    { code: 'INTUNE-001', name: '0x80180024 Device already enrolled', count: 22, trend: '+12%' },
    { code: 'ENTRA-001', name: 'DeviceNotCompliant 53000', count: 18, trend: '+5%' },
    { code: 'EXCH-001', name: 'Quarantine - Invoice', count: 12, trend: '-3%' },
    { code: 'ENTRA-003', name: 'MFA Authenticator loop', count: 8, trend: '+2%' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">SLA Compliance</span>
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${slaCompliance >= 95 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{slaCompliance}%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{slaCompliance}%</div>
          <div className="text-xs text-slate-500 mt-1">Target: 95% • {breached} breached</div>
          <div className="mt-2 bg-slate-100 rounded-full h-1.5">
            <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${slaCompliance}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">CSAT Score</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">4.2/5</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">4.2 ⭐</div>
          <div className="text-xs text-red-600 mt-1">↓ 4.6 → 4.2 (drop!)</div>
          <div className="text-[11px] text-slate-500 mt-1">Quality vs Speed tradeoff?</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">FRT (First Response Time)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{avgFRT}m</div>
          <div className="text-xs text-slate-500 mt-1">Target: &lt;15m • MTTR {avgMTTR}m</div>
          <div className="mt-2 flex gap-1">
            <div className="flex-1 bg-green-500 h-1.5 rounded-full"></div>
            <div className="flex-1 bg-green-500 h-1.5 rounded-full"></div>
            <div className="flex-1 bg-amber-500 h-1.5 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Live Queue</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{total}</div>
          <div className="text-xs mt-1 flex gap-2">
            <span className="text-red-600 font-bold">{p1} P1</span>
            <span className="text-orange-600">{unassigned} unassigned</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{recurring} recurring tags</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-900">📈 Ticket Trends - Top Recurring Issues (Problem Management)</h3>
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">ITIL Problem</span>
        </div>
        
        <div className="space-y-2">
          {topTags.map(tag => (
            <div key={tag.code} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200">
              <div className="w-20 text-xs font-mono font-bold text-slate-700">{tag.code}</div>
              <div className="flex-1">
                <div className="text-sm text-slate-900">{tag.name}</div>
                <div className="text-xs text-slate-500">{tag.count} tickets this week</div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold ${tag.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>{tag.trend}</div>
                <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1">
                  <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, tag.count * 4)}%` }}></div>
                </div>
              </div>
              <button className="text-xs px-2 py-1 bg-slate-900 text-white rounded hover:bg-slate-800">Create KB + Fix</button>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
          <strong>Team Lead Action (Drive Quality & Improvement):</strong><br/>
          INTUNE-001 (0x80180024) - 22 tickets, +12% trend. Root cause: Stale device records from old laptops. 
          <strong> Propose:</strong> PowerShell script to auto-clean stale Entra devices + KB article + raise device cap from 5 to 10 for Client A. This is Problem Management per ITIL, not just Incident.
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-xl p-4">
        <h3 className="font-bold text-sm mb-2">🎯 What Success Looks Like (6-12 months) - From JD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="flex gap-2"><span className="text-green-400">✓</span> Confident, well-supported team meeting service expectations</div>
          <div className="flex gap-2"><span className="text-green-400">✓</span> Strong client relationships, reliable SLA performance</div>
          <div className="flex gap-2"><span className="text-green-400">✓</span> Clear development plans, measurable growth</div>
          <div className="flex gap-2"><span className="text-green-400">✓</span> Driven improvements to process/tooling/knowledge</div>
          <div className="flex gap-2"><span className="text-green-400">✓</span> Trusted point of contact for clients and team</div>
          <div className="flex gap-2"><span className="text-amber-400">◐</span> Current: SLA {slaCompliance}% | CSAT 4.2 (need 4.5)</div>
        </div>
      </div>
    </div>
  );
}
