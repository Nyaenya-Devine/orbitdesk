'use client';
// von Neumann Architecture — Stored-Program OrbitDesk
// Single reducer, single source of truth, not 20+ useState spaghetti
// Tickets are instructions, fixes are opcodes, state is memory

import { Ticket } from './ticketEngine';
import { StudentProgress } from './progressEngine';
import { OUObject } from '@/components/OUTreeView';
import { PowerShellCommand } from '@/components/PowerShellHistory';

export interface OrbitState {
  // Auth
  isAuthenticated: boolean;
  userProfile: any;
  
  // Tickets — the program
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  portalActionLog: string[];
  checklist: { logs: boolean; tool: boolean; lang: boolean; confirm: boolean };
  bitLockerFixed: boolean;
  syncDone: boolean;
  
  // Progress — the accumulator
  progress: StudentProgress;
  levelUp: { oldLevel: number; newLevel: number } | null;
  
  // UI — the control unit
  activeTab: 'overview' | 'queue' | 'directory' | 'comms' | 'clients' | 'class' | 'assessment' | 'genius';
  directoryView: 'ou' | 'entra';
  policiesView: 'ca' | 'gpo' | 'intune' | 'agents';
  showGuide: boolean;
  showRemotePC: boolean;
  selectedClientForPolicies: string;
  
  // AD — memory
  selectedADObject: OUObject | null;
  psHistory: PowerShellCommand[];
  
  // System — clock
  isPaused: boolean;
  isManualPaused: boolean;
  awayMinutes: number;
  showAwayWelcome: { minutes: number; added: number } | null;
  lastActive: number;
  
  // Genius — new in v7.0
  geniusView: 'newton' | 'einstein' | 'davinci' | 'vonneumann' | 'turing' | 'all';
  thoughtExperiment: 'policy' | 'device' | 'user' | null;
}

export type OrbitAction =
  | { type: 'AUTHENTICATE'; profile: any }
  | { type: 'LOGOUT' }
  | { type: 'SET_TICKETS'; tickets: Ticket[] }
  | { type: 'SELECT_TICKET'; ticket: Ticket | null }
  | { type: 'UPDATE_TICKET_TIMERS'; updater: (tickets: Ticket[]) => Ticket[] }
  | { type: 'ASSIGN_TICKET'; ticketId: string; agentId: string; agentName: string }
  | { type: 'RESOLVE_TICKET'; ticketId: string; csat: number; qa: number; xpGain: number; newProgress: StudentProgress; levelUp: { oldLevel: number; newLevel: number } | null }
  | { type: 'REMOVE_TICKET'; ticketId: string }
  | { type: 'ADD_TICKETS'; tickets: Ticket[] }
  | { type: 'SET_CHECKLIST'; checklist: Partial<OrbitState['checklist']> }
  | { type: 'RESET_CHECKLIST' }
  | { type: 'ADD_PORTAL_ACTION'; action: string }
  | { type: 'SET_BITLOCKER_FIXED'; fixed: boolean }
  | { type: 'SET_SYNC_DONE'; done: boolean }
  | { type: 'SET_PROGRESS'; progress: StudentProgress }
  | { type: 'SET_ACTIVE_TAB'; tab: OrbitState['activeTab'] }
  | { type: 'SET_DIRECTORY_VIEW'; view: OrbitState['directoryView'] }
  | { type: 'SET_POLICIES_VIEW'; view: OrbitState['policiesView'] }
  | { type: 'SET_SHOW_GUIDE'; show: boolean }
  | { type: 'SET_SHOW_REMOTE_PC'; show: boolean }
  | { type: 'SET_SELECTED_CLIENT'; clientId: string }
  | { type: 'SET_SELECTED_AD_OBJECT'; obj: OUObject | null }
  | { type: 'ADD_PS_COMMAND'; command: PowerShellCommand }
  | { type: 'CLEAR_PS_HISTORY' }
  | { type: 'SET_PAUSED'; paused: boolean; manual: boolean }
  | { type: 'SET_AWAY'; minutes: number; welcome: { minutes: number; added: number } | null }
  | { type: 'SET_LAST_ACTIVE'; timestamp: number }
  | { type: 'SET_LEVEL_UP'; levelUp: { oldLevel: number; newLevel: number } | null }
  | { type: 'SET_GENIUS_VIEW'; view: OrbitState['geniusView'] }
  | { type: 'SET_THOUGHT_EXPERIMENT'; experiment: OrbitState['thoughtExperiment'] };

export function orbitReducer(state: OrbitState, action: OrbitAction): OrbitState {
  switch (action.type) {
    case 'AUTHENTICATE':
      return { ...state, isAuthenticated: true, userProfile: action.profile };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, userProfile: null };
    case 'SET_TICKETS':
      return { ...state, tickets: action.tickets };
    case 'SELECT_TICKET':
      return { 
        ...state, 
        selectedTicket: action.ticket,
        checklist: action.ticket ? { logs: false, tool: false, lang: false, confirm: false } : state.checklist,
        portalActionLog: action.ticket ? [] : state.portalActionLog,
      };
    case 'UPDATE_TICKET_TIMERS':
      return { ...state, tickets: action.updater(state.tickets) };
    case 'ASSIGN_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(t => t.id === action.ticketId ? { ...t, assignedTo: action.agentId, status: 'assigned' as const } : t),
        selectedTicket: state.selectedTicket?.id === action.ticketId ? { ...state.selectedTicket, assignedTo: action.agentId, status: 'assigned' as const } : state.selectedTicket,
      };
    case 'RESOLVE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(t => t.id === action.ticketId ? { ...t, status: 'resolved' as const, csat: action.csat, qaScore: action.qa } : t),
        progress: action.newProgress,
        levelUp: action.levelUp,
      };
    case 'REMOVE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter(t => t.id !== action.ticketId),
        selectedTicket: state.selectedTicket?.id === action.ticketId ? null : state.selectedTicket,
        checklist: { logs: false, tool: false, lang: false, confirm: false },
      };
    case 'ADD_TICKETS':
      return { ...state, tickets: [...action.tickets, ...state.tickets] };
    case 'SET_CHECKLIST':
      return { ...state, checklist: { ...state.checklist, ...action.checklist } };
    case 'RESET_CHECKLIST':
      return { ...state, checklist: { logs: false, tool: false, lang: false, confirm: false } };
    case 'ADD_PORTAL_ACTION':
      return {
        ...state,
        portalActionLog: [`${new Date().toLocaleTimeString()} — ${action.action}`, ...state.portalActionLog].slice(0, 10),
        bitLockerFixed: action.action.includes('BitLocker') || action.action.includes('Enable encryption') ? true : state.bitLockerFixed,
        syncDone: action.action.includes('Release') || action.action.includes('Sync') ? true : state.syncDone,
        checklist: {
          ...state.checklist,
          logs: action.action.includes('Sign-in logs') || action.action.includes('Audit Logs') || action.action.includes('Message Trace') ? true : state.checklist.logs,
          tool: action.action.includes('BitLocker') || action.action.includes('Enable encryption') || action.action.includes('Release') || action.action.includes('Sync') ? true : state.checklist.tool,
        }
      };
    case 'SET_BITLOCKER_FIXED':
      return { ...state, bitLockerFixed: action.fixed };
    case 'SET_SYNC_DONE':
      return { ...state, syncDone: action.done };
    case 'SET_PROGRESS':
      return { ...state, progress: action.progress };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab };
    case 'SET_DIRECTORY_VIEW':
      return { ...state, directoryView: action.view };
    case 'SET_POLICIES_VIEW':
      return { ...state, policiesView: action.view };
    case 'SET_SHOW_GUIDE':
      return { ...state, showGuide: action.show };
    case 'SET_SHOW_REMOTE_PC':
      return { ...state, showRemotePC: action.show };
    case 'SET_SELECTED_CLIENT':
      return { ...state, selectedClientForPolicies: action.clientId };
    case 'SET_SELECTED_AD_OBJECT':
      return { ...state, selectedADObject: action.obj };
    case 'ADD_PS_COMMAND':
      return { ...state, psHistory: [action.command, ...state.psHistory].slice(0, 50) };
    case 'CLEAR_PS_HISTORY':
      return { ...state, psHistory: [] };
    case 'SET_PAUSED':
      return { ...state, isPaused: action.paused, isManualPaused: action.manual };
    case 'SET_AWAY':
      return { ...state, awayMinutes: action.minutes, showAwayWelcome: action.welcome };
    case 'SET_LAST_ACTIVE':
      return { ...state, lastActive: action.timestamp };
    case 'SET_LEVEL_UP':
      return { ...state, levelUp: action.levelUp };
    case 'SET_GENIUS_VIEW':
      return { ...state, geniusView: action.view };
    case 'SET_THOUGHT_EXPERIMENT':
      return { ...state, thoughtExperiment: action.experiment };
    default:
      return state;
  }
}

export const initialOrbitState: OrbitState = {
  isAuthenticated: false,
  userProfile: null,
  tickets: [],
  selectedTicket: null,
  portalActionLog: [],
  checklist: { logs: false, tool: false, lang: false, confirm: false },
  bitLockerFixed: false,
  syncDone: false,
  progress: null as any, // set via loadProgress
  levelUp: null,
  activeTab: 'queue',
  directoryView: 'ou',
  policiesView: 'ca',
  showGuide: false,
  showRemotePC: false,
  selectedClientForPolicies: 'client-a',
  selectedADObject: null,
  psHistory: [],
  isPaused: false,
  isManualPaused: false,
  awayMinutes: 0,
  showAwayWelcome: null,
  lastActive: Date.now(),
  geniusView: 'all',
  thoughtExperiment: null,
};
