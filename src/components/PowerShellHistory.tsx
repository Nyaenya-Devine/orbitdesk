/**
 * © 2026 Devine Nyaenya — OrbitDesk Proprietary
 * PowerShell History Viewer — Like ADAC (Active Directory Administrative Center)
 * Shows cmdlet behind every UI action
 */

'use client';
import { useState, useEffect } from 'react';

export interface PowerShellCommand {
  id: string;
  timestamp: number;
  cmdlet: string;
  parameters: string;
  user: string;
  object: string;
  result: 'success' | 'error';
  durationMs: number;
}

const mockHistory: PowerShellCommand[] = [
  { id: '1', timestamp: Date.now() - 1000*60*2, cmdlet: 'Get-ADUser', parameters: '-Identity "Sarah Finance" -Properties MemberOf, LockedOut, Enabled, LastLogon', user: 'Priya Shah', object: 'Sarah Finance', result: 'success', durationMs: 120 },
  { id: '2', timestamp: Date.now() - 1000*60*5, cmdlet: 'Unlock-ADAccount', parameters: '-Identity "John Payroll"', user: 'Alex Mwangi', object: 'John Payroll', result: 'success', durationMs: 85 },
  { id: '3', timestamp: Date.now() - 1000*60*12, cmdlet: 'Set-ADAccountPassword', parameters: '-Identity "Sarah Finance" -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "Temp123!" -Force)', user: 'Priya Shah', object: 'Sarah Finance', result: 'success', durationMs: 210 },
  { id: '4', timestamp: Date.now() - 1000*60*18, cmdlet: 'Add-ADGroupMember', parameters: '-Identity "Payroll-Access" -Members "Sarah Finance"', user: 'You (Team Lead)', object: 'Payroll-Access', result: 'success', durationMs: 95 },
  { id: '5', timestamp: Date.now() - 1000*60*25, cmdlet: 'Get-ADUser', parameters: '-Filter {LockedOut -eq $true} -Properties LockedOut', user: 'System', object: 'Domain', result: 'success', durationMs: 150 },
];

export default function PowerShellHistory({ commands, onClear }: { commands?: PowerShellCommand[], onClear?: () => void }) {
  const [history, setHistory] = useState<PowerShellCommand[]>(mockHistory);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (commands) setHistory(commands);
  }, [commands]);

  const filtered = history.filter(c => 
    !filter || c.cmdlet.toLowerCase().includes(filter.toLowerCase()) || c.object.toLowerCase().includes(filter.toLowerCase()) || c.user.toLowerCase().includes(filter.toLowerCase())
  );

  const copyCommand = (cmd: PowerShellCommand) => {
    const full = `${cmd.cmdlet} ${cmd.parameters}`;
    navigator.clipboard.writeText(full).catch(()=>{});
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden">
      <div className="p-3 border-b border-zinc-800/60 bg-zinc-900/50 flex items-center gap-2">
        <span className="text-[14px]">💻</span>
        <h3 className="text-[12px] font-semibold text-zinc-100">PowerShell History Viewer — Like ADAC</h3>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">ADAC feature • Learn while doing</span>
        <button onClick={() => { setHistory([]); onClear?.(); }} className="h-7 px-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-400 hover:text-zinc-200">Clear</button>
      </div>

      <div className="p-2 border-b border-zinc-800/30">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter cmdlets, users, objects..."
          className="w-full h-8 pl-3 pr-3 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/30"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 font-mono text-[11px]">
        {filtered.length === 0 ? (
          <p className="text-[11px] text-zinc-500 p-3">No commands — perform actions in OU tree to see PowerShell behind them</p>
        ) : filtered.map(cmd => (
          <div key={cmd.id} className="group p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${cmd.result === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-violet-300 font-medium">{cmd.cmdlet}</span>
              <span className="text-zinc-500 truncate flex-1">{cmd.parameters}</span>
              <span className="text-[10px] text-zinc-600">{cmd.durationMs}ms</span>
              <button onClick={() => copyCommand(cmd)} className="opacity-0 group-hover:opacity-100 h-6 px-2 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 hover:text-zinc-200 transition">Copy</button>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-zinc-600">
              <span>👤 {cmd.user}</span>
              <span>🎯 {cmd.object}</span>
              <span>🕐 {new Date(cmd.timestamp).toLocaleTimeString()}</span>
              <span className={cmd.result === 'success' ? 'text-emerald-400' : 'text-red-400'}>{cmd.result}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-zinc-800/60 bg-zinc-900/30 text-[10px] text-zinc-500 flex items-center justify-between">
        <span>Every UI action shows cmdlet — learn PowerShell while using GUI, like ADAC PowerShell History Viewer</span>
        <span>{filtered.length} commands</span>
      </div>
    </div>
  );
}

// Helper to log commands from UI actions
export function logPowerShellCommand(cmdlet: string, parameters: string, user: string, object: string) {
  const cmd: PowerShellCommand = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    cmdlet,
    parameters,
    user,
    object,
    result: 'success',
    durationMs: Math.floor(Math.random() * 200) + 50,
  };
  // Dispatch event for history component to catch
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('orbitdesk-powershell', { detail: cmd }));
  }
  return cmd;
}
