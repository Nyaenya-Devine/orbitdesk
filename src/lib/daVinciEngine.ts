'use client';
// Da Vinci Engine — Visual Anatomy, Notebook, Human-Centered, Golden Ratio
// Leonardo da Vinci: "You cannot fix what you cannot draw"

export const ANATOMICAL_LAYERS = {
  skeleton: {
    title: "Skeleton — OU Tree Structure",
    description: "OU tree is skeleton — domain novatech.com is skull, Users/Groups/Computers are limbs, Finance/IT/HR are fingers. Flat is better — 3 OUs like Da Vinci's perfect proportions.",
    orbitdesk: "OUTreeView shows skeleton. Domain → OU → Users/Groups/Computers. Like anatomical drawing, shows structure.",
    drawing: "Draw domain as skull, OUs as spine, users as fingers. Label counts: Finance 50, IT 12, etc."
  },
  muscle: {
    title: "Muscle — Conditional Access Policies",
    description: "CA policies are muscles — they block movement (access) when device not compliant. Require compliant device is bicep that flexes to block Outlook. Report-Only is relaxed muscle.",
    orbitdesk: "EntraIDCenter shows muscles. 4 CA policies flexing. What-If shows which muscle blocks.",
    drawing: "Draw CA policy as muscle fiber that contracts to block 53000. Show Report-Only as relaxed."
  },
  nervous: {
    title: "Nervous System — GPOs",
    description: "GPOs are nervous system — signals from parent OU flow to child, unless blocked (Block Inheritance) or enforced (Enforced overrides). WMI filter is nerve that only fires in Nairobi.",
    orbitdesk: "GPOManagement shows nervous system. Linking, inheritance, WMI filters, Enforce.",
    drawing: "Draw GPO as nerve impulse from Domain → Finance OU, with Block Inheritance as cut nerve, Enforced as amplified signal."
  },
  circulatory: {
    title: "Circulatory — Intune Compliance Flow",
    description: "Intune compliance is blood flow — enrollment is heart pumping, Company Portal sync is pulse, BitLocker encryption is oxygen. Noncompliant device is blocked artery.",
    orbitdesk: "IntuneDeviceCenter shows circulation. WS-FIN-001 noncompliant = blocked artery, fix BitLocker = unblock.",
    drawing: "Draw compliance flow as blood: AzureADJoined heart → Company Portal pulse → BitLocker oxygen → Compliant healthy."
  },
  injury: {
    title: "Injury — Tickets",
    description: "Tickets are injuries — P1 is fracture, P2 sprain, P3 bruise. Root cause is diagnosis, fix is treatment, audit log is scar.",
    orbitdesk: "TicketQueue shows injuries. P1 fracture needs immediate surgery (logs + tool + language).",
    drawing: "Draw P1 as fracture with X-ray (Sign-in logs), treatment (BitLocker fix), scar (audit log)."
  }
};

export const GOLDEN_RATIO_AGENT = {
  title: "Vitruvian Agent — Perfect Proportions",
  description: "Da Vinci's Vitruvian Man had perfect proportions in golden ratio φ=1.618. Perfect IT agent also has golden ratio: empathy, clarity, technical, fluency, client language.",
  perfectProportions: {
    empathy: 20, // 20% — human
    clarity: 25, // 25% — clear
    technical: 30, // 30% — accurate
    fluency: 15, // 15% — smooth
    clientLanguage: 10, // 10% — adapted
  },
  formula: "Perfect agent = Empathy 20% + Clarity 25% + Technical 30% + Fluency 15% + ClientLang 10% — golden ratio φ",
  orbitdesk: "AssessmentReport shows your proportions vs Vitruvian perfect. Calculate communicationScores empathy, clarity, technicalAccuracy, fluency, clientLanguage.",
};

export function calculateGoldenRatioScore(scores: { empathy: number; clarity: number; technicalAccuracy: number; fluency: number; clientLanguage: number }): number {
  const perfect = GOLDEN_RATIO_AGENT.perfectProportions;
  // Calculate distance from perfect proportions in golden ratio space
  const total = scores.empathy + scores.clarity + scores.technicalAccuracy + scores.fluency + scores.clientLanguage;
  if (total === 0) return 0;
  
  const actual = {
    empathy: (scores.empathy / total) * 100,
    clarity: (scores.clarity / total) * 100,
    technical: (scores.technicalAccuracy / total) * 100,
    fluency: (scores.fluency / total) * 100,
    clientLang: (scores.clientLanguage / total) * 100,
  };
  
  // Distance from perfect — lower distance = higher golden ratio score
  const distance = Math.sqrt(
    Math.pow(actual.empathy - perfect.empathy, 2) +
    Math.pow(actual.clarity - perfect.clarity, 2) +
    Math.pow(actual.technical - perfect.technical, 2) +
    Math.pow(actual.fluency - perfect.fluency, 2) +
    Math.pow(actual.clientLang - perfect.clientLanguage, 2)
  );
  
  return Math.max(0, 100 - distance);
}

export const DAVINCI_NOTEBOOK_PROMPTS = {
  observation: [
    "What did you see in Sign-in logs? CA tab? Correlation ID?",
    "What did dsregcmd status show? AzureADJoined? Compliance?",
    "What did Company Portal say? Last sync? BitLocker?",
    "What did user say? Payroll deadline? Stress level?",
  ],
  sketch: [
    "Draw OU tree: domain → Users Finance 50 → Groups → Computers",
    "Draw CA policy as muscle blocking 53000",
    "Draw GPO as nerve from parent to child with Block Inheritance cut",
    "Draw compliance flow as blood: enrollment heart → BitLocker oxygen",
  ],
  hypothesis: [
    "Why did CA policy block? Because device Compliance NO, policy Require compliant, Report-Only off",
    "Why BitLocker off? User didn't enable, Intune requires encryption",
    "Why shared mailbox not visible? Outlook manual add needed, webmail auto",
    "Why Teams presence stuck? Client cache, need clear or presence reset",
  ],
  mirror: "Da Vinci wrote backwards (mirror) — try PowerShell mirrored: }oofnI-tseT{ → {Test-Info} — easter egg"
};

export function generateDaVinciObservation(ticket: any, portalLog: string[]): string {
  return `Observation: ${ticket.code} ${ticket.title}. User: ${ticket.userEmail} ${ticket.clientName}. Error: ${ticket.errorCodes.join(', ')}. Tools: ${ticket.requiredTools.join(', ')}. Portal actions: ${portalLog.slice(0,3).join('; ')}. Like Da Vinci observing anatomy, I see structure, muscle, nerve, injury.`;
}
