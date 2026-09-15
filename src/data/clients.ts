export type ClientType = 'enterprise-tech' | 'smb-non-tech' | 'enterprise-regulated';

export interface Client {
 id: string;
 name: string;
 type: ClientType;
 displayName: string;
 users: number;
 sla: {
 p1: number; // minutes
 p2: number;
 p3: number;
 p4: number;
 };
 hours: string;
 contactStyle: 'technical' | 'non-technical' | 'compliance';
 description: string;
 color: string;
 avatar: string;
}

export const clients: Client[] = [
 {
 id: 'client-a',
 name: 'Client A',
 displayName: 'NovaTech Enterprises',
 type: 'enterprise-tech',
 users: 247,
 sla: { p1: 60, p2: 120, p3: 480, p4: 1440 },
 hours: '24/7',
 contactStyle: 'technical',
 description: 'Highly technical enterprise with own IT team. Wants Correlation IDs, logs, technical RCA. 24/7 coverage.',
 color: 'bg-blue-600',
 avatar: 'NT'
 },
 {
 id: 'client-b',
 name: 'Client B',
 displayName: 'Bloom & Co Studio',
 type: 'smb-non-tech',
 users: 28,
 sla: { p1: 240, p2: 480, p3: 1440, p4: 2880 },
 hours: '9-5 EAT',
 contactStyle: 'non-technical',
 description: 'Small creative agency, no IT team. Relies heavily on us. Needs simple language, no jargon.',
 color: 'bg-emerald-600',
 avatar: 'BC'
 },
 {
 id: 'client-c',
 name: 'Client C',
 displayName: 'Apex Financial Group',
 type: 'enterprise-regulated',
 users: 112,
 sla: { p1: 120, p2: 180, p3: 360, p4: 1440 },
 hours: '9-5 EAT + On-call',
 contactStyle: 'compliance',
 description: 'Regulated financial services. Security + compliance first. Needs audit logs, DLP proof, documentation.',
 color: 'bg-purple-600',
 avatar: 'AF'
 }
];
