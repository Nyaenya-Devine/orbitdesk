/**
 * © 2026 Devine Nyaenya — OrbitDesk Proprietary
 * Entra ID Center — Feels like Microsoft Entra admin center
 * Modern UX: bulk edit, What-If, Identity Protection, PIM, Access Reviews
 */

'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { logPowerShellCommand } from './PowerShellHistory';

interface User {
  id: string;
  displayName: string;
  upn: string;
  jobTitle: string;
  department: string;
  accountEnabled: boolean;
  locked: boolean;
  mfaEnabled: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  lastSignIn: string;
  licenses: string[];
  groups: string[];
}

const mockUsers: User[] = [
  { id: 'u1', displayName: 'Sarah Finance', upn: 'sarah.finance@novatech.com', jobTitle: 'Finance Manager', department: 'Finance', accountEnabled: true, locked: false, mfaEnabled: true, riskLevel: 'high', lastSignIn: '2026-09-16 14:32', licenses: ['M365 E5', 'Entra ID P2'], groups: ['Finance-Users', 'Payroll-Access'] },
  { id: 'u2', displayName: 'John Payroll', upn: 'john.payroll@novatech.com', jobTitle: 'Payroll Specialist', department: 'Finance', accountEnabled: true, locked: true, mfaEnabled: false, riskLevel: 'high', lastSignIn: '2026-09-15 09:15', licenses: ['M365 E3'], groups: ['Finance-Users'] },
  { id: 'u3', displayName: 'Priya Shah', upn: 'priya.shah@novatech.com', jobTitle: 'Senior Engineer', department: 'IT', accountEnabled: true, locked: false, mfaEnabled: true, riskLevel: 'low', lastSignIn: '2026-09-16 15:00', licenses: ['M365 E5', 'Entra ID P2'], groups: ['IT-Admins', 'Domain-Users'] },
  { id: 'u4', displayName: 'Alex Mwangi', upn: 'alex.mwangi@novatech.com', jobTitle: 'Senior Engineer', department: 'IT', accountEnabled: true, locked: false, mfaEnabled: true, riskLevel: 'low', lastSignIn: '2026-09-16 14:55', licenses: ['M365 E5'], groups: ['IT-Admins'] },
  { id: 'u5', displayName: 'Emma Bloom', upn: 'emma@bloomco.studio', jobTitle: 'Designer', department: 'Design', accountEnabled: true, locked: false, mfaEnabled: false, riskLevel: 'medium', lastSignIn: '2026-09-14 10:20', licenses: ['M365 Business Premium'], groups: ['Design-Team'] },
];

const mockCAPolicies = [
  { id: 'ca1', name: 'Require compliant device — Finance', state: 'on', conditions: 'Finance-Users + All cloud apps', grant: 'Require compliant device', status: 'Report-Only → On (Breach)', risk: 'High — 50 users blocked, P1' },
  { id: 'ca2', name: 'MFA for admins — IT-Admins', state: 'on', conditions: 'IT-Admins + Azure Management', grant: 'Require MFA', status: 'On', risk: 'Low' },
  { id: 'ca3', name: 'Block legacy auth', state: 'on', conditions: 'All users + Other clients', grant: 'Block', status: 'On', risk: 'Medium' },
  { id: 'ca4', name: 'Require hybrid joined — Servers', state: 'off', conditions: 'Servers OU + All cloud apps', grant: 'Require hybrid joined', status: 'Off', risk: 'Low' },
];

export default function EntraIDCenter({ onAction }: { onAction: (action: string) => void }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'users' | 'groups' | 'ca' | 'identity' | 'pim'>('users');
  const [search, setSearch] = useState('');
  const [showWhatIf, setShowWhatIf] = useState(false);

  const filteredUsers = users.filter(u => !search || u.displayName.toLowerCase().includes(search.toLowerCase()) || u.upn.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) setSelectedUsers([]);
    else setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const bulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;
    const userNames = users.filter(u => selectedUsers.includes(u.id)).map(u => u.displayName).join(', ');
    onAction(`${action}: ${userNames} (${selectedUsers.length} users)`);
    logPowerShellCommand(action === 'Enable' ? 'Enable-ADAccount' : action === 'Disable' ? 'Disable-ADAccount' : action === 'Reset password' ? 'Set-ADAccountPassword' : 'Unlock-ADAccount', `-Identity "${userNames}"`, 'You', userNames);

    if (action === 'Unlock') {
      setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, locked: false } : u));
    }
    if (action === 'Enable') {
      setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, accountEnabled: true } : u));
    }
    if (action === 'Disable') {
      setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, accountEnabled: false } : u));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden">
      {/* Header — Entra ID admin center style */}
      <div className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-indigo-500/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">E</div>
          <div>
            <h3 className="text-[14px] font-semibold text-zinc-100 flex items-center gap-2">Microsoft Entra ID — Admin Center Simulation <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">Modern UX • Bulk edit • What-If</span></h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Users, groups, Conditional Access, Identity Protection, PIM — like entra.microsoft.com — no real tenant, simulated data</p>
          </div>
        </div>

        <div className="mt-4 flex gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800 w-fit">
          {[
            { id: 'users', label: 'Users', icon: '👤', count: users.length },
            { id: 'groups', label: 'Groups', icon: '👥', count: 45 },
            { id: 'ca', label: 'Conditional Access', icon: '🛡️', count: mockCAPolicies.length },
            { id: 'identity', label: 'Identity Protection', icon: '⚠️', count: 2 },
            { id: 'pim', label: 'PIM', icon: '🔑', count: 3 },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`h-8 px-3.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition ${activeView === tab.id ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span>{tab.icon}</span>{tab.label} <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-full border border-zinc-700">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeView === 'users' && (
          <div>
            {/* Toolbar — bulk actions like Entra ID */}
            <div className="p-3 border-b border-zinc-800/30 bg-zinc-900/20 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} onChange={toggleSelectAll} className="rounded" />
                <span className="text-[11px] text-zinc-400">{selectedUsers.length} selected • {filteredUsers.length} users</span>
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex gap-1.5">
                <button onClick={() => bulkAction('Unlock')} disabled={selectedUsers.length === 0} className="h-7 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 hover:bg-zinc-700 disabled:opacity-50">🔓 Unlock</button>
                <button onClick={() => bulkAction('Reset password')} disabled={selectedUsers.length === 0} className="h-7 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium disabled:opacity-50">🔑 Reset password</button>
                <button onClick={() => bulkAction('Enable')} disabled={selectedUsers.length === 0} className="h-7 px-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] disabled:opacity-50">✓ Enable</button>
                <button onClick={() => bulkAction('Disable')} disabled={selectedUsers.length === 0} className="h-7 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] hover:bg-zinc-700 disabled:opacity-50">🚫 Disable</button>
                <button onClick={() => bulkAction('Add to group')} disabled={selectedUsers.length === 0} className="h-7 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] hover:bg-zinc-700 disabled:opacity-50">👥 Add to group</button>
              </div>
              <div className="ml-auto flex gap-2">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="h-8 w-[200px] pl-3 pr-3 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/30" />
                <button className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">⚙️</button>
              </div>
            </div>

            {/* User list — Entra ID style */}
            <div className="divide-y divide-zinc-800/30">
              {filteredUsers.map(user => (
                <div key={user.id} className={`p-3 flex items-center gap-3 hover:bg-zinc-900/50 transition group ${selectedUsers.includes(user.id) ? 'bg-violet-500/5 border-l-2 border-l-violet-500' : ''}`}>
                  <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelect(user.id)} className="rounded" />
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-[11px]">{user.displayName.split(' ').map(n => n[0]).join('').substring(0,2)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-zinc-100 truncate">{user.displayName}</span>
                      {!user.accountEnabled && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-700 border border-zinc-600 text-zinc-400">Disabled</span>}
                      {user.locked && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">🔒 Locked</span>}
                      {user.riskLevel === 'high' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">⚠️ High risk</span>}
                      {user.mfaEnabled ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">MFA</span> : <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">No MFA</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono text-zinc-500 truncate">{user.upn}</span>
                      <span className="text-[10px] text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-500">{user.jobTitle} • {user.department}</span>
                      <span className="text-[10px] text-zinc-600">•</span>
                      <span className="text-[10px] text-zinc-600">Last sign-in {user.lastSignIn}</span>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-1.5">
                    {user.licenses.map(l => <span key={l} className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">{l}</span>)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => { onAction(`Reset password: ${user.displayName}`); logPowerShellCommand('Set-ADAccountPassword', `-Identity "${user.displayName}" -Reset`, 'You', user.displayName); }} className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200">🔑</button>
                    <button className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200">👥</button>
                    <button className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200">⚙️</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-zinc-800/30 bg-zinc-900/20 text-[10px] text-zinc-500 flex items-center justify-between">
              <span>Entra ID — Users • Bulk edit like new admin center • Multi-select, edit properties, add to groups, edit account status</span>
              <span>{filteredUsers.length} users • {selectedUsers.length} selected</span>
            </div>
          </div>
        )}

        {activeView === 'ca' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[12px] font-semibold text-zinc-100">Conditional Access Policies — What-If Analysis</h4>
              <button onClick={() => setShowWhatIf(!showWhatIf)} className={`h-8 px-3 rounded-full text-[11px] font-medium border transition ${showWhatIf ? 'bg-violet-600 border-violet-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}>🔍 What-If {showWhatIf ? 'On' : ''}</button>
            </div>

            {showWhatIf && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <p className="text-[11px] font-bold text-violet-300">What-If Simulation — Like Entra ID</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] text-zinc-500 uppercase">User</label><select className="mt-1 w-full h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200"><option>Sarah Finance</option><option>John Payroll — P1 locked</option><option>Priya Shah</option></select></div>
                  <div><label className="text-[10px] text-zinc-500 uppercase">Cloud App</label><select className="mt-1 w-full h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200"><option>All cloud apps</option><option>Office 365</option><option>Azure Management</option></select></div>
                  <div><label className="text-[10px] text-zinc-500 uppercase">Conditions</label><select className="mt-1 w-full h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200"><option>Compliant device — No</option><option>Hybrid joined — Yes</option><option>Location — Trusted</option></select></div>
                  <div className="flex items-end"><button onClick={() => { onAction('What-If: Sarah Finance + All cloud apps + Compliant No = Blocked by Require compliant device'); logPowerShellCommand('WhatIf-ConditionalAccess', '-User "Sarah Finance" -App "All"', 'You', 'What-If'); }} className="w-full h-8 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold">Run What-If → Blocked 53000</button></div>
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                  <p className="text-[11px] text-red-300">Result: Blocked — Policy Require compliant device — Finance • DeviceNotCompliant 53000 • Grant: Require compliant device • Session: Blocked</p>
                  <p className="text-[10px] text-zinc-500 mt-1">RCA: CA policy pushed without Report-Only by john.admin — per SEC-2024-07, must use Report-Only first, What-If shows safe with 15min expiry</p>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              {mockCAPolicies.map(policy => (
                <div key={policy.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${policy.state === 'on' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                        <span className="text-[12px] font-medium text-zinc-100">{policy.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${policy.state === 'on' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{policy.state.toUpperCase()}</span>
                        {policy.status.includes('Breach') && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">🚨 {policy.status}</span>}
                      </div>
                      <div className="mt-1.5 grid grid-cols-3 gap-2 text-[11px]">
                        <div><span className="text-zinc-500">Conditions:</span><span className="text-zinc-300 ml-1">{policy.conditions}</span></div>
                        <div><span className="text-zinc-500">Grant:</span><span className="text-zinc-300 ml-1">{policy.grant}</span></div>
                        <div><span className="text-zinc-500">Risk:</span><span className={`ml-1 ${policy.risk.includes('High') ? 'text-red-300' : policy.risk.includes('Medium') ? 'text-amber-300' : 'text-zinc-400'}`}>{policy.risk}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="h-7 px-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-400 hover:text-zinc-200">Edit</button>
                      <button className="h-7 px-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-400 hover:text-zinc-200">Report-Only</button>
                      <button onClick={() => { onAction(`Reverted ${policy.name} to Report-Only — What-If safe`); logPowerShellCommand('Set-AzureADMSConditionalAccessPolicy', `-Id ${policy.id} -State ReportOnly`, 'You', policy.name); }} className="h-7 px-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium">Revert → Report-Only</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'groups' && (
          <div className="p-4">
            <h4 className="text-[12px] font-semibold text-zinc-100">Groups — Security Groups, Nested Groups, Dynamic Membership</h4>
            <p className="text-[11px] text-zinc-500 mt-1">Like Entra ID — 45 groups, 30 security, 15 distribution, nested, dynamic. Flat is better, use attributes.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { name: 'Finance-Users', members: 50, type: 'Security', dynamic: false, desc: 'Finance dept access' },
                { name: 'IT-Admins', members: 12, type: 'Security', dynamic: false, desc: 'Tiered admin model — least privilege' },
                { name: 'Payroll-Access', members: 5, type: 'Security', dynamic: false, desc: 'Payroll system P1 critical' },
                { name: 'All-Users-Dynamic', members: 127, type: 'Security', dynamic: true, desc: 'Dynamic: user.accountEnabled eq true' },
              ].map(g => (
                <div key={g.name} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2"><span>👥</span><span className="text-[12px] font-medium text-zinc-200">{g.name}</span>{g.dynamic && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">Dynamic</span>}<span className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-full border border-zinc-700">{g.members}</span></div>
                  <p className="text-[11px] text-zinc-500 mt-1">{g.desc} • {g.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeView === 'identity' || activeView === 'pim') && (
          <div className="p-8 text-center">
            <p className="text-[13px] text-zinc-400">{activeView === 'identity' ? 'Identity Protection — Risk detections, risky users, risky sign-ins — like Entra ID Protection' : 'PIM — Privileged Identity Management — eligible assignments, activation, approval, audit'} — coming next, building now</p>
            <p className="text-[11px] text-zinc-600 mt-2">This will include risky users (2 high risk), risk policies, PIM roles (Global Admin, Intune Admin), activation with MFA and justification, like real Entra ID.</p>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-zinc-800/60 bg-zinc-900/30 text-[10px] text-zinc-500 flex items-center justify-between">
        <span>Microsoft Entra ID admin center simulation — bulk edit, What-If, Identity Protection, PIM — modern UX, no real tenant</span>
        <span>{users.length} users • {mockCAPolicies.length} CA policies • Entra ID P2</span>
      </div>
    </div>
  );
}
