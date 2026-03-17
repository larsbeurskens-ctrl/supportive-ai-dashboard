"""
Create Facebook videos matching reference style:
- 1080x1080 square
- Dark navy bg (#1a2e3b)
- Business name at top in white bold
- Orange waveform visualization in center
- "Our AI receptionist on a live call" subtitle
- Speech bubble at bottom with orange left border
- "Our AI Receptionist" / "Customer" tag
- Current word highlighted in orange
- Red progress bar at bottom with timestamp
"""
import os, textwrap, shutil, random, math
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1080, 1080
FPS = 10  # Higher FPS for smooth word highlighting

BG = (26, 46, 59)       # #1a2e3b
ORANGE = (232, 147, 12)  # #e8930c
BUBBLE_BG = (25, 35, 60) # dark blue-navy
WHITE = (255, 255, 255)
GREY = (140, 155, 170)
RED = (220, 38, 38)
PROGRESS_BG = (40, 55, 70)

def get_font(size):
    for p in ["/System/Library/Fonts/SFPro-Regular.otf",
              "/System/Library/Fonts/Supplemental/Arial.ttf",
              "/System/Library/Fonts/Helvetica.ttc"]:
        try: return ImageFont.truetype(p, size)
        except: continue
    return ImageFont.load_default()

def get_bold_font(size):
    for p in ["/System/Library/Fonts/SFPro-Bold.otf",
              "/System/Library/Fonts/Supplemental/Arial Bold.ttf"]:
        try: return ImageFont.truetype(p, size)
        except: continue
    return get_font(size)

# Generate static waveform bars
random.seed(42)
WAVE_BARS = [random.randint(15, 80) for _ in range(50)]

def draw_waveform(draw, y_center, active=True):
    """Draw orange waveform bars centered at y_center."""
    bar_width = 8
    gap = 5
    total_width = len(WAVE_BARS) * (bar_width + gap)
    start_x = (WIDTH - total_width) // 2
    color = ORANGE if active else (100, 80, 40)
    for i, h in enumerate(WAVE_BARS):
        x = start_x + i * (bar_width + gap)
        # Animate slightly
        ah = h + random.randint(-5, 5) if active else h // 2
        ah = max(5, min(85, ah))
        draw.rounded_rectangle(
            (x, y_center - ah, x + bar_width, y_center + ah),
            radius=3, fill=color
        )

def draw_speech_bubble(draw, text, role, highlight_word_idx, font, bold_font):
    """Draw speech bubble at bottom with orange left border and word highlighting."""
    bubble_y = 680
    bubble_h = 300
    bubble_x = 60
    bubble_w = WIDTH - 120
    # Role tag
    tag_font = get_bold_font(18)
    if role == 'agent':
        tag_text = "Our AI Receptionist"
        tag_bg = ORANGE
    else:
        tag_text = "Customer"
        tag_bg = (80, 100, 120)
    tw = tag_font.getlength(tag_text) + 20
    draw.rounded_rectangle((bubble_x, bubble_y - 30, bubble_x + tw, bubble_y - 2), radius=6, fill=tag_bg)
    draw.text((bubble_x + 10, bubble_y - 28), tag_text, fill=WHITE, font=tag_font)
    
    # Bubble background
    draw.rounded_rectangle((bubble_x, bubble_y, bubble_x + bubble_w, bubble_y + bubble_h), radius=16, fill=BUBBLE_BG)
    # Orange left border
    draw.rectangle((bubble_x, bubble_y + 8, bubble_x + 5, bubble_y + bubble_h - 8), fill=ORANGE)
    
    # Text with word highlighting
    words = text.split()
    text_font = get_bold_font(30)
    max_w = bubble_w - 50
    x, y = bubble_x + 25, bubble_y + 20
    line_h = 42
    cx, cy = x, y
    for i, word in enumerate(words):
        ww = text_font.getlength(word + " ")
        if cx + ww > bubble_x + max_w:
            cx = x
            cy += line_h
            if cy > bubble_y + bubble_h - 30:
                break
        if i == highlight_word_idx:
            # Orange highlight background
            pad = 4
            draw.rounded_rectangle(
                (cx - pad, cy - 2, cx + text_font.getlength(word) + pad, cy + line_h - 8),
                radius=6, fill=ORANGE
            )
            draw.text((cx, cy), word, fill=BG, font=text_font)
        else:
            draw.text((cx, cy), word, fill=WHITE, font=text_font)
        cx += ww

def create_frame(business_name, msg, highlight_idx, elapsed, total_dur):
    img = Image.new('RGB', (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    
    # Business name at top
    title_font = get_bold_font(38)
    tw = title_font.getlength(business_name)
    draw.text(((WIDTH - tw) / 2, 40), business_name, fill=WHITE, font=title_font)
    
    # Waveform
    draw_waveform(draw, 320, active=msg is not None)
    
    # Subtitle
    sub_font = get_font(22)
    st = "Our AI receptionist on a live call"
    sw = sub_font.getlength(st)
    draw.text(((WIDTH - sw) / 2, 440), st, fill=GREY, font=sub_font)
    
    # Speech bubble
    if msg:
        draw_speech_bubble(draw, msg['text'], msg['role'],
                          highlight_idx, get_font(30), get_bold_font(30))
    
    # Progress bar
    bar_y = HEIGHT - 30
    draw.rectangle((0, bar_y, WIDTH, HEIGHT), fill=PROGRESS_BG)
    prog = elapsed / total_dur if total_dur > 0 else 0
    draw.rectangle((0, bar_y, int(WIDTH * prog), HEIGHT), fill=RED)
    # Timestamp
    ts_font = get_font(18)
    mins, secs = divmod(int(elapsed), 60)
    tmins, tsecs = divmod(int(total_dur), 60)
    ts = f"{mins}:{secs:02d} / {tmins}:{tsecs:02d}"
    draw.text((WIDTH - 120, bar_y + 3), ts, fill=ORANGE, font=ts_font)
    
    return img

def make_video(business_name, conversation, audio_file, output_file, total_dur):
    frames_dir = "/Users/larsbeurskens/Documents/supportive-ai-dashboard/fb_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    total_frames = int(total_dur * FPS)
    print(f"Creating {total_frames} frames at {FPS}fps for {total_dur}s...")
    
    for frame in range(total_frames):
        t = frame / FPS
        # Find active message
        active_msg = None
        msg_start = 0
        for i, msg in enumerate(conversation):
            next_t = conversation[i+1]['t'] if i+1 < len(conversation) else total_dur
            if msg['t'] <= t < next_t:
                active_msg = msg
                msg_start = msg['t']
                break
        
        # Word highlighting
        highlight_idx = -1
        if active_msg:
            words = active_msg['text'].split()
            msg_elapsed = t - msg_start
            next_t = conversation[conversation.index(active_msg)+1]['t'] if conversation.index(active_msg)+1 < len(conversation) else total_dur
            msg_dur = next_t - msg_start
            if msg_dur > 0 and words:
                word_idx = int((msg_elapsed / msg_dur) * len(words))
                highlight_idx = min(word_idx, len(words) - 1)
        
        img = create_frame(business_name, active_msg, highlight_idx, t, total_dur)
        img.save(f"{frames_dir}/frame_{frame:06d}.png")
        if frame % (FPS * 10) == 0:
            print(f"  {frame}/{total_frames} ({t:.0f}s)")
    print(f"✅ Frames done. Compiling...")
    os.system(
        f'ffmpeg -y -framerate {FPS} -i "{frames_dir}/frame_%06d.png" '
        f'-i "{audio_file}" '
        f'-c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 '
        f'-c:a aac -b:a 128k -shortest '
        f'"{output_file}"'
    )
    shutil.rmtree(frames_dir)
    sz = os.path.getsize(output_file) / 1024 / 1024
    print(f"🎬 {output_file} ({sz:.1f}MB)")

DIR = "/Users/larsbeurskens/Documents/supportive-ai-dashboard"

ROBERT_CONV = [
    {"t": 0,  "role": "agent", "text": "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?"},
    {"t": 8,  "role": "user",  "text": "Hi, this is Robert. I have a question about your pricing and services. Can you share a bit more?"},
    {"t": 17, "role": "agent", "text": "Of course, Robert! Our call-out fee is £65 and that covers getting a plumber out to you. They'll assess what's going on and give you a clear quote before starting — no surprises."},
    {"t": 32, "role": "agent", "text": "A leaky tap runs about £80 to £150, blocked drains £80 to £200, boiler repairs £150 to £400. What sort of issue are you dealing with?"},
    {"t": 50, "role": "user",  "text": "I've got a leaky tap in the upstairs bathroom. Is the call-out fee deducted from the repair cost?"},
    {"t": 62, "role": "agent", "text": "Great question — the £65 call-out fee gets applied to the repair cost if you go ahead with the work, so it's essentially free. For a leaky tap you'd be looking at £80 to £150."},
    {"t": 80, "role": "agent", "text": "Would you like me to get someone booked in to sort that out for you?"},
    {"t": 86, "role": "user",  "text": "Yeah, that would be great. Thank you so much."},
]

MARIA_CONV = [
    {"t": 0,  "role": "agent", "text": "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?"},
    {"t": 8,  "role": "user",  "text": "Hi, Sarah. I'm calling regarding a clogged drain in my kitchen."},
    {"t": 14, "role": "agent", "text": "A clogged kitchen drain — we can definitely help with that. Can I start by getting your first name?"},
    {"t": 22, "role": "user",  "text": "My name is Maria."},
    {"t": 26, "role": "agent", "text": "Lovely, Maria. And what's your full address — house number and street?"},
    {"t": 33, "role": "user",  "text": "My address is 9 Japan Crescent, N4 4BB, London."},
    {"t": 42, "role": "agent", "text": "Perfect — 9 Japan Crescent, N4 4BB. When were you thinking, Maria?"},
    {"t": 52, "role": "user",  "text": "Is it possible to do it on Wednesday?"},
    {"t": 57, "role": "agent", "text": "Perfect, and what's the best number to reach you on?"},
    {"t": 64, "role": "user",  "text": "It's 07078 956 6868 5."},
    {"t": 72, "role": "agent", "text": "Let me check what we have available on Wednesday..."},
    {"t": 78, "role": "agent", "text": "Right, we've got openings at 8 AM and 3 PM. Which works better for you?"},
    {"t": 88, "role": "user",  "text": "Three would be perfect."},
    {"t": 92, "role": "agent", "text": "Let me get that booked in for you..."},
    {"t": 97, "role": "agent", "text": "You're all set for Wednesday, March 18th at 3 PM!"},
    {"t": 104, "role": "agent", "text": "There's a £65 call-out fee — gets applied to the repair cost if you go ahead. No surprises."},
    {"t": 118, "role": "agent", "text": "You're all sorted, Maria. Is there anything else I can help with?"},
    {"t": 126, "role": "user",  "text": "No, you've been really helpful. Thank you!"},
    {"t": 132, "role": "agent", "text": "You're welcome! Have a great day, Maria!"},
    {"t": 138, "role": "user",  "text": "You too. Bye!"},
]

LANCE_CONV = [
    {"t": 0,   "role": "agent", "text": "Thank you for calling Hudson Valley Plumbing. This is Sarah. How can I help you today?"},
    {"t": 6,   "role": "user",  "text": "Hi Sarah, this is Lance. I'd like to book an appointment at 150 Market Street in Poughkeepsie. My faucet is leaking."},
    {"t": 18,  "role": "agent", "text": "Got it, Lance — a leaky faucet at 150 Market Street in Poughkeepsie. Is that in the kitchen, bathroom, or somewhere else?"},
    {"t": 26,  "role": "user",  "text": "It's in the bathroom."},
    {"t": 29,  "role": "agent", "text": "Perfect — bathroom faucet. And what's the zip code there, Lance?"},
    {"t": 34,  "role": "user",  "text": "12601."},
    {"t": 38,  "role": "agent", "text": "Awesome, thanks Lance. So when were you thinking — any particular day that works for you?"},
    {"t": 44,  "role": "user",  "text": "Do you have next week on Monday?"},
    {"t": 48,  "role": "agent", "text": "Let me check what we have open on that day, just a moment..."},
    {"t": 54,  "role": "user",  "text": "Thank you."},
    {"t": 57,  "role": "agent", "text": "Great news! We have openings at 8 AM, 9 AM, and 10 AM on Monday. Which one works best for you?"},
    {"t": 64,  "role": "user",  "text": "9 AM will be best. Thank you."},
    {"t": 68,  "role": "agent", "text": "Perfect. Let me get that booked for you — just pulling up my system, this will take me a sec..."},
    {"t": 75,  "role": "agent", "text": "You're all set for Monday, March 9th at 9 AM! Just so you know, there's an $89 diagnostic visit fee. The plumber will assess the issue and give you a clear quote before starting — no surprises."},
    {"t": 91,  "role": "agent", "text": "And what's the best number to reach you so we can send you a confirmation text?"},
    {"t": 93,  "role": "user",  "text": "It's 479-888-4761."},
    {"t": 102, "role": "agent", "text": "Okay, so that's 479-888-4761 — did I get that right?"},
    {"t": 108, "role": "user",  "text": "Yes."},
    {"t": 112, "role": "agent", "text": "Perfect — you'll get a confirmation text at that number. We'll see you Monday, March 9th at 9 AM. Is there anything else I can help you with today?"},
    {"t": 120, "role": "user",  "text": "No, that's it. Thank you so much. See you Monday. Bye!"},
]

if __name__ == "__main__":
    import sys
    which = sys.argv[1] if len(sys.argv) > 1 else "lance"
    
    if which in ("robert", "all"):
        print("\n=== ROBERT (UK Price Enquiry) ===")
        make_video(
            "London Plumbing Services",
            ROBERT_CONV,
            f"{DIR}/public/audio/demo-call-uk-robert-pricing.m4a",
            f"{DIR}/uk_robert_pricing_facebook.mp4",
            94
        )
    
    if which in ("maria", "all"):
        print("\n=== MARIA (UK Booking) ===")
        make_video(
            "London Plumbing Services",
            MARIA_CONV,
            f"{DIR}/public/audio/demo-call-uk-maria-booking.m4a",
            f"{DIR}/uk_maria_booking_facebook.mp4",
            155
        )
    
    if which in ("lance", "all"):
        print("\n=== LANCE (US Plumbing Booking) ===")
        make_video(
            "Hudson Valley Plumbing",
            LANCE_CONV,
            f"{DIR}/public/audio/demo-call-plumbing-lance-booking.m4a",
            f"{DIR}/lance_booking_facebook.mp4",
            124
        )
    
    print("\n✅ All done!")
