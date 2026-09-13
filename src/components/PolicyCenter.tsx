'use client';
import { clients } from '@/data/clients';

interface Props {
  selectedClientId: string;
  onSelectClient: (id: string) => void;
}

export default function PolicyCenter({ selectedClientId, onSelectClient }: Props) {
  const policies = {
    'client-a': {
      name: 'NovaTech Enterprises',
      type: 'Enterprise Tech - 24/7',
      caPolicies: [
        { name: 'Require compliant device for M365', status: 'ON', scope: 'All users', conditions: 'Device must be compliant + Hybrid or Entra Joined', risk: 'High - Blocks 50 users if devices non-compliant', lastModified: 'Today 08:02 by john.admin', mode: 'ON (was Report-Only OFF)' },
        { name: 'Block legacy authentication', status: 'ON', scope: 'All users', conditions: 'Block basic auth, require modern auth', risk: 'Low', lastModified: '2024-11-15', mode: 'ON' },
        { name: 'Require MFA for admin roles', status: 'ON', scope: 'Admin roles', conditions: 'PIM activation requires MFA', risk: 'Medium', lastModified: '2024-10-20', mode: 'ON' },
        { name: 'Trusted locations - Nairobi + Mombasa', status: 'ON', scope: 'All users', conditions: 'Allow Nairobi HQ, Mombasa branch, block others unless MFA', risk: 'Medium', lastModified: '2024-09-10', mode: 'ON' },
      ],
      compliancePolicies: [
        { name: 'Windows Compliance - Standard', platform: 'Windows 11', settings: 'BitLocker Required, OS min 10.0.19045, Defender ON, PIN required', assignedTo: 'All devices', nonCompliant: 12 },
        { name: 'iOS Compliance', platform: 'iOS', settings: 'PIN 6 digits, Encryption ON, Jailbreak block', assignedTo: 'All iOS', nonCompliant: 2 },
      ],
      expectations: 'Share Correlation ID, Sign-in logs CA tab, technical RCA, update every 30min for P1, audit trail required'
    },
    'client-b': {
      name: 'Bloom & Co Studio',
      type: 'SMB Non-Tech - 9-5 EAT',
      caPolicies: [
        { name: 'Require MFA for all users', status: 'ON', scope: 'All users', conditions: 'MFA required, allow SMS + Authenticator', risk: 'Low - User-friendly', lastModified: '2024-08-01', mode: 'ON' },
        { name: 'Block sign-ins from outside Kenya', status: 'OFF', scope: 'All users', conditions: 'Disabled for travel flexibility', risk: 'Low', lastModified: '2024-07-15', mode: 'OFF' },
      ],
      compliancePolicies: [
        { name: 'Windows Compliance - Relaxed', platform: 'Windows 11', settings: 'BitLocker Optional, Defender ON, OS min 10.0.19041', assignedTo: 'All devices', nonCompliant: 1 },
      ],
      expectations: 'Use simple language, no jargon, step-by-step with emojis, confirm resolution, avoid technical terms like DeviceNotCompliant, say "security update needed"'
    },
    'client-c': {
      name: 'Apex Financial Group',
      type: 'Enterprise Regulated - Compliance First',
      caPolicies: [
        { name: 'Require compliant + Hybrid Joined for financial data', status: 'ON', scope: 'Finance group', conditions: 'Compliant + Hybrid Joined + MFA + Trusted location', risk: 'Critical - SOX compliance', lastModified: '2024-11-01', mode: 'ON' },
        { name: 'DLP - Block external sharing of financial docs', status: 'ON', scope: 'SharePoint + OneDrive', conditions: 'Block sharing outside org if contains credit card / PII', risk: 'Critical', lastModified: '2024-10-25', mode: 'ON' },
        { name: 'Require approved client apps', status: 'ON', scope: 'All users', conditions: 'Only allow Outlook, Teams official apps', risk: 'High', lastModified: '2024-09-20', mode: 'ON' },
      ],
      compliancePolicies: [
        { name: 'Windows Compliance - SEC-2024-07 Strict', platform: 'Windows 11', settings: 'BitLocker Required + Key escrowed, Defender ON + Real-time + Tamper protection, OS min 10.0.22621, Secure Boot ON, Encryption 256-bit', assignedTo: 'Finance devices', nonCompliant: 8 },
        { name: 'Defender Compliance', platform: 'All', settings: 'Defender Antivirus ON, Real-time ON, Definitions up-to-date <7 days, Firewall ON', assignedTo: 'All devices', nonCompliant: 3 },
      ],
      expectations: 'Formal language, reference policy SEC-2024-07, provide audit trail, RCA with timeline, compliance proof, documentation required, no shortcuts'
    }
  };

  const current = policies[selectedClientId as keyof typeof policies] || policies['client-a'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-bold text-sm">🏢 Per-Client Policies - Real Workplace</h3>
        <p className="text-xs text-slate-500 mt-1">Each client has different CA + Compliance policies - just like real MSP</p>
        
        <div className="flex gap-2 mt-3">
          {clients.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectClient(c.id)}
              className={`px-3 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition ${selectedClientId === c.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] ${c.color}`}>{c.avatar}</span>
              {c.displayName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-slate-900 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">{current.name}</div>
              <div className="text-xs text-slate-400">{current.type}</div>
            </div>
            <div className="text-xs bg-violet-600 px-2 py-1 rounded-full">{current.caPolicies.length} CA • {current.compliancePolicies.length} Compliance</div>
          </div>
          <div className="mt-3 bg-slate-800 rounded-lg p-3 text-xs">
            <strong className="text-violet-300">💬 Communication Expectations:</strong><br/>
            <span className="text-slate-300">{current.expectations}</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">🔐 Conditional Access Policies (Entra ID)</h4>
          <div className="space-y-2">
            {current.caPolicies.map((policy, i) => (
              <div key={i} className="border rounded-xl p-3 hover:border-violet-300 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {policy.name}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${policy.status === 'ON' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{policy.status}</span>
                      {policy.mode.includes('Report-Only OFF') && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full animate-pulse">⚠️ No Report-Only!</span>}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Scope: {policy.scope} • Conditions: {policy.conditions}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Last modified: {policy.lastModified} • Mode: {policy.mode}</div>
                  </div>
                  <div className={`text-[10px] px-2 py-1 rounded-full font-bold ${policy.risk.includes('High') || policy.risk.includes('Critical') ? 'bg-red-100 text-red-700' : policy.risk.includes('Medium') ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {policy.risk.split(' - ')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">📱 Compliance Policies (Intune)</h4>
          <div className="space-y-2">
            {current.compliancePolicies.map((policy, i) => (
              <div key={i} className="border rounded-xl p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">{policy.name}</div>
                    <div className="text-xs text-slate-500">{policy.platform} • Assigned to: {policy.assignedTo}</div>
                    <div className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded">{policy.settings}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${policy.nonCompliant > 5 ? 'bg-red-100 text-red-700' : policy.nonCompliant > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {policy.nonCompliant} non-compliant
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs">
          <strong>🎯 Team Lead Tip - Per-Client Policies:</strong><br/>
          Real MSP has different policies per client. NovaTech is strict (compliant device required), Bloom is relaxed (MFA only), Apex is critical (SEC-2024-07 + DLP). Always check which client ticket belongs to BEFORE fixing - same error has different fix per client policy.
        </div>
      </div>
    </div>
  );
}
