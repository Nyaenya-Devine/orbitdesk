import { ticketTemplates, TicketTemplate } from '@/data/ticketTemplates';
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

export function generateTicket(studentMode = true): Ticket {
  const template = randomFrom(ticketTemplates);
  const client = randomFrom(clients.filter(c => template.clientTypes.includes(c.type as any))) || randomFrom(clients);
  
  const now = new Date();
  
  // Student mode: reduce P1 overwhelming — max 5% P1, not 15% — for learning not expert stress
  let priority = template.priority as 'P1' | 'P2' | 'P3' | 'P4';
  if (studentMode) {
    // In student mode, P1 only 3% chance, P2 20%, P3 40%, P4 37% — balanced for learning
    const rand = Math.random();
    if (rand < 0.03) priority = 'P1';
    else if (rand < 0.23) priority = 'P2';
    else if (rand < 0.63) priority = 'P3';
    else priority = 'P4';
  } else {
    if (Math.random() < 0.05) priority = 'P1'; // Reduced from 15% to 5% even in expert mode
  }
  
  // Realistic SLA based on client business hours
  const realistic = calculateRealisticSLA(priority, client.id as any, now.getTime());
  
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
    status: 'new',
    createdAt: now,
    slaDeadline,
    slaBreach: false,
    timeLeftMs: realistic.timeLeftMs,
    requiredTools: template.requiredTools,
    rootCause: template.rootCause,
    correctFix: template.correctFix,
    errorCodes: template.errorCodes,
    isRecurring: Math.random() < 0.2, // Reduced from 30% to 20% for less clutter
    tags: [template.code, template.category, client.id, priority, realistic.businessHoursOnly ? 'business-hours' : '24-7']
  };
}

export function generateInitialTickets(count: number = 5, studentMode = true): Ticket[] {
  // Student mode: max 1 P1 in initial 5, rest P2-P4 for learning
  const tickets: Ticket[] = [];
  let p1Count = 0;
  
  for (let i = 0; i < count; i++) {
    let ticket: Ticket;
    let attempts = 0;
    do {
      ticket = generateTicket(studentMode);
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
  
  return Math.min(5, Math.max(1, Math.round(score * 10) / 10));
}
