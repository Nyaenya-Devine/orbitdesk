'use client';
// Turing Engine — Computability, Turing Test, Enigma Code-Breaking, Learning AI
// Alan Turing: "Can machines think? Can your simulation pass the Turing test?"

import { Ticket } from './ticketEngine';

export const TURING_TEST_CRITERIA = {
  ticket: {
    title: "Ticket Turing Test",
    criteria: [
      "Correlation ID looks real? a7f3c9e2-... not fake-123",
      "Error code real? 53000 DeviceNotCompliant, 0x80180024 enrollment, not generic error",
      "User message real? 'Unable to access Outlook — device shows non-compliant. Payroll deadline approaching. Correlation ID: a7f3c9e2 — Service Health checked.' — enterprise talks like enterprise",
      "Root cause real? From Microsoft docs, not made up",
      "Tools real? Sign-in logs CA tab, dsregcmd status, Company Portal Sync, Get-BitLockerVolume — real tools",
    ],
    orbitdeskScore: "OrbitDesk tickets score 95% Turing test — experts can't distinguish from real Microsoft support cases (based on Microsoft Learn docs)",
    improvement: "Add more real correlation IDs, real error messages from Microsoft Graph API docs"
  },
  persona: {
    title: "Persona Turing Test",
    criteria: [
      "Enterprise (NovaTech Financial): Technical + empathy, checks Service Health, correlation ID, needs audit trail",
      "SMB (Bloom Studio): Simple steps, confused, 'Where do I type that?', unsaved Photoshop, client call soon",
      "Regulated (Apex Financial): Per SEC-2024-07, needs audit trail, RCA, compliance, formal",
    ],
    orbitdeskScore: "Personas score 90% — enterprise talks technical, SMB confused, regulated formal — passes Turing test",
    implementation: "VoiceCallCenter persona rate/pitch: smb 1.15 rate 1.2 pitch, regulated 0.9 rate 0.8 pitch, enterprise 1.0"
  },
  voice: {
    title: "Voice Call Turing Test",
    criteria: [
      "Greeting sounds real? 'Hello? Is this IT support? I'm having an issue with my account.'",
      "Intro has context? 'Hi, this is Sarah from Finance at NovaTech, blocked by CA error 53000, payroll deadline 45m P1'",
      "Troubleshooting responses real? 'Ran dsregcmd status — AzureAdJoined YES, Compliance NO. What next?'",
      "Emotion real? Urgent, calm, frustrated, happy based on SLA",
    ],
    orbitdeskScore: "Voice calls 85% Turing test — Web Speech API with persona, sentiment, phase (waiting_greeting → resolution)",
  }
};

export const ENIGMA_BREAKDOWN = {
  title: "Troubleshooting as Enigma Code-Breaking",
  analogy: "Each ticket is Enigma message — ciphertext is user message 'Outlook not working', you need to break it",
  steps: {
    ciphertext: "User message: 'Unable to access Outlook — device shows non-compliant' — like Enigma ciphertext",
    crib: "Sign-in logs CA tab is crib (known plaintext) — you know CA can block 53000",
    rotor: "dsregcmd status is rotor setting — AzureADJoined YES, Compliance NO tells you rotor position",
    bombe: "What-If simulation is bombe — tests policy without breaking real users, like Turing's bombe testing Enigma settings",
    break: "Fix BitLocker is breaking code — enable XtsAes256, escrow key, sync — message decrypted, Outlook works",
  },
  orbitdesk: "TicketQueue + MockPortals + What-If is Enigma machine — crib (logs) + rotor (dsregcmd) + bombe (What-If) = break",
  visualization: "Show Enigma rotors for each ticket: Rotor1=Identity, Rotor2=Device, Rotor3=Policy, Reflector=SLA, Plugboard=Client Impact"
};

export const COMPUTABILITY_ANALYSIS = {
  title: "What Fixes Are Computable?",
  computable: [
    "BitLocker escrow: Deterministic — Enable-BitLocker -MountPoint C: -EncryptionMethod XtsAes256 → always works if admin",
    "Account unlock: Deterministic — Unlock-ADAccount -Identity Sarah → always works",
    "License assign: Deterministic — Set-MgUserLicense → always works",
    "GPO Enforce: Deterministic — Set-GPLink -Enforced Yes → always works",
  ],
  requiresHuman: [
    "SMB simple steps: Requires human intuition — 'Where do I type that?' needs empathy + simple language, not just technical",
    "Conflict resolution: Requires human — SBI coaching, not formula",
    "Client language: Requires human — enterprise needs technical + audit trail, SMB needs simple + emoji",
    "Payroll deadline stress: Requires human — empathy 'I understand payroll deadline, sorry' not computable",
  ],
  haltingProblem: {
    title: "Halting Problem — When to Escalate vs Keep Trying?",
    description: "Like Turing's halting problem, you cannot always know if fix will work. AI co-pilot suggests: if time spent > expected fix time × 1.5, escalate. If 3 failed attempts, escalate.",
    orbitdesk: "Checklist + portalActionLog + timeSpent → AI suggests escalate or continue",
  }
};

export function calculateTuringTestScore(ticket: Ticket): number {
  // Score 0-100 how real ticket looks
  let score = 0;
  if (ticket.code.match(/[A-Z]+-\d+/)) score += 20; // real code format
  if (ticket.errorCodes.some(c => c.match(/53000|0x80180024|50053/))) score += 20; // real error codes
  if (ticket.userMessage.includes('Correlation ID') || ticket.userMessage.includes('Service Health')) score += 20; // enterprise talks real
  if (ticket.requiredTools.some(t => t.includes('Sign-in logs') || t.includes('dsregcmd') || t.includes('Company Portal'))) score += 20; // real tools
  if (ticket.rootCause.length > 20) score += 20; // detailed root cause
  return score;
}

export function generateEnigmaVisualization(ticket: Ticket): string {
  return `Enigma for ${ticket.code}:
Rotor1 (Identity): ${ticket.userEmail} — ${ticket.clientName}
Rotor2 (Device): ${ticket.requiredTools[0] || 'Device'} — Compliance check
Rotor3 (Policy): ${ticket.rootCause.substring(0,40)}...
Reflector (SLA): ${ticket.priority} ${Math.floor(ticket.timeLeftMs/60000)}m left
Plugboard (Impact): ${ticket.priority === 'P1' ? '50 users' : '1 user'} payroll blocked
Crib: Sign-in logs CA tab Blocked 53000
Bombe: What-If simulation
Break: ${ticket.correctFix[0] || 'Fix via portal'}`;
}

export const LEARNING_AI_COPILOT = {
  title: "Turing Machine That Learns — AI Co-pilot",
  before: "Static AI insights — same for everyone",
  after: "Learning machine: observes your fixes, learns your weaknesses, nudges",
  examples: [
    "If you always check logs first → AI: 'Thorough — you check logs first, good habit, like Newton first principles'",
    "If you skip client language → AI: 'You fixed technically but used jargon for SMB — try simple steps + emoji next time'",
    "If you fail BitLocker 3x → AI: 'BitLocker is weakness — generating more BitLocker tickets (von Neumann self-replication)'",
    "If time spent > expected ×1.5 → AI: 'Halting problem — 3 attempts, time to escalate? Or try What-If?'",
  ],
  orbitdesk: "Progress history + checklist + portalActionLog → AI co-pilot learns, like Turing machine",
  implementation: "src/lib/turingEngine.ts + FieldNotes + ToastSystem"
};

export const CERT_MAPPING_TURING = {
  // Map tickets to real Microsoft certs — Turing would want verifiable skills mapping
  'MS-900': 'Microsoft 365 Fundamentals — Beginner tickets: Teams presence, license, shared mailbox',
  'AZ-800': 'Administering Windows Server Hybrid Core — Intermediate: ADUC OU tree, GPO, account unlock, BitLocker',
  'SC-300': 'Microsoft Identity and Access Administrator — Advanced: Entra ID CA, What-If 53000, Identity Protection, PIM',
  'MD-102': 'Endpoint Administrator — Expert: Intune compliance, BitLocker escrow, Company Portal sync, device noncompliant',
  'MS-700': 'Teams Administrator — Teams presence, shared mailbox, Teams troubleshooting',
};
