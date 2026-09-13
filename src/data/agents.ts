export type AgentSkill = 'm365' | 'entra' | 'intune' | 'exchange' | 'teams' | 'windows' | 'defender';
export type AgentLevel = 'senior' | 'junior' | 'lead';

export interface Agent {
  id: string;
  name: string;
  level: AgentLevel;
  avatar: string;
  skills: AgentSkill[];
  skillLevel: Record<AgentSkill, number>; // 1-10
  status: 'available' | 'busy' | 'on-break' | 'offline' | 'sick';
  currentTickets: number;
  maxTickets: number;
  weeklyHours: number; // 0-44
  maxWeeklyHours: number;
  metrics: {
    sla: number; // %
    csat: number; // 1-5
    qa: number; // %
    frt: number; // minutes avg
    mttr: number; // minutes avg
  };
  mood: 'happy' | 'neutral' | 'stressed' | 'conflicted';
  conflictWith?: string;
  learningGap?: string;
  strengths: string[];
  coachingNotes: string[];
  color: string;
}

export const agents: Agent[] = [
  {
    id: 'agent-alex',
    name: 'Alex Mwangi',
    level: 'senior',
    avatar: 'AM',
    skills: ['m365', 'intune', 'exchange', 'windows'],
    skillLevel: { m365: 9, entra: 7, intune: 9, exchange: 9, teams: 7, windows: 8, defender: 7 },
    status: 'available',
    currentTickets: 2,
    maxTickets: 5,
    weeklyHours: 32,
    maxWeeklyHours: 44,
    metrics: { sla: 98, csat: 4.2, qa: 88, frt: 12, mttr: 45 },
    mood: 'conflicted',
    conflictWith: 'agent-jamal',
    strengths: ['Exchange mail flow expert', 'Fast resolver', 'Mentor potential'],
    coachingNotes: ['Can be blunt in public channels', 'Needs coaching on coaching'],
    color: 'bg-slate-800'
  },
  {
    id: 'agent-priya',
    name: 'Priya Shah',
    level: 'senior',
    avatar: 'PS',
    skills: ['entra', 'm365', 'intune', 'defender'],
    skillLevel: { m365: 8, entra: 10, intune: 8, exchange: 6, teams: 7, windows: 6, defender: 9 },
    status: 'available',
    currentTickets: 1,
    maxTickets: 5,
    weeklyHours: 28,
    maxWeeklyHours: 44,
    metrics: { sla: 99, csat: 4.8, qa: 94, frt: 8, mttr: 38 },
    mood: 'happy',
    strengths: ['Entra ID & CA expert', 'Excellent mentor', 'Calm under pressure'],
    coachingNotes: ['Great role model for juniors'],
    color: 'bg-indigo-700'
  },
  {
    id: 'agent-jamal',
    name: 'Jamal Otieno',
    level: 'junior',
    avatar: 'JO',
    skills: ['m365', 'teams'],
    skillLevel: { m365: 5, entra: 3, intune: 2, exchange: 3, teams: 6, windows: 4, defender: 2 },
    status: 'available',
    currentTickets: 3,
    maxTickets: 3,
    weeklyHours: 36,
    maxWeeklyHours: 44,
    metrics: { sla: 92, csat: 4.0, qa: 72, frt: 18, mttr: 65 },
    mood: 'stressed',
    conflictWith: 'agent-alex',
    learningGap: 'Escalates easy M365 tickets without checking logs first - needs Message Trace and Sign-in logs training',
    strengths: ['Eager to learn', 'Good CSAT with SMB clients'],
    coachingNotes: ['Needs escalation checklist', 'Pair with Priya for Entra training'],
    color: 'bg-amber-600'
  },
  {
    id: 'agent-lisa',
    name: 'Lisa Chen',
    level: 'junior',
    avatar: 'LC',
    skills: ['teams', 'windows', 'm365'],
    skillLevel: { m365: 6, entra: 4, intune: 4, exchange: 3, teams: 8, windows: 7, defender: 3 },
    status: 'busy',
    currentTickets: 3,
    maxTickets: 3,
    weeklyHours: 38,
    maxWeeklyHours: 44,
    metrics: { sla: 95, csat: 4.7, qa: 78, frt: 25, mttr: 55 },
    mood: 'neutral',
    learningGap: 'Slow FRT but high CSAT - needs time management',
    strengths: ['Excellent with non-technical clients', 'Teams expert'],
    coachingNotes: ['Coach on FRT vs quality balance'],
    color: 'bg-teal-600'
  },
  {
    id: 'agent-chen',
    name: 'David Kimani',
    level: 'junior',
    avatar: 'DK',
    skills: ['exchange', 'm365', 'windows'],
    skillLevel: { m365: 6, entra: 5, intune: 5, exchange: 7, teams: 4, windows: 6, defender: 4 },
    status: 'available',
    currentTickets: 2,
    maxTickets: 3,
    weeklyHours: 30,
    maxWeeklyHours: 44,
    metrics: { sla: 96, csat: 4.3, qa: 81, frt: 15, mttr: 48 },
    mood: 'neutral',
    learningGap: 'Learning Intune - needs BitLocker and compliance training',
    strengths: ['Exchange quarantine expert', 'Good documentation'],
    coachingNotes: ['Ready for Intune stretch assignment'],
    color: 'bg-cyan-700'
  },
  {
    id: 'agent-lead',
    name: 'You (Team Lead)',
    level: 'lead',
    avatar: 'DL',
    skills: ['m365', 'entra', 'intune', 'exchange', 'teams', 'windows', 'defender'],
    skillLevel: { m365: 8, entra: 8, intune: 8, exchange: 8, teams: 8, windows: 8, defender: 8 },
    status: 'available',
    currentTickets: 0,
    maxTickets: 10,
    weeklyHours: 40,
    maxWeeklyHours: 44,
    metrics: { sla: 98, csat: 4.6, qa: 92, frt: 10, mttr: 40 },
    mood: 'happy',
    strengths: ['Focus on facts', 'Prioritize listener', 'Coaching'],
    coachingNotes: ['Team Lead - owns roster, escalations, quality, client relationships'],
    color: 'bg-violet-700'
  }
];
