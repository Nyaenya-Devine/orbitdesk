/**
 * © 2026 Devine Nyaenya — OrbitDesk Proprietary
 * Intune Device Center — Feels like Microsoft Intune admin center
 * Device compliance, BitLocker, Company Portal, remediation
 */

'use client';
import { useState } from 'react';
import { logPowerShellCommand } from './PowerShellHistory';

interface Device {
  id: string;
  name: string;
  user: string;
  os: string;
  compliance: 'compliant' | 'noncompliant' | 'unknown';
  bitLocker: 'on' | 'off' | 'unknown';
  lastSync: string;
  model: string;
  serial: string;
  issues: string[];
}

const mockDevices: Device[] = [
  { id: 'd1', name: 'WS-FIN-001', user: 'Sarah Finance', os: 'Windows 11 23H2', compliance: 'noncompliant', bitLocker: 'off', lastSync: '2 mins ago', model: 'Dell Latitude 7440', serial: 'DL7440-001', issues: ['BitLocker: Protection Off, 0%', 'Compliance: DeviceNotCompliant 53000', 'CA policy blocking payroll P1'] },
  { id: 'd2', name: 'WS-IT-012', user: 'Priya Shah', os: 'Windows 11 23H2', compliance: 'compliant', bitLocker: 'on', lastSync: '5 mins ago', model: 'Lenovo ThinkPad X1', serial: 'X1-012', issues: [] },
  { id: 'd3', name: 'WS-DES-007', user: 'Emma Bloom', os: 'Windows 11 22H2', compliance: 'noncompliant', bitLocker: 'unknown', lastSync: '1 hour ago', model: 'HP Spectre', serial: 'HP-007', issues: ['Compliance: Pending, Company Portal sync required'] },
  { id: 'd4', name: 'WS-FIN-023', user: 'John Payroll', os: 'Windows 11 23H2', compliance: 'noncompliant', bitLocker: 'off', lastSync: '10 mins ago', model: 'Dell Latitude 7440', serial: 'DL7440-023', issues: ['BitLocker: Off, Payroll blocked P1', 'Device: Not compliant'] },
];

export default function IntuneDeviceCenter({ onAction }: { onAction: (action: string) => void }) {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(mockDevices[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'bitlocker' | 'sync'>('overview');

  const fixBitLocker = (device: Device) => {
    setDevices(prev => prev.map(d => d.id === device.id ? { ...d, bitLocker: 'on' as const, compliance: 'compliant' as const, issues: [] } : d));
    setSelectedDevice(prev => prev?.id === device.id ? { ...prev, bitLocker: 'on' as const, compliance: 'compliant' as const, issues: [] } : prev);
    onAction(`Fixed BitLocker for ${device.name} — Enable encryption, escrow to AD, compliance now compliant`);
    logPowerShellCommand('Enable-BitLocker', `-MountPoint C: -EncryptionMethod XtsAes256 -UsedSpaceOnly`, 'You', device.name);
    logPowerShellCommand('Backup-BitLockerKeyProtector', `-MountPoint C: -KeyProtectorId (Get-BitLockerVolume -MountPoint C).KeyProtector[0].KeyProtectorId`, 'You', device.name);
  };

  const syncDevice = (device: Device) => {
    onAction(`Synced ${device.name} — Company Portal Check Status, last sync now`);
    logPowerShellCommand('Invoke-CompanyPortalSync', `-Device ${device.name}`, 'You', device.name);
    setDevices(prev => prev.map(d => d.id === device.id ? { ...d, lastSync: 'Just now' } : d));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left — Device List */}
      <div className="w-full lg:w-[360px] flex-shrink-0 bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-3 border-b border-zinc-800/60 bg-zinc-900/50">
          <h3 className="text-[12px] font-semibold text-zinc-100 flex items-center gap-2">💻 Intune — Device Compliance Center <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">Intune admin center • Co-managed</span></h3>
          <p className="text-[11px] text-zinc-500 mt-1">Devices, compliance, BitLocker, Company Portal — like intune.microsoft.com</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/30">
          {devices.map(device => (
            <div key={device.id} onClick={() => setSelectedDevice(device)} className={`p-3 cursor-pointer hover:bg-zinc-900/50 transition ${selectedDevice?.id === device.id ? 'bg-violet-500/5 border-l-2 border-l-violet-500' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-[16px]">{device.compliance === 'compliant' ? '✅' : device.compliance === 'noncompliant' ? '❌' : '❓'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-zinc-100 truncate">{device.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${device.compliance === 'compliant' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>{device.compliance.toUpperCase()}</span>
                    {device.bitLocker === 'off' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">BitLocker Off</span>}
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate">{device.user} • {device.os} • {device.model}</p>
                  <p className="text-[10px] text-zinc-600">Last sync {device.lastSync} • S/N {device.serial}</p>
                </div>
              </div>
              {device.issues.length > 0 && (
                <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                  <p className="text-[10px] text-red-300">{device.issues[0]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-zinc-800/60 bg-zinc-900/20 text-[10px] text-zinc-500 flex items-center justify-between">
          <span>Intune — compliance, BitLocker, Company Portal, co-managed</span>
          <span>{devices.filter(d => d.compliance === 'noncompliant').length} noncompliant • {devices.filter(d => d.bitLocker === 'off').length} BitLocker off</span>
        </div>
      </div>

      {/* Right — Device Details */}
      <div className="flex-1 bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
        {selectedDevice ? (
          <>
            <div className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-[16px]">💻</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-zinc-100 truncate">{selectedDevice.name} — {selectedDevice.user}</h3>
                  <p className="text-[11px] text-zinc-500 truncate">{selectedDevice.os} • {selectedDevice.model} • S/N {selectedDevice.serial} • Last sync {selectedDevice.lastSync}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedDevice.compliance === 'compliant' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>{selectedDevice.compliance.toUpperCase()} • {selectedDevice.compliance === 'compliant' ? 'Intune compliant' : 'DeviceNotCompliant 53000'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedDevice.bitLocker === 'on' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>BitLocker: {selectedDevice.bitLocker.toUpperCase()} {selectedDevice.bitLocker === 'off' ? '— 0% — P1' : '— 100% — escrowed'}</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => syncDevice(selectedDevice)} className="h-8 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 hover:bg-zinc-700">🔄 Sync</button>
                  <button onClick={() => fixBitLocker(selectedDevice)} disabled={selectedDevice.bitLocker === 'on'} className="h-8 px-3 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[11px] font-medium">🔐 Fix BitLocker</button>
                </div>
              </div>

              <div className="mt-4 flex gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800 w-fit">
                {[
                  { id: 'overview', label: 'Overview', icon: '◍' },
                  { id: 'compliance', label: 'Compliance', icon: '✅' },
                  { id: 'bitlocker', label: 'BitLocker', icon: '🔐' },
                  { id: 'sync', label: 'Company Portal', icon: '🔄' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`h-7 px-3 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition ${activeTab === tab.id ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Device Name</p><p className="text-[13px] text-zinc-200 mt-1">{selectedDevice.name}</p><p className="text-[11px] text-zinc-500 font-mono">{selectedDevice.serial}</p></div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Primary User</p><p className="text-[13px] text-zinc-200 mt-1">{selectedDevice.user}</p><p className="text-[11px] text-zinc-500">{selectedDevice.os}</p></div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Compliance State</p><p className={`text-[13px] mt-1 font-medium ${selectedDevice.compliance === 'compliant' ? 'text-emerald-400' : 'text-red-400'}`}>{selectedDevice.compliance.toUpperCase()}</p><p className="text-[11px] text-zinc-500">{selectedDevice.compliance === 'compliant' ? 'Compliant per policy' : 'Not compliant — CA blocking'}</p></div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">BitLocker</p><p className={`text-[13px] mt-1 font-medium ${selectedDevice.bitLocker === 'on' ? 'text-emerald-400' : 'text-red-400'}`}>{selectedDevice.bitLocker.toUpperCase()}</p><p className="text-[11px] text-zinc-500">{selectedDevice.bitLocker === 'on' ? 'Protection On, 100%, escrowed to AD' : 'Protection Off, 0% — enable per SEC-2024-07'}</p></div>
                  </div>

                  {selectedDevice.issues.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <p className="text-[11px] font-medium text-red-300">Issues — P1 Critical</p>
                      <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-400 list-disc pl-4">
                        {selectedDevice.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                      </ul>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => fixBitLocker(selectedDevice)} className="h-8 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium">🔐 Enable BitLocker + Escrow</button>
                        <button onClick={() => syncDevice(selectedDevice)} className="h-8 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px]">🔄 Company Portal Sync</button>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[11px] font-medium text-zinc-200">Diagnostic Commands — Like Intune Remote Actions</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 flex items-center justify-between"><span className="text-[11px] font-mono text-zinc-400">dsregcmd /status</span><button onClick={() => { onAction('Ran dsregcmd /status — AzureAdJoined YES, Compliance NO'); logPowerShellCommand('dsregcmd', '/status', 'You', selectedDevice.name); }} className="h-6 px-2 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300">Run</button></div>
                      <div className="p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 flex items-center justify-between"><span className="text-[11px] font-mono text-zinc-400">Get-BitLockerVolume -MountPoint C:</span><button onClick={() => { onAction(`BitLocker: ${selectedDevice.bitLocker === 'on' ? 'Protection On, 100%' : 'Protection Off, 0% — enable required'}`); logPowerShellCommand('Get-BitLockerVolume', '-MountPoint C:', 'You', selectedDevice.name); }} className="h-6 px-2 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300">Run</button></div>
                      <div className="p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 flex items-center justify-between"><span className="text-[11px] font-mono text-zinc-400">Company Portal → Check Status → Sync</span><button onClick={() => syncDevice(selectedDevice)} className="h-6 px-2 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300">Sync</button></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <h4 className="text-[11px] font-semibold text-zinc-200">Compliance Policy — Require Compliant Device</h4>
                    <p className="text-[11px] text-zinc-500 mt-1">Policy: Require compliant device for Finance-Users + All cloud apps — like Conditional Access grant</p>
                    <div className="mt-3 space-y-2 text-[11px]">
                      <div className="flex justify-between"><span className="text-zinc-500">Compliance:</span><span className={selectedDevice.compliance === 'compliant' ? 'text-emerald-400' : 'text-red-400'}>{selectedDevice.compliance.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">BitLocker:</span><span className={selectedDevice.bitLocker === 'on' ? 'text-emerald-400' : 'text-red-400'}>{selectedDevice.bitLocker.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Password:</span><span className="text-emerald-400">Compliant — 14 chars</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">OS Version:</span><span className="text-emerald-400">Compliant — 23H2</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bitlocker' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <h4 className="text-[11px] font-semibold text-zinc-200">BitLocker — Like Intune Endpoint Security</h4>
                    <div className="mt-2 p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 font-mono text-[11px] text-zinc-400">
                      <p>Volume C: [{selectedDevice.bitLocker === 'on' ? 'C:' : 'C:'}]</p>
                      <p>Size: 476GB, Used: 120GB</p>
                      <p>Protection Status: {selectedDevice.bitLocker === 'on' ? 'Protection On' : 'Protection Off'}</p>
                      <p>Percentage Encrypted: {selectedDevice.bitLocker === 'on' ? '100%' : '0%'}</p>
                      <p>Encryption Method: XtsAes256</p>
                      <p>Key Protector: {selectedDevice.bitLocker === 'on' ? 'TPM + Recovery Password — escrowed to AD' : 'None — enable required per SEC-2024-07'}</p>
                    </div>
                    <button onClick={() => fixBitLocker(selectedDevice)} disabled={selectedDevice.bitLocker === 'on'} className="mt-3 w-full h-9 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[12px] font-medium">🔐 Enable BitLocker + Backup Recovery Key to AD</button>
                  </div>
                </div>
              )}

              {activeTab === 'sync' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <h4 className="text-[11px] font-semibold text-zinc-200">Company Portal — Sync Device</h4>
                    <p className="text-[11px] text-zinc-500 mt-1">User opens Company Portal (blue shopping bag icon) → Check Status → Sync — last sync {selectedDevice.lastSync}</p>
                    <button onClick={() => syncDevice(selectedDevice)} className="mt-3 w-full h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold">🔄 Sync Device — Company Portal Check Status</button>
                    <p className="text-[10px] text-zinc-600 mt-2">Like Intune: device syncs compliance, BitLocker status, apps — takes 2 mins, then CA What-If shows safe</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center"><p className="text-[12px] text-zinc-500">Select a device from left to view compliance, BitLocker, Company Portal sync — like Intune admin center</p></div>
        )}
      </div>
    </div>
  );
}
