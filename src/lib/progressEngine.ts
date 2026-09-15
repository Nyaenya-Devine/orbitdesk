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

export function calculateCommunicationScore(
 userMessage: string,
 clientPersona: 'enterprise' | 'smb' | 'regulated',
 context: { usedClientLanguage: boolean; checkedLogs: boolean; usedCorrectTool: boolean }
): StudentProgress['communicationScores'] {
 const lower = userMessage.toLowerCase();
 
 // Empathy: sorry, understand, thank you, apologize, appreciate
 let empathy = 0;
 if (lower.includes('sorry') || lower.includes('apologize')) empathy += 30;
 if (lower.includes('understand') || lower.includes('i see') || lower.includes('got it')) empathy += 25;
 if (lower.includes('thank')) empathy += 20;
 if (lower.includes('help') || lower.includes('assist')) empathy += 15;
 if (lower.length > 20) empathy += 10; // not too short
 empathy = Math.min(100, empathy);

 // Clarity: for SMB simple, for enterprise technical but clear
 let clarity = 0;
 if (clientPersona === 'smb') {
 // SMB wants simple steps, no jargon
 if (!lower.includes('dsregcmd') && !lower.includes('conditional access') && !lower.includes('entra')) clarity += 40;
 if (lower.includes('click') || lower.includes('open') || lower.includes('start')) clarity += 30;
 if (lower.includes('simple') || lower.includes('easy')) clarity += 20;
 if (lower.split(' ').length < 30) clarity += 10; // concise for SMB
 } else if (clientPersona === 'enterprise') {
 if (lower.includes('correlation') || lower.includes('sign-in logs') || lower.includes('ca tab')) clarity += 40;
 if (lower.includes('what if') || lower.includes('audit logs')) clarity += 30;
 if (lower.includes('rca') || lower.includes('remediation')) clarity += 20;
 if (lower.split(' ').length > 15) clarity += 10; // detailed for enterprise
 } else {
 // regulated wants formal + audit trail
 if (lower.includes('sec-2024-07') || lower.includes('audit trail') || lower.includes('rca')) clarity += 50;
 if (lower.includes('per policy') || lower.includes('compliance')) clarity += 30;
 if (lower.includes('confirm') || lower.includes('escrow')) clarity += 20;
 }
 clarity = Math.min(100, clarity);

 // Technical accuracy
 let technical = 0;
 if (context.checkedLogs) technical += 40;
 if (context.usedCorrectTool) technical += 40;
 if (lower.includes('dsregcmd') || lower.includes('bitlocker') || lower.includes('company portal') || lower.includes('message trace')) technical += 20;
 technical = Math.min(100, technical);

 // Fluency: based on message length and filler words
 let fluency = 100;
 const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually'];
 fillerWords.forEach(filler => {
 if (lower.includes(filler)) fluency -= 10;
 });
 if (userMessage.split(' ').length < 5) fluency -= 20; // too short
 if (userMessage.split(' ').length > 100) fluency -= 10; // too long
 fluency = Math.max(0, Math.min(100, fluency));

 // Client language
 let clientLang = 0;
 if (context.usedClientLanguage) clientLang = 90;
 else {
 if (clientPersona === 'smb' && (lower.includes('😅') || lower.includes('please') || lower.includes('thanks'))) clientLang = 60;
 if (clientPersona === 'enterprise' && (lower.includes('correlation') || lower.includes('service health'))) clientLang = 60;
 if (clientPersona === 'regulated' && lower.includes('sec-2024-07')) clientLang = 70;
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

export function getLevelInfo(level: number): { title: string; description: string; unlocks: string[]; color: string; orbitRings: number } {
 switch (level) {
  case 1:
   return { title: 'Orbit Initiate', description: 'Welcome to OrbitDesk — learning the basics', unlocks: ['Beginner tickets', 'MFA, DeviceCap, Teams presence'], color: 'emerald', orbitRings: 1 };
  case 2:
   return { title: 'Desk Cadet', description: 'Getting comfortable with M365 basics', unlocks: ['Mixed beginner', 'License, shared mailbox'], color: 'blue', orbitRings: 1 };
  case 3:
   return { title: 'Support Specialist', description: 'Ready for intermediate challenges', unlocks: ['Intermediate unlock', 'CA DeviceNotCompliant, Enrollment 0x80180024'], color: 'violet', orbitRings: 2 };
  case 4:
   return { title: 'Compliance Operator', description: 'Handling compliance & quarantine', unlocks: ['BitLocker, Quarantine release', 'Higher P1 rate 10%'], color: 'amber', orbitRings: 2 };
  case 5:
   return { title: 'Intune Navigator', description: 'Mastering device management', unlocks: ['Advanced prep', 'Location CA, Account lock'], color: 'indigo', orbitRings: 3 };
  case 6:
   return { title: 'Entra Guardian', description: 'Securing identity & access', unlocks: ['Advanced tickets', 'MDM authority, Defender SmartScreen'], color: 'purple', orbitRings: 3 };
  case 7:
   return { title: 'Exchange Commander', description: 'Expert mail flow & security', unlocks: ['Expert unlock', 'SSO, Mail flow down'], color: 'red', orbitRings: 4 };
  case 8:
   return { title: 'Autopilot Architect', description: 'Deploying at scale', unlocks: ['Autopilot TPM', 'Recurring incidents 35%'], color: 'orange', orbitRings: 4 };
  case 9:
   return { title: 'Team Lead', description: 'Leading the orbit', unlocks: ['All ticket types', 'Shorter SLAs, real pressure'], color: 'pink', orbitRings: 5 };
  default:
   return { title: `Orbit Master Lvl ${level}`, description: 'Elite operations — all challenges, max pressure', unlocks: ['Expert heavy 60%', 'P1 15% + business-hours pressure', 'Interview ready'], color: 'violet', orbitRings: 5 };
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
