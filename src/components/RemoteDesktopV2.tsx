'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

type ConnectionStage = 'connecting' | 'authenticating' | 'mfa' | 'consent' | 'connected';

export default function RemoteDesktopV2({ ticket, isOpen, onClose, onAction, bitLockerFixed = false, syncDone = false }: Props) {
  const [activeApp, setActiveApp] = useState<'desktop' | 'terminal' | 'portal' | 'explorer' | 'settings'>('desktop');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [stage, setStage] = useState<ConnectionStage>('connecting');
  const [localBitLockerFixed, setLocalBitLockerFixed] = useState(bitLockerFixed);
  const [localSyncDone, setLocalSyncDone] = useState(syncDone);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    setLocalBitLockerFixed(bitLockerFixed);
    setLocalSyncDone(syncDone);
  }, [bitLockerFixed, syncDone]);

  useEffect(() => {
    if (isOpen) {
      setStage('connecting');
      setTerminalOutput([]);
      setActiveApp('desktop');
      setShowConsent(false);

      // Realistic connection flow — like real RDP / Quick Assist
      const stages: { stage: ConnectionStage; delay: number; message?: string }[] = [
        { stage: 'connecting', delay: 800 },
        { stage: 'authenticating', delay: 1200, message: `Authenticating as Team Lead • ${ticket?.userEmail}` },
        { stage: 'mfa', delay: 1000, message: 'MFA verified • Authenticator app approved' },
        { stage: 'consent', delay: 600, message: 'Waiting for user consent...' },
        { stage: 'connected', delay: 800 },
      ];

      let current = 0;
      const runStage = () => {
        if (current >= stages.length) return;
        const s = stages[current];
        setStage(s.stage);
        if (s.message) {
          onAction?.(`RDP ${s.stage}: ${s.message}`);
        }
        if (s.stage === 'consent') {
          setShowConsent(true);
        } else {
          setTimeout(() => {
            current++;
            if (current < stages.length) {
              if (stages[current].stage === 'connected') {
                setTerminalOutput([
                  `✓ Secure connection established to ${ticket?.userEmail.split('@')[0]}-LAPTOP`,
                  `✓ Session: ${Math.random().toString(36).substring(2, 8).toUpperCase()}-RDP • Encrypted TLS 1.3 • Recording ON`,
                  `✓ User: ${ticket?.userEmail} • Client: ${ticket?.clientName} • ${ticket?.clientId === 'client-c' ? 'SEC-2024-07 Strict' : 'Standard'}`,
                  `✓ Compliance: ${localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant — BitLocker Off (DeviceNotCompliant 53000)'} • Entra Joined • Intune Managed`,
                  `✓ Consent: User approved remote session at ${new Date().toLocaleTimeString()} • Audit logged`,
                  ``,
                  `Real IT Support Workflow:`,
                  `1. User called helpdesk: "${ticket?.title}"`,
                  `2. You checked Entra Sign-in Logs → Found ${ticket?.errorCodes[0] || 'DeviceNotCompliant'} blocked by CA`,
                  `3. Now in RDP: Run dsregcmd /status to verify device state, Get-BitLockerVolume to check encryption`,
                  `4. Fix in Intune portal → Sync Company Portal → device becomes Compliant`,
                  ``,
                  `Commands: dsregcmd /status, ipconfig, whoami, Get-BitLockerVolume, dir, CompanyPortal Sync`,
                  `Tip: This is real Windows 11 desktop simulation — try File Explorer, Company Portal, Terminal`,
                  ``
                ]);
              }
              runStage();
            } else {
              runStage();
            }
          }, s.delay);
        }
      };
      runStage();
    }
  }, [isOpen, ticket]);

  const handleConsent = (approved: boolean) => {
    if (approved) {
      setShowConsent(false);
      setStage('connected');
      setTerminalOutput([
        `✓ User consent granted at ${new Date().toLocaleTimeString()} • Session approved`,
        `✓ Secure connection established to ${ticket?.userEmail.split('@')[0]}-LAPTOP`,
        `✓ Session: ${Math.random().toString(36).substring(2, 8).toUpperCase()}-RDP • Encrypted TLS 1.3 • Recording ON • Audit HMAC-signed`,
        `✓ Compliance: ${localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant — BitLocker Off'} • ${ticket?.clientId === 'client-c' ? 'SEC-2024-07' : 'Standard'}`,
        ``,
        `Welcome to ${ticket?.userEmail.split('@')[0]}-LAPTOP — Windows 11 Pro`,
        `Real IT: You are now remotely controlling user's PC with their permission — like Quick Assist / Remote Help`,
        ``
      ]);
      onAction?.(`RDP consent: User ${ticket?.userEmail} approved remote session — encrypted, recording, audit logged — real workflow`);
    } else {
      onAction?.(`RDP consent: User declined — session ended per policy`);
      onClose();
    }
  };

  const runCommand = () => {
    if (!command.trim()) return;
    onAction?.(`RDP: ${command} on ${ticket?.userEmail} — real command execution`);
    let output = [...terminalOutput, `PS C:\\Users\\${ticket?.userEmail.split('@')[0]}> ${command}`];
    
    const cmd = command.toLowerCase();
    
    if (cmd.includes('dsregcmd /status')) {
      output.push(
        ``,
        `+----------------------------------------------------------------------+`,
        `| Device State                                                         |`,
        `+----------------------------------------------------------------------+`,
        `  AzureAdJoined : YES`,
        `  EnterpriseJoined : NO`,
        `  DomainJoined : NO`,
        `  DeviceId : ${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}`,
        `  Thumbprint : ${Math.random().toString(36).substring(2, 18).toUpperCase()}`,
        `+----------------------------------------------------------------------+`,
        `| User State                                                           |`,
        `+----------------------------------------------------------------------+`,
        `  NgcSet : YES`,
        `  WorkplaceJoined : NO`,
        `  WamDefaultSet : YES`,
        `+----------------------------------------------------------------------+`,
        `| SSO State                                                            |`,
        `+----------------------------------------------------------------------+`,
        `  AzureAdPrt : YES`,
        `  AzureAdPrtAuthority : https://login.microsoftonline.com/...`,
        `+----------------------------------------------------------------------+`,
        `| Device Details                                                       |`,
        `+----------------------------------------------------------------------+`,
        `  DeviceAuthStatus : SUCCESS`,
        `  MdmUrl : https://enrollment.manage.microsoft.com/enrollmentserver/discovery.svc`,
        `  MdmTouUrl : https://portal.manage.microsoft.com/TermsOfUse.aspx`,
        `  Compliance : ${localBitLockerFixed ? 'YES ✓ Compliant — BitLocker On, key escrowed to Entra ID' : 'NO — DeviceNotCompliant 53000 — BitLocker Off, enable in Company Portal'}`,
        `  ComplianceServerError : ${localBitLockerFixed ? 'None' : 'DeviceNotCompliant - BitLocker required per ' + (ticket?.clientId === 'client-c' ? 'SEC-2024-07' : 'company policy')}`,
        ``,
        `Real: This is actual dsregcmd output from Windows — shows if device is Entra Joined and Compliant. If Compliance NO, check Intune.`,
        ``
      );
    } else if (cmd.includes('ipconfig')) {
      output.push(
        ``,
        `Windows IP Configuration`,
        ``,
        `Ethernet adapter Ethernet:`,
        `   Connection-specific DNS Suffix  . : ${ticket?.clientName.toLowerCase().replace(/[^a-z]/g, '')}.local`,
        `   IPv4 Address. . . . . . . . . . . : 192.168.1.${Math.floor(Math.random()*100)+10}`,
        `   Subnet Mask . . . . . . . . . . . : 255.255.255.0`,
        `   Default Gateway . . . . . . . . . : 192.168.1.1`,
        `   DNS Servers . . . . . . . . . . . : 10.0.0.4, 10.0.0.5 (Entra DNS)`,
        `   NetBIOS over Tcpip. . . . . . . . : Enabled`,
        ``,
        `Real: Check if device can reach Entra/Intune endpoints — DNS 10.0.0.4 is Entra`,
        ``
      );
    } else if (cmd.includes('whoami')) {
      output.push(``, `${ticket?.clientName.toUpperCase()}\\${ticket?.userEmail.split('@')[0]}`, `Real: Shows logged-in user — should match ticket user`, ``);
    } else if (cmd.includes('dir') || cmd.includes('ls')) {
      output.push(
        ``,
        ` Directory of C:\\Users\\${ticket?.userEmail.split('@')[0]}\\Documents`,
        ``,
        `09/15/2026  09:12 AM    <DIR>          .`,
        `09/15/2026  09:12 AM    <DIR>          ..`,
        `09/15/2026  09:10 AM             2,345  Payroll_Report_Q3.xlsx`,
        `09/15/2026  09:08 AM            12,456  Presentation.pptx`,
        `09/14/2026  03:22 PM             1,234  Notes.txt`,
        `               3 File(s)         16,035 bytes`,
        `Real: File Explorer shows same files — try opening File Explorer app`,
        ``
      );
    } else if (cmd.includes('get-bitlockervolume') || cmd.includes('manage-bde')) {
      const complianceMsg = ticket?.clientId === 'client-c' ? 'SEC-2024-07 requires BitLocker encryption with key escrow' : 'Company policy requires device encryption';
      output.push(
        ``,
        `ComputerName: ${ticket?.userEmail.split('@')[0]}-LAPTOP`,
        ``,
        `VolumeType      Mount CapacityGB VolumeStatus           Encryption KeyProtector              AutoUnlock ProtectionStatus`,
        `----------      ----- ---------- ------------           ---------- ------------              ---------- ----------------`,
        `OperatingSystem C:         237.23 ${localBitLockerFixed ? 'FullyEncrypted' : 'FullyDecrypted'}         ${localBitLockerFixed ? 'XtsAes256' : 'None'}       {${localBitLockerFixed ? 'RecoveryPassword' : 'None'}}              ${localBitLockerFixed ? 'Enabled' : 'Disabled'}   ${localBitLockerFixed ? 'On ✓' : 'Off'}`,
        ``,
        `  Key Protectors:`,
        `    ${localBitLockerFixed ? `RecoveryPassword : Key ID {${Math.random().toString(36).substring(2,10)}} — Escrowed to Entra ID at ${new Date().toLocaleTimeString()} ✓` : `None — NOT ENCRYPTED — Data at risk`}`,
        ``,
        `  Compliance: ${localBitLockerFixed ? 'Compliant ✓ — BitLocker On, key escrowed to Entra ID → Devices → BitLocker keys (for recovery)' : `Not Compliant — ${complianceMsg} — Enable in Company Portal → Device Compliance → BitLocker → Enable`}`,
        ``,
        `Real: Get-BitLockerVolume shows encryption status — if Protection Off, enable in Company Portal or Settings → Privacy → Device encryption`,
        ``
      );
    } else if (cmd.includes('companyportal') || cmd.includes('sync')) {
      setLocalSyncDone(true);
      output.push(
        ``,
        `✓ Company Portal Sync initiated at ${new Date().toLocaleTimeString()}`,
        `  Device: ${ticket?.userEmail.split('@')[0]}-LAPTOP • User: ${ticket?.userEmail}`,
        `  Enrollment: YES — MDM: https://enrollment.manage.microsoft.com`,
        `  Last sync: ${new Date().toLocaleTimeString()} (forced, real: normally every 8h)`,
        `  Compliance check:`,
        `    - BitLocker: ${localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant — still failing, enable in portal'}`,
        `    - Defender: Compliant ✓ (Real-time ON, Tamper protection)`,
        `    - OS Version: Compliant ✓ (10.0.22621)`,
        `    - Secure Boot: ${ticket?.clientId === 'client-c' ? 'Compliant ✓ (SEC-2024-07)' : 'Compliant ✓'}`,
        `  Result: ${localBitLockerFixed ? '✓ All compliant — device will show Compliant in Entra/Intune in 2-5 mins, user can access Teams/Outlook' : '⚠ 1 failure — BitLocker needs manual enable in Intune portal → then Sync again'}`,
        ``,
        `Real: Company Portal Sync forces Intune to re-evaluate compliance immediately — otherwise waits 8h auto check-in`,
        ``
      );
      onAction?.(`Company Portal Sync — ${localBitLockerFixed ? 'All compliant now — real linkage portal↔RDP' : 'BitLocker still failing — need to enable in portal first'}`);
    } else if (cmd.includes('clear') || cmd.includes('cls')) {
      output = [];
    } else {
      output.push(``, `'${command}' is not recognized as cmdlet — Real: Try dsregcmd /status, Get-BitLockerVolume, ipconfig, whoami, dir`, `Real: In PowerShell, you need correct syntax — this teaches real commands`, ``);
    }

    setTerminalOutput(output);
    setCommand('');
  };

  if (!isOpen || !ticket) return null;

  const stageInfo = {
    connecting: { icon: '🔌', text: 'Connecting to remote PC...', sub: `Resolving ${ticket.userEmail.split('@')[0]}-LAPTOP.${ticket.clientName.toLowerCase().replace(/[^a-z]/g, '')}.local • TLS 1.3` },
    authenticating: { icon: '🔐', text: 'Authenticating as Team Lead...', sub: `Entra ID • ${ticket.clientName} • Conditional Access check • Device compliance` },
    mfa: { icon: '📱', text: 'MFA Verification...', sub: 'Authenticator app • Approved at 09:12:34 • Location Nairobi Trusted • Compliant device' },
    consent: { icon: '👤', text: 'Waiting for user consent...', sub: `${ticket.userEmail} must approve remote session — like Quick Assist — audit logged` },
    connected: { icon: '✅', text: 'Connected • Encrypted • Recording', sub: `Session ${Math.random().toString(36).substring(2,8).toUpperCase()}-RDP • Audit HMAC-signed • Client consent granted` },
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[90] flex items-center justify-center p-2 md:p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-[#0a0a0a] rounded-[20px] shadow-2xl w-full max-w-[1280px] h-[92vh] md:h-[88vh] overflow-hidden border border-zinc-800 flex flex-col">
        {/* Title bar — Windows 11 style */}
        <div className="h-12 bg-[#202020] border-b border-zinc-800 flex items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            </div>
            <Logo variant="icon" size={22} />
            <span className="text-[13px] font-medium text-zinc-200 truncate">Remote Desktop — {ticket.userEmail.split('@')[0]}-LAPTOP • {ticket.clientName} • Quick Assist Style</span>
            <span className={`hidden md:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${stage === 'connected' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
              {stageInfo[stage].icon} {stageInfo[stage].text}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden lg:inline text-[11px] text-zinc-500 truncate max-w-[250px]">{ticket.userEmail} • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant • 53000'} • {stageInfo[stage].sub}</span>
            <button onClick={onClose} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 text-[14px]">✕</button>
          </div>
        </div>

        {/* Connection stages — like real RDP */}
        <AnimatePresence>
          {stage !== 'connected' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#0a0a0a] p-8 flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-[400px] space-y-6">
                <div className="text-center">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-20 h-20 mx-auto bg-violet-600/20 rounded-full flex items-center justify-center text-3xl border border-violet-500/20">
                    {stageInfo[stage].icon}
                  </motion.div>
                  <h3 className="mt-4 font-bold text-[18px] text-white">{stageInfo[stage].text}</h3>
                  <p className="mt-2 text-[12px] text-zinc-500 leading-[1.4]">{stageInfo[stage].sub}</p>
                </div>

                <div className="space-y-2">
                  {(['connecting', 'authenticating', 'mfa', 'consent', 'connected'] as ConnectionStage[]).map((s, idx) => {
                    const isDone = ['connecting', 'authenticating', 'mfa', 'consent', 'connected'].indexOf(stage) > idx;
                    const isCurrent = stage === s;
                    return (
                      <div key={s} className={`flex items-center gap-3 p-2.5 rounded-xl border text-[12px] ${isCurrent ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : isDone ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300/70' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] ${isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-violet-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>{isDone ? '✓' : idx + 1}</span>
                        <span className="font-medium">{s === 'connecting' ? 'Connecting to remote PC' : s === 'authenticating' ? 'Authenticating as Team Lead (Entra ID)' : s === 'mfa' ? 'MFA Verification (Authenticator)' : s === 'consent' ? 'User Consent (Quick Assist style)' : 'Connected • Encrypted • Recording'}</span>
                        {isCurrent && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />}
                      </div>
                    );
                  })}
                </div>

                {showConsent && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-[13px] font-bold text-amber-300">👤 User Consent Required — Real Workflow</p>
                    <p className="text-[11px] text-amber-200/70 mt-2 leading-[1.4]">
                      In real IT support (Quick Assist / Remote Help), user must approve remote session. {ticket.userEmail} sees prompt: "Team Lead wants to connect to your PC — Allow? Session will be encrypted, recorded, audit logged per {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'company policy'}."
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => handleConsent(false)} className="flex-1 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium text-[13px]">Deny — Per Policy</button>
                      <button onClick={() => handleConsent(true)} className="flex-1 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[13px]">✓ Allow — User Approved</button>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[11px] font-bold text-zinc-400">🔒 Security — Real RDP security for beginners:</p>
                  <ul className="mt-2 space-y-1 text-[10px] text-zinc-500 list-disc list-inside">
                    <li>TLS 1.3 encrypted, Session ID {Math.random().toString(36).substring(2,8).toUpperCase()}-RDP, recording ON, audit HMAC-signed</li>
                    <li>Conditional Access checked: Require compliant device + MFA + Trusted location Nairobi</li>
                    <li>User consent required per {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'company policy'} — prevents unauthorized access</li>
                    <li>All actions logged: dsregcmd, Get-BitLockerVolume, Company Portal Sync — for audit and RCA</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 'connected' && (
          <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
            {/* Sidebar — Windows 11 style */}
            <div className="w-full md:w-60 bg-[#1a1a1a] border-b md:border-b-0 md:border-r border-zinc-800 p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {[
                { id: 'desktop', icon: '🖥️', label: 'Desktop', desc: 'Win11 Pro • Real', color: 'blue' },
                { id: 'explorer', icon: '📁', label: 'File Explorer', desc: 'Documents • 3 files', color: 'amber' },
                { id: 'terminal', icon: '💻', label: 'Terminal', desc: 'PowerShell • Admin', color: 'violet' },
                { id: 'portal', icon: '🏢', label: 'Company Portal', desc: syncDone ? 'Synced now ✓' : 'Sync needed • 1 update', color: 'blue' },
                { id: 'settings', icon: '⚙️', label: 'Settings', desc: 'Work/School • Entra', color: 'zinc' },
              ].map(app => (
                <button key={app.id} onClick={() => setActiveApp(app.id as any)} className={`flex md:flex-row flex-col items-center md:items-start gap-2 p-2.5 rounded-xl text-[11px] transition flex-shrink-0 border ${activeApp === app.id ? 'bg-zinc-100 text-zinc-900 border-zinc-100 shadow' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'}`}>
                  <span className="text-[18px]">{app.icon}</span>
                  <div className="text-center md:text-left min-w-0">
                    <div className="font-semibold leading-tight truncate">{app.label}</div>
                    <div className="text-[10px] opacity-70 leading-tight hidden md:block truncate">{app.desc}</div>
                  </div>
                  {app.id === 'portal' && !localSyncDone && <span className="hidden md:block ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                </button>
              ))}
              
              <div className="hidden md:block mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Session — Real IT Support</p>
                <div className="mt-2.5 space-y-2 text-[11px]">
                  <div className="flex justify-between gap-2"><span className="text-zinc-600">Client:</span><span className="text-zinc-200 truncate font-medium">{ticket.clientName}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-zinc-600">User:</span><span className="text-zinc-200 truncate">{ticket.userEmail.split('@')[0]}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-zinc-600">PC:</span><span className="text-zinc-200 truncate">{ticket.userEmail.split('@')[0]}-LAPTOP</span></div>
                  <div className="flex justify-between gap-2"><span className="text-zinc-600">Compliance:</span><span className={`${localBitLockerFixed ? 'text-emerald-400' : 'text-red-400'} truncate font-bold`}>{localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant • 53000'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-zinc-600">BitLocker:</span><span className={`${localBitLockerFixed ? 'text-emerald-400' : 'text-red-400'} truncate`}>{localBitLockerFixed ? 'On ✓ Escrowed' : 'Off • Fix needed'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-zinc-600">Session:</span><span className="text-zinc-400 font-mono text-[10px] truncate">{Math.random().toString(36).substring(2,8).toUpperCase()}-RDP</span></div>
                </div>
              </div>

              <div className="hidden md:block p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <p className="text-[11px] font-bold text-violet-300">🎯 For Beginners — Real Workflow</p>
                <p className="text-[10px] text-violet-200/70 mt-1.5 leading-[1.4]">
                  In real IT, you connect via Quick Assist / Remote Help with user consent. Then you run <strong>dsregcmd /status</strong> to check Entra join, <strong>Get-BitLockerVolume</strong> to check encryption, fix in Company Portal, Sync. This RDP simulates that — try Terminal and File Explorer.
                </p>
              </div>
            </div>

            <div className="flex-1 bg-[#0a0a0a] flex flex-col min-w-0 overflow-hidden">
              {activeApp === 'desktop' && (
                <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-br from-[#0a0a0a] to-[#111111]">
                  <div className="flex items-center justify-between mb-6 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">🖥️</div>
                      <div className="min-w-0">
                        <div className="text-zinc-100 font-bold text-[15px] truncate">Windows 11 Pro • {ticket.userEmail.split('@')[0]}-LAPTOP</div>
                        <div className="text-[11px] text-zinc-500 truncate">Entra Joined • Intune Managed • {localBitLockerFixed ? 'Compliant ✓ • Teams Online • Outlook Online' : 'Not Compliant — BitLocker Off • Teams Blocked • Outlook Blocked (53000)'} • {ticket.clientId === 'client-c' ? 'SEC-2024-07 Strict' : 'Standard'}</div>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-600">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">🔒 Encrypted TLS 1.3</span>
                      <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">● REC</span>
                      <span>{new Date().toLocaleTimeString()} • 100% • 🔋</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: '📁', name: 'File Explorer', count: 'Documents • 3 files • Real', alert: false, action: () => setActiveApp('explorer') },
                      { icon: '🏢', name: 'Company Portal', count: localSyncDone ? 'Synced now ✓ • All compliant' : '1 update • Sync needed • Real: Intune', alert: !localSyncDone, action: () => setActiveApp('portal') },
                      { icon: '💬', name: 'Teams', count: localBitLockerFixed ? 'Online ✓ • Chat • Meetings' : 'Blocked — DeviceNotCompliant 53000 • Real: CA blocks', alert: !localBitLockerFixed, action: () => {} },
                      { icon: '📧', name: 'Outlook', count: localBitLockerFixed ? 'Online ✓ • Inbox • Calendar' : 'Blocked — Compliance NO • Real', alert: !localBitLockerFixed, action: () => {} },
                      { icon: '⚙️', name: 'Settings', count: 'Work/School • Entra Joined • MDM', alert: false, action: () => setActiveApp('settings') },
                      { icon: '🔐', name: 'BitLocker', count: localBitLockerFixed ? 'On ✓ Escrowed to Entra ID • Recovery key saved' : 'Off • Not Compliant • Data at risk • Fix in portal', alert: !localBitLockerFixed, action: () => setActiveApp('portal') },
                      { icon: '🛡️', name: 'Defender', count: 'Protected ✓ • Real-time ON • Tamper • Definitions up-to-date', alert: false, action: () => {} },
                      { icon: '💻', name: 'PowerShell', count: 'Admin • dsregcmd • Get-BitLockerVolume • Real commands', alert: false, action: () => setActiveApp('terminal') },
                    ].map(app => (
                      <div key={app.name} onClick={app.action} className={`p-4 rounded-xl border transition cursor-pointer group ${app.alert ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'}`}>
                        <div className="text-[22px] mb-2 group-hover:scale-105 transition">{app.icon}</div>
                        <div className="text-zinc-100 text-[13px] font-semibold leading-tight truncate">{app.name}</div>
                        <div className={`text-[11px] leading-[1.3] mt-1.5 break-words ${app.alert ? 'text-red-400' : 'text-zinc-500'}`}>{app.count}</div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-6 p-4 rounded-xl border ${localBitLockerFixed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                    <div className="flex gap-3">
                      <span className="text-[20px] flex-shrink-0">{localBitLockerFixed ? '✅' : '⚠️'}</span>
                      <div className="min-w-0 flex-1">
                        <div className={`font-bold text-[13px] ${localBitLockerFixed ? 'text-emerald-300' : 'text-red-300'}`}>{localBitLockerFixed ? 'Device Compliant — Fixed ✓ — Real Workflow Success' : 'Device Not Compliant — Action Required — Real IT Support Scenario'}</div>
                        <div className={`text-[12px] mt-2 leading-[1.5] break-words ${localBitLockerFixed ? 'text-emerald-200/70' : 'text-red-200/70'}`}>
                          {localBitLockerFixed ? `BitLocker enabled at ${new Date().toLocaleTimeString()}, key escrowed to Entra ID → Devices → BitLocker keys, device now Compliant. Teams and Outlook unblocked. User ${ticket.userEmail} can access M365. This is real linkage — your portal action updated this PC, just like in production.` : `In real IT support, when user is blocked by Conditional Access error DeviceNotCompliant 53000, you check Intune compliance and find BitLocker Off. You guide user to Company Portal → Enable BitLocker → Sync. Device encrypts, key escrowed, becomes Compliant in 2-5 mins. That's exactly what you need to do here — click Company Portal → Fix BitLocker.`}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button onClick={() => setActiveApp('portal')} className={`px-4 py-2 rounded-full text-[12px] font-bold transition ${localBitLockerFixed ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>{localBitLockerFixed ? '✓ Fixed — View Portal' : 'Fix Now → Company Portal (Real Steps)'}</button>
                          <button onClick={() => setActiveApp('terminal')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-[12px] font-medium">Run Diagnostics → Terminal</button>
                          <button onClick={() => setActiveApp('explorer')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-[12px] font-medium">Open File Explorer</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[11px] font-bold text-zinc-400">💻 Real Windows 11 Desktop — For Beginners:</p>
                    <p className="text-[11px] text-zinc-500 mt-1.5 leading-[1.4]">This is simulation of user's actual PC. In real Quick Assist, you see user's desktop, can open File Explorer to check files, open Company Portal to fix compliance, open Terminal to run dsregcmd. You are controlling their PC with permission — like you are sitting at their desk. All actions are logged for audit per {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'company policy'}.</p>
                  </div>
                </div>
              )}

              {activeApp === 'explorer' && (
                <div className="flex-1 bg-[#1e1e1e] flex flex-col">
                  <div className="h-10 bg-[#2d2d2d] border-b border-zinc-800 flex items-center px-4 gap-2">
                    <span className="text-[12px]">📁</span>
                    <span className="text-[12px] text-zinc-300">File Explorer — C:\Users\{ticket.userEmail.split('@')[0]}\Documents</span>
                    <span className="ml-auto text-[10px] text-zinc-600">Real: Check user's files — like real RDP</span>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="bg-[#252525] rounded-xl border border-zinc-800 overflow-hidden">
                      <div className="p-3 bg-[#2d2d2d] border-b border-zinc-800 grid grid-cols-4 gap-2 text-[11px] font-bold text-zinc-400">
                        <span>Name</span><span>Date modified</span><span>Type</span><span>Size</span>
                      </div>
                      {[
                        { name: 'Payroll_Report_Q3.xlsx', date: '09/15/2026 09:10 AM', type: 'Excel', size: '2,345 KB', icon: '📊' },
                        { name: 'Presentation.pptx', date: '09/15/2026 09:08 AM', type: 'PowerPoint', size: '12,456 KB', icon: '📈' },
                        { name: 'Notes.txt', date: '09/14/2026 03:22 PM', type: 'Text', size: '1 KB', icon: '📝' },
                      ].map(f => (
                        <div key={f.name} className="p-3 grid grid-cols-4 gap-2 text-[11px] border-t border-zinc-800/50 hover:bg-zinc-800/50">
                          <span className="text-zinc-200 flex items-center gap-2 truncate"><span>{f.icon}</span>{f.name}</span>
                          <span className="text-zinc-500">{f.date}</span>
                          <span className="text-zinc-500">{f.type}</span>
                          <span className="text-zinc-500">{f.size}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-[11px] font-bold text-blue-300">💡 Real: In RDP, you can open File Explorer to verify user's files, check if BitLocker recovery key file exists, etc.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeApp === 'terminal' && (
                <div className="flex-1 bg-[#0c0c0c] flex flex-col font-mono text-[12px] min-h-0">
                  <div className="h-8 bg-[#1a1a1a] border-b border-zinc-800 flex items-center px-3 gap-2">
                    <span className="text-[11px] text-zinc-400">💻 PowerShell — Administrator — Real Commands</span>
                    <span className="ml-auto text-[10px] text-zinc-600">Real: dsregcmd, Get-BitLockerVolume, ipconfig, whoami</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
                    {terminalOutput.map((line, i) => (
                      <div key={i} className="text-zinc-300 text-[11px] whitespace-pre-wrap break-words leading-[1.5]">{line}</div>
                    ))}
                  </div>
                  <div className="border-t border-zinc-800 p-3 flex gap-2 flex-shrink-0 bg-[#1a1a1a]">
                    <span className="text-violet-400 text-[11px] hidden md:inline mt-1.5">PS C:\&gt;</span>
                    <input value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => e.key === 'Enter' && runCommand()} placeholder="Type real command: dsregcmd /status, Get-BitLockerVolume, ipconfig..." className="flex-1 bg-[#0c0c0c] border border-zinc-800 rounded-full px-4 py-2 text-white placeholder:text-zinc-600 outline-none text-[11px] min-w-0 focus:border-violet-500/50" />
                    <button onClick={runCommand} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-[11px] font-bold flex-shrink-0">Run → Real</button>
                  </div>
                </div>
              )}

              {activeApp === 'portal' && (
                <div className="flex-1 p-4 md:p-6 bg-zinc-50 overflow-y-auto">
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">🏢</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-[15px] truncate">Company Portal • {ticket.clientName} • Real Intune</div>
                          <div className="text-[11px] text-zinc-500 truncate">Intune Managed • Compliance {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant • Real: This is where user fixes'} • Real linkage to RDP</div>
                        </div>
                        <button onClick={() => { setLocalSyncDone(true); onAction?.(`Company Portal Sync — Real: Forces Intune check-in immediately, normally every 8h — ${localBitLockerFixed ? 'All compliant now' : 'BitLocker still failing, enable first'}`); }} className={`ml-auto h-9 px-4 rounded-full text-[11px] font-bold border transition flex-shrink-0 ${localSyncDone ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20' : 'bg-zinc-900 text-white border-zinc-900 hover:bg-black'}`}>{localSyncDone ? '✓ Synced Now (Real: Forced)' : 'Sync → Force Check-in (Real)'}</button>
                      </div>

                      <div className="border rounded-xl p-4">
                        <div className="flex justify-between items-center gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${localBitLockerFixed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{localBitLockerFixed ? '✓' : '⚠️'}</div>
                            <div className="min-w-0">
                              <div className="font-bold text-[14px]">Device Compliance — Real Check</div>
                              <div className="text-[11px] text-zinc-500 leading-tight">Real: Check if device meets {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'company'} requirements — this is why user blocked in Entra</div>
                            </div>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 ${localBitLockerFixed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant • Fix needed'}</span>
                        </div>
                        
                        <div className="mt-5 space-y-3">
                          <div className={`flex justify-between items-center gap-3 text-[11px] p-3 rounded-xl border-2 ${localBitLockerFixed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="min-w-0">
                              <div className="font-bold flex items-center gap-2"><span>{localBitLockerFixed ? '✅' : '🔴'}</span>BitLocker — Require device encryption</div>
                              <div className="text-[10px] text-zinc-600 mt-1">Real: Encrypts entire drive, protects data if laptop stolen. Key escrowed to Entra ID for recovery. If Off, Not Compliant per policy.</div>
                            </div>
                            <span className={`font-bold flex-shrink-0 text-[12px] ${localBitLockerFixed ? 'text-emerald-600' : 'text-red-600'}`}>{localBitLockerFixed ? 'Compliant ✓ Escrowed' : 'Not Compliant'}</span>
                          </div>
                          <div className="flex justify-between text-[11px] p-3 bg-emerald-50 rounded-xl border border-emerald-200"><span className="flex items-center gap-2"><span>✅</span>OS Version - Minimum 10.0.19045 — Security patches</span><span className="text-emerald-600 font-bold">Compliant</span></div>
                          <div className="flex justify-between text-[11px] p-3 bg-emerald-50 rounded-xl border border-emerald-200"><span className="flex items-center gap-2"><span>✅</span>Defender - Real-time ON • Tamper protection • Definitions up-to-date</span><span className="text-emerald-600 font-bold">Compliant</span></div>
                        </div>

                        <button onClick={() => { setLocalBitLockerFixed(true); onAction?.(`Enabled BitLocker for ${ticket.userEmail} — Real: Company Portal → Device Compliance → BitLocker → Enable, or Settings → Privacy → Device encryption → Turn on — key escrowed to Entra ID, RDP now Compliant ✓`); }} className={`w-full mt-6 h-12 rounded-full text-[13px] font-bold transition ${localBitLockerFixed ? 'bg-emerald-600 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20'}`}>{localBitLockerFixed ? '✅ BitLocker Enabled — RDP Updated ✓ — Real Success' : 'Fix BitLocker → Enable Encryption (Real: Updates RDP Live, like production)'}</button>
                        <p className="text-[11px] text-zinc-500 mt-3 text-center leading-[1.4]">Real linkage — enabling here updates Remote Desktop terminal + desktop + compliance in real-time — not disjointed, like actual Intune → device sync. In real IT, after enabling, you click Sync to force immediate compliance check.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeApp === 'settings' && (
                <div className="flex-1 p-4 md:p-6 bg-zinc-50 overflow-y-auto">
                  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-5">
                    <div className="font-bold text-[15px] flex items-center gap-2">⚙️ Settings → Accounts → Access work or school <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">Real: MDM enrollment</span></div>
                    <div className="text-[11px] text-zinc-500 mt-2">Real: This is where you check if device is Entra Joined + Intune Managed — for 0x80180024 stale enrollment fix, you Disconnect + dsregcmd /leave + delete stale device in Entra</div>
                    <div className="mt-5 p-4 border rounded-xl flex items-center justify-between gap-3 bg-zinc-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">🏢</div>
                        <div className="min-w-0"><div className="font-bold text-[13px] truncate">{ticket.userEmail}</div><div className="text-[11px] text-zinc-500 truncate">Connected to {ticket.clientName} • MDM: Intune • Entra Joined • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant • BitLocker Off'} • Real</div></div>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold flex-shrink-0">Connected • Real</span>
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-[11px] font-bold text-blue-700">💡 Real workflow for 0x80180024 (stale enrollment):</p>
                      <ol className="mt-2 space-y-1 text-[11px] text-blue-600/70 list-decimal list-inside">
                        <li>Settings → Accounts → Access work or school → Select work account → Disconnect</li>
                        <li>Run <code className="bg-black/10 px-1 rounded">dsregcmd /leave</code> in Terminal (admin)</li>
                        <li>Delete stale device in Entra ID → Devices → Search → Delete</li>
                        <li>Re-enroll: Company Portal → Enroll device</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="h-11 bg-[#202020] border-t border-zinc-800 flex items-center justify-between px-4 text-[11px] text-zinc-500 gap-3">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <span className="flex items-center gap-2 truncate"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />🔒 Encrypted RDP • Session {Math.random().toString(36).substring(2, 8).toUpperCase()} • {localBitLockerFixed ? 'Compliant ✓' : 'Not Compliant • 53000'} • Recording ON • Audit HMAC-signed</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden md:inline">Real: Actions logged • User consent • {ticket.clientId === 'client-c' ? 'SEC-2024-07' : 'Standard'} • Quick Assist style</span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20">● Live • {new Date().toLocaleTimeString()} • Real Feel</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
