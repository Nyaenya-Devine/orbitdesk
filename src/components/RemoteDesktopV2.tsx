'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket } from '@/lib/ticketEngine';
import Logo from './Logo';

interface Props {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string) => void;
  bitLockerFixed?: boolean;
  syncDone?: boolean;
}

export default function RemoteDesktopV2({ ticket, isOpen, onClose, onAction, bitLockerFixed = false, syncDone = false }: Props) {
  const [activeApp, setActiveApp] = useState<'desktop' | 'terminal' | 'portal' | 'settings'>('desktop');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [localBitLockerFixed, setLocalBitLockerFixed] = useState(bitLockerFixed);
  const [localSyncDone, setLocalSyncDone] = useState(syncDone);

  useEffect(() => {
    setLocalBitLockerFixed(bitLockerFixed);
    setLocalSyncDone(syncDone);
  }, [bitLockerFixed, syncDone]);

  useEffect(() => {
    if (isOpen) {
      setIsConnected(false);
      setTerminalOutput([]);
      setTimeout(() => {
        setIsConnected(true);
        setTerminalOutput([
          `✓ Secure connection to ${ticket?.userEmail.split('@')[0]}-LAPTOP — ${ticket?.clientName}`,
          `✓ User: ${ticket?.userEmail} — Session ${Math.random().toString(36).substring(2, 8).toUpperCase()}-RDP Encrypted`,
          `✓ Compliance: ${localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant — BitLocker Off'} — ${ticket?.clientId === 'client-c' ? 'SEC-2024-07' : 'Standard'}`,
          ``,
          `Commands: dsregcmd /status, ipconfig, whoami, Get-BitLockerVolume, CompanyPortal Sync`,
          `Tip: Actions in Intune portal update this PC in real-time — try enabling BitLocker in portal then check here`,
          ``
        ]);
      }, 1000);
    }
  }, [isOpen, ticket, localBitLockerFixed]);

  const runCommand = () => {
    if (!command.trim()) return;
    onAction?.(`RDP: ${command} on ${ticket?.userEmail} — real`);
    let output = [...terminalOutput, `> ${command}`];
    
    const cmd = command.toLowerCase();
    
    if (cmd.includes('dsregcmd /status')) {
      output.push(
        ``,
        `Device State:`,
        `  AzureAdJoined : YES`,
        `  DeviceId : ${Math.random().toString(36).substring(2, 10)}`,
        `  Compliance : ${localBitLockerFixed ? 'YES ✓' : 'NO — BitLocker Off'}`,
        ``,
        `User: ${ticket?.userEmail}`,
        `MdmUrl: https://enrollment.manage.microsoft.com/...`,
        ``,
        `Compliance: ${localBitLockerFixed ? 'Compliant ✓ — BitLocker On, key escrowed' : 'Not Compliant — BitLocker Off, enable in Company Portal'}`,
        ``
      );
    } else if (cmd.includes('ipconfig')) {
      output.push(
        ``,
        `Ethernet: 192.168.1.${Math.floor(Math.random()*100)+10} — ${ticket?.clientName.toLowerCase().replace(' ', '')}.local`,
        `DNS: 10.0.0.4, 10.0.0.5 (Entra)`,
        ``
      );
    } else if (cmd.includes('whoami')) {
      output.push(``, `${ticket?.userEmail}`, ``);
    } else if (cmd.includes('get-bitlockervolume') || cmd.includes('manage-bde')) {
      const complianceMsg = ticket?.clientId === 'client-c' ? 'SEC-2024-07 requires BitLocker' : 'Company policy requires';
      output.push(
        ``,
        `C: [Windows] — ${localBitLockerFixed ? 'Protection On ✓' : 'Protection Off'}`,
        `  KeyProtector: ${localBitLockerFixed ? '{RecoveryPassword} — Escrowed to Entra ID ✓' : '{None} — NOT ENCRYPTED'}`,
        `  Protection: ${localBitLockerFixed ? 'On ✓' : 'Off — Enable in Company Portal'}`,
        `  Compliance: ${localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant — ' + complianceMsg}`,
        ``
      );
    } else if (cmd.includes('companyportal') || cmd.includes('sync')) {
      setLocalSyncDone(true);
      output.push(
        ``,
        `✓ Company Portal Sync — Last sync: ${new Date().toLocaleTimeString()}`,
        `  Enrollment: YES — MDM Intune`,
        `  BitLocker: ${localBitLockerFixed ? 'Compliant ✓' : 'Still failing — enable in portal'}`,
        `  Defender: Compliant, OS: Compliant`,
        `  ${localBitLockerFixed ? '✓ All compliant — device will be Compliant in 2 mins' : '⚠ 1 failure — BitLocker needs manual enable in portal'}`,
        ``
      );
      onAction?.(`Company Portal Sync — ${localBitLockerFixed ? 'All compliant now' : 'BitLocker still failing'}`);
    } else if (cmd.includes('clear') || cmd.includes('cls')) {
      output = [];
    } else {
      output.push(``, `'${command}' not recognized — try dsregcmd /status, Get-BitLockerVolume`, ``);
    }

    setTerminalOutput(output);
    setCommand('');
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-2 md:p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-[#0a0a0a] rounded-[16px] shadow-2xl w-full max-w-6xl h-[90vh] md:h-[85vh] overflow-hidden border border-zinc-800 flex flex-col">
        <div className="h-11 bg-[#1a1a1a] border-b border-zinc-800 flex items-center justify-between px-3 md:px-4 gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="flex gap-1 flex-shrink-0">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            </div>
            <Logo variant="icon" size={20} />
            <span className="text-[11px] md:text-xs text-zinc-400 truncate">Remote — {ticket.userEmail.split('@')[0]}-LAPTOP • {ticket.clientName}</span>
            <span className={`hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{isConnected ? '● Connected Encrypted Recording' : '○ Connecting...'}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden md:inline text-[11px] text-zinc-500 truncate max-w-[200px]">{ticket.userEmail} • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</span>
            <button onClick={onClose} className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 text-[12px]">✕</button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
          <div className="w-full md:w-56 bg-[#111111] border-b md:border-b-0 md:border-r border-zinc-800 p-2 md:p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {[
              { id: 'desktop', icon: '◧', label: 'Desktop', desc: 'Win11 Pro' },
              { id: 'terminal', icon: '◫', label: 'Terminal', desc: 'PowerShell' },
              { id: 'portal', icon: '◩', label: 'Portal', desc: 'Intune Sync' },
              { id: 'settings', icon: '◪', label: 'Settings', desc: 'Work/School' },
            ].map(app => (
              <button key={app.id} onClick={() => setActiveApp(app.id as any)} className={`flex md:flex-row flex-col items-center md:items-start gap-1 md:gap-2 p-2 rounded-xl text-[11px] transition flex-shrink-0 ${activeApp === app.id ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                <span className="text-[16px]">{app.icon}</span>
                <div className="text-center md:text-left">
                  <div className="font-medium leading-tight">{app.label}</div>
                  <div className="text-[10px] opacity-70 leading-tight hidden md:block">{app.desc}</div>
                </div>
              </button>
            ))}
            
            <div className="hidden md:block mt-4 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Session — Real</p>
              <div className="mt-2 space-y-1.5 text-[11px]">
                <div className="flex justify-between gap-2"><span className="text-zinc-600">Client:</span><span className="text-zinc-300 truncate">{ticket.clientName.split(' ')[0]}</span></div>
                <div className="flex justify-between gap-2"><span className="text-zinc-600">User:</span><span className="text-zinc-300 truncate">{ticket.userEmail.split('@')[0]}</span></div>
                <div className="flex justify-between gap-2"><span className="text-zinc-600">Compliance:</span><span className={`${localBitLockerFixed ? 'text-emerald-400' : 'text-red-400'} truncate`}>{localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</span></div>
                <div className="flex justify-between gap-2"><span className="text-zinc-600">BitLocker:</span><span className={`${localBitLockerFixed ? 'text-emerald-400' : 'text-red-400'} truncate`}>{localBitLockerFixed ? 'On ✓ Escrowed' : 'Off'}</span></div>
              </div>
            </div>

            <div className="hidden md:block p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-[11px] font-bold text-violet-300">🎯 Student Tip</p>
              <p className="text-[10px] text-violet-200/70 mt-1 leading-[1.3]">Actions in portal update this PC live — enable BitLocker in Intune tab, then check Get-BitLockerVolume here — real linkage, not disjointed.</p>
            </div>
          </div>

          <div className="flex-1 bg-[#0a0a0a] flex flex-col min-w-0 overflow-hidden">
            {activeApp === 'desktop' && (
              <div className="flex-1 p-3 md:p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-[16px] md:text-xl flex-shrink-0">◧</div>
                    <div className="min-w-0">
                      <div className="text-zinc-100 font-medium text-[13px] md:text-[14px] truncate">Windows 11 Pro • {ticket.userEmail.split('@')[0]}-LAPTOP</div>
                      <div className="text-[11px] text-zinc-500 truncate">Entra Joined • Intune Managed • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant — BitLocker Off'} • {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'Standard'}</div>
                    </div>
                  </div>
                  <div className="hidden md:block text-[11px] text-zinc-600">🔒 Secure • {new Date().toLocaleTimeString()} • 100% • 🔋</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {[
                    { icon: '◫', name: 'File Explorer', count: '3 pinned', alert: false },
                    { icon: '◩', name: 'Company Portal', count: localSyncDone ? 'Synced now ✓' : '1 update • Sync needed', alert: !localSyncDone },
                    { icon: '◑', name: 'Teams', count: localBitLockerFixed ? 'Online ✓' : 'Blocked — DeviceNotCompliant', alert: !localBitLockerFixed },
                    { icon: '◒', name: 'Outlook', count: localBitLockerFixed ? 'Online ✓' : 'Blocked', alert: !localBitLockerFixed },
                    { icon: '◪', name: 'Settings', count: 'Work/School', alert: false },
                    { icon: '◍', name: 'BitLocker', count: localBitLockerFixed ? 'On ✓ Escrowed to Entra ID' : 'Off • Not Compliant', alert: !localBitLockerFixed },
                    { icon: '◍', name: 'Defender', count: 'Protected ✓', alert: false },
                    { icon: '◫', name: 'PowerShell', count: 'Admin', alert: false },
                  ].map(app => (
                    <div key={app.name} className={`p-3 rounded-xl border transition cursor-pointer ${app.alert ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}>
                      <div className="text-[18px] md:text-xl mb-1">{app.icon}</div>
                      <div className="text-zinc-100 text-[12px] md:text-[13px] font-medium leading-tight truncate">{app.name}</div>
                      <div className={`text-[10px] md:text-[11px] leading-tight mt-1 break-words ${app.alert ? 'text-red-400' : 'text-zinc-500'}`}>{app.count}</div>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 md:mt-6 p-3 md:p-4 rounded-xl border ${localBitLockerFixed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-[16px] md:text-xl flex-shrink-0">{localBitLockerFixed ? '✓' : '⚠'}</span>
                    <div className="min-w-0">
                      <div className={`font-medium text-[12px] md:text-[13px] ${localBitLockerFixed ? 'text-emerald-300' : 'text-red-300'}`}>{localBitLockerFixed ? 'Device Compliant — Fixed ✓' : 'Device Compliance — Action Required'}</div>
                      <div className={`text-[11px] md:text-[12px] mt-1 leading-[1.4] break-words ${localBitLockerFixed ? 'text-emerald-200/70' : 'text-red-200/70'}`}>
                        {localBitLockerFixed ? `BitLocker enabled, key escrowed to Entra ID, device now Compliant. Teams and Outlook unblocked. Real linkage — portal action updated this PC.` : `Device not compliant per ${ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'company policy'}. Cannot access Teams, Outlook, SharePoint. Open Company Portal to fix. Error DeviceNotCompliant 53000 — enable BitLocker in Intune tab.`}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => setActiveApp('portal')} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition ${localBitLockerFixed ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>{localBitLockerFixed ? '✓ Fixed — Open Portal' : 'Open Company Portal'}</button>
                        <button onClick={() => setActiveApp('terminal')} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-[11px]">Run Diagnostics</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeApp === 'terminal' && (
              <div className="flex-1 bg-[#050507] flex flex-col font-mono text-[12px] min-h-0">
                <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
                  {terminalOutput.map((line, i) => (
                    <div key={i} className="text-zinc-300 text-[11px] whitespace-pre-wrap break-words leading-[1.4]">{line}</div>
                  ))}
                </div>
                <div className="border-t border-zinc-800 p-2 md:p-3 flex gap-2 flex-shrink-0">
                  <span className="text-violet-400 text-[11px] hidden md:inline">PS C:\&gt;</span>
                  <input value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => e.key === 'Enter' && runCommand()} placeholder="dsregcmd /status, Get-BitLockerVolume..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-white placeholder:text-zinc-600 outline-none text-[11px] min-w-0" />
                  <button onClick={runCommand} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-[11px] flex-shrink-0">Run</button>
                </div>
              </div>
            )}

            {activeApp === 'portal' && (
              <div className="flex-1 p-3 md:p-6 bg-zinc-50 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-[18px] md:text-xl flex-shrink-0">◩</div>
                      <div className="min-w-0">
                        <div className="font-bold text-[14px] md:text-[15px] truncate">Company Portal • {ticket.clientName}</div>
                        <div className="text-[11px] text-zinc-500 truncate">Intune Managed • Compliance {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'} • Real linkage to RDP</div>
                      </div>
                      <button onClick={() => { setLocalSyncDone(true); onAction?.(`Company Portal Sync — ${localBitLockerFixed ? 'All compliant' : 'BitLocker still failing'}`); }} className={`ml-auto h-8 px-3 rounded-full text-[11px] font-semibold border transition flex-shrink-0 ${localSyncDone ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20' : 'bg-zinc-900 text-white border-zinc-900'}`}>{localSyncDone ? '✓ Synced' : 'Sync'}</button>
                    </div>

                    <div className="border rounded-xl p-3 md:p-4">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${localBitLockerFixed ? 'bg-emerald-100' : 'bg-red-100'}`}>{localBitLockerFixed ? '✓' : '◍'}</div>
                          <div className="min-w-0">
                            <div className="font-medium text-[13px]">Device Compliance</div>
                            <div className="text-[11px] text-zinc-500 leading-tight">Check if device meets {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'company'} requirements — real linkage</div>
                          </div>
                        </div>
                        <span className={`px-2 md:px-3 py-1 rounded-full text-[11px] font-bold flex-shrink-0 ${localBitLockerFixed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</span>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className={`flex justify-between items-center gap-2 text-[11px] p-2.5 rounded-lg ${localBitLockerFixed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                          <span className="flex items-center gap-2 min-w-0"><span className="flex-shrink-0">{localBitLockerFixed ? '✓' : '◍'}</span><span className="truncate">BitLocker — Require encryption — {localBitLockerFixed ? 'On Escrowed' : 'Off'}</span></span>
                          <span className={`font-bold flex-shrink-0 ${localBitLockerFixed ? 'text-emerald-600' : 'text-red-600'}`}>{localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</span>
                        </div>
                        <div className="flex justify-between text-[11px] p-2 bg-emerald-50 rounded-lg"><span>✓ OS Version</span><span className="text-emerald-600">Compliant</span></div>
                        <div className="flex justify-between text-[11px] p-2 bg-emerald-50 rounded-lg"><span>✓ Defender</span><span className="text-emerald-600">Compliant</span></div>
                      </div>

                      <button onClick={() => { setLocalBitLockerFixed(true); onAction?.(`Enabled BitLocker for ${ticket.userEmail} — Protection On, key escrowed to Entra ID — RDP now Compliant ✓`); }} className={`w-full mt-4 h-10 rounded-full text-[13px] font-semibold transition ${localBitLockerFixed ? 'bg-emerald-600 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'}`}>{localBitLockerFixed ? '✓ BitLocker Enabled — RDP Updated ✓' : 'Fix BitLocker → Enable Encryption (Updates RDP Live)'}</button>
                      <p className="text-[10px] text-zinc-500 mt-2 text-center">Real linkage — enabling here updates Remote Desktop terminal + desktop + compliance — not disjointed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeApp === 'settings' && (
              <div className="flex-1 p-3 md:p-6 bg-zinc-50 overflow-y-auto">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-4">
                  <div className="font-bold text-[14px]">Settings → Accounts → Access work or school</div>
                  <div className="text-[11px] text-zinc-500 mt-1">MDM enrollment — real linkage for 0x80180024 fix</div>
                  <div className="mt-4 p-3 border rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">◩</div>
                      <div className="min-w-0"><div className="font-medium text-[13px] truncate">{ticket.userEmail}</div><div className="text-[11px] text-zinc-500 truncate">Connected to {ticket.clientName} • MDM Intune • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</div></div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] flex-shrink-0">Connected</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-10 bg-[#1a1a1a] border-t border-zinc-800 flex items-center justify-between px-3 text-[10px] md:text-[11px] text-zinc-500 gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 overflow-hidden">
            <span className="truncate hidden md:inline">🔒 Encrypted RDP • Session {Math.random().toString(36).substring(2, 8).toUpperCase()} • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</span>
            <span className="md:hidden truncate">🔒 RDP • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant'}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden md:inline">Actions logged • Real linkage portal↔RDP</span>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">● Live • {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
