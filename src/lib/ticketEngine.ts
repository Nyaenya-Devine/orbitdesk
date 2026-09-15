import { ticketTemplates, TicketTemplate, TicketDifficulty } from '@/data/ticketTemplates';
import { clients } from '@/data/clients';
import { calculateRealisticSLA } from './progressEngine';

export interface Ticket {
 id: string;
 templateId: string;
 clientId: string;
 clientName: string;
 category: string;
 code: string;
 title: string;
 description: string;
 userMessage: string;
 userEmail: string;
 priority: 'P1' | 'P2' | 'P3' | 'P4';
 difficulty: TicketDifficulty;
 status: 'new' | 'assigned' | 'in-progress' | 'waiting-client' | 'resolved' | 'closed';
 assignedTo?: string;
 createdAt: Date;
 slaDeadline: Date;
 slaBreach: boolean;
 timeLeftMs: number;
 requiredTools: string[];
 rootCause: string;
 correctFix: string[];
 errorCodes: string[];
 csat?: number;
 qaScore?: number;
 resolutionNotes?: string;
 isRecurring: boolean;
 tags: string[];
}

const firstNames = ['Sarah', 'John', 'Priya', 'David', 'Lisa', 'Ahmed', 'Grace', 'Michael', 'Amina', 'James', 'Fatima', 'Carlos'];
const lastNames = ['Finance', 'Sales', 'Marketing', 'Engineering', 'HR', 'Operations', 'Support'];
const domains = ['novatech.com', 'bloomco.studio', 'apexfinancial.com'];

function randomFrom<T>(arr: T[]): T {
 return arr[Math.floor(Math.random() * arr.length)];
}

function generateUserEmail(clientId: string): string {
 const first = randomFrom(firstNames);
 const last = randomFrom(lastNames);
 const domain = clientId === 'client-a' ? domains[0] : clientId === 'client-b' ? domains[1] : domains[2];
 return `${first}.${last}@${domain}`.toLowerCase();
}

function getEligibleTemplates(ticketsResolved: number, studentMode: boolean): TicketTemplate[] {
 // Difficulty progression based on solved count — OrbitDesk style
 // Lvl 1 (0-4): Beginner only — learn basics MFA, DeviceCap, Teams presence, license, shared mailbox
 // Lvl 2-3 (5-9): Beginner + Intermediate — CA DeviceNotCompliant, enrollment 0x80180024, BitLocker, quarantine
 // Lvl 4-6 (10-19): Intermediate + Advanced — location CA, account locked attack, MDM authority, SmartScreen
 // Lvl 7-9 (20-34): Advanced + Expert — SSO, Autopilot TPM, mail flow down
 // Lvl 10+ (35+): Expert heavy + all + higher P1 rate
 let difficulties: TicketDifficulty[] = [];
 if (ticketsResolved < 5) {
  difficulties = ['beginner'];
 } else if (ticketsResolved < 10) {
  difficulties = ['beginner', 'intermediate'];
 } else if (ticketsResolved < 20) {
  difficulties = ['intermediate', 'advanced'];
 } else if (ticketsResolved < 35) {
  difficulties = ['advanced', 'expert'];
 } else {
  difficulties = ['intermediate', 'advanced', 'expert'];
 }

 let pool = ticketTemplates.filter(t => difficulties.includes(t.difficulty));
 
 // In student mode, reduce expert even more early
 if (studentMode && ticketsResolved < 10) {
  pool = pool.filter(t => t.difficulty !== 'expert');
 }
 if (pool.length === 0) pool = ticketTemplates.filter(t => t.difficulty === 'beginner');
 
 return pool;
}

function getWeightedTemplate(pool: TicketTemplate[], ticketsResolved: number): TicketTemplate {
 // Weighted: higher difficulty more likely as you progress
 // For pool with 2 difficulties, favor higher one 70%
 if (pool.length === 0) return randomFrom(ticketTemplates);
 
 const beginner = pool.filter(t => t.difficulty === 'beginner');
 const intermediate = pool.filter(t => t.difficulty === 'intermediate');
 const advanced = pool.filter(t => t.difficulty === 'advanced');
 const expert = pool.filter(t => t.difficulty === 'expert');

 // Determine weights based on ticketsResolved
 if (ticketsResolved < 5) {
  // 100% beginner
  return randomFrom(beginner.length ? beginner : pool);
 } else if (ticketsResolved < 10) {
  // 30% beginner, 70% intermediate
  if (Math.random() < 0.7 && intermediate.length) return randomFrom(intermediate);
  return randomFrom(beginner.length ? beginner : intermediate);
 } else if (ticketsResolved < 20) {
  // 30% intermediate, 70% advanced
  if (Math.random() < 0.7 && advanced.length) return randomFrom(advanced);
  return randomFrom(intermediate.length ? intermediate : advanced);
 } else if (ticketsResolved < 35) {
  // 30% advanced, 70% expert
  if (Math.random() < 0.7 && expert.length) return randomFrom(expert);
  return randomFrom(advanced.length ? advanced : expert);
 } else {
  // Expert heavy: 60% expert, 30% advanced, 10% intermediate
  const r = Math.random();
  if (r < 0.6 && expert.length) return randomFrom(expert);
  if (r < 0.9 && advanced.length) return randomFrom(advanced);
  return randomFrom(intermediate.length ? intermediate : pool);
 }
}

export function generateTicket(studentMode = true, ticketsResolved = 0, level = 1): Ticket {
 const eligiblePool = getEligibleTemplates(ticketsResolved, studentMode);
 const template = getWeightedTemplate(eligiblePool, ticketsResolved);
 const client = randomFrom(clients.filter(c => template.clientTypes.includes(c.type as any))) || randomFrom(clients);
 
 const now = new Date();
 
 // Dynamic P1 rate based on level — harder as you progress (OrbitDesk progression)
 // Lvl1: 3% P1, Lvl2-3: 5%, Lvl4-6: 10%, Lvl7+: 15% (real MSP gets more P1 as you level)
 let p1Chance = 0.03;
 if (level >= 2 && level < 4) p1Chance = 0.05;
 else if (level >= 4 && level < 7) p1Chance = 0.10;
 else if (level >= 7) p1Chance = 0.15;
 if (!studentMode) p1Chance += 0.05; // Expert mode +5%

 let priority = template.priority as 'P1' | 'P2' | 'P3' | 'P4';
 if (studentMode) {
  const rand = Math.random();
  if (rand < p1Chance) priority = 'P1';
  else if (rand < p1Chance + 0.20) priority = 'P2';
  else if (rand < p1Chance + 0.60) priority = 'P3';
  else priority = 'P4';
 } else {
  if (Math.random() < p1Chance) priority = 'P1';
 }
 
 // Realistic SLA based on client business hours — shorter as level increases (pressure)
 const realistic = calculateRealisticSLA(priority, client.id as any, now.getTime(), level);
 
 const slaDeadline = new Date(now.getTime() + realistic.timeLeftMs);
 
 const id = `${template.code}-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
 
 return {
 id,
 templateId: template.id,
 clientId: client.id,
 clientName: client.displayName,
 category: template.category,
 code: template.code,
 title: template.title,
 description: template.description,
 userMessage: template.userMessage,
 userEmail: generateUserEmail(client.id),
 priority: priority as any,
 difficulty: template.difficulty,
 status: 'new',
 createdAt: now,
 slaDeadline,
 slaBreach: false,
 timeLeftMs: realistic.timeLeftMs,
 requiredTools: template.requiredTools,
 rootCause: template.rootCause,
 correctFix: template.correctFix,
 errorCodes: template.errorCodes,
 isRecurring: Math.random() < (level >= 7 ? 0.35 : 0.2), // More recurring at high level
 tags: [template.code, template.category, client.id, priority, template.difficulty, realistic.businessHoursOnly ? 'business-hours' : '24-7']
 };
}

export function generateInitialTickets(count: number = 5, studentMode = true, ticketsResolved = 0, level = 1): Ticket[] {
 // Student mode: max 1 P1 in initial 5, rest P2-P4 for learning — now with difficulty scaling
 const tickets: Ticket[] = [];
 let p1Count = 0;
 
 for (let i = 0; i < count; i++) {
 let ticket: Ticket;
 let attempts = 0;
 do {
 ticket = generateTicket(studentMode, ticketsResolved, level);
 attempts++;
 } while (studentMode && ticket.priority === 'P1' && p1Count >= 1 && attempts < 10);
 
 if (ticket.priority === 'P1') p1Count++;
 tickets.push(ticket);
 }
 
 return tickets;
}

export function updateTicketTimers(tickets: Ticket[]): Ticket[] {
 const now = new Date();
 return tickets.map(ticket => {
 const timeLeft = ticket.slaDeadline.getTime() - now.getTime();
 return {
 ...ticket,
 timeLeftMs: timeLeft,
 slaBreach: timeLeft < 0 && ticket.status !== 'resolved' && ticket.status !== 'closed'
 };
 });
}

export function getSLAColor(timeLeftMs: number, priority: string): string {
 if (timeLeftMs < 0) return 'bg-red-600 text-white';
 const minutesLeft = timeLeftMs / (60 * 1000);
 if (priority === 'P1') {
 if (minutesLeft < 15) return 'bg-red-500 text-white animate-pulse';
 if (minutesLeft < 30) return 'bg-orange-500 text-white';
 return 'bg-yellow-500 text-black';
 }
 if (minutesLeft < 30) return 'bg-red-500 text-white';
 if (minutesLeft < 60) return 'bg-orange-500 text-white';
 return 'bg-green-100 text-green-800';
}

export function calculateCSAT(ticket: Ticket, actions: {
 checkedLogsFirst: boolean;
 usedCorrectTool: boolean;
 usedClientLanguage: boolean;
 confirmedResolution: boolean;
 documentedKB: boolean;
}): number {
 const template = ticketTemplates.find(t => t.id === ticket.templateId);
 if (!template) return 3;
 
 let score = 2.5; // base
 if (actions.checkedLogsFirst) score += template.csatFactors.checkLogsFirst * 0.4;
 if (actions.usedCorrectTool) score += template.csatFactors.correctTool * 0.4;
 if (actions.usedClientLanguage) score += template.csatFactors.clientLanguage * 0.4;
 if (actions.confirmedResolution) score += template.csatFactors.confirmResolution * 0.3;
 if (actions.documentedKB) score += template.csatFactors.documentKB * 0.2;
 
 // Penalty for wrong fixes
 if (!actions.checkedLogsFirst) score -= 1.5;
 
 // Difficulty bonus — harder tickets give more CSAT if done right
 if (template.difficulty === 'advanced') score += 0.2;
 if (template.difficulty === 'expert') score += 0.3;
 
 return Math.min(5, Math.max(1, Math.round(score * 10) / 10));
}

export function getDifficultyLabel(d: TicketDifficulty): { label: string; color: string; xp: number } {
 switch (d) {
  case 'beginner': return { label: 'Beginner', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', xp: 10 };
  case 'intermediate': return { label: 'Intermediate', color: 'bg-blue-500/15 text-blue-300 border-blue-500/20', xp: 20 };
  case 'advanced': return { label: 'Advanced', color: 'bg-amber-500/15 text-amber-300 border-amber-500/20', xp: 30 };
  case 'expert': return { label: 'Expert', color: 'bg-red-500/15 text-red-300 border-red-500/20', xp: 50 };
 }
}
