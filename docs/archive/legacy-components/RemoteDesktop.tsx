'use client';
import { useState, useEffect } from 'react';
import { Ticket } from '@/lib/ticketEngine';

interface Props {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string) => void;
}

export default function RemoteDesktop({ ticket, isOpen, onClose, onAction }: Props) {
  const [activeApp, setActiveApp] = useState<'desktop' | 'terminal' | 'portal' | 'settings'>('desktop');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsConnected(false);
      setTerminalOutput([]);
      setTimeout(() => {
        setIsConnected(true);
        setTerminalOutput([
          `✓ Secure connection established to ${ticket?.userEmail.split('@')[0]}-LAPTOP`,
          `✓ Client: ${ticket?.clientName} • User: ${ticket?.userEmail}`,
          `✓ Session ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}-RDP • Encrypted`,
          `✓ Compliance: Awaiting check...`,
          ``,
          `Type commands: dsregcmd /status, ipconfig, whoami, Get-BitLockerVolume, CompanyPortal Sync`,
          ``
        ]);
      }, 1200);
    }
  }, [isOpen, ticket]);

  const runCommand = () => {
    if (!command.trim()) return;
    onAction?.(`RDP Terminal: ${command} on ${ticket?.userEmail} — real command executed`);
    let output: string[] = [...terminalOutput, `> ${command}`];
    
    const cmd = command.toLowerCase();
    
    if (cmd.includes('dsregcmd /status')) {
      output.push(
        ``,
        `+----------------------------------------------------------------------+`,
        `| Device State                                                         |`,
        `+----------------------------------------------------------------------+`,
        `| AzureAdJoined : YES                                                  |`,
        `| EnterpriseJoined : NO                                                |`,
        `| DomainJoined : NO                                                    |`,
        `| DeviceId : ${Math.random().toString(36).substring(2, 10)}-...        |`,
        `+----------------------------------------------------------------------+`,
        `| User State                                                           |`,
        `+----------------------------------------------------------------------+`,
        `| NgcSet : YES                                                         |`,
        `| WorkplaceJoined : NO                                                 |`,
        `| WamDefaultSet : YES                                                  |`,
        `+----------------------------------------------------------------------+`,
        `| SSO State                                                            |`,
        `+----------------------------------------------------------------------+`,
        `| AzureAdPrt : YES                                                     |`,
        `| AzureAdPrtUpdateTime : ${new Date().toISOString()}                  |`,
        `| AzureAdPrtExpiryTime : ${new Date(Date.now()+ 3600000*4).toISOString()} |`,
        `| AzureAdPrtAuthority : https://login.microsoftonline.com/...          |`,
        `+----------------------------------------------------------------------+`,
        `| User Context                                                         |`,
        `+----------------------------------------------------------------------+`,
        `| MdmUrl : https://enrollment.manage.microsoft.com/...                |`,
        `| MdmTouUrl : https://portal.manage.microsoft.com/TermsofUse.aspx     |`,
        `| MdmComplianceUrl : https://portal.manage.microsoft.com/?portalAction=Compliance |`,
        `| SettingsUrl : https://portal.manage.microsoft.com/...               |`,
        `| JoinSrvVersion : 2.0                                                 |`,
        `| JoinSrvId : urn:ms-drs:enterpriseregistration.windows.net           |`,
        `| KeyProvider : Microsoft Software Key Storage Provider                |`,
        `+----------------------------------------------------------------------+`,
        `| Diagnostic Data                                                      |`,
        `+----------------------------------------------------------------------+`,
        `| AadRecoveryEnabled : NO                                              |`,
        `| ExecutableRes : NONE                                                 |`,
        `| AadRecoveryLink :                                                    |`,
        `+----------------------------------------------------------------------+`,
        ``,
        `Compliance Check:`,
        `  Device Compliance : NO - BitLocker not enabled, failing policy`,
        `  → Fix: Enable-BitLocker -MountPoint C: -RecoveryPasswordProtector`,
        ``
      );
    } else if (cmd.includes('ipconfig')) {
      output.push(
        ``,
        `Windows IP Configuration`,
        ``,
        `Ethernet adapter Ethernet:`,
        `   Connection-specific DNS Suffix  . : ${ticket?.clientName.toLowerCase().replace(' ', '')}.local`,
        `   IPv4 Address. . . . . . . . . . . : 192.168.1.${Math.floor(Math.random()*100)+10}`,
        `   Subnet Mask . . . . . . . . . . . : 255.255.255.0`,
        `   Default Gateway . . . . . . . . . : 192.168.1.1`,
        ``,
        `   DNS Servers . . . . . . . . . . . : 10.0.0.4, 10.0.0.5 (Entra DNS)`,
        ``
      );
    } else if (cmd.includes('whoami')) {
      output.push(``, `${ticket?.userEmail}`, `azuread\\${ticket?.userEmail.split('@')[0]}`, ``);
    } else if (cmd.includes('get-bitlockervolume') || cmd.includes('manage-bde -status')) {
      output.push(
        ``,
        `Volume C: [Windows]`,
        `  VolumeType      : OperatingSystem`,
        `  MountPoint      : C:`,
        `  CapacityGB      : 476.21`,
        `  KeyProtector    : {None} - NOT ENCRYPTED`,
        `  ProtectionStatus: Protection Off`,
        `  LockStatus      : Unlocked`,
        `  EncryptionMethod: None`,
        ``,
        `  → Device shows Not Compliant because BitLocker is OFF`,
        `  → Required by compliance policy: ${ticket?.clientId === 'client-c' ? 'SEC-2024-07' : 'Compliance-Standard'}`,
        ``
      );
    } else if (cmd.includes('companyportal') || cmd.includes('sync')) {
      output.push(
        ``,
        `✓ Company Portal Sync initiated...`,
        `  Checking enrollment: YES`,
        `  MDM URL: https://enrollment.manage.microsoft.com/...`,
        `  Last Sync: ${new Date().toLocaleString()}`,
        `  Syncing policies...`,
        `  - Compliance policy: Checking...`,
        `  - BitLocker: Still failing - needs manual enable`,
        `  - Defender: Compliant`,
        `  - OS Version: Compliant`,
        `  Sync completed with 1 failure (BitLocker)`,
        ``,
        `  Next sync in 8 hours or manual sync via Settings → Accounts → Access work or school → Info → Sync`,
        ``
      );
    } else if (cmd.includes('clear') || cmd.includes('cls')) {
      output = [];
    } else {
      output.push(``, `'${command}' is not recognized as an internal or external command,`, `operable program or batch file.`, `Try: dsregcmd /status, ipconfig, Get-BitLockerVolume`, ``);
    }

    setTerminalOutput(output);
    setCommand('');
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] rounded-[16px] shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden border border-slate-800 flex flex-col">
        {/* Title Bar - Like macOS + Windows 11 */}
        <div className="h-11 bg-[#1a1a1a] border-b border-slate-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>🔒</span>
              <span>Remote Session - {ticket.userEmail.split('@')[0]}-LAPTOP</span>
              <span className="w-px h-4 bg-slate-700"></span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isConnected ? '● Connected • Encrypted • Session Recording' : '○ Connecting...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{ticket.clientName} • {ticket.userEmail}</span>
            <button onClick={onClose} className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400">✕</button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Like Linear + VS Code */}
          <div className="w-64 bg-[#111111] border-r border-slate-800 p-3 flex flex-col gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Client PC - {ticket.userEmail.split('@')[0]}</div>
              <div className="space-y-1">
                {[
                  { id: 'desktop', icon: '🖥️', label: 'Desktop', desc: 'Windows 11 Pro' },
                  { id: 'terminal', icon: '💻', label: 'Terminal', desc: 'PowerShell • Admin' },
                  { id: 'portal', icon: '🌐', label: 'Company Portal', desc: 'Intune • Sync' },
                  { id: 'settings', icon: '⚙️', label: 'Settings', desc: 'Accounts → Work/School' },
                ].map(app => (
                  <button
                    key={app.id}
                    onClick={() => setActiveApp(app.id as any)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 transition ${activeApp === app.id ? 'bg-white text-black' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <span className="text-lg">{app.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{app.label}</div>
                      <div className="text-[11px] opacity-75">{app.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-2">Session Info</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Client:</span><span className="text-white">{ticket.clientName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">User:</span><span className="text-white truncate">{ticket.userEmail}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Device:</span><span className="text-white">{ticket.userEmail.split('@')[0]}-LT</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Compliance:</span><span className="text-red-400">Not Compliant</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Policy:</span><span className="text-amber-400">{ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'Standard'}</span></div>
              </div>
            </div>

            <div className="bg-violet-600/10 border border-violet-600/20 rounded-xl p-3">
              <div className="text-xs font-bold text-violet-300 mb-1">🎯 Team Lead Action</div>
              <div className="text-[11px] text-violet-200/80">You have remote access - run dsregcmd /status to check join state, Get-BitLockerVolume to check encryption, then guide user. All actions logged for audit.</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#0a0a0a] flex flex-col">
            {activeApp === 'desktop' && (
              <div className="flex-1 p-6 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-20 left-20 w-96 h-96 bg-violet-600 rounded-full blur-[120px]"></div>
                  <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">🪟</div>
                      <div>
                        <div className="text-white font-medium">Windows 11 Pro • {ticket.userEmail.split('@')[0]}-LAPTOP</div>
                        <div className="text-xs text-slate-500">Entra Joined • Intune Managed • Compliance: Not Compliant</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">🔒 Secure • {new Date().toLocaleTimeString()} • 100% • 🔋</div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 max-w-3xl">
                    {[
                      { icon: '📁', name: 'File Explorer', count: '3 pinned' },
                      { icon: '🌐', name: 'Company Portal', count: '1 update', alert: true },
                      { icon: '💬', name: 'Teams', count: 'Blocked', alert: true },
                      { icon: '📧', name: 'Outlook', count: 'Blocked', alert: true },
                      { icon: '⚙️', name: 'Settings', count: '' },
                      { icon: '🔒', name: 'BitLocker', count: 'Off • Not Compliant', alert: true },
                      { icon: '🛡️', name: 'Defender', count: 'Protected' },
                      { icon: '🔧', name: 'PowerShell', count: 'Admin' },
                    ].map(app => (
                      <div key={app.name} className={`bg-white/5 backdrop-blur border ${app.alert ? 'border-red-500/30 bg-red-500/5' : 'border-white/10'} rounded-2xl p-4 hover:bg-white/10 transition cursor-pointer group`}>
                        <div className="text-2xl mb-2 group-hover:scale-110 transition">{app.icon}</div>
                        <div className="text-white text-sm font-medium">{app.name}</div>
                        <div className={`text-xs ${app.alert ? 'text-red-400' : 'text-slate-500'}`}>{app.count}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-3xl">
                    <div className="flex gap-3">
                      <div className="text-xl">⚠️</div>
                      <div>
                        <div className="text-red-300 font-medium text-sm">Device Compliance - Action Required</div>
                        <div className="text-red-200/70 text-xs mt-1">Your device is not compliant per {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'company policy'}. You cannot access Teams, Outlook, SharePoint. Contact IT or open Company Portal to fix. Error: DeviceNotCompliant 53000</div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => setActiveApp('portal')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-medium">Open Company Portal</button>
                          <button onClick={() => setActiveApp('terminal')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs">Run Diagnostics</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeApp === 'terminal' && (
              <div className="flex-1 bg-[#0a0a0a] flex flex-col font-mono text-sm">
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {terminalOutput.map((line, i) => (
                    <div key={i} className="text-slate-300 text-xs whitespace-pre-wrap">{line}</div>
                  ))}
                </div>
                <div className="border-t border-slate-800 p-3 flex gap-2">
                  <span className="text-violet-400 text-xs">PS C:\&gt;</span>
                  <input
                    value={command}
                    onChange={e => setCommand(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runCommand()}
                    placeholder="Type command: dsregcmd /status, Get-BitLockerVolume, ipconfig..."
                    className="flex-1 bg-transparent text-white placeholder:text-slate-600 outline-none text-xs"
                  />
                  <button onClick={runCommand} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs">Run</button>
                </div>
              </div>
            )}

            {activeApp === 'portal' && (
              <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">🏢</div>
                      <div>
                        <div className="font-bold">Company Portal</div>
                        <div className="text-xs text-slate-500">Intune • {ticket.clientName} • Managed by IT</div>
                      </div>
                      <div className="ml-auto">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold">Sync</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">🔒</div>
                            <div>
                              <div className="font-medium text-sm">Device Compliance</div>
                              <div className="text-xs text-slate-500">Check if device meets company requirements</div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Not Compliant</span>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs p-2 bg-red-50 rounded-lg">
                            <span>🔴 BitLocker - Require encryption</span>
                            <span className="text-red-600 font-bold">Not Compliant • Tap to fix</span>
                          </div>
                          <div className="flex justify-between text-xs p-2 bg-green-50 rounded-lg">
                            <span>🟢 OS Version - Minimum 10.0.19045</span>
                            <span className="text-green-600">Compliant</span>
                          </div>
                          <div className="flex justify-between text-xs p-2 bg-green-50 rounded-lg">
                            <span>🟢 Defender - Real-time protection ON</span>
                            <span className="text-green-600">Compliant</span>
                          </div>
                        </div>

                        <button className="w-full mt-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-sm font-bold">Fix BitLocker Issue → Enable Encryption</button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="border rounded-xl p-3">
                          <div className="text-xs text-slate-500">Last Sync</div>
                          <div className="font-medium text-sm">2 hours ago</div>
                          <div className="text-xs text-amber-600">Sync required</div>
                        </div>
                        <div className="border rounded-xl p-3">
                          <div className="text-xs text-slate-500">Management</div>
                          <div className="font-medium text-sm">Intune + Entra Joined</div>
                          <div className="text-xs text-green-600">✓ Managed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeApp === 'settings' && (
              <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border">
                  <div className="p-4 border-b">
                    <div className="font-bold">Settings → Accounts → Access work or school</div>
                    <div className="text-xs text-slate-500">Manage work or school accounts and MDM enrollment</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">🏢</div>
                        <div>
                          <div className="font-medium text-sm">{ticket.userEmail}</div>
                          <div className="text-xs text-slate-500">Connected to {ticket.clientName} Entra ID • MDM: Intune</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Connected</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs">Info → Sync</button>
                      <button className="px-4 py-2 bg-slate-100 rounded-full text-xs">Disconnect</button>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs">
                      <strong>Team Lead Tip:</strong> This is where you check MDM enrollment. If Disconnect is grayed out or shows stale enrollment, run dsregcmd /leave in Terminal, then re-enroll via Company Portal. Error 0x80180024 fix lives here.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-10 bg-[#1a1a1a] border-t border-slate-800 flex items-center justify-between px-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span>🔒 Encrypted RDP • Session ID: {Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
            <span className="w-px h-4 bg-slate-700"></span>
            <span>📹 Recording • Audit log enabled</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Actions are logged • Client consent obtained</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">● Live • {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
