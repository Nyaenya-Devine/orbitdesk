/**
 * © 2026 Devine Nyaenya Ngorwe — OrbitDesk Proprietary Flagship
 * OU Tree View — Active Directory Users and Computers (ADUC) style
 * Inspired by OpenADUC and modern Entra ID admin center
 */

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface OUObject {
  id: string;
  name: string;
  type: 'domain' | 'ou' | 'user' | 'group' | 'computer' | 'container';
  dn: string;
  children?: OUObject[];
  count?: number;
  description?: string;
  status?: 'enabled' | 'disabled' | 'locked';
  memberOf?: string[];
  expanded?: boolean;
}

const mockDirectory: OUObject = {
  id: 'novatech.com',
  name: 'novatech.com',
  type: 'domain',
  dn: 'DC=novatech,DC=com',
  expanded: true,
  children: [
    {
      id: 'ou-users',
      name: 'Users',
      type: 'ou',
      dn: 'OU=Users,DC=novatech,DC=com',
      count: 127,
      description: 'User accounts — synced to Entra ID',
      expanded: true,
      children: [
        { id: 'ou-finance', name: 'Finance', type: 'ou', dn: 'OU=Finance,OU=Users,DC=novatech,DC=com', count: 50, description: 'Finance dept — payroll critical', children: [
          { id: 'u-sarah', name: 'Sarah Finance', type: 'user', dn: 'CN=Sarah Finance,OU=Finance,OU=Users,DC=novatech,DC=com', status: 'enabled', description: 'Finance Manager', memberOf: ['Finance-Users', 'Payroll-Access'] },
          { id: 'u-john', name: 'John Payroll', type: 'user', dn: 'CN=John Payroll,OU=Finance,OU=Users,DC=novatech,DC=com', status: 'locked', description: 'Payroll Specialist — locked, P1 ticket', memberOf: ['Finance-Users'] },
        ]},
        { id: 'ou-it', name: 'IT', type: 'ou', dn: 'OU=IT,OU=Users,DC=novatech,DC=com', count: 12, description: 'IT Support — admin workstations', children: [
          { id: 'u-priya', name: 'Priya Shah', type: 'user', dn: 'CN=Priya Shah,OU=IT,OU=Users,DC=novatech,DC=com', status: 'enabled', description: 'Senior Engineer — Entra ID expert', memberOf: ['IT-Admins', 'Domain-Users'] },
          { id: 'u-alex', name: 'Alex Mwangi', type: 'user', dn: 'CN=Alex Mwangi,OU=IT,OU=Users,DC=novatech,DC=com', status: 'enabled', description: 'Senior Engineer — Exchange expert', memberOf: ['IT-Admins'] },
        ]},
        { id: 'ou-hr', name: 'HR', type: 'ou', dn: 'OU=HR,OU=Users,DC=novatech,DC=com', count: 8, description: 'Human Resources', children: [] },
        { id: 'ou-service', name: 'Service Accounts', type: 'ou', dn: 'OU=Service Accounts,OU=Users,DC=novatech,DC=com', count: 5, description: 'Service accounts — non-interactive', children: [] },
      ]
    },
    {
      id: 'ou-groups',
      name: 'Groups',
      type: 'ou',
      dn: 'OU=Groups,DC=novatech,DC=com',
      count: 45,
      description: 'Security and distribution groups',
      expanded: false,
      children: [
        { id: 'ou-sec-groups', name: 'Security Groups', type: 'ou', dn: 'OU=Security Groups,OU=Groups,DC=novatech,DC=com', count: 30, children: [
          { id: 'g-finance', name: 'Finance-Users', type: 'group', dn: 'CN=Finance-Users,OU=Security Groups,OU=Groups,DC=novatech,DC=com', count: 50, description: 'Finance department access' },
          { id: 'g-it-admins', name: 'IT-Admins', type: 'group', dn: 'CN=IT-Admins,OU=Security Groups,OU=Groups,DC=novatech,DC=com', count: 12, description: 'IT admin workstations — tiered admin model' },
          { id: 'g-payroll', name: 'Payroll-Access', type: 'group', dn: 'CN=Payroll-Access,OU=Security Groups,OU=Groups,DC=novatech,DC=com', count: 5, description: 'Payroll system — P1 critical' },
        ]},
        { id: 'ou-dl', name: 'Distribution Lists', type: 'ou', dn: 'OU=Distribution Lists,OU=Groups,DC=novatech,DC=com', count: 15, children: [] },
      ]
    },
    {
      id: 'ou-computers',
      name: 'Computers',
      type: 'ou',
      dn: 'OU=Computers,DC=novatech,DC=com',
      count: 89,
      description: 'Workstations and servers — flat is better',
      expanded: false,
      children: [
        { id: 'ou-workstations', name: 'Workstations', type: 'ou', dn: 'OU=Workstations,OU=Computers,DC=novatech,DC=com', count: 80, description: 'User workstations — Intune co-managed', children: [
          { id: 'c-ws-001', name: 'WS-FIN-001', type: 'computer', dn: 'CN=WS-FIN-001,OU=Workstations,OU=Computers,DC=novatech,DC=com', status: 'enabled', description: 'Finance workstation — compliance failing, BitLocker off' },
          { id: 'c-ws-002', name: 'WS-IT-012', type: 'computer', dn: 'CN=WS-IT-012,OU=Workstations,OU=Computers,DC=novatech,DC=com', status: 'enabled', description: 'IT admin workstation — compliant' },
        ]},
        { id: 'ou-servers', name: 'Servers', type: 'ou', dn: 'OU=Servers,OU=Computers,DC=novatech,DC=com', count: 9, description: 'Domain controllers and member servers', children: [] },
      ]
    },
    {
      id: 'ou-disabled',
      name: 'Disabled Accounts',
      type: 'ou',
      dn: 'OU=Disabled Accounts,DC=novatech,DC=com',
      count: 23,
      description: 'Disabled users — Recycle Bin ready',
      children: []
    },
  ]
};

interface Props {
  onSelectObject: (obj: OUObject) => void;
  selectedId?: string;
  onAction: (action: string, obj: OUObject) => void;
}

function OUItem({ obj, depth, onSelect, selectedId, onToggle, onAction }: { obj: OUObject, depth: number, onSelect: (o: OUObject) => void, selectedId?: string, onToggle: (id: string) => void, onAction: (a: string, o: OUObject) => void }) {
  const isSelected = selectedId === obj.id;
  const hasChildren = obj.children && obj.children.length > 0;
  const isExpanded = obj.expanded;

  const getIcon = () => {
    switch (obj.type) {
      case 'domain': return '🌐';
      case 'ou': return isExpanded ? '📂' : '📁';
      case 'user': return obj.status === 'locked' ? '🔒' : obj.status === 'disabled' ? '👤❌' : '👤';
      case 'group': return '👥';
      case 'computer': return obj.status === 'disabled' ? '💻❌' : '💻';
      case 'container': return '📦';
      default: return '📄';
    }
  };

  const getTypeColor = () => {
    switch (obj.type) {
      case 'domain': return 'text-violet-300';
      case 'ou': return 'text-amber-300';
      case 'user': return obj.status === 'locked' ? 'text-red-300' : obj.status === 'disabled' ? 'text-zinc-500' : 'text-blue-300';
      case 'group': return 'text-emerald-300';
      case 'computer': return 'text-cyan-300';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all group text-[12px] ${isSelected ? 'bg-zinc-800 border border-zinc-700 text-white' : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
        style={{ marginLeft: depth * 16 }}
        onClick={() => {
          if (obj.type === 'ou' || obj.type === 'domain') onToggle(obj.id);
          onSelect(obj);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          // Context menu could show actions
        }}
      >
        {hasChildren && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(obj.id); }}
            className="h-4 w-4 rounded flex items-center justify-center hover:bg-zinc-700 text-[10px]"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <span className="w-4" />}
        <span className="text-[14px]">{getIcon()}</span>
        <span className={`font-medium truncate ${getTypeColor()}`}>{obj.name}</span>
        {obj.count !== undefined && <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-full border border-zinc-700">{obj.count}</span>}
        {obj.status === 'locked' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">Locked</span>}
        {obj.status === 'disabled' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-700 border border-zinc-600 text-zinc-400">Disabled</span>}
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
            className="overflow-hidden"
          >
            {obj.children!.map((child, idx) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: idx * 0.02 }}
              >
                <OUItem obj={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} onToggle={onToggle} onAction={onAction} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OUTreeView({ onSelectObject, selectedId, onAction }: Props) {
  const [directory, setDirectory] = useState<OUObject>(mockDirectory);
  const [search, setSearch] = useState('');

  const toggleExpand = (id: string) => {
    const toggle = (obj: OUObject): OUObject => {
      if (obj.id === id) return { ...obj, expanded: !obj.expanded };
      if (obj.children) return { ...obj, children: obj.children.map(toggle) };
      return obj;
    };
    setDirectory(toggle(directory));
  };

  const filteredDirectory = search ? filterDirectory(directory, search.toLowerCase()) : directory;

  function filterDirectory(obj: OUObject, term: string): OUObject | null {
    if (obj.name.toLowerCase().includes(term) || obj.description?.toLowerCase().includes(term)) {
      return { ...obj, expanded: true, children: obj.children?.map(c => filterDirectory(c, term)).filter(Boolean) as OUObject[] };
    }
    if (obj.children) {
      const filteredChildren = obj.children.map(c => filterDirectory(c, term)).filter(Boolean) as OUObject[];
      if (filteredChildren.length > 0) return { ...obj, expanded: true, children: filteredChildren };
    }
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl overflow-hidden">
      {/* Header — ADUC style */}
      <div className="p-3 border-b border-zinc-800/60 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">🌳</span>
          <h3 className="text-[12px] font-semibold text-zinc-100">Active Directory — OU Tree</h3>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">ADUC style • Flat is better</span>
        </div>
        <div className="mt-2 flex gap-2">
          <div className="flex-1 relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Find users, groups, computers..."
              className="w-full h-8 pl-8 pr-3 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-zinc-500">🔍</span>
          </div>
          <button className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200">⚙️</button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500" /> Domain</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> OU</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> User</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Group</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Computer</span>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <OUItem obj={filteredDirectory || directory} depth={0} onSelect={onSelectObject} selectedId={selectedId} onToggle={toggleExpand} onAction={onAction} />
      </div>

      {/* Footer — ADUC status */}
      <div className="p-2 border-t border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between text-[10px] text-zinc-500">
        <span>novatech.com • {directory.children?.reduce((acc, ou) => acc + (ou.count || 0), 0) || 0} objects • Flat: 3 OUs (Users, Groups, Computers)</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> LDAPS • Audited</span>
      </div>
    </div>
  );
}
