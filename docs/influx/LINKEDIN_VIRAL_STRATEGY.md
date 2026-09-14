# 3 NON-BASIC LinkedIn Posts That Get Likes (Not Basic Screenshots)

## POST 1: The Rejection Post (Vulnerable = Viral) — USE THIS FIRST
**Format:** Text + 3-image carousel you already have
**Hook:** Failure story, not success story. LinkedIn loves vulnerability + comeback.

**Caption:**

I got told to reapply.

Applied to a Support-as-a-Service company with 1000+ agents, 24/7. Recruiter replied: "We welcome you to reapply for entry-level."

Ouch. My first pitch was too technical: "modern workplace lab with live tickets, SLAs, CSAT, VM troubleshooting"

They want: thoughtful, detail-oriented, sense of humour, ownership.

So I rebuilt everything in 48 hours:

❌ Before: 935 lines of robotic TTS — SpeechSynthesis reading scripts. Sounded like a recording.

✅ After: Real phone. Web Audio API oscillator 800Hz, gain 0.15, loops while incoming. No MP3. Phone rings → you pick up → hold legit conversation where client does actions on other side — runs dsregcmd /status, clicks Sync in Company Portal, checks BitLocker — and asks questions back. Like real calls work.

Swipe → P1 incoming (00:43 SLA) → active call with live action → 5-star CSAT: "Heyy! It works now! Thank you! Simple steps, no jargon — perfect! ⭐⭐⭐⭐⭐"

What I learned: Enterprise wants Correlation ID + audit trail. SMB wants emojis OK 😅 and "Will I lose my Photoshop work? 🥺" — you say "Your layers are safe, I'll stay on line."

Reapplied. Voice recording done. 44h/week rotating including weekends, laptop + headset, G Suite ready.

Building in public from Nairobi. What's one thing that makes a support call feel 100% real to you?

#CustomerSupport #BuildInPublic #RemoteWork #SupportAsAService #CX

**Why it works:** Vulnerability (rejection) + comeback + technical depth + human story + question at end drives comments. Tag no one in post, but comment under your own post: "Live demo: orbitdesk-gamma.vercel.app — feedback welcome!"

---

## POST 2: Hot Take — Controversial (Gets Comments = Exposure)

**Format:** Text only or single image of your code snippet (Web Audio ringtone)

**Caption:**

Most customer support portfolios are fake.

Screenshots of tickets. Fake chat bubbles. No real phone.

Recruiters can tell in 5 seconds.

I built one that actually rings.

Not MP3. Not TTS robotic voice.

Web Audio API:
```
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.frequency.value = 800;
gain.gain.value = 0.15;
osc.start();
setTimeout(() => osc.stop(), 400);
```

Loops while incomingCall exists. Stops on Accept.

Client does real actions on other side: dsregcmd /status, Company Portal Sync, BitLocker check, Entra Audit Logs. Follow-up question: "Will I lose my work if I restart? 🥺"

That's what Influx does 24/7 — not answering tickets, owning problems.

If your portfolio doesn't ring, does it even support?

Live: orbitdesk-gamma.vercel.app

Fight me in comments — what's the most fake portfolio you've seen?

#CustomerSupport #SaaS #WebAudioAPI #BuildInPublic

**Why it works:** Controversial hot take + code snippet + challenge at end = comments = LinkedIn pushes to 10x more people.

---

## POST 3: Video Demo (LinkedIn Video Feed = 3x Reach Right Now)

**Format:** Use the HTML file I built: linkedin-viral-video.html — screen record it as video

**How to make video in 2 mins:**
1. Open influx-lab/linkedin-viral-video.html in Chrome (I made it 390x844 phone size, perfect for LinkedIn vertical video)
2. On phone, screen record for 14 seconds (it auto-plays: incoming → active → CSAT)
3. Add captions in LinkedIn: "Phone rings → you pick up → legit conversation"
4. Post as Video, not image

**Caption for video:**

POV: Your support portfolio actually rings.

0:00 — 📞 Incoming P1, SLA 00:43, $250k MRR
0:04 — Accept → real-time transcript
0:06 — Client does action: dsregcmd /status
0:09 — "Will it delete files? 😅" — empathy + simple steps
0:12 — ⭐⭐⭐⭐⭐ "Heyy! It works now! No jargon — perfect!"

No robotic TTS. No recording. Web Audio API 800Hz.

Built after getting told to reapply for entry-level CSR. Lesson: thoughtful > technical.

Full demo: orbitdesk-gamma.vercel.app

Would you pick up this call?

#CustomerSupport #VideoDemo #BuildInPublic #RemoteWork

**Why video works:** LinkedIn is pushing video hard in 2025-2026. Vertical 9:16 video gets 3x more reach than images. Auto-plays in feed, stops scroll.

---

## GROWTH HACKS (Non-basic, do these TODAY):

1. **Engage before you post:** Spend 15 mins commenting on 10 Influx employees' posts + 10 Customer Support leaders' posts BEFORE you post yours. LinkedIn shows your post to people you just engaged with.

2. **Post at 9 AM Nairobi (6 AM UTC) on Tuesday/Wednesday** — catches APAC recruiter morning + EMEA morning + US evening. Your last post at 13:51 EAT is low traffic.

3. **First hour is everything:** After posting, reply to EVERY comment within 10 mins with a question. "Thanks! What's one thing that makes a support call feel real to you?" — drives 2nd comment.

4. **Don't use "with Influx" tag** — you did in screenshot. That looks like you work there. Instead, in caption write "@Influx" (company page) — but only once per week max.

5. **DM 5 people who liked:** After post gets 5 likes, DM each: "Thanks for liking my OrbitDesk post! Curious — what's your biggest pet peeve with support portfolios?" — builds relationships, not spam.

6. **Repurpose:** Same video → post as Instagram Reel, TikTok, Twitter with "Building in public from Nairobi" — drives LinkedIn profile views.

Pick POST 1 for today — vulnerable rejection story + carousel you already uploaded. It will get 10x more than basic screenshots.

Want me to start a live preview server so you can screen record the video demo in perfect 1080x1920?
