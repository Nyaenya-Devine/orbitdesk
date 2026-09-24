'use client';

export interface StudentProgress {
 sessionId: string;
 startTime: number;
 ticketsResolved: number;
 ticketsBreached: number;
 avgCSAT: number;
 avgQA: number;
 totalTimeMs: number;
 communicationScores: {
 empathy: number; // 0-100 — did you say sorry, understand, thank you
 clarity: number; // 0-100 — simple language for SMB, technical for enterprise
 technicalAccuracy: number; // 0-100 — correct logs, tools, RCA
 fluency: number; // 0-100 — words per minute, filler words, pace
 clientLanguage: number; // 0-100 — used client language (Bloom simple + emojis, Apex SEC-2024-07)
 };
 slaCompliance: number; // 0-100
 callsHandled: number;
 callScores: {
 duration: number;
 empathy: number;
 resolution: number;
 clientSatisfaction: number;
 }[];
 level: number;
 xp: number;
 streak: number;
 badges: string[];
 history: {
 timestamp: number;
 action: string;
 ticketCode?: string;
 score?: number;
 }[];
}

export const initialProgress: StudentProgress = {
 sessionId: `sess_${Math.random().toString(36).substring(7)}_${Date.now()}`,
 startTime: Date.now(),
 ticketsResolved: 0,
 ticketsBreached: 0,
 avgCSAT: 0,
 avgQA: 0,
 totalTimeMs: 0,
 communicationScores: {
 empathy: 0,
 clarity: 0,
 technicalAccuracy: 0,
 fluency: 0,
 clientLanguage: 0,
 },
 slaCompliance: 100,
 callsHandled: 0,
 callScores: [],
 level: 1,
 xp: 0,
 streak: 0,
 badges: [],
 history: [],
};

// Advanced language understanding — no external AI, pure client-side heuristics
// Communication scoring based on MSP quality assurance rubrics

const EMPATHY_PATTERNS = {
 apology: [
  /orry/i, /apologize/i, /apologies/i, /my apologies/i, /apologise/i,
  /i understand.*frustrat/i, /must be frustrat/i, /i know.*difficult/i
 ],
 acknowledgment: [
  /i understand/i, /i see/i, /got it/i, /i hear you/i, /that makes sense/i,
  /i appreciate/i, /thanks for.*(letting|sharing|checking|patience)/i,
  /thank you for/i, /appreciate.*patience/i, /i get it/i
 ],
 reassurance: [
  /i'll (help|take care|sort|fix|look into)/i, /let me (help|check|look|see)/i,
  /we'll (get|sort|fix|resolve)/i, /don't worry/i, /i've got you/i,
  /i will.*(help|assist|resolve|fix)/i, /rest assured/i, /be with you/i
 ],
 personalization: [
  /your (payroll|presentation|deadline|meeting)/i, /i know.*(important|urgent|deadline)/i,
  /for your (team|client|work)/i, /i understand.*(time|pressure|stress)/i
 ],
 gratitude: [
  /thank/i, /thanks/i, /appreciate/i, /grateful/i
 ],
};

const CLARITY_PATTERNS = {
 structure: [
  /tep \d/i, /first,.*second/i, /1\.\s.*2\.\s/i, /- [\s\S]*?- /, /•/,
  /to (do|fix|resolve).*?:/i, /here's what/i, /let's do this/i
 ],
 simpleLanguage: [
  /click/i, /open/i, /go to/i, /type/i, /press/i, /elect/i,
  /imple/i, /easy/i, /just/i, /quick/i
 ],
 technicalPrecision: [
  /correlation id/i, /ign-?in logs/i, /conditional access/i, /ca tab/i,
  /what if/i, /audit logs/i, /device.*compliant/i, /entra id/i,
  /intune/i, /compliance policy/i, /dsregcmd/i, /get-bitlocker/i
 ],
 regulatedFormal: [
  /per policy/i, /ec-2024-07/i, /audit trail/i, /rca/i, /root cause/i,
  /compliance/i, /escrow/i, /key.*escrow/i, /attestation/i,
  /per sec/i, /as per/i, /in accordance/i
 ],
 conciseness: {
  smb: { min: 10, max: 40, ideal: 25 },
  enterprise: { min: 15, max: 80, ideal: 45 },
  regulated: { min: 20, max: 100, ideal: 60 },
 }
};

const TECHNICAL_PATTERNS = {
 diagnostics: [
  /ign-?in logs/i, /audit logs/i, /ervice health/i, /message trace/i,
  /dsregcmd/i, /company portal/i, /bitlocker/i, /get-bitlocker/i,
  /what if/i, /conditional access/i, /compliance/i, /enrollment/i
 ],
 toolUsage: [
  /entra.*admin/i, /intune.*admin/i, /exchange.*admin/i, /teams.*admin/i,
  /check.*logs/i, /run.*status/i, /ync/i, /enable/i, /disable/i
 ],
 rca: [
  /because/i, /due to/i, /root cause/i, /rca/i, /reason.*is/i,
  /caused by/i, /policy.*without.*report-only/i, /without.*report-only/i
 ],
 remediation: [
  /fix.*by/i, /resolve.*by/i, /to fix/i, /olution/i, /remediation/i,
  /revert.*report-only/i, /enable.*bitlocker/i, /check.*status/i
 ],
};

const FLUENCY_PATTERNS = {
 filler: [
  /\bum\b/gi, /\buh\b/gi, /\blike\b/gi, /\byou know\b/gi, /\bso\b/gi, /\bactually\b/gi,
  /\bkind of\b/gi, /\bsort of\b/gi, /\bI mean\b/gi, /\bwell\b/gi
 ],
 repetition: /(\b\w+\b)(?:\s+\1){1,}/gi,
 grammar: {
  doubleSpace: /  +/g,
  caps: /[A-Z]{4,}/,
  punctuation: /[.!?]{2,}/,
 },
 confidence: [
  /i think maybe/i, /not sure/i, /might be/i, /could be/i, /probably/i,
  /i guess/i, /i'm not sure/i
 ],
};

const CLIENT_LANGUAGE_PATTERNS = {
 smb: {
  simple: [/imple/i, /easy/i, /quick/i, /no jargon/i, /tep-by-step/i],
  emoji: [/😅|🥺|😰|🙏|⭐|📎|💜|😊/u],
  friendly: [/please/i, /thanks/i, /thank you/i, /happy to help/i, /no worries/i],
  avoidJargon: [/device.*compliant/i, /conditional access/i, /entra/i],
 },
 enterprise: {
  technical: [/correlation id/i, /ervice health/i, /ign-in logs/i, /ca tab/i, /what if/i],
  professional: [/per/i, /audit/i, /rca/i, /remediation/i, /escalation/i],
  structured: [/first/i, /econd/i, /next/i, /then/i, /finally/i],
 },
 regulated: {
  formal: [/per policy/i, /ec-2024-07/i, /audit trail/i, /compliance/i, /escrow/i],
  precise: [/confirm/i, /verify/i, /attestation/i, /in accordance/i],
  documentation: [/document/i, /record/i, /log/i, /trail/i],
 }
};

export function calculateCommunicationScore(
 userMessage: string,
 clientPersona: 'enterprise' | 'smb' | 'regulated',
 context: { usedClientLanguage: boolean; checkedLogs: boolean; usedCorrectTool: boolean }
): StudentProgress['communicationScores'] {
 const lower = userMessage.toLowerCase();
 const words = userMessage.split(/\s+/).filter(w => w.length > 0);
 const wordCount = words.length;
 const sentences = userMessage.split(/[.!?]+/).filter(s => s.trim().length > 0);
 const sentenceCount = sentences.length || 1;
 const avgWordsPerSentence = wordCount / sentenceCount;

 // === EMPATHY — Advanced ===
 let empathy = 0;
 let empathyDetails: string[] = [];

 // Apology detection
 const apologyMatches = EMPATHY_PATTERNS.apology.filter(p => p.test(userMessage));
 if (apologyMatches.length > 0) {
  empathy += 30;
  empathyDetails.push(`apology (${apologyMatches.length})`);
 }
 // Acknowledgment
 const ackMatches = EMPATHY_PATTERNS.acknowledgment.filter(p => p.test(userMessage));
 if (ackMatches.length > 0) {
  empathy += 20 + Math.min(15, ackMatches.length * 5);
  empathyDetails.push(`acknowledgment (${ackMatches.length})`);
 }
 // Reassurance
 const reassureMatches = EMPATHY_PATTERNS.reassurance.filter(p => p.test(userMessage));
 if (reassureMatches.length > 0) {
  empathy += 15 + Math.min(10, reassureMatches.length * 5);
  empathyDetails.push(`reassurance`);
 }
 // Personalization
 const personalMatches = EMPATHY_PATTERNS.personalization.filter(p => p.test(userMessage));
 if (personalMatches.length > 0) {
  empathy += 15;
  empathyDetails.push(`personalization`);
 }
 // Gratitude
 const gratitudeMatches = EMPATHY_PATTERNS.gratitude.filter(p => p.test(userMessage));
 if (gratitudeMatches.length > 0) {
  empathy += 10;
  empathyDetails.push(`gratitude`);
 }
 // Length bonus — not too short, shows effort
 if (wordCount >= 15 && wordCount <= 60) empathy += 10;
 else if (wordCount > 60 && wordCount <= 100) empathy += 5;
 // Client name usage (if message contains name-like)
 if (/[A-Z][a-z]+/.test(userMessage) && wordCount > 10) empathy += 5;

 empathy = Math.min(100, empathy);

 // === CLARITY — Advanced, persona-aware ===
 let clarity = 0;
 let clarityDetails: string[] = [];

 // Structure detection
 const structureMatches = CLARITY_PATTERNS.structure.filter(p => p.test(userMessage));
 if (structureMatches.length > 0) {
  clarity += 25;
  clarityDetails.push(`structured steps`);
 }
 // Check for numbered or bulleted list
 if (/\d+\.\s/.test(userMessage) || /[-•]\s/.test(userMessage)) {
  clarity += 15;
  clarityDetails.push(`list format`);
 }

 if (clientPersona === 'smb') {
  // SMB wants simple, no jargon, actionable
  const simpleMatches = CLARITY_PATTERNS.simpleLanguage.filter(p => p.test(lower));
  clarity += Math.min(35, simpleMatches.length * 8);
  if (simpleMatches.length > 0) clarityDetails.push(`simple language (${simpleMatches.length})`);
  
  // Penalize jargon for SMB
  const jargonCount = (lower.match(/entra|conditional access|device.*compliant|correlation id|audit logs/gi) || []).length;
  if (jargonCount > 0) {
   clarity -= jargonCount * 8;
   clarityDetails.push(`jargon penalty (-${jargonCount * 8})`);
  } else {
   clarity += 15;
   clarityDetails.push(`no jargon +15`);
  }
  
  // Conciseness for SMB
  const { min, max, ideal } = CLARITY_PATTERNS.conciseness.smb;
  if (wordCount >= min && wordCount <= max) {
   const dist = Math.abs(wordCount - ideal);
   clarity += Math.max(0, 20 - dist);
   clarityDetails.push(`concise SMB`);
  } else if (wordCount < min) {
   clarity -= 10;
  }
  
  // Emoji for SMB is clarity (friendly)
  if (/😅|🥺|😊|🙏|⭐/u.test(userMessage)) {
   clarity += 10;
   clarityDetails.push(`emoji friendly`);
  }
 } else if (clientPersona === 'enterprise') {
  // Enterprise wants technical precision + structure
  const techMatches = CLARITY_PATTERNS.technicalPrecision.filter(p => p.test(lower));
  clarity += Math.min(40, techMatches.length * 10);
  if (techMatches.length > 0) clarityDetails.push(`technical precision (${techMatches.length})`);
  
  // Detailed for enterprise
  const { min, max, ideal } = CLARITY_PATTERNS.conciseness.enterprise;
  if (wordCount >= min && wordCount <= max) {
   const dist = Math.abs(wordCount - ideal);
   clarity += Math.max(0, 25 - dist * 0.5);
   clarityDetails.push(`detailed enterprise`);
  }
  
  // Correlation ID, logs, etc. are clarity for enterprise
  if (/correlation/i.test(lower)) clarity += 10;
  if (/ign-in logs|audit logs|what if/i.test(lower)) clarity += 10;
 } else {
  // Regulated wants formal + audit trail
  const formalMatches = CLARITY_PATTERNS.regulatedFormal.filter(p => p.test(lower));
  clarity += Math.min(50, formalMatches.length * 12);
  if (formalMatches.length > 0) clarityDetails.push(`formal regulated (${formalMatches.length})`);
  
  const { min, max } = CLARITY_PATTERNS.conciseness.regulated;
  if (wordCount >= min && wordCount <= max) clarity += 20;
 }

 // Readability — avg words per sentence
 if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 20) {
  clarity += 10;
  clarityDetails.push(`readable sentence length`);
 } else if (avgWordsPerSentence > 25) {
  clarity -= 5;
  clarityDetails.push(`long sentences penalty`);
 }

 clarity = Math.max(0, Math.min(100, clarity));

 // === TECHNICAL ACCURACY — Advanced ===
 let technical = 0;
 let techDetails: string[] = [];

 if (context.checkedLogs) {
  technical += 35;
  techDetails.push(`checked logs +35`);
 }
 if (context.usedCorrectTool) {
  technical += 35;
  techDetails.push(`correct tool +35`);
 }

 const diagMatches = TECHNICAL_PATTERNS.diagnostics.filter(p => p.test(lower));
 technical += Math.min(20, diagMatches.length * 5);
 if (diagMatches.length > 0) techDetails.push(`diagnostics (${diagMatches.length})`);

 const rcaMatches = TECHNICAL_PATTERNS.rca.filter(p => p.test(lower));
 if (rcaMatches.length > 0) {
  technical += 15;
  techDetails.push(`RCA mentioned`);
 }

 const remediationMatches = TECHNICAL_PATTERNS.remediation.filter(p => p.test(lower));
 if (remediationMatches.length > 0) {
  technical += 10;
  techDetails.push(`remediation steps`);
 }

 // Penalize if no technical content but context says should have
 if (!context.checkedLogs && !context.usedCorrectTool && diagMatches.length === 0) {
  technical = Math.max(0, technical - 20);
 }

 technical = Math.min(100, technical);

 // === FLUENCY — Advanced ===
 let fluency = 100;
 let fluencyDetails: string[] = [];

 // Filler words
 let fillerCount = 0;
 FLUENCY_PATTERNS.filler.forEach(pattern => {
  const matches = userMessage.match(pattern);
  if (matches) fillerCount += matches.length;
 });
 if (fillerCount > 0) {
  fluency -= fillerCount * 8;
  fluencyDetails.push(`filler -${fillerCount * 8}`);
 }

 // Repetition
 const repetitionMatches = userMessage.match(FLUENCY_PATTERNS.repetition);
 if (repetitionMatches) {
  fluency -= repetitionMatches.length * 10;
  fluencyDetails.push(`repetition -${repetitionMatches.length * 10}`);
 }

 // Grammar checks
 const doubleSpaces = (userMessage.match(FLUENCY_PATTERNS.grammar.doubleSpace) || []).length;
 if (doubleSpaces > 2) {
  fluency -= 5;
  fluencyDetails.push(`formatting`);
 }

 if (FLUENCY_PATTERNS.grammar.caps.test(userMessage) && wordCount > 10) {
  fluency -= 10;
  fluencyDetails.push(`caps penalty`);
 }

 // Confidence — avoid "I think maybe", "not sure"
 const confidenceMatches = FLUENCY_PATTERNS.confidence.filter(p => (p as RegExp).test ? (p as RegExp).test(lower) : lower.includes(p as unknown as string));
 let lowConfidenceCount = 0;
 [/i think maybe/i, /not sure/i, /might be/i, /could be/i, /probably/i, /i guess/i].forEach(p => {
  if (p.test(lower)) lowConfidenceCount++;
 });
 if (lowConfidenceCount > 0) {
  fluency -= lowConfidenceCount * 7;
  fluencyDetails.push(`low confidence -${lowConfidenceCount * 7}`);
 }

 // Length checks
 if (wordCount < 5) {
  fluency -= 25;
  fluencyDetails.push(`too short -25`);
 } else if (wordCount > 120) {
  fluency -= 10;
  fluencyDetails.push(`too long -10`);
 } else if (wordCount >= 15 && wordCount <= 80) {
  fluency += 5;
  fluencyDetails.push(`ideal length +5`);
 }

 // Sentence variety
 if (sentenceCount >= 2 && sentenceCount <= 6) {
  fluency += 5;
 }

 fluency = Math.max(0, Math.min(100, fluency));

 // === CLIENT LANGUAGE — Advanced, persona-specific ===
 let clientLang = 0;
 let langDetails: string[] = [];

 if (context.usedClientLanguage) {
  clientLang = 85;
  langDetails.push(`checklist flag +85`);
 } else {
  if (clientPersona === 'smb') {
   const simpleMatches = CLIENT_LANGUAGE_PATTERNS.smb.simple.filter(p => p.test(lower));
   clientLang += Math.min(30, simpleMatches.length * 10);
   
   const emojiMatches = userMessage.match(CLIENT_LANGUAGE_PATTERNS.smb.emoji[0]);
   if (emojiMatches) {
    clientLang += 20;
    langDetails.push(`emoji +20`);
   }
   
   const friendlyMatches = CLIENT_LANGUAGE_PATTERNS.smb.friendly.filter(p => p.test(lower));
   clientLang += Math.min(20, friendlyMatches.length * 7);
   
   // Avoid jargon for SMB is good
   const hasJargon = CLIENT_LANGUAGE_PATTERNS.smb.avoidJargon.some(p => p.test(lower));
   if (!hasJargon && wordCount > 10) {
    clientLang += 25;
    langDetails.push(`no jargon SMB +25`);
   } else if (hasJargon) {
    clientLang -= 15;
    langDetails.push(`jargon penalty SMB -15`);
   }
  } else if (clientPersona === 'enterprise') {
   const techMatches = CLIENT_LANGUAGE_PATTERNS.enterprise.technical.filter(p => p.test(lower));
   clientLang += Math.min(40, techMatches.length * 12);
   
   const profMatches = CLIENT_LANGUAGE_PATTERNS.enterprise.professional.filter(p => p.test(lower));
   clientLang += Math.min(25, profMatches.length * 8);
   
   const structMatches = CLIENT_LANGUAGE_PATTERNS.enterprise.structured.filter(p => p.test(lower));
   if (structMatches.length >= 2) {
    clientLang += 20;
    langDetails.push(`structured enterprise +20`);
   }
   
   // Enterprise should NOT use too many emojis
   const emojiCount = (userMessage.match(/😅|🥺|😰|😊|🙏/gu) || []).length;
   if (emojiCount > 2) {
    clientLang -= 10;
    langDetails.push(`too many emojis enterprise -10`);
   }
  } else {
   // Regulated
   const formalMatches = CLIENT_LANGUAGE_PATTERNS.regulated.formal.filter(p => p.test(lower));
   clientLang += Math.min(45, formalMatches.length * 15);
   
   const preciseMatches = CLIENT_LANGUAGE_PATTERNS.regulated.precise.filter(p => p.test(lower));
   clientLang += Math.min(25, preciseMatches.length * 8);
   
   const docMatches = CLIENT_LANGUAGE_PATTERNS.regulated.documentation.filter(p => p.test(lower));
   if (docMatches.length > 0) {
    clientLang += 15;
    langDetails.push(`documentation +15`);
   }
  }
 }

 // Bonus for using client name or company
 if (/novatech|bloom|apex/i.test(lower) && wordCount > 10) {
  clientLang += 10;
  langDetails.push(`client name +10`);
 }

 clientLang = Math.max(0, Math.min(100, clientLang));

 // Debug log for advanced understanding (only in dev)
 if (typeof window !== 'undefined' && (window as any).DEBUG_ORBITDESK) {
  console.log('Advanced Score:', {
   empathy: { score: empathy, details: empathyDetails },
   clarity: { score: clarity, details: clarityDetails },
   technical: { score: technical, details: techDetails },
   fluency: { score: fluency, details: fluencyDetails },
   clientLang: { score: clientLang, details: langDetails },
   wordCount, sentenceCount, avgWordsPerSentence
  });
 }

 return {
 empathy,
 clarity,
 technicalAccuracy: technical,
 fluency,
 clientLanguage: clientLang,
 };
}

export function calculateSLACompliance(ticketsResolved: number, ticketsBreached: number): number {
 if (ticketsResolved + ticketsBreached === 0) return 100;
 return Math.round((ticketsResolved / (ticketsResolved + ticketsBreached)) * 100);
}

export function calculateLevel(xp: number): number {
 return Math.floor(xp / 100) + 1;
}

export function getLevelInfo(level: number): { title: string; description: string; unlocks: string[]; color: string; orbitRings: number; cert: string; certPath: string } {
 switch (level) {
  case 1:
   return { title: 'Orbit Initiate', description: 'Welcome to OrbitDesk — learning M365 fundamentals', unlocks: ['Beginner tickets', 'MFA, DeviceCap, Teams presence'], color: 'emerald', orbitRings: 1, cert: 'MS-900', certPath: 'Microsoft 365 Fundamentals — Understand M365 services, Teams, Entra ID basics' };
  case 2:
   return { title: 'Desk Cadet', description: 'M365 basics + support fundamentals', unlocks: ['Mixed beginner', 'License, shared mailbox'], color: 'blue', orbitRings: 1, cert: 'MS-900', certPath: 'MS-900 Fundamentals — Licensing, Exchange Online, SharePoint basics' };
  case 3:
   return { title: 'Support Specialist', description: 'Ready for intermediate — hybrid identity', unlocks: ['Intermediate unlock', 'CA DeviceNotCompliant 53000, Enrollment 0x80180024'], color: 'violet', orbitRings: 2, cert: 'AZ-800', certPath: 'AZ-800 Hybrid Core — ADUC, OU tree, GPO, AD DS, ADUC Recycle Bin, PowerShell History' };
  case 4:
   return { title: 'Compliance Operator', description: 'Handling compliance & quarantine — Intune', unlocks: ['BitLocker, Quarantine release', 'Higher P1 rate 10%'], color: 'amber', orbitRings: 2, cert: 'AZ-800 + MD-102', certPath: 'AZ-800 + MD-102 Endpoint — Intune compliance, BitLocker, Company Portal sync, encryption' };
  case 5:
   return { title: 'Intune Navigator', description: 'Mastering device management — endpoint', unlocks: ['Advanced prep', 'Location CA, Account lock'], color: 'indigo', orbitRings: 3, cert: 'MD-102', certPath: 'MD-102 Endpoint Administrator — Device enrollment, compliance policies, BitLocker escrow, Remote Help' };
  case 6:
   return { title: 'Entra Guardian', description: 'Securing identity & access — zero trust', unlocks: ['Advanced tickets', 'MDM authority, Defender SmartScreen'], color: 'purple', orbitRings: 3, cert: 'SC-300', certPath: 'SC-300 Identity & Access — Entra ID CA, What-If 53000, Identity Protection, PIM, Access Reviews' };
  case 7:
   return { title: 'Exchange Commander', description: 'Expert mail flow & security — messaging', unlocks: ['Expert unlock', 'SSO, Mail flow down'], color: 'red', orbitRings: 4, cert: 'MS-700 + SC-300', certPath: 'MS-700 Teams + SC-300 — Exchange Online, Teams presence, mail flow, DLP, CA for Teams' };
  case 8:
   return { title: 'Autopilot Architect', description: 'Deploying at scale — modern workplace', unlocks: ['Autopilot TPM', 'Recurring incidents 35%'], color: 'orange', orbitRings: 4, cert: 'MD-102 + AZ-800', certPath: 'MD-102 + AZ-800 Expert — Autopilot, GPO linking WMI Enforce, OU flat is better, bulk edit' };
  case 9:
   return { title: 'Team Lead', description: 'Leading the orbit — strategy & people', unlocks: ['All ticket types', 'Shorter SLAs, real pressure'], color: 'pink', orbitRings: 5, cert: 'SC-300 + AZ-800 + MD-102', certPath: 'All Certs — Identity, Endpoint, Hybrid, Teams — Interview ready for MSP L1/L2, Team Lead SBI coaching' };
  default:
   return { title: `Orbit Master Lvl ${level}`, description: 'Advanced operations under sustained service pressure', unlocks: ['Advanced case mix', 'Critical-incident pressure', 'Full assessment'], color: 'violet', orbitRings: 5, cert: 'SC-300 + AZ-800 + MD-102 + MS-700', certPath: 'Advanced identity, endpoint, collaboration and hybrid operations' };
 }
}

export function getBadges(progress: StudentProgress): string[] {
 const badges: string[] = [];
 if (progress.ticketsResolved >= 1) badges.push('First Fix 🛠️');
 if (progress.ticketsResolved >= 5) badges.push('Problem Solver 🔧');
 if (progress.ticketsResolved >= 10) badges.push('Support Hero 🦸');
 if (progress.ticketsResolved >= 20) badges.push('Orbit Explorer 🛰️');
 if (progress.ticketsResolved >= 35) badges.push('Orbit Master 👑');
 if (progress.avgCSAT >= 4.5) badges.push('CSAT Champion ⭐');
 if (progress.avgQA >= 90) badges.push('QA Master 🎯');
 if (progress.slaCompliance >= 95) badges.push('SLA Guardian ⏱️');
 if (progress.callsHandled >= 1) badges.push('Voice Pro 📞');
 if (progress.callsHandled >= 5) badges.push('Call Master 🎙️');
 if (progress.communicationScores.empathy >= 80) badges.push('Empathy Expert 💜');
 if (progress.streak >= 3) badges.push('Streak Keeper 🔥');
 if (progress.level >= 5) badges.push('Level 5 Navigator 🚀');
 if (progress.level >= 9) badges.push('Team Lead Ready 👔');
 return badges;
}

export function saveProgress(progress: StudentProgress) {
 if (typeof window !== 'undefined') {
 localStorage.setItem('orbitdesk_progress_v3', JSON.stringify(progress));
 localStorage.setItem('orbitdesk_session_' + progress.sessionId, JSON.stringify(progress));
 }
}

export function loadProgress(): StudentProgress {
 if (typeof window !== 'undefined') {
 const saved = localStorage.getItem('orbitdesk_progress_v3');
 if (saved) {
 try {
  return JSON.parse(saved);
 } catch {}
 }
 }
 return { ...initialProgress, sessionId: `sess_${Math.random().toString(36).substring(7)}_${Date.now()}` };
}

export function calculateRealisticSLA(
 priority: 'P1' | 'P2' | 'P3' | 'P4',
 clientId: 'client-a' | 'client-b' | 'client-c',
 createdAt: number,
 level: number = 1
): { timeLeftMs: number; businessHoursOnly: boolean; escalationAt: number } {
 const now = Date.now();
 const hour = new Date().getHours();
 const isBusinessHours = hour >= 9 && hour <= 17;
 const day = new Date().getDay();
 const isWeekday = day >= 1 && day <= 5;

 let baseMs: number;
 let businessHoursOnly = false;

 if (clientId === 'client-a') {
  // NovaTech 24/7 — P1 60min, P2 4h, P3 8h, P4 24h
  baseMs = priority === 'P1' ? 60 * 60 * 1000 : priority === 'P2' ? 4 * 60 * 60 * 1000 : priority === 'P3' ? 8 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  businessHoursOnly = false;
 } else if (clientId === 'client-b') {
  // Bloom 9-5 — P1 4h, P2 8h, P3 24h, P4 48h
  baseMs = priority === 'P1' ? 4 * 60 * 60 * 1000 : priority === 'P2' ? 8 * 60 * 60 * 1000 : priority === 'P3' ? 24 * 60 * 60 * 1000 : 48 * 60 * 60 * 1000;
  businessHoursOnly = true;
 } else {
  // Apex strict — P1 1h, P2 2h, P3 4h, P4 8h
  baseMs = priority === 'P1' ? 1 * 60 * 60 * 1000 : priority === 'P2' ? 2 * 60 * 60 * 1000 : priority === 'P3' ? 4 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
  businessHoursOnly = false;
 }

 // Level scaling — higher level = tighter SLAs (more pressure like real MSP)
 // Lvl1: 100% time, Lvl5: 85%, Lvl9+: 70%
 let levelFactor = 1;
 if (level >= 5 && level < 7) levelFactor = 0.85;
 else if (level >= 7 && level < 9) levelFactor = 0.75;
 else if (level >= 9) levelFactor = 0.70;
 baseMs = Math.floor(baseMs * levelFactor);

 // If Bloom and outside business hours, add time until next business hour
 let adjustedMs = baseMs;
 if (businessHoursOnly && (!isBusinessHours || !isWeekday)) {
  const nowDate = new Date();
  let nextBusiness = new Date(nowDate);
  if (!isWeekday) {
   const daysUntilMonday = (8 - day) % 7;
   nextBusiness.setDate(nowDate.getDate() + daysUntilMonday);
   nextBusiness.setHours(9, 0, 0, 0);
  } else if (hour < 9) {
   nextBusiness.setHours(9, 0, 0, 0);
  } else {
   nextBusiness.setDate(nowDate.getDate() + 1);
   nextBusiness.setHours(9, 0, 0, 0);
   if (nextBusiness.getDay() === 0) nextBusiness.setDate(nextBusiness.getDate() + 1);
   if (nextBusiness.getDay() === 6) nextBusiness.setDate(nextBusiness.getDate() + 2);
  }
  const waitMs = nextBusiness.getTime() - nowDate.getTime();
  adjustedMs += waitMs;
 }

 const timeLeftMs = adjustedMs - (now - createdAt);
 const escalationAt = adjustedMs * 0.5;

 return {
  timeLeftMs,
  businessHoursOnly,
  escalationAt,
 };
}
