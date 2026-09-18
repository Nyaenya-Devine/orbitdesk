/**
 * © 2026 Devine Nyaenya — OrbitDesk Proprietary
 * GPO Management — Group Policy Management Console (GPMC) style
 * Like GPMC: linking, inheritance, WMI filters, delegation
 */

'use client';
import { useState } from 'react';
import { logPowerShellCommand } from './PowerShellHistory';

interface GPO {
  id: string;
  name: string;
  linkedOUs: string[];
  status: 'enabled' | 'disabled' | 'enforced';
  wmiFilter?: string;
  description: string;
  settings: string[];
  lastModified: string;
  modifiedBy: string;
}

const mockGPOs: GPO[] = [
  { id: 'gpo1', name: 'Default Domain Policy', linkedOUs: ['novatech.com'], status: 'enabled', description: 'Default domain policy — password policy, Kerberos', settings: ['Password: 14 chars, 60 days', 'Kerberos: 10h ticket', 'Audit: logon events'], lastModified: '2026-08-01', modifiedBy: 'Domain Admins' },
  { id: 'gpo2', name: 'BitLocker-Require — Finance', linkedOUs: ['OU=Finance,OU=Users,DC=novatech,DC=com', 'OU=Workstations,OU=Computers,DC=novatech,DC=com'], status: 'enforced', description: 'Require BitLocker per SEC-2024-07 — compliance failing', settings: ['BitLocker: Require, 256-bit', 'OS Drive: Encrypt', 'Recovery: AD backup'], lastModified: '2026-09-14', modifiedBy: 'john.admin (BREACH — no Report-Only)' },
  { id: 'gpo3', name: 'Printers — Nairobi Office', linkedOUs: ['OU=Nairobi,DC=novatech,DC=com'], status: 'enabled', wmiFilter: 'Location = Nairobi', description: 'Office printers — location-based GPO, modern guidance', settings: ['Printers: \\print-srv\NBO-Floor1, NBO-Floor2', 'Point and Print: enabled'], lastModified: '2026-07-15', modifiedBy: 'IT-Admins' },
  { id: 'gpo4', name: 'M365 Apps — All Users', linkedOUs: ['OU=Users,DC=novatech,DC=com'], status: 'enabled', description: 'Microsoft 365 Apps deployment — Company Portal', settings: ['Office: M365 Apps, Monthly', 'OneDrive: Known Folder Move', 'Teams: auto-install'], lastModified: '2026-06-20', modifiedBy: 'Intune Admins' },
];

export default function GPOManagement({ onAction }: { onAction: (action: string) => void }) {
  const [gpos, setGpos] = useState<GPO[]>(mockGPOs);
  const [selectedGPO, setSelectedGPO] = useState<GPO | null>(mockGPOs[0]);
  const [showInheritance, setShowInheritance] = useState(false);

  const toggleStatus = (id: string) => {
    setGpos(prev => prev.map(g => g.id === id ? { ...g, status: g.status === 'enabled' ? 'disabled' as const : 'enabled' as const } : g));
    const gpo = gpos.find(g => g.id === id);
    if (gpo) {
      onAction(`GPO ${gpo.name} ${gpo.status === 'enabled' ? 'disabled' : 'enabled'}`);
      logPowerShellCommand(gpo.status === 'enabled' ? 'Set-GPLink' : 'Set-GPLink', `-Name "${gpo.name}" -Target "${gpo.linkedOUs[0]}" -LinkEnabled ${gpo.status === 'enabled' ? 'No' : 'Yes'}`, 'You', gpo.name);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left — GPO List */}
      <div className="w-full lg:w-[360px] flex-shrink-0 bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-3 border-b border-zinc-800/60 bg-zinc-900/50">
          <h3 className="text-[12px] font-semibold text-zinc-100 flex items-center gap-2">📜 Group Policy Management — GPMC style <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">Linking • Inheritance • WMI</span></h3>
          <p className="text-[11px] text-zinc-500 mt-1">GPOs linked to OUs — like GPMC — inheritance, enforcement, WMI filters, delegation</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/30">
          {gpos.map(gpo => (
            <div key={gpo.id} onClick={() => setSelectedGPO(gpo)} className={`p-3 cursor-pointer hover:bg-zinc-900/50 transition ${selectedGPO?.id === gpo.id ? 'bg-violet-500/5 border-l-2 border-l-violet-500' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${gpo.status === 'enforced' ? 'bg-violet-500' : gpo.status === 'enabled' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                <span className="text-[12px] font-medium text-zinc-100 truncate">{gpo.name}</span>
                <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full border ${gpo.status === 'enforced' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : gpo.status === 'enabled' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{gpo.status.toUpperCase()}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 truncate">{gpo.description}</p>
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                {gpo.linkedOUs.slice(0,2).map(ou => <span key={ou} className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono truncate max-w-[120px]">{ou.split(',')[0]}</span>)}
                {gpo.wmiFilter && <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">WMI: {gpo.wmiFilter}</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-zinc-800/60 bg-zinc-900/20 text-[10px] text-zinc-500 flex items-center justify-between">
          <span>GPMC — linking, inheritance, enforcement, WMI filters, delegation</span>
          <span>{gpos.length} GPOs</span>
        </div>
      </div>

      {/* Right — GPO Details */}
      <div className="flex-1 bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
        {selectedGPO ? (
          <>
            <div className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-amber-500/5 via-violet-500/5 to-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-600 to-violet-600 flex items-center justify-center text-white font-bold">G</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-zinc-100 truncate">{selectedGPO.name}</h3>
                  <p className="text-[11px] text-zinc-500 truncate">{selectedGPO.description} • Modified {selectedGPO.lastModified} by {selectedGPO.modifiedBy}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedGPO.status === 'enforced' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : selectedGPO.status === 'enabled' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{selectedGPO.status.toUpperCase()}</span>
                    {selectedGPO.status === 'enforced' && <span className="text-[10px] text-violet-300">Enforced — overrides inheritance</span>}
                    {selectedGPO.wmiFilter && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">WMI Filter: {selectedGPO.wmiFilter}</span>}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toggleStatus(selectedGPO.id)} className={`h-8 px-3 rounded-full text-[11px] font-medium border transition ${selectedGPO.status === 'enabled' ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-500'}`}>{selectedGPO.status === 'enabled' ? 'Disable' : 'Enable'}</button>
                  <button onClick={() => { onAction(`Enforced ${selectedGPO.name} — overrides inheritance`); logPowerShellCommand('Set-GPLink', `-Name "${selectedGPO.name}" -Enforced Yes`, 'You', selectedGPO.name); }} className="h-8 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium">Enforce</button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Linked OUs — Inheritance</h4>
                <div className="mt-2 space-y-2">
                  {selectedGPO.linkedOUs.map(ou => (
                    <div key={ou} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-300">{ou}</span>
                      <span className="text-[10px] text-zinc-500">Link order 1 • Enforced: {selectedGPO.status === 'enforced' ? 'Yes' : 'No'} • Inheritance: {showInheritance ? 'Blocked' : 'Enabled'}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowInheritance(!showInheritance)} className="mt-2 h-7 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-400 hover:text-zinc-200">🔗 {showInheritance ? 'Enable Inheritance' : 'Block Inheritance'} — like GPMC</button>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Settings — Policy</h4>
                <div className="mt-2 space-y-1.5">
                  {selectedGPO.settings.map((s, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />{s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-[11px] font-medium text-amber-300">GPO Reality Check — Like GPMC</p>
                <p className="text-[11px] text-zinc-400 mt-1">OU tree suggests order, but GPO linking and inheritance reveal reality. This GPO linked to {selectedGPO.linkedOUs.length} OUs, {selectedGPO.status === 'enforced' ? 'enforced overrides child inheritance' : 'inheritance enabled'}. WMI filter {selectedGPO.wmiFilter ? `active: ${selectedGPO.wmiFilter}` : 'none — applies to all'}. Delegation: IT-Admins can edit, Domain Admins owner. Check GPMC for policy reality, not just OU tree.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[11px] font-medium text-zinc-200">PowerShell — GPMC actions</p>
                <div className="mt-2 p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1">
                  <p>Get-GPO -Name "{selectedGPO.name}" | Get-GPOReport -ReportType Html</p>
                  <p>Get-GPLink -Target "{selectedGPO.linkedOUs[0]}"</p>
                  <p>Set-GPLink -Name "{selectedGPO.name}" -Target "{selectedGPO.linkedOUs[0]}" -LinkEnabled Yes -Enforced {selectedGPO.status === 'enforced' ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center"><p className="text-[12px] text-zinc-500">Select a GPO from left to view linking, inheritance, WMI filters, delegation — like GPMC</p></div>
        )}
      </div>
    </div>
  );
}
