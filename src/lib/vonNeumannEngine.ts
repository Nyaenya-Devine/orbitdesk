'use client';
// von Neumann Engine — Game Theory, Architecture, Self-Replication, Cellular Automata
// John von Neumann: "The game is not about winning — it's about not losing too much"

import { Ticket } from './ticketEngine';

export const PAYOFF_MATRIX = {
  // Payoff for resolving tickets — game vs time
  // Rows: your action, Columns: time's action (breach or not)
  // Payoff = XP + CSAT impact
  P1_resolve: { breach: 5, noBreach: 50, description: "P1 resolve before breach: +50 XP, +CSAT. After breach: +5 XP, -CSAT" },
  P1_breach: { breach: -100, noBreach: 0, description: "P1 breach: -100 XP, -CSAT, SLA fail" },
  P2_resolve: { breach: 10, noBreach: 20, description: "P2 resolve: +20 XP" },
  P2_breach: { breach: -20, noBreach: 0, description: "P2 breach: -20 XP" },
  P3_resolve: { breach: 5, noBreach: 10, description: "P3 resolve: +10 XP" },
  conflict_resolve: { payoff: 15, description: "Conflict resolve via SBI: +15 XP" },
};

export function calculateExpectedPayoff(ticket: Ticket, teamLoad: number, agentSkill: number): number {
  // Expected payoff = (prob success × payoff success) + (prob breach × payoff breach)
  // prob success based on agent skill, team load, time left, complexity
  const baseProb = 0.8; // 80% base success if you check logs + tool
  const skillBonus = agentSkill / 100 * 0.2; // skill adds up to 20%
  const loadPenalty = teamLoad / 10 * 0.1; // team load 0-10 reduces prob up to 10%
  const timePressure = ticket.timeLeftMs < 5*60*1000 ? -0.2 : 0; // <5m left reduces prob 20%
  
  const probSuccess = Math.max(0.1, Math.min(0.95, baseProb + skillBonus - loadPenalty + timePressure));
  const probBreach = 1 - probSuccess;
  
  const payoffMap = {
    P1: { success: 50, breach: -100 },
    P2: { success: 20, breach: -20 },
    P3: { success: 10, breach: -5 },
    P4: { success: 5, breach: -2 },
  };
  const payoff = payoffMap[ticket.priority] || payoffMap.P3;
  
  return probSuccess * payoff.success + probBreach * payoff.breach;
}

export function minimaxTriage(tickets: Ticket[], agents: any[]): { ticketId: string; agentId: string; expectedPayoff: number }[] {
  // Minimax: minimize maximum loss — allocate best agent to highest risk ticket
  // Like chess, think 2 moves ahead: if you don't fix P1 now, it breaches, you lose 100
  // So you fix P1 now even if P2 also waiting
  
  const allocations: { ticketId: string; agentId: string; expectedPayoff: number }[] = [];
  const sortedTickets = [...tickets]
    .filter(t => t.status !== 'resolved')
    .sort((a, b) => {
      // Sort by force (Newton) + expected payoff (von Neumann)
      const forceA = (a.priority === 'P1' ? 100 : a.priority === 'P2' ? 50 : 20) / Math.max(1, a.timeLeftMs/60000);
      const forceB = (b.priority === 'P1' ? 100 : b.priority === 'P2' ? 50 : 20) / Math.max(1, b.timeLeftMs/60000);
      return forceB - forceA;
    });
  
  const availableAgents = [...agents].sort((a, b) => b.skill - a.skill); // best skill first
  
  for (let i = 0; i < Math.min(sortedTickets.length, availableAgents.length); i++) {
    const ticket = sortedTickets[i];
    const agent = availableAgents[i];
    const payoff = calculateExpectedPayoff(ticket, agents.filter(a => a.currentTickets > 0).length, agent.skill || 70);
    allocations.push({ ticketId: ticket.id, agentId: agent.id, expectedPayoff: payoff });
  }
  
  return allocations;
}

export function calculateNashEquilibrium(tickets: Ticket[], agents: any[]): string {
  // Nash equilibrium: no agent can improve payoff by changing ticket alone
  // In OrbitDesk: if all P1 assigned to best agents, and P2 to others, that's Nash — no one benefits by swapping
  const p1Count = tickets.filter(t => t.priority === 'P1').length;
  const bestAgents = agents.filter(a => a.skill > 80).length;
  
  if (p1Count <= bestAgents) {
    return "Nash Equilibrium: P1 tickets assigned to best agents (skill>80), no agent benefits by swapping — optimal allocation, like von Neumann's minimax theorem";
  } else {
    return "No Nash: Not enough best agents for P1s — need to train agents or reduce P1 rate. Game is unbalanced.";
  }
}

export function selfReplicatingTickets(ticketsResolved: number, weaknesses: Record<string, number>, studentMode: boolean): string[] {
  // Self-replicating lab: generates more tickets of types you fail
  // Like cellular automata, lab evolves based on your play
  // Weaknesses: { 'BitLocker': 3 fails, 'Entra': 1 fail, 'GPO': 0 fails } → generate more BitLocker
  const sortedWeaknesses = Object.entries(weaknesses).sort((a, b) => b[1] - a[1]);
  const topWeakness = sortedWeaknesses[0]?.[0] || 'general';
  
  if (topWeakness === 'BitLocker') {
    return ['INTUNE-881 BitLocker off', 'INTUNE-882 BitLocker key not escrowed', 'INTUNE-883 BitLocker policy not applied'];
  } else if (topWeakness === 'Entra') {
    return ['ENTRA-53000 DeviceNotCompliant', 'ENTRA-53003 Location block', 'ENTRA-50053 Account locked'];
  } else if (topWeakness === 'GPO') {
    return ['GPO-101 Inheritance blocked', 'GPO-102 WMI filter fail', 'GPO-103 Enforced override'];
  } else {
    return ['General tickets based on level'];
  }
}

export const VON_NEUMANN_ARCHITECTURE = {
  title: "von Neumann Architecture — Stored-Program OrbitDesk",
  before: "20+ useState spaghetti — state everywhere, hard to reason, like early computers with plugboards",
  after: "Single orbitReducer — tickets are instructions (program), fixes are opcodes, state is memory, reducer is CPU — stored-program, single source of truth",
  benefits: [
    "Single source of truth — no state sync bugs",
    "Time-travel debugging — replay actions",
    "Self-modifying — lab learns from weaknesses",
    "Predictable — pure function reducer",
    "Testable — reducer is pure, easy to test"
  ],
  orbitdesk: "src/lib/orbitReducer.ts implements this — 30 actions, one state, like von Neumann architecture"
};

export const CELLULAR_AUTOMATA_TEAM = {
  title: "Team as Cellular Automata",
  description: "Each agent is cell, state: online, in-call, offline, conflict. State affects neighbors: if Alex conflicts with Priya, both mood drops, neighbors' load increases. Conflict spreads like infection, resolution via SBI coaching heals neighbors.",
  orbitdesk: "AgentRoster shows cellular automata — mood, conflictWith, currentTickets. Resolve conflict heals team.",
};
