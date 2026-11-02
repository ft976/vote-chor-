import os
import subprocess

def run(cmd):
    subprocess.run(cmd, shell=True, check=True)

os.makedirs('screenshots', exist_ok=True)
os.makedirs('public/screenshots', exist_ok=True)
os.makedirs('/tmp/assets', exist_ok=True)

# 1. Prepare assets
# Resize bird for gameplay (~80x112)
run("convert public/static/images/bird.png -resize 80x112 /tmp/assets/bird_game.png")
# Resize bird for title emblem (~120x168)
run("convert public/static/images/bird.png -resize 120x168 /tmp/assets/bird_title.png")

# Prepare Rahul obstacle pillars
# Top pillar 1: width 90, height 240
run("convert public/static/images/rahul.webp -resize 90x240! -matte -bordercolor 'rgba(0,0,0,0)' \\( +clone -alpha extract -draw 'roundrectangle 0,0,90,240,12,12' \\) -alpha off -compose CopyOpacity -composite /tmp/assets/pipe_top1.png")
run("convert /tmp/assets/pipe_top1.png -bordercolor '#f59e0b' -border 2 /tmp/assets/pipe_top1_bordered.png")

# Bottom pillar 1: width 90, height 260
run("convert public/static/images/rahul.webp -resize 90x260! -matte -bordercolor 'rgba(0,0,0,0)' \\( +clone -alpha extract -draw 'roundrectangle 0,0,90,260,12,12' \\) -alpha off -compose CopyOpacity -composite /tmp/assets/pipe_bot1.png")
run("convert /tmp/assets/pipe_bot1.png -bordercolor '#f59e0b' -border 2 /tmp/assets/pipe_bot1_bordered.png")

# Top pillar 2: width 90, height 300
run("convert public/static/images/rahul.webp -resize 90x300! -matte -bordercolor 'rgba(0,0,0,0)' \\( +clone -alpha extract -draw 'roundrectangle 0,0,90,300,12,12' \\) -alpha off -compose CopyOpacity -composite /tmp/assets/pipe_top2.png")
run("convert /tmp/assets/pipe_top2.png -bordercolor '#f59e0b' -border 2 /tmp/assets/pipe_top2_bordered.png")

# Bottom pillar 2: width 90, height 200
run("convert public/static/images/rahul.webp -resize 90x200! -matte -bordercolor 'rgba(0,0,0,0)' \\( +clone -alpha extract -draw 'roundrectangle 0,0,90,200,12,12' \\) -alpha off -compose CopyOpacity -composite /tmp/assets/pipe_bot2.png")
run("convert /tmp/assets/pipe_bot2.png -bordercolor '#f59e0b' -border 2 /tmp/assets/pipe_bot2_bordered.png")

print("Pillars and character sprites prepared.")

# -------------------------------------------------------------
# 2. BUILD GAMEPLAY SCREENSHOT
# -------------------------------------------------------------
gameplay_cmd = """
convert public/static/images/background.webp -resize 1280x720! \
  -fill 'rgba(15,23,42,0.50)' -draw 'rectangle 0,0 1280,720' \
  -fill 'rgba(255,255,255,0.12)' \
  -draw 'circle 1100,150 1100,185 circle 1140,140 1140,190 circle 1180,150 1180,190' \
  -draw 'circle 400,200 400,230 circle 435,190 435,235 circle 470,200 470,230' \
  /tmp/assets/bg_base.png
"""
run(gameplay_cmd)

# Composite pillars onto background
run("composite -geometry +560+0 /tmp/assets/pipe_top1_bordered.png /tmp/assets/bg_base.png /tmp/assets/game_step1.png")
run("composite -geometry +560+435 /tmp/assets/pipe_bot1_bordered.png /tmp/assets/game_step1.png /tmp/assets/game_step2.png")
run("composite -geometry +980+0 /tmp/assets/pipe_top2_bordered.png /tmp/assets/game_step2.png /tmp/assets/game_step3.png")
run("composite -geometry +980+495 /tmp/assets/pipe_bot2_bordered.png /tmp/assets/game_step3.png /tmp/assets/game_step4.png")

# Composite bird character at x=230, y=285
run("composite -geometry +230+285 /tmp/assets/bird_game.png /tmp/assets/game_step4.png /tmp/assets/game_step5.png")

# Draw Runway bar, HUD, and Particle trail
gameplay_final_cmd = """
convert /tmp/assets/game_step5.png \
  -fill '#f59e0b' -draw 'rectangle 0,698 1280,705' \
  -fill '#ffffff' -draw 'rectangle 0,705 1280,712' \
  -fill '#10b981' -draw 'rectangle 0,712 1280,720' \
  -fill '#020617' -draw 'rectangle 0,696 1280,698' \
  -fill '#fbbf24' -draw 'circle 210,360 210,365 circle 180,368 180,373 circle 150,372 150,376' \
  -fill '#ffffff' -draw 'circle 195,355 195,358 circle 165,362 165,365' \
  -fill '#10b981' -draw 'circle 185,378 185,382 circle 135,380 135,383' \
  -fill 'rgba(2,6,23,0.85)' -stroke '#334155' -strokewidth 1 \
  -draw 'roundrectangle 30,25 210,65 14,14' \
  -draw 'roundrectangle 220,25 310,65 14,14' \
  -draw 'roundrectangle 1040,25 1090,65 14,14' \
  -draw 'roundrectangle 1100,25 1150,65 14,14' \
  -draw 'roundrectangle 1160,25 1210,65 14,14' \
  -draw 'roundrectangle 1220,25 1270,65 14,14' \
  -draw 'roundrectangle 440,660 840,690 15,15' \
  -stroke none \
  -font DejaVu-Sans-Bold -pointsize 13 -fill '#f59e0b' \
  -draw 'text 46,50 "★ Record: 48"' \
  -draw 'text 238,50 "CLASSIC"' \
  -font DejaVu-Sans-Bold -pointsize 12 -fill '#cbd5e1' \
  -draw 'text 475,680 "Space or Tap to Elevate • Esc to Pause • F for Fullscreen"' \
  -font DejaVu-Sans-Bold -pointsize 11 -fill '#f59e0b' \
  -draw 'gravity North text 0,22 "CAMPAIGN POINTS"' \
  -font DejaVu-Sans-Bold -pointsize 38 -fill '#ffffff' \
  -draw 'gravity North text 0,38 "18"' \
  -font DejaVu-Sans-Bold -pointsize 18 -fill '#fbbf24' \
  -draw 'gravity Northwest text 605,340 "+1"' \
  -font DejaVu-Sans -pointsize 16 -fill '#cbd5e1' \
  -draw 'text 1058,50 "⛶"' \
  -draw 'text 1118,50 "🔊"' \
  -draw 'text 1178,50 "🎵"' \
  -draw 'text 1238,50 "⏸"' \
  screenshots/gameplay.jpg
"""
run(gameplay_final_cmd)
run("cp screenshots/gameplay.jpg public/screenshots/gameplay.jpg")
print("Gameplay screenshot created successfully.")

# -------------------------------------------------------------
# 3. BUILD TITLE SCREEN SCREENSHOT
# -------------------------------------------------------------
title_cmd = """
convert public/static/images/background.webp -resize 1280x720! \
  -fill 'rgba(2,6,23,0.76)' -draw 'rectangle 0,0 1280,720' \
  -fill 'rgba(245,158,11,0.22)' -draw 'circle 640,240 640,360' \
  -fill 'rgba(15,23,42,0.95)' -stroke '#f59e0b' -strokewidth 3 \
  -draw 'circle 640,240 640,320' \
  -stroke none \
  /tmp/assets/title_base.png
"""
run(title_cmd)

# Composite bird into center of emblem
run("composite -geometry +580+155 /tmp/assets/bird_title.png /tmp/assets/title_base.png /tmp/assets/title_step1.png")

title_final_cmd = """
convert /tmp/assets/title_step1.png \
  -fill 'rgba(2,6,23,0.85)' -stroke '#334155' -strokewidth 1 \
  -draw 'roundrectangle 40,30 220,70 14,14' \
  -draw 'roundrectangle 235,30 380,70 14,14' \
  -draw 'roundrectangle 1100,30 1150,70 14,14' \
  -draw 'roundrectangle 1160,30 1210,70 14,14' \
  -draw 'roundrectangle 1220,30 1270,70 14,14' \
  -stroke none \
  -font DejaVu-Sans-Bold -pointsize 14 -fill '#f59e0b' \
  -draw 'text 58,55 "★ Record: 48"' \
  -font DejaVu-Sans-Bold -pointsize 12 -fill '#10b981' \
  -draw 'text 255,55 "● Airspace Active"' \
  -font DejaVu-Sans -pointsize 18 -fill '#cbd5e1' \
  -draw 'text 1118,56 "⛶"' \
  -draw 'text 1178,56 "🔊"' \
  -draw 'text 1238,56 "🎵"' \
  -fill 'rgba(245,158,11,0.15)' -stroke '#f59e0b' -strokewidth 1 \
  -draw 'roundrectangle 530,345 750,375 14,14' \
  -stroke none \
  -font DejaVu-Sans-Bold -pointsize 11 -fill '#f59e0b' \
  -draw 'gravity North text 0,352 "OFFICIAL SIMULATION"' \
  -font DejaVu-Sans-Bold -pointsize 44 -fill '#fbbf24' \
  -draw 'gravity North text 0,385 "FLYING LEADER"' \
  -font DejaVu-Sans-Bold -pointsize 14 -fill '#cbd5e1' \
  -draw 'gravity North text 0,442 "AERIAL CAMPAIGN ODYSSEY"' \
  -fill 'rgba(15,23,42,0.90)' -stroke '#334155' -strokewidth 1 \
  -draw 'roundrectangle 430,475 850,535 18,18' \
  -fill 'rgba(15,23,42,0.6)' -draw 'roundrectangle 438,482 565,528 14,14' \
  -fill '#b45309' -stroke '#f59e0b' -strokewidth 1.5 -draw 'roundrectangle 575,482 705,528 14,14' \
  -stroke none -fill 'rgba(15,23,42,0.6)' -draw 'roundrectangle 715,482 842,528 14,14' \
  -font DejaVu-Sans-Bold -pointsize 13 -fill '#94a3b8' -draw 'text 468,510 "Standard"' \
  -font DejaVu-Sans-Bold -pointsize 13 -fill '#ffffff' -draw 'text 615,510 "Classic"' \
  -font DejaVu-Sans-Bold -pointsize 13 -fill '#94a3b8' -draw 'text 752,510 "Precision"' \
  -fill '#fbbf24' -stroke '#ffffff' -strokewidth 1 -draw 'roundrectangle 490,560 790,620 30,30' \
  -stroke none -font DejaVu-Sans-Bold -pointsize 16 -fill '#020617' \
  -draw 'text 530,598 "▶  INITIATE FLIGHT"' \
  -fill '#0f172a' -draw 'roundrectangle 720,570 780,600 8,8' \
  -font DejaVu-Sans-Bold -pointsize 11 -fill '#fbbf24' \
  -draw 'text 732,588 "SPACE"' \
  -font DejaVu-Sans-Bold -pointsize 12 -fill '#94a3b8' \
  -draw 'gravity South text 0,35 "TAP SCREEN or SPACE to Flap • ESC Pause • F Fullscreen • M Audio"' \
  screenshots/title.jpg
"""
run(title_final_cmd)
run("cp screenshots/title.jpg public/screenshots/title.jpg")
print("Title screenshot created successfully.")
