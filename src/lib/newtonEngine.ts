'use client';
// Newton Engine — First Principles, Laws, Calculus of IT Support
// Isaac Newton: "If I have seen further, it is by standing on first principles"

import { Ticket } from './ticketEngine';

export const NEWTON_LAWS = {
  first: {
    title: "Law of Inertia — Ticket at Rest",
    statement: "A ticket at rest stays at rest unless acted upon by an agent. An agent in motion stays in motion unless blocked by missing logs.",
    formula: "ΣF = 0 → v = constant",
    orbitdesk: "If you don't check Sign-in Logs, ticket doesn't move. If you are in flow fixing, you keep fixing unless blocked.",
    example: "Sarah's P1 stays 'new' until you open it. Your investigation stays 'in-progress' until you hit missing BitLocker info."
  },
  second: {
    title: "Law of Force — F = P × (1/t)",
    statement: "Force = Priority × SLA Urgency. P1 with 5m left has massive force.",
    formula: "F = PriorityMass × (1/timeLeft) — like F=ma",
    orbitdesk: "Calculate force for triage: P1=100 mass, P2=50, P3=20, P4=5. timeLeft in minutes. Force = mass / timeLeft. Highest force first.",
    example: "P1 with 5m left: F=100/5=20. P2 with 60m left: F=50/60=0.83. Fix P1 first — 24x more force."
  },
  third: {
    title: "Law of Reaction — Audit Trail",
    statement: "For every fix, there is equal and opposite audit log. Every action creates PowerShell history + hash chain.",
    formula: "Action ↔ -Reaction (Audit)",
    orbitdesk: "You enable BitLocker → log Set-BitLockerVolume. You reset password → log Set-ADAccountPassword. Tamper-evident.",
    example: "Fix WS-FIN-001 BitLocker → PowerShell: Enable-BitLocker -MountPoint C: -EncryptionMethod XtsAes256 → Audit log SHA-256 chain"
  }
};

export function calculateForce(ticket: Ticket): number {
  const massMap = { P1: 100, P2: 50, P3: 20, P4: 5 };
  const mass = massMap[ticket.priority] || 20;
  const timeLeftMin = Math.max(1, ticket.timeLeftMs / 60000); // avoid div by zero
  return mass / timeLeftMin;
}

export function calculateGravityScore(ticket: Ticket, allTickets: Ticket[]): number {
  // Like universal gravitation: Score = (PriorityMass × ClientImpact) / (SLADistance²)
  // ClientImpact = number of users affected (from tags or priority)
  const massMap = { P1: 100, P2: 50, P3: 20, P4: 5 };
  const mass = massMap[ticket.priority] || 20;
  const distance = Math.max(1, ticket.timeLeftMs / 60000); // SLA distance in minutes
  const impact = ticket.priority === 'P1' ? 50 : ticket.priority === 'P2' ? 10 : 1; // users affected
  return (mass * (1 + impact/10)) / (distance * distance);
}

export function calculatePredictiveBreachRisk(ticket: Ticket, teamLoad: number, complexity: number): number {
  // Predictive breach integral: risk = ∫(priority × complexity × teamLoad) dt
  // Simplified: risk = (priorityMass × complexity × teamLoad) / timeLeft
  // Returns 0-100% breach probability
  const massMap = { P1: 100, P2: 50, P3: 20, P4: 5 };
  const mass = massMap[ticket.priority] || 20;
  const timeLeftMin = Math.max(1, ticket.timeLeftMs / 60000);
  const risk = (mass * complexity * (1 + teamLoad/10)) / timeLeftMin;
  return Math.min(100, Math.max(0, risk));
}

export function calculateSLACurve(ticket: Ticket): { time: number; risk: number }[] {
  // Show SLA as curve, not number — visualize breach calculus
  // X: time elapsed (0 to SLA), Y: breach risk (0-100)
  const points = [];
  const totalSLA = 60; // minutes for P1, etc.
  const priorityMass = { P1: 100, P2: 50, P3: 20, P4: 5 }[ticket.priority] || 20;
  
  for (let t = 0; t <= totalSLA; t += 5) {
    const timeLeft = totalSLA - t;
    const risk = timeLeft <= 0 ? 100 : (priorityMass / Math.max(1, timeLeft)) * 10;
    points.push({ time: t, risk: Math.min(100, risk) });
  }
  return points;
}

export function breakdownFirstPrinciples(ticket: Ticket): {
  identity: string;
  device: string;
  policy: string;
  time: string;
  impact: string;
  formula: string;
} {
  // Break down ticket to first principles: who, what, why, when, how many
  return {
    identity: `Who: ${ticket.userEmail} (${ticket.clientName}) — ${ticket.clientId === 'client-b' ? 'SMB needs simple steps' : ticket.clientId === 'client-c' ? 'Regulated needs audit trail' : 'Enterprise needs technical + empathy'}`,
    device: `What: ${ticket.requiredTools.join(', ')} — Device compliance, BitLocker, Company Portal`,
    policy: `Why: ${ticket.rootCause} — ${ticket.errorCodes.join(', ')}`,
    time: `When: ${Math.floor(ticket.timeLeftMs/60000)}m left of ${ticket.priority} SLA — Force=${calculateForce(ticket).toFixed(1)}`,
    impact: `How many: ${ticket.priority === 'P1' ? '50 users payroll blocked' : ticket.priority === 'P2' ? '10 users' : '1 user'} — Gravity Score=${calculateGravityScore(ticket, []).toFixed(2)}`,
    formula: `Triage Score = (PriorityMass × (1+Impact/10)) / (SLADistance²) = ${calculateGravityScore(ticket, []).toFixed(2)}`
  };
}

export const CERT_MAPPING_NEWTON = {
  'beginner': 'MS-900 Microsoft 365 Fundamentals — Understand M365 services',
  'intermediate': 'AZ-800 Administering Windows Server Hybrid Core — ADUC, GPO, OU',
  'advanced': 'SC-300 Microsoft Identity and Access Administrator — Entra ID, CA, What-If',
  'expert': 'MD-102 Endpoint Administrator + SC-300 — Intune, BitLocker, Compliance',
};
