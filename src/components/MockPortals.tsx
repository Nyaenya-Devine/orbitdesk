'use client';
import { Ticket } from '@/lib/ticketEngine';
import { useState } from 'react';

interface Props {
  ticket: Ticket | null;
}

export default function MockPortals({ ticket }: Props) {
  const [activePortal, setActivePortal] = useState<'signin' | 'intune' | 'exchange' | 'service' | 'whatif' | 'audit'>('signin');

  if (!ticket) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 text-center text-slate-400 h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl">🔍</div>
        <p className="font-medium">Select a ticket to open admin portals</p>
        <p className="text-sm mt-2">Entra ID, Intune, Exchange, Service Health, What If tool</p>
      </div>
    );
  }

  const portals = [
    { id: 'signin', label: 'Entra Sign-in Logs', icon: '🔐', color: 'bg-blue-600' },
    { id: 'intune', label: 'Intune Compliance', icon: '📱', color: 'bg-emerald-600' },
    { id: 'exchange', label: 'Exchange Trace', icon: '📧', color: 'bg-purple-600' },
    { id: 'service', label: 'Service Health', icon: '💚', color: 'bg-green-600' },
    { id: 'whatif', label: 'What If Tool', icon: '🧪', color: 'bg-amber-600' },
    { id: 'audit', label: 'Audit Logs', icon: '📜', color: 'bg-slate-600' },
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="bg-slate-900 p-3 flex items-center gap-2 overflow-x-auto">
        {portals.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePortal(p.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition ${activePortal === p.id ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 font-mono text-xs">
        {activePortal === 'signin' && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900">Microsoft Entra Admin Center - Sign-in Logs</h4>
                <span className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded">entra.microsoft.com</span>
              </div>
              <div className="text-[11px] text-slate-600 mb-3">Filtered: User = {ticket.userEmail} | Last 24h | Status = Failure</div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-slate-100 p-2 grid grid-cols-5 gap-2 font-bold text-[11px]">
                  <span>Time</span><span>User</span><span>App</span><span>Status</span><span>Details</span>
                </div>
                <div className="p-2 grid grid-cols-5 gap-2 bg-red-50 border-t text-[11px]">
                  <span>{new Date().toLocaleTimeString()}</span>
                  <span className="truncate">{ticket.userEmail}</span>
                  <span>Office 365 Exchange Online</span>
                  <span className="text-red-600 font-bold">Failure</span>
                  <span className="text-red-600">Blocked by CA</span>
                </div>
              </div>

              <div className="mt-4 bg-slate-900 text-green-400 p-3 rounded-lg">
                <div className="font-bold text-white mb-2">▶ Conditional Access Tab (CLICK THIS IN INTERVIEW)</div>
                <div>Policy: <span className="text-yellow-400">"Require compliant device for M365"</span></div>
                <div>Result: <span className="text-red-400">Failure - Blocked</span></div>
                <div>Reason: <span className="text-red-400">{ticket.errorCodes[0] || 'DeviceNotCompliant'}</span></div>
                <div className="mt-2 text-slate-300">Conditions:</div>
                <div className="ml-4">• Device State: Not Compliant</div>
                <div className="ml-4">• Client App: Mobile Apps and Desktop Clients</div>
                <div className="ml-4">• Location: Trusted</div>
                <div className="mt-2 text-amber-300">→ What to do: Check Intune → Device Compliance for failing setting</div>
              </div>

              <div className="mt-3 bg-blue-50 border border-blue-200 p-2 rounded text-[11px]">
                <strong>Team Lead Tip:</strong> Always check Sign-in logs FIRST. This tab tells you exactly which policy blocked and why. No guessing.
              </div>
            </div>
          </div>
        )}

        {activePortal === 'intune' && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-2">Intune Admin Center - Device Compliance</h4>
              <div className="text-[11px] text-slate-600 mb-3">Device: {ticket.userEmail.split('@')[0]}-LAPTOP | User: {ticket.userEmail}</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded p-2">
                  <div className="text-[10px] text-slate-500">Compliance State</div>
                  <div className="font-bold text-red-600">Not Compliant</div>
                  <div className="text-[10px] mt-1">Last Check-in: 2 hours ago</div>
                </div>
                <div className="border rounded p-2">
                  <div className="text-[10px] text-slate-500">Management</div>
                  <div className="font-bold">Intune + Entra Joined</div>
                  <div className="text-[10px] mt-1">OS: Windows 11 22H2</div>
                </div>
              </div>

              <div className="mt-3 border rounded">
                <div className="bg-slate-100 p-2 font-bold text-[11px]">Compliance Policy - Failing Settings (THIS IS THE ROOT CAUSE)</div>
                <div className="divide-y">
                  <div className="p-2 flex justify-between bg-red-50">
                    <span>🔴 BitLocker - Require BitLocker</span>
                    <span className="text-red-600 font-bold">Not Compliant</span>
                  </div>
                  <div className="p-2 flex justify-between bg-green-50">
                    <span>🟢 OS Version - Min 10.0.19045</span>
                    <span className="text-green-600">Compliant</span>
                  </div>
                  <div className="p-2 flex justify-between bg-green-50">
                    <span>🟢 Defender - Real-time protection</span>
                    <span className="text-green-600">Compliant</span>
                  </div>
                  <div className="p-2 flex justify-between bg-red-50">
                    <span>🔴 Device Compliance - Enrolled user exists</span>
                    <span className="text-red-600">Not Compliant</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 bg-slate-900 text-green-400 p-3 rounded">
                <div className="text-white font-bold">▶ dsregcmd /status (Run on device)</div>
                <div className="mt-1">AzureAdJoined : YES</div>
                <div>EnterpriseJoined : NO</div>
                <div>DomainJoined : NO</div>
                <div>MdmUrl : https://enrollment.manage.microsoft.com/enrollmentserver/discovery.svc</div>
                <div>Compliance : <span className="text-red-400">NO</span></div>
                <div className="mt-2 text-amber-300">→ Fix: Enable BitLocker, ensure key escrowed to Entra, then Company Portal Sync</div>
              </div>
            </div>
          </div>
        )}

        {activePortal === 'exchange' && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-2">Exchange Admin Center - Message Trace</h4>
              <div className="text-[11px] text-slate-600 mb-3">Search: Sender = vendor@supplier.com | Recipient = {ticket.userEmail} | Last 24h</div>
              
              <div className="border rounded overflow-hidden">
                <div className="bg-slate-100 p-2 grid grid-cols-4 gap-2 font-bold text-[11px]">
                  <span>Time</span><span>Sender</span><span>Status</span><span>Details</span>
                </div>
                <div className="p-2 grid grid-cols-4 gap-2 bg-amber-50 border-t text-[11px]">
                  <span>{new Date().toLocaleTimeString()}</span>
                  <span>vendor@supplier.com</span>
                  <span className="text-amber-700 font-bold">Quarantined</span>
                  <span>Bulk - High confidence</span>
                </div>
              </div>

              <div className="mt-4 bg-white border rounded">
                <div className="bg-slate-100 p-2 font-bold text-[11px]">Quarantine Portal - security.microsoft.com/quarantine</div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm">Invoice_12345.pdf from vendor@supplier.com</div>
                      <div className="text-[11px] text-slate-600">Quarantined: Today 09:12 | Reason: Bulk email | Policy: Anti-spam</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Release</button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-xs">Allow Sender</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 bg-blue-50 border border-blue-200 p-2 rounded text-[11px]">
                <strong>Team Lead Tip:</strong> Message Trace shows WHERE email stopped. Quarantine portal shows WHY. Release + Allow Sender + Report as Not Junk.
              </div>
            </div>
          </div>
        )}

        {activePortal === 'service' && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Microsoft 365 Service Health Dashboard
              </h4>
              <div className="text-[11px] text-slate-600 mb-3">admin.microsoft.com → Health → Service health</div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded bg-green-50">
                  <span>✅ Exchange Online</span><span className="text-green-700 text-[11px]">Service is healthy</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded bg-green-50">
                  <span>✅ Microsoft Teams</span><span className="text-green-700 text-[11px]">Service is healthy</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded bg-green-50">
                  <span>✅ Microsoft Entra</span><span className="text-green-700 text-[11px]">Service is healthy</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded bg-green-50">
                  <span>✅ Intune</span><span className="text-green-700 text-[11px]">Service is healthy</span>
                </div>
              </div>

              <div className="mt-4 bg-slate-900 text-white p-3 rounded">
                <div className="font-bold">✅ No Microsoft incident - Issue is on our side, not Microsoft</div>
                <div className="text-[11px] text-slate-400 mt-1">If Service Health showed red, you would tell client "Microsoft incident, we are monitoring" and not waste time troubleshooting.</div>
              </div>
            </div>
          </div>
        )}

        {activePortal === 'whatif' && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-2">🧪 Conditional Access - What If Tool (SAFE TESTING)</h4>
              <div className="text-[11px] text-slate-600 mb-3">Test what would happen WITHOUT actually blocking users</div>
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded space-y-2">
                <div><strong>Test Input:</strong></div>
                <div className="ml-4 text-[11px]">User: {ticket.userEmail}</div>
                <div className="ml-4 text-[11px]">Device: Compliant = NO (current device)</div>
                <div className="ml-4 text-[11px]">Location: Trusted (Nairobi office)</div>
                <div className="ml-4 text-[11px]">App: Office 365 Exchange Online</div>
                
                <div className="mt-3"><strong>Result:</strong></div>
                <div className="ml-4 bg-red-100 border border-red-300 p-2 rounded text-red-800">
                  ❌ BLOCKED by policy "Require compliant device for M365"<br/>
                  Reason: Device is Not Compliant<br/>
                  Would require: Compliant device OR Hybrid Joined
                </div>

                <div className="mt-3"><strong>Now test with Compliant = YES:</strong></div>
                <div className="ml-4 bg-green-100 border border-green-300 p-2 rounded text-green-800">
                  ✅ ALLOWED<br/>
                  Policy would grant access if device were Compliant
                </div>
              </div>

              <div className="mt-3 bg-blue-50 border border-blue-200 p-2 rounded text-[11px]">
                <strong>Team Lead Gold:</strong> Always use What If BEFORE changing policy. Shows exact block reason without impacting users. Use Report-Only mode for 24h before turning policy ON.
              </div>
            </div>
          </div>
        )}

        {activePortal === 'audit' && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-2">📜 Entra ID - Audit Logs (WHO changed WHAT WHEN)</h4>
              
              <div className="border rounded overflow-hidden">
                <div className="bg-slate-100 p-2 grid grid-cols-4 gap-2 font-bold text-[11px]">
                  <span>Time</span><span>Actor</span><span>Activity</span><span>Target</span>
                </div>
                <div className="p-2 grid grid-cols-4 gap-2 bg-amber-50 border-t text-[11px]">
                  <span>{new Date().toLocaleDateString()} 08:02</span>
                  <span>john.admin@novatech.com</span>
                  <span className="text-amber-700">Update Conditional Access policy</span>
                  <span>Require compliant device</span>
                </div>
                <div className="p-2 grid grid-cols-4 gap-2 bg-slate-50 border-t text-[11px]">
                  <span>{new Date().toLocaleDateString()} 08:03</span>
                  <span>System</span>
                  <span>Policy changed from Report-Only OFF to ON</span>
                  <span>All M365 apps</span>
                </div>
              </div>

              <div className="mt-3 bg-red-50 border border-red-200 p-2 rounded text-[11px]">
                <strong>Root Cause Found:</strong> Policy was turned ON at 8:02am without Report-Only testing. This caused 50 users to be blocked. This is why we need peer review + Report-Only.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
