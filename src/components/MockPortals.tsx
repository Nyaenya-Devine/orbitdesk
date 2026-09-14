'use client';
import { Ticket } from '@/lib/ticketEngine';
import { useState } from 'react';

interface Props {
  ticket: Ticket | null;
  onAction?: (action: string) => void;
}

export default function MockPortals({ ticket, onAction }: Props) {
  const [activePortal, setActivePortal] = useState<'signin' | 'intune' | 'exchange' | 'service' | 'whatif' | 'audit'>('signin');
  const [whatIfCompliant, setWhatIfCompliant] = useState(false);
  const [quarantineReleased, setQuarantineReleased] = useState(false);
  const [bitLockerFixed, setBitLockerFixed] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  if (!ticket) {
    return (
      <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 p-8 text-center text-zinc-500 h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-2xl border border-zinc-700">🔍</div>
        <p className="font-medium text-zinc-300">Select a ticket to open admin portals — every action real</p>
        <p className="text-[12px] mt-2">Entra ID, Intune, Exchange, Service Health, What If, Audit Logs — all buttons commit real actions with toast proof</p>
      </div>
    );
  }

  const portals = [
    { id: 'signin', label: 'Entra Sign-in Logs', icon: '🔐' },
    { id: 'intune', label: 'Intune Compliance', icon: '📱' },
    { id: 'exchange', label: 'Exchange Trace', icon: '📧' },
    { id: 'service', label: 'Service Health', icon: '💚' },
    { id: 'whatif', label: 'What If Tool', icon: '🧪' },
    { id: 'audit', label: 'Audit Logs', icon: '📜' },
  ] as const;

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="bg-zinc-900 p-2.5 flex items-center gap-1.5 overflow-x-auto border-b border-zinc-800/60">
        {portals.map(p => (
          <button
            key={p.id}
            onClick={() => {
              setActivePortal(p.id as any);
              onAction?.(`Opened ${p.label} for ${ticket.code} — checking logs`);
            }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap flex items-center gap-1.5 transition border ${activePortal === p.id ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200'}`}
          >
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#050507] p-4 text-[12px]">
        {activePortal === 'signin' && (
          <div className="space-y-3">
            <div className="bg-[#0a0a0a] p-3 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-zinc-100">Microsoft Entra Admin Center - Sign-in Logs</h4>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700">entra.microsoft.com</span>
              </div>
              <div className="text-[11px] text-zinc-500 mb-3">Filtered: User = {ticket.userEmail} | Last 24h | Status = Failure</div>
              
              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-900 p-2 grid grid-cols-5 gap-2 font-bold text-[11px] text-zinc-400">
                  <span>Time</span><span>User</span><span>App</span><span>Status</span><span>Details</span>
                </div>
                <div className="p-2 grid grid-cols-5 gap-2 bg-red-500/10 border-t border-zinc-800 text-[11px]">
                  <span className="text-zinc-400">{new Date().toLocaleTimeString()}</span>
                  <span className="truncate text-zinc-200">{ticket.userEmail}</span>
                  <span className="text-zinc-300">Exchange Online</span>
                  <span className="text-red-400 font-bold">Failure</span>
                  <span className="text-red-400">Blocked by CA</span>
                </div>
              </div>

              <div className="mt-4 bg-zinc-900 text-zinc-300 p-3 rounded-xl border border-zinc-800">
                <div className="font-bold text-white mb-2 flex items-center justify-between">
                  <span>▶ Conditional Access Tab — Root Cause</span>
                  <button onClick={() => onAction?.(`Checked Sign-in logs CA tab — ${ticket.errorCodes[0] || 'DeviceNotCompliant'} for ${ticket.code} — logs checked ✓`)} className="h-6 px-2.5 rounded-full bg-white text-black text-[11px] font-semibold">Check → Logs ✓</button>
                </div>
                <div>Policy: <span className="text-amber-300">"Require compliant device for M365"</span></div>
                <div>Result: <span className="text-red-400">Failure - Blocked</span></div>
                <div>Reason: <span className="text-red-400">{ticket.errorCodes[0] || 'DeviceNotCompliant'}</span></div>
                <div className="mt-2 text-zinc-400">Conditions: Not Compliant, Mobile Apps, Trusted Location</div>
                <div className="mt-2 text-emerald-300">→ Action: Check Intune → Device Compliance for failing setting (BitLocker) — button commits real</div>
              </div>
            </div>
          </div>
        )}

        {activePortal === 'intune' && (
          <div className="space-y-3">
            <div className="bg-[#0a0a0a] p-3 rounded-xl border border-zinc-800">
              <h4 className="font-bold text-zinc-100 mb-2 flex items-center justify-between">
                Intune Admin Center - Device Compliance
                <button onClick={() => { setSyncDone(true); onAction?.(`Company Portal Sync for ${ticket.userEmail} — Last sync now, BitLocker still failing`); }} className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition ${syncDone ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-white text-black border-white hover:bg-zinc-100'}`}>{syncDone ? '✓ Synced Now' : 'Sync →'}</button>
              </h4>
              <div className="text-[11px] text-zinc-500 mb-3">Device: {ticket.userEmail.split('@')[0]}-LAPTOP | User: {ticket.userEmail}</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-zinc-800 rounded-xl p-2.5 bg-zinc-900/50">
                  <div className="text-[10px] text-zinc-500">Compliance State</div>
                  <div className={`font-bold ${bitLockerFixed ? 'text-emerald-400' : 'text-red-400'}`}>{bitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</div>
                  <div className="text-[10px] mt-1 text-zinc-500">Last Check-in: {syncDone ? 'Just now' : '2 hours ago'}</div>
                </div>
                <div className="border border-zinc-800 rounded-xl p-2.5 bg-zinc-900/50">
                  <div className="text-[10px] text-zinc-500">Management</div>
                  <div className="font-bold text-zinc-200">Intune + Entra Joined</div>
                  <div className="text-[10px] mt-1 text-zinc-500">OS: Windows 11 22H2</div>
                </div>
              </div>

              <div className="mt-3 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-900 p-2 font-bold text-[11px] text-zinc-300">Failing Settings — Root Cause (Real Action)</div>
                <div className="divide-y divide-zinc-800/50">
                  <div className={`p-2.5 flex justify-between items-center ${bitLockerFixed ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    <span className="text-zinc-200">🔴 BitLocker - Require BitLocker</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${bitLockerFixed ? 'text-emerald-400' : 'text-red-400'}`}>{bitLockerFixed ? 'Compliant ✓ Fixed' : 'Not Compliant'}</span>
                      {!bitLockerFixed && <button onClick={() => { setBitLockerFixed(true); onAction?.(`Enabled BitLocker for ${ticket.userEmail} — Protection On, key escrowed to Entra ID — correct tool used ✓`); }} className="h-6 px-2.5 rounded-full bg-white text-black text-[11px] font-semibold hover:bg-zinc-100">Enable → Fix</button>}
                    </div>
                  </div>
                  <div className="p-2.5 flex justify-between bg-emerald-500/5"><span className="text-zinc-400">🟢 OS Version</span><span className="text-emerald-400">Compliant</span></div>
                  <div className="p-2.5 flex justify-between bg-emerald-500/5"><span className="text-zinc-400">🟢 Defender</span><span className="text-emerald-400">Compliant</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePortal === 'exchange' && (
          <div className="space-y-3">
            <div className="bg-[#0a0a0a] p-3 rounded-xl border border-zinc-800">
              <h4 className="font-bold text-zinc-100 mb-2">Exchange Admin Center - Message Trace</h4>
              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-900 p-2 grid grid-cols-4 gap-2 font-bold text-[11px] text-zinc-400"><span>Time</span><span>Sender</span><span>Status</span><span>Details</span></div>
                <div className={`p-2 grid grid-cols-4 gap-2 border-t border-zinc-800 text-[11px] ${quarantineReleased ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}><span className="text-zinc-400">{new Date().toLocaleTimeString()}</span><span className="text-zinc-200">vendor@supplier.com</span><span className={`font-bold ${quarantineReleased ? 'text-emerald-400' : 'text-amber-400'}`}>{quarantineReleased ? 'Released ✓' : 'Quarantined'}</span><span className="text-zinc-400">Bulk - High</span></div>
              </div>

              <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <div><div className="font-bold text-[13px] text-zinc-100">Invoice_12345.pdf</div><div className="text-[11px] text-zinc-500">Quarantined: Today 09:12 | Reason: Bulk | Policy: Anti-spam</div></div>
                  <div className="flex gap-2">
                    <button onClick={() => { setQuarantineReleased(true); onAction?.(`Released quarantined email for ${ticket.userEmail} — Allow Sender + Not Junk — correct tool ✓`); }} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition ${quarantineReleased ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 'bg-white text-black hover:bg-zinc-100'}`}>{quarantineReleased ? '✓ Released' : 'Release →'}</button>
                    <button onClick={() => onAction?.(`Allowed sender vendor@supplier.com for ${ticket.code} — anti-spam tuned`)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full text-[12px] hover:bg-zinc-700">Allow Sender</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePortal === 'service' && (
          <div className="bg-[#0a0a0a] p-3 rounded-xl border border-zinc-800">
            <h4 className="font-bold text-zinc-100 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span> Microsoft 365 Service Health</span>
              <button onClick={() => onAction?.(`Checked Service Health — Exchange, Teams, Entra, Intune all green — no Microsoft incident for ${ticket.code}`)} className="h-6 px-2.5 rounded-full bg-white text-black text-[11px] font-semibold">Refresh → Check ✓</button>
            </h4>
            <div className="space-y-2">
              {['Exchange Online','Teams','Entra','Intune'].map(s => (
                <div key={s} className="flex items-center justify-between p-2.5 border border-zinc-800 rounded-xl bg-emerald-500/5"><span className="text-zinc-200">✅ {s}</span><span className="text-emerald-400 text-[11px]">Healthy</span></div>
              ))}
            </div>
            <div className="mt-3 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-[11px] text-zinc-400">✅ No Microsoft incident — Issue is on our side, not Microsoft. Real check commits.</div>
          </div>
        )}

        {activePortal === 'whatif' && (
          <div className="bg-[#0a0a0a] p-3 rounded-xl border border-zinc-800">
            <h4 className="font-bold text-zinc-100 mb-2 flex items-center justify-between">
              🧪 Conditional Access What If — Safe Testing (Real Toggle)
              <button onClick={() => setWhatIfCompliant(!whatIfCompliant)} className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition ${whatIfCompliant ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/15 text-amber-300 border-amber-500/20'}`}>{whatIfCompliant ? 'Compliant YES' : 'Compliant NO'}</button>
            </h4>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl space-y-2 text-[11px]">
              <div className="text-zinc-400">User: {ticket.userEmail} | Device: Compliant = {whatIfCompliant ? 'YES' : 'NO'} | Location: Trusted</div>
              <div className={`p-2.5 rounded-xl border ${whatIfCompliant ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                {whatIfCompliant ? '✅ ALLOWED — Policy would grant access if compliant' : '❌ BLOCKED by Require compliant device — Reason: Not Compliant'}
              </div>
              <button onClick={() => onAction?.(`What If tested for ${ticket.code} — Compliant ${whatIfCompliant ? 'YES=ALLOWED' : 'NO=BLOCKED'} — safe testing, no impact`)} className="w-full h-8 rounded-full bg-white text-black text-[12px] font-semibold mt-2">Test → What If Log ✓</button>
            </div>
          </div>
        )}

        {activePortal === 'audit' && (
          <div className="bg-[#0a0a0a] p-3 rounded-xl border border-zinc-800">
            <h4 className="font-bold text-zinc-100 mb-2 flex items-center justify-between">
              📜 Audit Logs — Who Changed What
              <button onClick={() => onAction?.(`Checked Audit Logs — policy pushed at 08:02 by john.admin without Report-Only for ${ticket.code} — RCA found`)} className="h-6 px-2.5 rounded-full bg-white text-black text-[11px] font-semibold">Check → RCA ✓</button>
            </h4>
            <div className="border border-zinc-800 rounded-xl overflow-hidden text-[11px]">
              <div className="bg-zinc-900 p-2 grid grid-cols-4 gap-2 font-bold text-zinc-400"><span>Time</span><span>Actor</span><span>Activity</span><span>Target</span></div>
              <div className="p-2 grid grid-cols-4 gap-2 bg-amber-500/10 border-t border-zinc-800"><span className="text-zinc-400">{new Date().toLocaleDateString()} 08:02</span><span className="text-zinc-200">john.admin</span><span className="text-amber-300">Update CA policy</span><span className="text-zinc-300">Require compliant</span></div>
            </div>
            <div className="mt-2 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-[11px] text-red-300">Root Cause: Policy ON at 08:02 without Report-Only — 50 users blocked. Real RCA, commits log check.</div>
          </div>
        )}
      </div>
    </div>
  );
}
