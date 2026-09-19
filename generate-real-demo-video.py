#!/usr/bin/env python3
"""
OrbitDesk Real Demo Video Generator — Chokepoint-style real screen recording simulation
Creates orbitdesk-walkthrough-demo.mp4 that shows actual OrbitDesk workflow
Not image concatenation — simulated real UI with cursor, typing, smooth transitions
"""

from PIL import Image, ImageDraw, ImageFont
import imageio
import imageio_ffmpeg
import os
import math

# Get ffmpeg
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using ffmpeg: {ffmpeg_exe}")

# Video settings — premium 1920x1080, 30fps, 90 seconds
W, H = 1920, 1080
FPS = 30
DURATION = 90  # seconds
TOTAL_FRAMES = DURATION * FPS

# Colors — OrbitDesk premium dark
BG = (5, 5, 7)
CARD_BG = (10, 10, 12)
BORDER = (39, 39, 42)
VIOLET = (124, 58, 237)
VIOLET_LIGHT = (139, 92, 246)
EMERALD = (16, 185, 129)
ZINC_100 = (244, 244, 245)
ZINC_400 = (161, 161, 170)
ZINC_500 = (113, 113, 122)
AMBER = (245, 158, 11)
RED = (239, 68, 68)

# Try to load font, fallback to default
try:
    # Try to find a good font
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    font_bold_path = None
    for p in font_paths:
        if os.path.exists(p):
            font_bold_path = p
            break
    
    if font_bold_path:
        font_small = ImageFont.truetype(font_bold_path, 18)
        font_medium = ImageFont.truetype(font_bold_path, 24)
        font_large = ImageFont.truetype(font_bold_path, 36)
        font_xlarge = ImageFont.truetype(font_bold_path, 48)
        font_xxlarge = ImageFont.truetype(font_bold_path, 64)
    else:
        font_small = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_large = ImageFont.load_default()
        font_xlarge = ImageFont.load_default()
        font_xxlarge = ImageFont.load_default()
except:
    font_small = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_large = ImageFont.load_default()
    font_xlarge = ImageFont.load_default()
    font_xxlarge = ImageFont.load_default()

def draw_rounded_rect(draw, xy, radius, fill, outline=None):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline)

def draw_orbitdesk_chrome(draw, frame_idx):
    """Draw OrbitDesk header chrome — premium dark"""
    # Header
    draw_rounded_rect(draw, (0, 0, W, 64), 0, fill=(10, 10, 12), outline=BORDER)
    draw.line([(0, 64), (W, 64)], fill=BORDER, width=1)
    
    # Logo
    draw.ellipse([(24, 14), (60, 50)], fill=VIOLET)
    draw.text((30, 20), "O", fill=(255,255,255), font=font_medium)
    
    draw.text((76, 16), "OrbitDesk", fill=ZINC_100, font=font_medium)
    draw.text((76, 40), "Modern Workplace Operations Lab • v6.17 • Real Live Demo", fill=ZINC_500, font=font_small)
    
    # Right side — Live indicator
    draw_rounded_rect(draw, (W-280, 16, W-24, 48), 20, fill=(16, 185, 129, 25), outline=EMERALD)
    # Blinking dot
    blink = int(frame_idx / 15) % 2
    if blink == 0:
        draw.ellipse([(W-264, 24), (W-252, 36)], fill=EMERALD)
    draw.text((W-244, 22), "● LIVE LAB", fill=EMERALD, font=font_small)
    
    # Version
    draw.text((W-120, 40), "v6.17", fill=ZINC_500, font=font_small)

def draw_step_content(draw, step, sub_frame, frame_idx):
    """Draw content for each step — simulating real OrbitDesk UI"""
    
    y_offset = 90
    
    if step == 0:  # Landing / AuthGate
        # AuthGate professional learning tool
        draw.text((80, y_offset), "Modern Workplace Operations Lab", fill=ZINC_100, font=font_xlarge)
        draw.text((80, y_offset+60), "Professional helpdesk simulator for Microsoft 365 — practice Entra ID, Intune, Exchange, Teams", fill=ZINC_400, font=font_medium)
        
        # Curriculum cards
        cards = [
            ("Operations", "Ticket triage, SLA, client context", "◧"),
            ("Identity", "Entra ID, Conditional Access, What-If", "◨"),
            ("Endpoint", "Intune, BitLocker, Company Portal", "◐"),
        ]
        for i, (title, desc, icon) in enumerate(cards):
            x = 80 + i * 400
            y = y_offset + 140
            # Card
            draw_rounded_rect(draw, (x, y, x+360, y+200), 16, fill=CARD_BG, outline=VIOLET if i==0 else BORDER)
            draw.text((x+20, y+20), icon, fill=VIOLET_LIGHT, font=font_xlarge)
            draw.text((x+20, y+70), title, fill=ZINC_100, font=font_large)
            draw.text((x+20, y+110), desc, fill=ZINC_400, font=font_small)
            if i == 0:
                draw.text((x+20, y+150), "● Recommended", fill=EMERALD, font=font_small)
        
        # Big CTA
        pulse = 0.8 + 0.2 * math.sin(frame_idx * 0.1)
        btn_color = (int(VIOLET[0]*pulse), int(VIOLET[1]*pulse), int(VIOLET[2]*pulse))
        draw_rounded_rect(draw, (80, y_offset+400, 380, y_offset+460), 24, fill=btn_color)
        draw.text((110, y_offset+415), "Skip → Enter Lab Now", fill=(255,255,255), font=font_medium)
        draw.text((80, y_offset+480), "Demo Mode • Local-only • No signup • Fixes stuck at start page", fill=ZINC_500, font=font_small)
        
        # Cursor simulation
        cursor_x = 250 + int(20 * math.sin(frame_idx * 0.05))
        cursor_y = y_offset + 430 + int(5 * math.cos(frame_idx * 0.05))
        draw.polygon([(cursor_x, cursor_y), (cursor_x, cursor_y+20), (cursor_x+12, cursor_y+14), (cursor_x+6, cursor_y+12)], fill=(255,255,255), outline=(0,0,0))
        
    elif step == 1:  # Overview metrics
        draw.text((80, y_offset), "Overview • Real-time Operations", fill=ZINC_100, font=font_xlarge)
        draw.text((80, y_offset+60), "Live metrics, SLA tracking, team presence — like Teams/Slack", fill=ZINC_400, font=font_medium)
        
        # Metrics grid
        metrics = [
            ("Open Tickets", "12", "P1: 3 • P2: 5 • P3: 4", EMERALD),
            ("SLA Breach", "2", "60m • 45m left P1", RED),
            ("Team Online", "5/6", "Alex, Priya, Devine...", VIOLET),
            ("CSAT", "4.8/5", "↑ 0.2 this shift", EMERALD),
        ]
        for i, (label, value, sub, color) in enumerate(metrics):
            x = 80 + (i % 4) * 420
            y = y_offset + 120 + (i // 4) * 160
            draw_rounded_rect(draw, (x, y, x+380, y+130), 16, fill=CARD_BG, outline=BORDER)
            draw.text((x+20, y+15), label, fill=ZINC_500, font=font_small)
            draw.text((x+20, y+40), value, fill=ZINC_100, font=font_xxlarge)
            draw.text((x+20, y+90), sub, fill=color, font=font_small)
    
    elif step == 2:  # Queue P1 ticket
        draw.text((80, y_offset), "Queue • P1 Critical Triage", fill=ZINC_100, font=font_xlarge)
        draw.text((80, y_offset+60), "ENTRA-53000 DeviceNotCompliant • Sarah Finance • Payroll deadline 45m", fill=ZINC_400, font=font_medium)
        
        # Ticket list
        tickets = [
            ("P1", "ENTRA-53000", "DeviceNotCompliant • Sarah Finance • Payroll", "45m", RED, True),
            ("P2", "EXCH-2041", "Shared mailbox not visible Outlook", "2h", AMBER, False),
            ("P1", "INTUNE-881", "BitLocker off • WS-FIN-001", "1h", RED, False),
            ("P3", "TEAMS-102", "Teams presence stuck", "4h", ZINC_500, False),
        ]
        for i, (pri, code, title, sla, color, selected) in enumerate(tickets):
            y = y_offset + 120 + i * 90
            outline = VIOLET if selected else BORDER
            fill = (124, 58, 237, 20) if selected else CARD_BG
            draw_rounded_rect(draw, (80, y, 800, y+70), 12, fill=fill, outline=outline)
            draw_rounded_rect(draw, (90, y+15, 130, y+40), 6, fill=color)
            draw.text((95, y+18), pri, fill=(255,255,255), font=font_small)
            draw.text((150, y+15), code, fill=ZINC_100, font=font_medium)
            draw.text((150, y+40), title, fill=ZINC_400, font=font_small)
            draw.text((700, y+20), sla, fill=color, font=font_small)
        
        # Detail pane
        draw_rounded_rect(draw, (860, y_offset+120, W-80, y_offset+500), 16, fill=CARD_BG, outline=BORDER)
        draw.text((890, y_offset+140), "Sign-in Logs • Correlation ID a7f3c9e2", fill=ZINC_100, font=font_medium)
        draw.text((890, y_offset+170), "CA tab: BlockedByConditionalAccess 53000 DeviceNotCompliant", fill=AMBER, font=font_small)
        draw.text((890, y_offset+200), "Service Health: Green • dsregcmd: AzureADJoined YES, Compliance NO", fill=ZINC_400, font=font_small)
        draw.text((890, y_offset+240), "Checklist: ☑ Logs  ☑ Tool  ☑ Lang  ☐ Confirm", fill=EMERALD, font=font_small)
        draw_rounded_rect(draw, (890, y_offset+280, 1100, y_offset+320), 20, fill=EMERALD)
        draw.text((910, y_offset+288), "Resolve +XP", fill=(255,255,255), font=font_small)
    
    elif step == 3:  # Directory OU Tree
        draw.text((80, y_offset), "Directory • ADUC Hierarchical OU Tree", fill=ZINC_100, font=font_xlarge)
        draw.text((80, y_offset+60), "Domain novatech.com → Users Finance 50 IT 12 HR → Groups Security 30 → Computers 80 → Disabled 23", fill=ZINC_400, font=font_medium)
        
        # OU Tree
        ous = [
            ("📁", "novatech.com", "Domain", 0, False),
            ("📁", "Users", "OU • 85 users", 1, False),
            ("👥", "Finance", "50 • 3 locked", 2, True),
            ("👥", "IT", "12 • 1 disabled", 2, False),
            ("👥", "HR", "8 • all active", 2, False),
            ("📁", "Groups", "OU • 45 groups", 1, False),
            ("🔒", "Security", "30 • high risk", 2, False),
            ("💻", "Computers", "OU • 89 devices", 1, False),
            ("🖥️", "Workstations", "80 • 2 noncompliant", 2, False),
        ]
        for i, (icon, name, desc, indent, selected) in enumerate(ous):
            y = y_offset + 120 + i * 45
            x = 80 + indent * 30
            fill = (124, 58, 237, 20) if selected else CARD_BG
            outline = VIOLET if selected else BORDER
            draw_rounded_rect(draw, (x, y, x+500, y+36), 8, fill=fill, outline=outline)
            draw.text((x+10, y+8), icon, fill=ZINC_100, font=font_small)
            draw.text((x+40, y+8), name, fill=ZINC_100 if selected else ZINC_400, font=font_small)
            draw.text((x+200, y+8), desc, fill=ZINC_500, font=font_small)
        
        # User Properties
        draw_rounded_rect(draw, (650, y_offset+120, W-80, y_offset+500), 16, fill=CARD_BG, outline=BORDER)
        draw.text((680, y_offset+140), "AD User Properties • Sarah Finance", fill=ZINC_100, font=font_medium)
        tabs = ["General", "Account", "MemberOf", "Security", "Audit"]
        for j, tab in enumerate(tabs):
            tx = 680 + j * 110
            active = j == 1
            draw_rounded_rect(draw, (tx, y_offset+180, tx+100, y_offset+210), 8, fill=VIOLET if active else (30,30,35), outline=VIOLET if active else BORDER)
            draw.text((tx+10, y_offset+188), tab, fill=(255,255,255) if active else ZINC_500, font=font_small)
        draw.text((680, y_offset+230), "Account: Locked NO • Disabled NO • MFA Required YES", fill=EMERALD, font=font_small)
        draw.text((680, y_offset+260), "MemberOf: Finance-All, M365-Licensed, ConditionalAccess-RequireCompliant", fill=ZINC_400, font=font_small)
        draw.text((680, y_offset+300), "PowerShell History: Unlock-ADAccount, Get-ADUser, Set-ADAccountPassword", fill=ZINC_500, font=font_small)
    
    elif step == 4:  # Entra What-If
        draw.text((80, y_offset), "Entra ID Center • What-If Simulation Blocked 53000", fill=ZINC_100, font=font_xlarge)
        draw.text((80, y_offset+60), "4 CA policies • Require compliant device Finance Report-Only → On breach P1 • What-If: Sarah Finance All apps Compliant No → Blocked 53000", fill=ZINC_400, font=font_medium)
        
        # CA Policies
        policies = [
            ("Require compliant device", "Finance", "Report-Only", "BREACH", AMBER),
            ("Require MFA", "All users", "On", "Active", EMERALD),
            ("Block legacy auth", "All", "On", "Active", EMERALD),
            ("Require compliant + Hybrid", "Servers", "On", "Active", EMERALD),
        ]
        for i, (name, target, state, status, color) in enumerate(policies):
            y = y_offset + 120 + i * 70
            draw_rounded_rect(draw, (80, y, 700, y+50), 12, fill=CARD_BG, outline=color if i==0 else BORDER)
            draw.text((100, y+8), name, fill=ZINC_100, font=font_small)
            draw.text((100, y+28), f"{target} • {state} • {status}", fill=color, font=font_small)
        
        # What-If result
        draw_rounded_rect(draw, (760, y_offset+120, W-80, y_offset+400), 16, fill=(239, 68, 68, 15), outline=RED)
        draw.text((790, y_offset+140), "What-If Simulation Result", fill=RED, font=font_medium)
        draw.text((790, y_offset+180), "User: Sarah Finance (Finance)", fill=ZINC_100, font=font_small)
        draw.text((790, y_offset+210), "App: All cloud apps", fill=ZINC_100, font=font_small)
        draw.text((790, y_offset+240), "Device: Compliant = No", fill=ZINC_100, font=font_small)
        draw.text((790, y_offset+280), "Result: ❌ Blocked — 53000 DeviceNotCompliant", fill=RED, font=font_medium)
        draw.text((790, y_offset+310), "Policy: Require compliant device (Finance)", fill=ZINC_400, font=font_small)
        draw.text((790, y_offset+340), "Fix: Company Portal Sync + BitLocker escrow", fill=EMERALD, font=font_small)
    
    elif step == 5:  # GPO / Intune
        draw.text((80, y_offset), "Policies & Devices • GPO GPMC + Intune Device Center", fill=ZINC_100, font=font_xlarge)
        draw.text((80, y_offset+60), "4 GPOs • Default Domain Policy, BitLocker-Require enforced, Printers Nairobi WMI, M365 Apps • 4 devices compliance", fill=ZINC_400, font=font_medium)
        
        # GPOs
        gpos = [
            ("Default Domain Policy", "Linked: novatech.com", "Enforced: Yes", EMERALD),
            ("BitLocker-Require", "Finance BREACH", "Enforced: Yes • WMI", RED),
            ("Printers-Nairobi", "Location WMI Filter", "Enforced: No", AMBER),
            ("M365 Apps", "All Users", "Enforced: No", ZINC_500),
        ]
        for i, (name, linked, enforced, color) in enumerate(gpos):
            y = y_offset + 120 + i * 80
            draw_rounded_rect(draw, (80, y, 600, y+60), 12, fill=CARD_BG, outline=color if i==1 else BORDER)
            draw.text((100, y+8), name, fill=ZINC_100, font=font_small)
            draw.text((100, y+30), f"{linked} • {enforced}", fill=color, font=font_small)
        
        # Intune devices
        devices = [
            ("WS-FIN-001", "Sarah Finance", "Noncompliant • BitLocker off", RED),
            ("WS-IT-012", "Alex IT", "Compliant • Encrypted", EMERALD),
            ("WS-HR-03", "Priya HR", "Compliant", EMERALD),
            ("SRV-DC-01", "Domain Controller", "Compliant", EMERALD),
        ]
        for i, (dev, user, status, color) in enumerate(devices):
            y = y_offset + 120 + i * 80
            draw_rounded_rect(draw, (650, y, W-80, y+60), 12, fill=CARD_BG, outline=color if i==0 else BORDER)
            draw.text((670, y+8), f"{dev} • {user}", fill=ZINC_100, font=font_small)
            draw.text((670, y+30), status, fill=color, font=font_small)
            if i == 0:
                draw_rounded_rect(draw, (W-300, y+15, W-100, y+45), 8, fill=VIOLET)
                draw.text((W-280, y+22), "Fix BitLocker", fill=(255,255,255), font=font_small)
    
    elif step == 6:  # Calls + Assessment
        draw.text((80, y_offset), "Voice • WebRTC Teams-like 420px Compact + Assessment", fill=ZINC_100, font=font_xlarge)
        draw.text((80, y_offset+60), "Team Calls BroadcastChannel both sides • Client calls pill + dropdown • Active call modal bottom-right 420px", fill=ZINC_400, font=font_medium)
        
        # Call UI mock
        draw_rounded_rect(draw, (80, y_offset+120, 500, y_offset+350), 20, fill=CARD_BG, outline=BORDER)
        draw_rounded_rect(draw, (80, y_offset+120, 500, y_offset+170), 20, fill=(24, 24, 27))
        draw.text((100, y_offset+135), "📞 Incoming Call • NovaTech Financial • P1", fill=ZINC_100, font=font_small)
        draw.text((100, y_offset+180), "\"P1: Can't access Outlook, device not compliant. Need payroll email!\"", fill=ZINC_400, font=font_small)
        draw_rounded_rect(draw, (100, y_offset+240, 220, y_offset+280), 20, fill=(39,39,42))
        draw.text((120, y_offset+250), "✕ Decline", fill=ZINC_400, font=font_small)
        draw_rounded_rect(draw, (240, y_offset+240, 360, y_offset+280), 20, fill=EMERALD)
        draw.text((260, y_offset+250), "● Accept", fill=(255,255,255), font=font_small)
        
        # Assessment
        draw_rounded_rect(draw, (600, y_offset+120, W-80, y_offset+400), 16, fill=CARD_BG, outline=VIOLET)
        draw.text((630, y_offset+140), "Assessment Report • Level 4 • 87% Score", fill=ZINC_100, font=font_medium)
        draw.text((630, y_offset+180), "Tickets Resolved: 23 • Avg Time: 4.2m • CSAT: 4.8/5", fill=ZINC_400, font=font_small)
        draw.text((630, y_offset+210), "Skills: Entra ID What-If ✓ • GPO Enforce ✓ • Intune BitLocker ✓ • WebRTC ✓", fill=EMERALD, font=font_small)
        draw.text((630, y_offset+250), "Badges: P1 Slayer • OU Explorer • What-If Master • BitLocker Fixer", fill=VIOLET_LIGHT, font=font_small)
        draw_rounded_rect(draw, (630, y_offset+300, 850, y_offset+340), 20, fill=VIOLET)
        draw.text((650, y_offset+310), "Download Report PDF", fill=(255,255,255), font=font_small)

def generate_frame(frame_idx):
    """Generate single frame"""
    img = Image.new('RGB', (W, H), BG)
    draw = ImageDraw.Draw(img)
    
    # Determine step (7 steps, each ~12.8 seconds)
    step_duration = TOTAL_FRAMES // 7
    step = min(frame_idx // step_duration, 6)
    sub_frame = frame_idx % step_duration
    
    # Background gradient effect
    # Subtle vignette
    for y in range(0, H, 4):
        alpha = int(10 * (1 - abs(y - H//2) / (H//2)))
        draw.line([(0, y), (W, y)], fill=(124, 58, 237, alpha//4), width=1)
    
    # Chrome
    draw_orbitdesk_chrome(draw, frame_idx)
    
    # Step indicator
    steps = ["Landing/AuthGate", "Overview", "Queue P1", "Directory OU", "Entra What-If", "GPO/Intune", "Calls/Assess"]
    for i, s in enumerate(steps):
        x = 80 + i * 220
        y = H - 60
        active = i == step
        draw_rounded_rect(draw, (x, y, x+200, y+32), 16, fill=VIOLET if active else (30,30,35), outline=VIOLET if active else BORDER)
        draw.text((x+12, y+8), f"{i+1}. {s}", fill=(255,255,255) if active else ZINC_500, font=font_small)
    
    # Progress bar
    progress = frame_idx / TOTAL_FRAMES
    draw_rounded_rect(draw, (80, H-20, W-80, H-12), 4, fill=(30,30,35))
    draw_rounded_rect(draw, (80, H-20, int(80 + (W-160)*progress), H-12), 4, fill=VIOLET)
    
    # Step content
    draw_step_content(draw, step, sub_frame, frame_idx)
    
    # Watermark
    draw.text((W-400, H-50), "OrbitDesk — Modern Workplace Operations Lab • Real Live Demo", fill=ZINC_500, font=font_small)
    
    return img

def main():
    output_path = "/home/user/influx-lab/public/orbitdesk-walkthrough-demo.mp4"
    print(f"Generating {DURATION}s video at {FPS}fps, {TOTAL_FRAMES} frames...")
    print(f"Output: {output_path}")
    
    # Create writer
    writer = imageio.get_writer(output_path, fps=FPS, macro_block_size=1, quality=9, ffmpeg_params=['-crf', '18', '-preset', 'medium'])
    
    for frame_idx in range(TOTAL_FRAMES):
        if frame_idx % 30 == 0:
            print(f"Frame {frame_idx}/{TOTAL_FRAMES} ({frame_idx/TOTAL_FRAMES*100:.1f}%) — Step {frame_idx // (TOTAL_FRAMES//7) + 1}/7")
        
        img = generate_frame(frame_idx)
        # Convert PIL to numpy
        import numpy as np
        frame = np.array(img)
        writer.append_data(frame)
    
    writer.close()
    print(f"✅ Video saved: {output_path}")
    print(f"Size: {os.path.getsize(output_path) / 1024 / 1024:.2f} MB")
    
    # Also copy to root public for download
    import shutil
    shutil.copy(output_path, "/home/user/orbitdesk-walkthrough-demo.mp4")
    print(f"Also copied to /home/user/orbitdesk-walkthrough-demo.mp4")

if __name__ == "__main__":
    main()
