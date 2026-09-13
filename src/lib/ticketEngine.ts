import { ticketTemplates, TicketTemplate } from '@/data/ticketTemplates';
import { clients } from '@/data/clients';

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

export function generateTicket(): Ticket {
  const template = randomFrom(ticketTemplates);
  const client = randomFrom(clients.filter(c => template.clientTypes.includes(c.type as any))) || randomFrom(clients);
  
  const now = new Date();
  const slaMinutes = client.sla[template.priority.toLowerCase() as keyof typeof client.sla];
  const slaDeadline = new Date(now.getTime() + slaMinutes * 60 * 1000);
  
  // Randomly make some P1 more likely if common
  let priority = template.priority;
  if (Math.random() < 0.15) priority = 'P1';
  
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
    timeLeftMs: slaMinutes * 60 * 1000,
    requiredTools: template.requiredTools,
    rootCause: template.rootCause,
    correctFix: template.correctFix,
    errorCodes: template.errorCodes,
    isRecurring: Math.random() < 0.3,
    tags: [template.code, template.category, client.id, priority]
  };
}

export function generateInitialTickets(count: number = 8): Ticket[] {
  return Array.from({ length: count }, () => generateTicket());
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
