'use client';
import { Ticket } from '@/lib/ticketEngine';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
 const [selectedLog, setSelectedLog] = useState(0);
 const [searchQuery, setSearchQuery] = useState('');

 if (!ticket) {
 return (
 <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 p-8 text-center text-zinc-500 h-full flex flex-col items-center justify-center">
  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-2xl border border-zinc-700">🔍</div>
  <p className="font-medium text-zinc-300">Select a ticket to open admin portals — learn real IT support</p>
  <p className="text-[12px] mt-2 max-w-[400px]">In real IT helpdesk, you don't just click a button. You go to entra.microsoft.com, filter sign-in logs, check Conditional Access tab, identify DeviceNotCompliant 53000, then fix in Intune. This teaches that reality.</p>
  <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-300">
  💡 <strong>Never worked in IT before?</strong> Start with Student Mode — guided steps, max 1 P1, 5 tickets. Each portal has "How this works in real life" explanation.
  </div>
 </div>
 );
 }

 const portals = [
 { id: 'signin', label: 'Entra Sign-in Logs', icon: '🔐', desc: 'Real: entra.microsoft.com → Monitoring → Sign-in logs' },
 { id: 'intune', label: 'Intune Compliance', icon: '📱', desc: 'Real: intune.microsoft.com → Devices → Compliance' },
 { id: 'exchange', label: 'Exchange Trace', icon: '📧', desc: 'Real: admin.exchange.microsoft.com → Mail flow → Message trace' },
 { id: 'service', label: 'Service Health', icon: '💚', desc: 'Real: admin.microsoft.com → Health → Service health' },
 { id: 'whatif', label: 'What If Tool', icon: '🧪', desc: 'Real: Entra → Conditional Access → What If' },
 { id: 'audit', label: 'Audit Logs', icon: '📜', desc: 'Real: entra.microsoft.com → Audit logs' },
 ] as const;

 // Realistic sign-in logs data
 const signInLogs = [
 { time: '09:12:34', user: ticket.userEmail, app: 'Exchange Online', status: 'Failure', reason: ticket.errorCodes[0] || 'DeviceNotCompliant', ip: '196.201.12.45', location: 'Nairobi, KE', caPolicy: 'Require compliant device for M365', result: 'Blocked', correlationId: 'a7f3c9e2-' + Math.random().toString(36).substring(2,6) },
 { time: '09:10:12', user: ticket.userEmail, app: 'Teams', status: 'Failure', reason: '53000', ip: '196.201.12.45', location: 'Nairobi, KE', caPolicy: 'Require compliant device for M365', result: 'Blocked', correlationId: 'b3e9d1a4-' + Math.random().toString(36).substring(2,6) },
 { time: '09:08:45', user: ticket.userEmail, app: 'SharePoint Online', status: 'Success', reason: '-', ip: '196.201.12.45', location: 'Nairobi, KE', caPolicy: '-', result: 'Granted', correlationId: 'c4f2a9b1-' + Math.random().toString(36).substring(2,6) },
 { time: '08:55:22', user: 'john.admin@novatech.com', app: 'Azure Portal', status: 'Success', reason: '-', ip: '196.201.12.10', location: 'Nairobi, KE', caPolicy: '-', result: 'Granted', correlationId: 'd2a8c3e1-' + Math.random().toString(36).substring(2,6) },
 ];

 const filteredLogs = signInLogs.filter(log => 
 !searchQuery || log.user.toLowerCase().includes(searchQuery.toLowerCase()) || log.reason.toLowerCase().includes(searchQuery.toLowerCase())
 );

 return (
 <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm flex flex-col h-full overflow-hidden">
 <div className="bg-zinc-900 p-2.5 flex items-center gap-1.5 overflow-x-auto border-b border-zinc-800/60">
  {portals.map(p => (
  <button
  key={p.id}
  onClick={() => {
   setActivePortal(p.id as any);
   onAction?.(`Opened ${p.label} for ${ticket.code} — learning real IT workflow: ${p.desc}`);
  }}
  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap flex items-center gap-1.5 transition border ${activePortal === p.id ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200'}`}
  >
  <span>{p.icon}</span> {p.label}
  </button>
  ))}
 </div>

 <div className="flex-1 overflow-y-auto bg-[#050507] p-4 text-[12px]">
  {activePortal === 'signin' && (
  <div className="space-y-4">
  {/* Real life explanation */}
  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
   <p className="text-[12px] font-bold text-blue-300">📚 How this works in real IT helpdesk (for beginners)</p>
   <p className="text-[11px] text-blue-200/70 mt-1.5 leading-[1.4]">
   In real life, when user says "Can't access Outlook, error DeviceNotCompliant", you don't guess. You go to <strong>entra.microsoft.com → Monitoring → Sign-in logs</strong>, filter by user email <code className="bg-black/30 px-1 rounded">{ticket.userEmail}</code>, look for <strong>Failure</strong> status, click into it, go to <strong>Conditional Access tab</strong> to see which policy blocked and why (DeviceNotCompliant 53000). Then you know to check Intune compliance. This portal simulates that exact flow.
   </p>
  </div>

  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800">
   <div className="flex items-center justify-between mb-3">
   <h4 className="font-bold text-zinc-100 flex items-center gap-2">
   🔐 Microsoft Entra Admin Center - Sign-in Logs
   <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700">entra.microsoft.com</span>
   </h4>
   <div className="flex items-center gap-2">
   <input
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    placeholder="Filter by user or error..."
    className="h-7 w-40 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50"
   />
   <button onClick={() => onAction?.(`Searched sign-in logs for ${ticket.userEmail} — found ${filteredLogs.length} entries — real IT workflow`)} className="h-7 px-3 rounded-full bg-white text-black text-[11px] font-semibold">Search</button>
   </div>
   </div>
   
   <div className="text-[11px] text-zinc-500 mb-3 flex items-center gap-2">
   <span>Filtered: User = {ticket.userEmail} | Last 24h | Status = Failure</span>
   <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">Real: In production, you filter by user, app, status, date</span>
   </div>
   
   <div className="border border-zinc-800 rounded-xl overflow-hidden">
   <div className="bg-zinc-900 p-2.5 grid grid-cols-6 gap-2 font-bold text-[11px] text-zinc-400">
   <span>Time</span><span>User</span><span>App</span><span>Status</span><span>Failure Reason</span><span>Correlation ID</span>
   </div>
   {filteredLogs.map((log, idx) => (
   <div
    key={idx}
    onClick={() => setSelectedLog(idx)}
    className={`p-2.5 grid grid-cols-6 gap-2 border-t border-zinc-800 text-[11px] cursor-pointer transition ${selectedLog === idx ? 'bg-violet-500/10 border-violet-500/20' : log.status === 'Failure' ? 'bg-red-500/10 hover:bg-red-500/15' : 'bg-emerald-500/5 hover:bg-emerald-500/10'}`}
   >
    <span className="text-zinc-400 font-mono">{log.time}</span>
    <span className="truncate text-zinc-200">{log.user.split('@')[0]}</span>
    <span className="text-zinc-300 truncate">{log.app}</span>
    <span className={`font-bold ${log.status === 'Failure' ? 'text-red-400' : 'text-emerald-400'}`}>{log.status}</span>
    <span className={`${log.reason.includes('Compliant') || log.reason.includes('53000') ? 'text-red-400 font-bold' : 'text-zinc-500'}`}>{log.reason}</span>
    <span className="text-zinc-500 font-mono text-[10px] truncate">{log.correlationId}</span>
   </div>
   ))}
   </div>

   {/* Details pane — like real Entra */}
   <div className="mt-4 bg-zinc-900 text-zinc-300 p-4 rounded-xl border border-zinc-800">
   <div className="font-bold text-white mb-3 flex items-center justify-between">
   <span>▶ Selected Log Details — Conditional Access Tab (Root Cause)</span>
   <button onClick={() => onAction?.(`Checked Sign-in logs CA tab — ${filteredLogs[selectedLog]?.reason || 'DeviceNotCompliant'} — Correlation ID ${filteredLogs[selectedLog]?.correlationId} — logs checked ✓ — real workflow`)} className="h-7 px-3 rounded-full bg-white text-black text-[11px] font-semibold">Check CA Tab → Logs ✓</button>
   </div>
   
   <div className="grid grid-cols-2 gap-4 text-[11px]">
   <div className="space-y-2">
    <div><span className="text-zinc-500">User:</span> <span className="text-white">{filteredLogs[selectedLog]?.user}</span></div>
    <div><span className="text-zinc-500">App:</span> <span className="text-white">{filteredLogs[selectedLog]?.app}</span></div>
    <div><span className="text-zinc-500">IP:</span> <span className="text-white font-mono">{filteredLogs[selectedLog]?.ip}</span> <span className="text-zinc-500">({filteredLogs[selectedLog]?.location})</span></div>
    <div><span className="text-zinc-500">Time:</span> <span className="text-white">{filteredLogs[selectedLog]?.time} Today</span></div>
   </div>
   <div className="space-y-2">
    <div><span className="text-zinc-500">Policy:</span> <span className="text-amber-300">"{filteredLogs[selectedLog]?.caPolicy}"</span></div>
    <div><span className="text-zinc-500">Result:</span> <span className={`${filteredLogs[selectedLog]?.result === 'Blocked' ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>{filteredLogs[selectedLog]?.result}</span></div>
    <div><span className="text-zinc-500">Failure:</span> <span className="text-red-400 font-bold">{filteredLogs[selectedLog]?.reason}</span></div>
    <div><span className="text-zinc-500">Correlation ID:</span> <span className="text-white font-mono text-[10px]">{filteredLogs[selectedLog]?.correlationId}</span> <span className="text-zinc-500">(give to Microsoft support)</span></div>
   </div>
   </div>

   <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
   <p className="text-[11px] font-bold text-amber-300">🎯 What to do next — Real IT workflow for beginners:</p>
   <ol className="mt-2 space-y-1 text-[11px] text-amber-200/70 list-decimal list-inside">
    <li>Failure reason is <strong>{filteredLogs[selectedLog]?.reason}</strong> — means device not compliant per Intune</li>
    <li>Go to <strong>Intune Compliance tab</strong> (next portal) → check which setting fails (BitLocker, Defender, OS version)</li>
    <li>Fix failing setting → Company Portal Sync → device becomes Compliant in 2-5 mins</li>
    <li>User can then access {filteredLogs[selectedLog]?.app} — verify by asking user to try again</li>
   </ol>
   </div>

   <div className="mt-3 text-[10px] text-zinc-600">
   💡 Real: Correlation ID is used when escalating to Microsoft — they can find exact log. CA tab shows all policies evaluated, not just blocking one. This is how you avoid guessing.
   </div>
   </div>
  </div>
  </div>
  )}

  {activePortal === 'intune' && (
  <div className="space-y-4">
  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
   <p className="text-[12px] font-bold text-blue-300">📚 How Intune Compliance works in real life</p>
   <p className="text-[11px] text-blue-200/70 mt-1.5 leading-[1.4]">
   After you find DeviceNotCompliant in Entra, you go to <strong>intune.microsoft.com → Devices → Compliance → Device compliance</strong>, search user device, see <strong>Not Compliant</strong> with failing settings (BitLocker, Defender, OS). You fix by enabling BitLocker, syncing Company Portal. Device checks in every 8 hours, but manual Sync forces immediate check. This is real workflow — not just clicking "Fix".
   </p>
  </div>

  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800">
   <h4 className="font-bold text-zinc-100 mb-3 flex items-center justify-between">
   <span className="flex items-center gap-2">📱 Intune Admin Center - Device Compliance <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700">intune.microsoft.com</span></span>
   <button onClick={() => { setSyncDone(true); onAction?.(`Company Portal Sync for ${ticket.userEmail} — Last sync now, BitLocker still failing — real: Device checks in, Sync forces immediate compliance evaluation`); }} className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition ${syncDone ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-white text-black border-white hover:bg-zinc-100'}`}>{syncDone ? '✓ Synced Now (real: forces check-in)' : 'Sync → Force Check-in'}</button>
   </h4>
   
   <div className="grid grid-cols-3 gap-3 mb-4">
   <div className="border border-zinc-800 rounded-xl p-3 bg-zinc-900/50">
   <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Compliance State</div>
   <div className={`font-bold text-[14px] mt-1 ${bitLockerFixed ? 'text-emerald-400' : 'text-red-400'}`}>{bitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</div>
   <div className="text-[10px] mt-1 text-zinc-500">Last Check-in: {syncDone ? 'Just now (forced)' : '2 hours ago (auto every 8h)'}</div>
   <div className="text-[10px] mt-2 text-zinc-600">Real: Intune checks every 8h, Sync forces now</div>
   </div>
   <div className="border border-zinc-800 rounded-xl p-3 bg-zinc-900/50">
   <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Device Info</div>
   <div className="font-bold text-zinc-200 text-[13px] mt-1">{ticket.userEmail.split('@')[0]}-LAPTOP</div>
   <div className="text-[11px] mt-1 text-zinc-400">Win11 22H2 • Entra Joined • Intune Managed</div>
   <div className="text-[10px] mt-2 text-zinc-600">Real: Hybrid Joined for on-prem + cloud</div>
   </div>
   <div className="border border-zinc-800 rounded-xl p-3 bg-zinc-900/50">
   <div className="text-[10px] text-zinc-500 uppercase tracking-wider">User</div>
   <div className="font-bold text-zinc-200 text-[13px] mt-1 truncate">{ticket.userEmail}</div>
   <div className="text-[11px] mt-1 text-zinc-400">{ticket.clientName} • {ticket.clientId === 'client-c' ? 'SEC-2024-07 Strict' : 'Standard'}</div>
   <div className="text-[10px] mt-2 text-zinc-600">Real: Per-client policies different</div>
   </div>
   </div>

   <div className="border border-zinc-800 rounded-xl overflow-hidden">
   <div className="bg-zinc-900 p-3 font-bold text-[11px] text-zinc-300 flex items-center justify-between">
   <span>Failing Settings — Root Cause (Real: This is why user blocked)</span>
   <span className="text-[10px] font-normal text-zinc-500">Real: Each setting is a compliance policy requirement</span>
   </div>
   <div className="divide-y divide-zinc-800/50">
   <div className={`p-3 flex justify-between items-center ${bitLockerFixed ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
    <div>
    <div className="text-zinc-200 font-medium flex items-center gap-2">🔴 BitLocker - Require device encryption</div>
    <div className="text-[10px] text-zinc-500 mt-1">Real: BitLocker encrypts drive, key escrowed to Entra ID for recovery. If Off, device Not Compliant per policy. User needs to enable in Company Portal or Settings.</div>
    </div>
    <div className="flex items-center gap-2 ml-4">
    <span className={`font-bold text-[12px] ${bitLockerFixed ? 'text-emerald-400' : 'text-red-400'}`}>{bitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</span>
    {!bitLockerFixed && <button onClick={() => { setBitLockerFixed(true); onAction?.(`Enabled BitLocker for ${ticket.userEmail} — Protection On, key escrowed to Entra ID — real: In Company Portal → Device Compliance → BitLocker → Enable, or Settings → Privacy → Device encryption → Turn on`); }} className="h-7 px-3 rounded-full bg-white text-black text-[11px] font-semibold hover:bg-zinc-100">Enable → Fix (Real Workflow)</button>}
    </div>
   </div>
   <div className="p-3 flex justify-between bg-emerald-500/5">
    <div>
    <div className="text-zinc-400">🟢 OS Version - Minimum 10.0.19045</div>
    <div className="text-[10px] text-zinc-600">Real: Ensures security patches, prevents old vulnerable OS</div>
    </div>
    <span className="text-emerald-400 font-bold text-[12px]">Compliant</span>
   </div>
   <div className="p-3 flex justify-between bg-emerald-500/5">
    <div>
    <div className="text-zinc-400">🟢 Defender - Real-time protection ON</div>
    <div className="text-[10px] text-zinc-600">Real: Antivirus, tamper protection, definitions &lt;7 days</div>
    </div>
    <span className="text-emerald-400 font-bold text-[12px]">Compliant</span>
   </div>
   <div className="p-3 flex justify-between bg-emerald-500/5">
    <div>
    <div className="text-zinc-400">🟢 Secure Boot - Required for Apex</div>
    <div className="text-[10px] text-zinc-600">Real: Prevents rootkits, required for regulated clients per SEC-2024-07</div>
    </div>
    <span className="text-emerald-400 font-bold text-[12px]">Compliant</span>
   </div>
   </div>
   </div>

   <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
   <p className="text-[11px] font-bold text-violet-300">🎯 For beginners — Step-by-step how to fix in real life:</p>
   <ol className="mt-2 space-y-1.5 text-[11px] text-violet-200/70 list-decimal list-inside">
   <li>User opens <strong>Company Portal</strong> (blue shopping bag icon) → Devices → {ticket.userEmail.split('@')[0]}-LAPTOP → Check compliance</li>
   <li>Shows failing: BitLocker Off → Click <strong>Enable</strong> or go to Settings → Privacy & security → Device encryption → Turn on</li>
   <li>BitLocker encrypts (takes 5-20 mins), key auto-escrowed to Entra ID → Devices → BitLocker keys (for recovery)</li>
   <li>Then click <strong>Sync</strong> in Company Portal — forces Intune to re-evaluate compliance immediately (otherwise waits 8h)</li>
   <li>After 2-5 mins, device shows Compliant ✓ → user can access Outlook/Teams again</li>
   </ol>
   </div>
  </div>
  </div>
  )}

  {activePortal === 'exchange' && (
  <div className="space-y-4">
  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
   <p className="text-[12px] font-bold text-blue-300">📚 How Exchange Message Trace works in real life</p>
   <p className="text-[11px] text-blue-200/70 mt-1.5 leading-[1.4]">
   When user says "Invoice not received" or "Email in quarantine", you go to <strong>admin.exchange.microsoft.com → Mail flow → Message trace</strong>, search by sender/recipient, see status <strong>Quarantined</strong> with reason (Bulk, Spam, Phish). You then go to <strong>Quarantine portal</strong> (security.microsoft.com/quarantine) to Release + Allow Sender + Report as Not Junk to train filter. Real workflow, not just "Release".
   </p>
  </div>

  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800">
   <h4 className="font-bold text-zinc-100 mb-3">📧 Exchange Admin Center - Message Trace <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700 ml-2">admin.exchange.microsoft.com</span></h4>
   
   <div className="border border-zinc-800 rounded-xl overflow-hidden">
   <div className="bg-zinc-900 p-2.5 grid grid-cols-5 gap-2 font-bold text-[11px] text-zinc-400"><span>Time</span><span>Sender</span><span>Recipient</span><span>Status</span><span>Details</span></div>
   <div className={`p-2.5 grid grid-cols-5 gap-2 border-t border-zinc-800 text-[11px] ${quarantineReleased ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
   <span className="text-zinc-400 font-mono">{new Date().toLocaleTimeString()}</span>
   <span className="text-zinc-200 truncate">vendor@supplier.com</span>
   <span className="text-zinc-300 truncate">{ticket.userEmail.split('@')[0]}</span>
   <span className={`font-bold ${quarantineReleased ? 'text-emerald-400' : 'text-amber-400'}`}>{quarantineReleased ? 'Released ✓' : 'Quarantined'}</span>
   <span className="text-zinc-400">Bulk - High confidence</span>
   </div>
   </div>

   <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
   <div className="flex justify-between items-start gap-4">
   <div>
    <div className="font-bold text-[14px] text-zinc-100">Invoice_12345.pdf from vendor@supplier.com</div>
    <div className="text-[11px] text-zinc-500 mt-1">Quarantined: Today 09:12 | Reason: Bulk (mass email) | Confidence: High | Policy: Anti-spam - Default</div>
    <div className="text-[10px] text-zinc-600 mt-2">Real: Bulk means mass marketing, not necessarily spam. But finance needs it for payroll. Need to release + allow sender to prevent future blocks.</div>
   </div>
   <div className="flex gap-2 flex-shrink-0">
    <button onClick={() => { setQuarantineReleased(true); onAction?.(`Released quarantined email for ${ticket.userEmail} — Real: security.microsoft.com/quarantine → Select email → Release → Check Allow Sender + Report as Not Junk → Release`); }} className={`px-4 py-2 rounded-full text-[12px] font-semibold transition ${quarantineReleased ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 'bg-white text-black hover:bg-zinc-100'}`}>{quarantineReleased ? '✓ Released (Real workflow)' : 'Release → Real Steps'}</button>
   </div>
   </div>

   {quarantineReleased && (
   <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <p className="text-[11px] font-bold text-emerald-300">✅ Released — What you did in real life:</p>
    <ol className="mt-2 space-y-1 text-[11px] text-emerald-200/70 list-decimal list-inside">
    <li>Went to <strong>security.microsoft.com/quarantine</strong> → Found email from vendor@supplier.com</li>
    <li>Clicked <strong>Release</strong> → Checked <strong>Allow sender</strong> (adds to allowed senders list) + <strong>Report as Not Junk</strong> (trains filter)</li>
    <li>Email delivered to user's inbox in 2-5 mins, future emails from vendor won't be quarantined as Bulk</li>
    <li>Also tuned Anti-spam policy: Increased Bulk threshold for finance mailbox per client request</li>
    </ol>
   </div>
   )}

   <div className="mt-3 flex gap-2">
   <button onClick={() => onAction?.(`Allowed sender vendor@supplier.com for ${ticket.code} — Real: Exchange → Policies → Anti-spam → Allowed senders → Add vendor@supplier.com with approval`)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full text-[11px] hover:bg-zinc-700">Allow Sender (Real: Anti-spam policy)</button>
   <button onClick={() => onAction?.(`Reported as Not Junk for ${ticket.code} — Real: Trains Microsoft filter, reduces false positives`)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full text-[11px] hover:bg-zinc-700">Report Not Junk (Real: Train filter)</button>
   </div>
   </div>
  </div>
  </div>
  )}

  {activePortal === 'service' && (
  <div className="space-y-4">
  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
   <p className="text-[12px] font-bold text-blue-300">📚 How Service Health check works — ALWAYS check first in real IT</p>
   <p className="text-[11px] text-blue-200/70 mt-1.5 leading-[1.4]">
   In real IT support, <strong>first thing you check is Service Health</strong> — is Microsoft having an outage? Go to <strong>admin.microsoft.com → Health → Service health</strong>. If Exchange Online shows incident, it's not your fault, it's Microsoft. You inform users, no need to troubleshoot. If all green, then you know issue is on your side (CA policy, compliance, etc.). This is ITIL best practice — check Service Health first.
   </p>
  </div>

  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800">
   <h4 className="font-bold text-zinc-100 mb-3 flex items-center justify-between">
   <span className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span> Microsoft 365 Service Health <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700 ml-2">admin.microsoft.com</span></span>
   <button onClick={() => onAction?.(`Checked Service Health — Real: admin.microsoft.com → Health → Service health → All services green, no Microsoft incident — so issue is on our side, check CA/compliance`)} className="h-7 px-3 rounded-full bg-white text-black text-[11px] font-semibold">Refresh → Real Check ✓</button>
   </h4>
   <div className="space-y-2.5">
   {[
   { name: 'Exchange Online', status: 'Healthy', icon: '✅', desc: 'Email flow, no incidents', lastIncident: 'None in 30 days' },
   { name: 'Microsoft Teams', status: 'Healthy', icon: '✅', desc: 'Chat, meetings, calls', lastIncident: 'None in 30 days' },
   { name: 'Microsoft Entra', status: 'Healthy', icon: '✅', desc: 'Sign-ins, CA, MFA', lastIncident: 'None in 30 days' },
   { name: 'Microsoft Intune', status: 'Healthy', icon: '✅', desc: 'Device compliance, enrollment', lastIncident: 'None in 30 days' },
   { name: 'SharePoint Online', status: 'Healthy', icon: '✅', desc: 'File storage, sites', lastIncident: 'None in 30 days' },
   ].map(s => (
   <div key={s.name} className="flex items-center justify-between p-3 border border-zinc-800 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 transition">
    <div className="flex items-center gap-3">
    <span className="text-[16px]">{s.icon}</span>
    <div>
    <div className="text-zinc-200 font-medium text-[13px]">{s.name}</div>
    <div className="text-[11px] text-zinc-500">{s.desc} • Last incident: {s.lastIncident}</div>
    </div>
    </div>
    <span className="text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">{s.status}</span>
   </div>
   ))}
   </div>
   <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[11px] font-bold text-zinc-300">💡 Real IT workflow for beginners:</p>
   <ol className="mt-2 space-y-1 text-[11px] text-zinc-400 list-decimal list-inside">
   <li>ALWAYS check Service Health first — if Microsoft incident, inform users, no troubleshooting needed</li>
   <li>If all green (like now), issue is on your side — check Sign-in logs, Intune compliance, etc.</li>
   <li>This saves time and prevents blaming your CA policy when it's actually Microsoft outage</li>
   <li>In ticket, document: "Checked Service Health at 09:15 — all green, no Microsoft incident — issue is client-side"</li>
   </ol>
   </div>
  </div>
  </div>
  )}

  {activePortal === 'whatif' && (
  <div className="space-y-4">
  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
   <p className="text-[12px] font-bold text-blue-300">📚 What If Tool — Safe testing without breaking production (real IT best practice)</p>
   <p className="text-[11px] text-blue-200/70 mt-1.5 leading-[1.4]">
   In real IT, you NEVER push CA policy directly to production without testing — you could block 50 users (P1). Instead, you use <strong>What If tool</strong>: Entra → Conditional Access → What If → select user, app, device state, location → see if policy would block or allow. Also use <strong>Report-Only mode</strong> — policy logs what would happen but doesn't block, watch 24h, then turn ON. This is how you prevent P1 outages.
   </p>
  </div>

  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800">
   <h4 className="font-bold text-zinc-100 mb-3 flex items-center justify-between">
   <span>🧪 Conditional Access What If — Safe Testing <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700 ml-2">Entra → CA → What If</span></span>
   <button onClick={() => setWhatIfCompliant(!whatIfCompliant)} className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition ${whatIfCompliant ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/15 text-amber-300 border-amber-500/20'}`}>{whatIfCompliant ? 'Compliant YES → Test' : 'Compliant NO → Test'}</button>
   </h4>
   
   <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
   <div className="grid grid-cols-2 gap-4 text-[11px]">
   <div className="space-y-2">
    <div><span className="text-zinc-500">User:</span> <span className="text-white">{ticket.userEmail}</span> <span className="text-zinc-600">(real: select user to test)</span></div>
    <div><span className="text-zinc-500">App:</span> <span className="text-white">Exchange Online</span> <span className="text-zinc-600">(real: select app)</span></div>
    <div><span className="text-zinc-500">Device:</span> <span className={whatIfCompliant ? 'text-emerald-400' : 'text-red-400'}>Compliant = {whatIfCompliant ? 'YES' : 'NO'}</span> <span className="text-zinc-600">(real: toggle to test)</span></div>
    <div><span className="text-zinc-500">Location:</span> <span className="text-white">Nairobi Trusted</span> <span className="text-zinc-600">(real: select location)</span></div>
   </div>
   <div className="space-y-2">
    <div><span className="text-zinc-500">Policy:</span> <span className="text-amber-300">"Require compliant device for M365"</span></div>
    <div><span className="text-zinc-500">Mode:</span> <span className="text-white">Report-Only OFF → ON (real: test in Report-Only first)</span></div>
   </div>
   </div>

   <div className={`p-4 rounded-xl border text-[13px] font-bold ${whatIfCompliant ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
   {whatIfCompliant ? '✅ ALLOWED — If device Compliant YES, policy would GRANT access — user can access Outlook/Teams' : '❌ BLOCKED by Require compliant device — If Compliant NO, policy BLOCKS — Reason: DeviceNotCompliant 53000 — user cannot access M365'}
   </div>

   <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
   <p className="text-[11px] font-bold text-amber-300">🎯 Real IT workflow to prevent P1:</p>
   <ol className="mt-2 space-y-1 text-[11px] text-amber-200/70 list-decimal list-inside">
    <li>Before pushing CA policy "Require compliant", use What If: User={ticket.userEmail.split('@')[0]}, App=Exchange, Compliant=NO → shows BLOCKED</li>
    <li>Check how many users would be blocked — if 50, don't push directly</li>
    <li>Instead, set policy to <strong>Report-Only</strong> — it logs what WOULD happen but doesn't block</li>
    <li>Watch Report-Only logs for 24h — see 50 users would be blocked → inform, fix compliance first, then turn ON</li>
    <li>This is how you prevent "P1 50 users blocked at 08:02 by john.admin without Report-Only" — real RCA from Audit Logs</li>
   </ol>
   </div>

   <button onClick={() => onAction?.(`What If tested for ${ticket.code} — Real: Entra → CA → What If → User ${ticket.userEmail} → Compliant ${whatIfCompliant ? 'YES=ALLOWED' : 'NO=BLOCKED'} — safe testing, no production impact — prevents P1`)} className="w-full h-9 rounded-full bg-white text-black text-[12px] font-semibold mt-2">Test → What If Log ✓ (Real: Safe testing)</button>
   </div>
  </div>
  </div>
  )}

  {activePortal === 'audit' && (
  <div className="space-y-4">
  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
   <p className="text-[12px] font-bold text-blue-300">📚 Audit Logs — Who changed what, when, why — Root Cause Analysis (RCA)</p>
   <p className="text-[11px] text-blue-200/70 mt-1.5 leading-[1.4]">
   In real IT, when P1 happens "50 users blocked", you need RCA: Who pushed CA policy, when, without Report-Only? Go to <strong>entra.microsoft.com → Audit logs</strong>, filter by Activity "Update conditional access policy", see actor john.admin@novatech.com at 08:02, target "Require compliant device for M365", changed from Report-Only OFF to ON. That's RCA — not guessing. You then revert to Report-Only, fix compliance, post-incident review.
   </p>
  </div>

  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800">
   <h4 className="font-bold text-zinc-100 mb-3 flex items-center justify-between">
   <span>📜 Audit Logs — Who Changed What <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700 ml-2">entra.microsoft.com → Audit logs</span></span>
   <button onClick={() => onAction?.(`Checked Audit Logs — Real: Filter Activity=Update CA policy → Found john.admin pushed at 08:02 without Report-Only → RCA for P1 50 users blocked — revert to Report-Only`)} className="h-7 px-3 rounded-full bg-white text-black text-[11px] font-semibold">Check → RCA ✓ (Real)</button>
   </h4>
   
   <div className="border border-zinc-800 rounded-xl overflow-hidden">
   <div className="bg-zinc-900 p-2.5 grid grid-cols-5 gap-2 font-bold text-[11px] text-zinc-400"><span>Time</span><span>Actor</span><span>Activity</span><span>Target</span><span>Details</span></div>
   <div className="p-2.5 grid grid-cols-5 gap-2 bg-amber-500/10 border-t border-zinc-800 text-[11px]">
   <span className="text-zinc-400 font-mono">{new Date().toLocaleDateString()} 08:02</span>
   <span className="text-zinc-200">john.admin@novatech.com</span>
   <span className="text-amber-300">Update CA policy</span>
   <span className="text-zinc-300 truncate">Require compliant device</span>
   <span className="text-red-400">OFF → ON without Report-Only</span>
   </div>
   <div className="p-2.5 grid grid-cols-5 gap-2 border-t border-zinc-800 text-[11px] bg-zinc-900/30">
   <span className="text-zinc-500">08:05</span>
   <span className="text-zinc-400">system</span>
   <span className="text-zinc-400">P1 triggered</span>
   <span className="text-zinc-400">50 users blocked</span>
   <span className="text-zinc-500">SLA breach 60min</span>
   </div>
   </div>

   <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
   <p className="text-[12px] font-bold text-red-300">🚨 Root Cause Analysis — Real P1 from Audit Logs:</p>
   <div className="mt-3 space-y-2 text-[11px] text-red-200/70">
   <div><span className="text-zinc-500">What happened:</span> At 08:02, john.admin pushed CA policy "Require compliant device for M365" from OFF to ON without Report-Only mode — blocked 50 users immediately</div>
   <div><span className="text-zinc-500">Impact:</span> P1, 50 users cannot access Outlook/Teams, payroll blocked, SLA 60min breach, CSAT drop</div>
   <div><span className="text-zinc-500">Why:</span> No What If testing, no Report-Only 24h watch, no peer review — pushed directly to production</div>
   <div><span className="text-zinc-500">Fix:</span> Revert to Report-Only → fix compliance for 50 users (BitLocker) → What If test → turn ON with approval</div>
   <div><span className="text-zinc-500">Prevention:</span> Require What If + Report-Only 24h + peer approval for all CA policies — documented in KB</div>
   </div>
   </div>

   <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[11px] font-bold text-zinc-300">💡 Real IT workflow for beginners — How to do RCA:</p>
   <ol className="mt-2 space-y-1 text-[11px] text-zinc-400 list-decimal list-inside">
   <li>Go to <strong>entra.microsoft.com → Audit logs</strong> → Filter Activity="Update conditional access policy" → Last 24h</li>
   <li>Find who changed policy, when, what changed (OFF → ON, Report-Only, etc.)</li>
   <li>That's RCA — you now know root cause, not guessing</li>
   <li>Document in ticket: "RCA: Policy pushed at 08:02 by john.admin without Report-Only — 50 users blocked — revert to Report-Only per ITIL"</li>
   <li>Post-incident review + KB update to prevent recurrence</li>
   </ol>
   </div>
  </div>
  </div>
  )}
 </div>
 </div>
 );
}
