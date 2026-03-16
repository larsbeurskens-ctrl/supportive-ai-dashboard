"""
Create a Facebook Reel video (9:16 = 1080x1920) from a UK AI receptionist call.
Speech bubbles with captions, synced to trimmed audio.
"""
import os, textwrap, shutil
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = "/Users/larsbeurskens/Documents/supportive-ai-dashboard"
AUDIO_FILE = f"{OUTPUT_DIR}/public/audio/demo-call-uk-plumbing-michael-trimmed.m4a"
FRAMES_DIR = f"{OUTPUT_DIR}/uk_video_frames"
VIDEO_OUT = f"{OUTPUT_DIR}/uk_plumbing_demo_facebook.mp4"

WIDTH, HEIGHT = 1080, 1920
FPS = 2

BG_COLOR = (26, 46, 59)
AGENT_BG = (13, 148, 136)
AGENT_TEXT = (255, 255, 255)
USER_BG = (240, 238, 235)
USER_TEXT = (26, 46, 59)
ACCENT = (232, 147, 12)
MUTED = (148, 167, 184)

# Conversation with TRIMMED timestamps (19s dead air removed at 84s mark)
CONVERSATION = [
    {"t": 0,  "role": "agent", "text": "Hello, thank you for calling London Plumbing Services! This is Sarah. How can I help you today?"},
    {"t": 8,  "role": "user",  "text": "Hi, this is Michael. I have a leaky tap in the upstairs bathroom. Can you help me with that?"},
    {"t": 15, "role": "agent", "text": "Hi Michael! Yeah, absolutely we can help with that. What's your full address including house number?"},
    {"t": 27, "role": "user",  "text": "28 Annaly Park Mansions, in London. SE28 0NE is the postcode."},
    {"t": 38, "role": "agent", "text": "Perfect — 28 Annaly Park Mansions, London, SE28 0NE. When were you thinking you'd like someone to come out?"},
    {"t": 48, "role": "user",  "text": "Do you have availability tomorrow?"},
    {"t": 52, "role": "agent", "text": "Great! What's the best number to reach you on?"},
    {"t": 57, "role": "user",  "text": "+44 7494 156 213"},
    {"t": 64, "role": "agent", "text": "Let me check what we've got available tomorrow, just a moment..."},
    {"t": 72, "role": "agent", "text": "For tomorrow we've got an opening at 12 PM. Would that work for you?"},
    {"t": 82, "role": "user",  "text": "12 PM works really well. Let's lock it in."},
    {"t": 86, "role": "agent", "text": "Brilliant, let me get that booked in for you..."},
    {"t": 91, "role": "agent", "text": "You're all set for Tuesday, March 17th at 12 PM!"},
    {"t": 96, "role": "agent", "text": "There's a £65 call-out fee — gets applied to the repair cost if you go ahead. No surprises."},
    {"t": 108, "role": "agent", "text": "You'll get a confirmation text shortly. Anything else I can help with?"},
    {"t": 114, "role": "user",  "text": "No, that's it. Thank you so much. You've been really helpful!"},
    {"t": 122, "role": "agent", "text": "You're welcome! Have a great day, Michael!"},
]

def get_font(size):
    for p in ["/System/Library/Fonts/SFPro-Regular.otf",
              "/System/Library/Fonts/Supplemental/Arial.ttf",
              "/System/Library/Fonts/Helvetica.ttc"]:
        try: return ImageFont.truetype(p, size)
        except: continue
    return ImageFont.load_default()

def get_bold_font(size):
    for p in ["/System/Library/Fonts/SFPro-Bold.otf",
              "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
              "/System/Library/Fonts/Helvetica.ttc"]:
        try: return ImageFont.truetype(p, size)
        except: continue
    return get_font(size)

def draw_bubble(draw, text, y_pos, role, font, max_width=900):
    lines = []
    for line in text.split('\n'):
        wrapped = textwrap.wrap(line, width=36)
        lines.extend(wrapped if wrapped else [''])
    line_height = font.size + 14
    text_height = len(lines) * line_height + 24
    bubble_width = min(max_width, 850)
    padding = 28
    if role == 'agent':
        bx = 50
        bg, tc = AGENT_BG, AGENT_TEXT
    else:
        bx = WIDTH - bubble_width - 50
        bg, tc = USER_BG, USER_TEXT
    draw.rounded_rectangle((bx, y_pos, bx + bubble_width, y_pos + text_height + padding), radius=20, fill=bg)
    label_font = get_font(20)
    label = "🤖 Sarah (AI)" if role == 'agent' else "👤 Customer"
    label_color = (180, 220, 210) if role == 'agent' else (100, 120, 140)
    draw.text((bx + 18, y_pos + 8), label, fill=label_color, font=label_font)
    ty = y_pos + 34
    for line in lines:
        draw.text((bx + 18, ty), line, fill=tc, font=font)
        ty += line_height
    return y_pos + text_height + padding + 14

def create_frame(visible_messages, frame_num):
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    title_font = get_bold_font(42)
    sub_font = get_font(26)
    # Top accent bar
    draw.rectangle((0, 0, WIDTH, 8), fill=ACCENT)
    # Header
    draw.text((60, 50), "Supportive AI", fill=ACCENT, font=title_font)
    draw.text((60, 105), "AI Receptionist for UK Plumbers", fill=MUTED, font=sub_font)
    # Live tag
    draw.rounded_rectangle((60, 150, 250, 183), radius=12, fill=(220, 38, 38))
    draw.text((78, 154), "🔴 LIVE CALL", fill=(255, 255, 255), font=get_bold_font(18))
    # Divider
    draw.line((60, 210, WIDTH - 60, 210), fill=(50, 70, 85), width=2)
    # Bubbles
    font = get_font(28)
    y = 235
    max_y = HEIGHT - 180
    for msg in visible_messages:
        if y > max_y: break
        y = draw_bubble(draw, msg['text'], y, msg['role'], font)
    # Bottom bar
    draw.rectangle((0, HEIGHT - 130, WIDTH, HEIGHT), fill=(20, 35, 45))
    draw.text((60, HEIGHT - 105), "supportive-ai.com", fill=ACCENT, font=get_bold_font(30))
    draw.text((60, HEIGHT - 65), "24/7 AI receptionist for trade businesses", fill=MUTED, font=get_font(24))
    draw.text((WIDTH - 420, HEIGHT - 75), "Try it: +44 7427 846243", fill=(255, 255, 255), font=get_font(22))
    return img

def main():
    os.makedirs(FRAMES_DIR, exist_ok=True)
    total_duration = CONVERSATION[-1]['t'] + 8
    total_frames = total_duration * FPS
    print(f"Creating {total_frames} frames at {FPS} FPS for {total_duration}s...")
    visible = []
    msg_idx = 0
    for frame in range(total_frames):
        current_time = frame / FPS
        while msg_idx < len(CONVERSATION) and CONVERSATION[msg_idx]['t'] <= current_time:
            visible.append(CONVERSATION[msg_idx])
            msg_idx += 1
        show = visible[-6:] if len(visible) > 6 else visible
        img = create_frame(show, frame)
        img.save(f"{FRAMES_DIR}/frame_{frame:05d}.png")
        if frame % 20 == 0:
            print(f"  Frame {frame}/{total_frames} ({current_time:.0f}s)")
    print(f"\n✅ {total_frames} frames generated")
    print("Compiling video...")
    cmd = (
        f'ffmpeg -y -framerate {FPS} -i "{FRAMES_DIR}/frame_%05d.png" '
        f'-i "{AUDIO_FILE}" '
        f'-c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 '
        f'-c:a aac -b:a 128k -shortest '
        f'"{VIDEO_OUT}"'
    )
    os.system(cmd)
    shutil.rmtree(FRAMES_DIR)
    size_mb = os.path.getsize(VIDEO_OUT) / 1024 / 1024
    print(f"\n🎬 Video: {VIDEO_OUT}")
    print(f"   Size: {WIDTH}x{HEIGHT} (9:16 Reels)")
    print(f"   Duration: ~{total_duration}s | File: {size_mb:.1f}MB")

if __name__ == "__main__":
    main()
