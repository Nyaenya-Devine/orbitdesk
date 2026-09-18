/**
 * © 2026 Devine Nyaenya Ngorwe — OrbitDesk Proprietary Flagship
 * AD User Properties — ADUC style dialog with tabs
 * Like Active Directory Users and Computers user properties
 */

'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { OUObject } from './OUTreeView';

interface Props {
  object: OUObject | null;
  onAction: (action: string, obj: OUObject) => void;
  onClose: () => void;
}

export default function ADUserProperties({ object, onAction, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'memberOf' | 'security' | 'audit'>('general');

  if (!object) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-[24px]">🌳</div>
          <p className="text-[13px] font-medium text-zinc-300">Select an object from OU tree</p>
          <p className="text-[11px] text-zinc-500 mt-1 max-w-[280px]">Browse domain → Users → Finance → User — view properties, reset password, unlock, group membership, audit trail — like ADUC</p>
        </div>
      </div>
    );
  }

  const isUser = object.type === 'user';
  const isGroup = object.type === 'group';
  const isComputer = object.type === 'computer';
  const isOU = object.type === 'ou';

  const tabs = [
    { id: 'general', label: 'General', icon: '👤' },
    { id: 'account', label: 'Account', icon: '🔑' },
    { id: 'memberOf', label: 'Member Of', icon: '👥' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'audit', label: 'Audit', icon: '📋' },
  ] as const;

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-violet-500/5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[16px]">
            {object.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-zinc-100 truncate">{object.name}</h3>
            <p className="text-[11px] text-zinc-500 truncate font-mono">{object.dn}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${object.type === 'user' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : object.type === 'group' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : object.type === 'computer' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>{object.type.toUpperCase()}</span>
              {object.status === 'locked' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">🔒 Locked — P1</span>}
              {object.status === 'enabled' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">✓ Enabled</span>}
              {object.description && <span className="text-[10px] text-zinc-500 truncate">{object.description}</span>}
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400">✕</button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`h-7 px-3 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition ${activeTab === tab.id ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Display Name</p>
                <p className="text-[13px] text-zinc-200 mt-1">{object.name}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Logon Name</p>
                <p className="text-[13px] text-zinc-200 mt-1 font-mono">{object.name.toLowerCase().replace(' ', '.')}@novatech.com</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Description</p>
                <p className="text-[13px] text-zinc-200 mt-1">{object.description || '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">OU / Location</p>
                <p className="text-[13px] text-zinc-200 mt-1 font-mono text-[11px]">{object.dn.split(',').slice(1).join(',')}</p>
              </div>
            </div>

            {isUser && (
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-[11px] font-medium text-blue-300">Entra ID Sync Status</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between"><span className="text-zinc-500">Synced:</span><span className="text-zinc-200">✓ Yes — 2 mins ago</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Immutable ID:</span><span className="text-zinc-200 font-mono">a1b2c3d4...</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Last Logon:</span><span className="text-zinc-200">2026-09-16 14:32 UTC</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Password Last Set:</span><span className="text-zinc-200">2026-08-01</span></div>
                </div>
              </div>
            )}

            {isOU && (
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-[11px] font-medium text-amber-300">OU Properties — Flat is Better (Modern AD)</p>
                <p className="text-[11px] text-zinc-400 mt-2">This OU contains {object.count || 0} objects. Modern guidance: flat structure with 3 OUs (Users, Groups, Computers), location-based only if needed for GPOs (printers, etc). Department OUs outdated — use attributes and groups instead. GPOs linked: 2, Inheritance: enabled.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'account' && isUser && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <h4 className="text-[11px] font-semibold text-zinc-200">Account Options — ADUC Account Tab</h4>
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-[12px] text-zinc-300"><input type="checkbox" checked={object.status === 'locked'} readOnly className="rounded" /> Account is locked out — P1 payroll blocked</label>
                <label className="flex items-center gap-2 text-[12px] text-zinc-300"><input type="checkbox" checked={false} readOnly /> User must change password at next logon</label>
                <label className="flex items-center gap-2 text-[12px] text-zinc-300"><input type="checkbox" checked={true} readOnly /> Password never expires</label>
                <label className="flex items-center gap-2 text-[12px] text-zinc-300"><input type="checkbox" checked={false} readOnly /> Account is disabled</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onAction('unlock', object)} className={`h-9 rounded-full text-[12px] font-medium border transition ${object.status === 'locked' ? 'bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed'}`}>🔓 Unlock Account</button>
              <button onClick={() => onAction('reset-password', object)} className="h-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-medium">🔑 Reset Password</button>
              <button onClick={() => onAction('disable', object)} className="h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[12px]">🚫 Disable</button>
              <button onClick={() => onAction('enable', object)} className="h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-medium">✓ Enable</button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[11px] font-medium text-zinc-300">Logon Hours, Account Expires, Group Membership</p>
              <p className="text-[11px] text-zinc-500 mt-1">Like ADUC — set logon hours, account expiration, dial-in, environment. For Entra ID: Conditional Access policies control access, not logon hours.</p>
            </div>
          </div>
        )}

        {activeTab === 'memberOf' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-semibold text-zinc-200">Member Of — Group Membership (Nested Groups)</h4>
              <button onClick={() => onAction('add-group', object)} className="h-7 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 hover:bg-zinc-700">+ Add</button>
            </div>
            <div className="space-y-2">
              {(object.memberOf || ['Domain-Users', 'Finance-Users']).map(g => (
                <div key={g} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">👥</span>
                    <span className="text-[12px] text-zinc-200">{g}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500">Security Group</span>
                  </div>
                  <button onClick={() => onAction('remove-group', object)} className="h-6 px-2 rounded-full bg-zinc-800 hover:bg-red-500/10 border border-zinc-700 hover:border-red-500/20 text-[11px] text-zinc-400 hover:text-red-300">Remove</button>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[11px] text-emerald-300">Graph view: How user ends up in Domain Admins? Path: Sarah → Finance-Users → Payroll-Access → Domain Admins? Check nested groups — like BloodHound but for training.</p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <h4 className="text-[11px] font-semibold text-zinc-200">Security — Delegation ACLs (Like ADUC Security Tab)</h4>
              <div className="mt-2 space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-zinc-500">Owner:</span><span className="text-zinc-200">Domain Admins</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Inheritance:</span><span className="text-zinc-200">Enabled — from parent OU</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">GPOs Linked:</span><span className="text-zinc-200">2 — Default Domain Policy, BitLocker-Require</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Delegated To:</span><span className="text-zinc-200">IT-Admins (Reset password, Unlock)</span></div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
              <p className="text-[11px] font-medium text-violet-300">Fine-Grained Password Policy</p>
              <p className="text-[11px] text-zinc-400 mt-1">Domain default: 14 chars, 60 days. Finance OU: 16 chars, 30 days, no reuse — per SEC-2024-07. Like ADAC fine-grained policy management.</p>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <h4 className="text-[11px] font-semibold text-zinc-200">Audit Trail — Tamper-Evident (Like OpenADUC)</h4>
              <div className="mt-2 space-y-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800">
                  <p className="text-zinc-500">2026-09-16 14:32:10 UTC — Priya Shah reset password for Sarah Finance</p>
                  <p className="text-[10px] text-zinc-600">Hash: a1b2c3d4e5f6... HMAC: valid • Prev: 9f8e7d6c... • SHA-256 chain intact</p>
                </div>
                <div className="p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800">
                  <p className="text-zinc-500">2026-09-15 09:15:22 UTC — Alex Mwangi unlocked John Payroll (P1)</p>
                  <p className="text-[10px] text-zinc-600">Hash: 9f8e7d6c5b4a... HMAC: valid • RCA: CA policy blocking payroll</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <p className="text-amber-300">2026-09-14 11:00:00 UTC — john.admin pushed CA policy without Report-Only — BREACH</p>
                  <p className="text-[10px] text-amber-500">Anomaly detected: policy pushed without What-If — per SEC-2024-07</p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[11px] font-medium text-zinc-200">PowerShell History Viewer (Like ADAC)</p>
              <div className="mt-2 p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 font-mono text-[11px] text-zinc-400">
                <p>Get-ADUser -Identity "Sarah Finance" -Properties MemberOf, LockedOut, Enabled</p>
                <p>Unlock-ADAccount -Identity "John Payroll"</p>
                <p>Set-ADAccountPassword -Identity "Sarah Finance" -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "Temp123!" -Force)</p>
                <p>Add-ADGroupMember -Identity "Payroll-Access" -Members "Sarah Finance"</p>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">Every UI action shows PowerShell cmdlet behind it — like ADAC PowerShell History Viewer. Learn while doing.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30 flex gap-2">
        <button onClick={() => onAction('move', object)} className="h-8 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 hover:bg-zinc-700">↗️ Move OU</button>
        <button onClick={() => onAction('delete', object)} className="h-8 px-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] hover:bg-red-500/20">🗑️ Delete → Recycle Bin</button>
        <button onClick={onClose} className="ml-auto h-8 px-4 rounded-full bg-zinc-100 text-zinc-900 text-[11px] font-medium hover:bg-white">Close</button>
      </div>
    </div>
  );
}
