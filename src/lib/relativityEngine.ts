'use client';
// Einstein Engine — Thought Experiments, Relativity, E=mc² Simplicity
// Albert Einstein: "Imagination is more important than knowledge"

export const THOUGHT_EXPERIMENTS = {
  policy: {
    title: "What if you ARE the Conditional Access policy?",
    persona: "You are policy 'Require compliant device' for Finance",
    scenario: "You see Sarah's sign-in: User=Sarah Finance, App=Outlook, Device=WS-FIN-001, Compliance=NO, Location=Nairobi, Risk=Medium",
    question: "What do you do? Block 53000 DeviceNotCompliant. Why? Because your rule says: IF Finance AND Compliant=NO THEN Block. You are not evil — you enforce zero trust. Now you understand why Sarah is blocked. To fix, you need Report-Only or device compliant.",
    insight: "Policies are not obstacles — they are guards with rules. Understand guard's rules to negotiate.",
    orbitdeskAction: "Go to Entra ID Center → What-If → Run simulation → See Blocked 53000 → Revert to Report-Only with 15min expiry"
  },
  device: {
    title: "What if you ARE the device WS-FIN-001?",
    persona: "You are Sarah's laptop, Windows 11, AzureADJoined YES, Compliance NO, BitLocker 0%, Company Portal last sync 2m ago",
    scenario: "You feel noncompliant. Your BitLocker is off, so Intune says you are not healthy. You tried Company Portal sync, but BitLocker still off. You need encryption.",
    question: "What do you need? Enable BitLocker XtsAes256, escrow key to AD, then sync. Then you feel compliant. Then CA policy lets you through. You are not broken — you are waiting for encryption.",
    insight: "Devices have feelings (compliance). Fix device health, not just policy.",
    orbitdeskAction: "Go to Intune Device Center → WS-FIN-001 → BitLocker tab → Fix BitLocker → Enable XtsAes256 → Sync Just now"
  },
  user: {
    title: "What if you ARE Sarah Finance?",
    persona: "You are Sarah, Finance, payroll deadline 45m, Outlook blocked, Teams blocked, unsaved Photoshop work, stress high",
    scenario: "You need payroll email now. You checked Service Health green. You don't know dsregcmd. You need simple steps, not technical jargon. You are frustrated but polite.",
    question: "What do you need from IT? Simple steps: 1. Open Company Portal (blue shopping bag) 2. Check Status 3. Fix BitLocker if says off 4. Wait 2 mins 5. Try Outlook again. Plus empathy: 'I understand payroll deadline, sorry, let's fix quickly'.",
    insight: "User is human with deadline and emotions. Simple language + empathy > technical accuracy for SMB.",
    orbitdeskAction: "Go to Queue → P1 ticket → Checklist: Logs ✓ Tool ✓ Lang ✓ Confirm → Resolve with simple steps + empathy"
  }
};

export const EINSTEIN_FORMULAS = {
  entra: {
    title: "Entra ID: Access = Identity × Device × Policy",
    formula: "Access = I × D × P — if any 0, blocked. Like E=mc² simple.",
    breakdown: "Identity: User is Finance, licensed, MFA yes. Device: Compliance NO → 0. Policy: Require compliant → needs compliant. 1 × 0 × 1 = 0 → Blocked 53000. Fix: Make D=1 via BitLocker.",
    orbitdesk: "EntraIDCenter What-If shows this formula live"
  },
  intune: {
    title: "Intune: Compliance = Enrollment × Encryption × Health",
    formula: "Compliance = Enroll × Encrypt × Health",
    breakdown: "Enrollment: AzureADJoined YES=1, Compliance NO=0. Encryption: BitLocker off=0. Health: Company Portal sync recent=1. 1×0×1=0 Noncompliant. Fix: Encrypt=1",
    orbitdesk: "IntuneDeviceCenter shows compliance breakdown"
  },
  troubleshooting: {
    title: "Troubleshooting: Fix = Logs × Tool × Language",
    formula: "Fix = L × T × Lang — our checklist is Einstein's formula!",
    breakdown: "Logs: Checked Sign-in logs CA tab=1. Tool: Used Intune Company Portal sync=1. Language: Simple steps + empathy=1. 1×1×1=1 Fixed +XP. If any 0, fix fails.",
    orbitdesk: "Queue checklist is this formula"
  },
  gpo: {
    title: "GPO: Result = Policy × Link × WMI × Enforce",
    formula: "Result = P × Link × WMI × Enforce",
    breakdown: "Policy: BitLocker-Require exists=1. Link: Linked to Finance OU=1. WMI: Nairobi location filter matches=1. Enforce: Yes=1.5 (overrides). Result=1.5 Enforced. If WMI=0, no apply.",
    orbitdesk: "GPOManagement shows linking + WMI + Enforce"
  }
};

export function getRelativityClocks(ticket: any, timeSpent: number): {
  userTime: { label: string; time: string; feeling: string };
  systemTime: { label: string; time: string; feeling: string };
  adminTime: { label: string; time: string; feeling: string };
} {
  // User time, system time, admin time are relative — Einstein relativity
  const slaLeft = Math.floor(ticket.timeLeftMs / 60000);
  const userFeels = ticket.priority === 'P1' ? `${slaLeft}m feels like 5m when stressed payroll deadline` : `${slaLeft}m feels normal`;
  const systemFeels = `${slaLeft}m objective SLA countdown`;
  const adminFeels = timeSpent < 2 ? `${timeSpent}m feels like 30s in flow state` : `${timeSpent}m feels like ${timeSpent*2}m when stuck`;
  
  return {
    userTime: { label: "User Clock (Sarah)", time: `${slaLeft}m left`, feeling: userFeels },
    systemTime: { label: "System Clock (SLA)", time: `${slaLeft}m objective`, feeling: systemFeels },
    adminTime: { label: "Admin Clock (You)", time: `${timeSpent}m spent`, feeling: adminFeels },
  };
}

export function simplifyComplexConcept(concept: string): string {
  const simplifications: Record<string, string> = {
    'Conditional Access': 'Guard with rulebook — checks who, what device, where, then allows or blocks',
    'Device Compliance': 'Device health check — is it enrolled, encrypted, healthy?',
    'What-If': 'Time machine — test policy without breaking real users',
    'GPO Inheritance': 'Family rules — parent OU rules flow to child, unless blocked or enforced',
    'BitLocker': 'Safe for your disk — encrypts so if laptop stolen, data safe',
    'Entra ID': 'ID card system for cloud — who you are, what device, what policy',
  };
  return simplifications[concept] || concept;
}
