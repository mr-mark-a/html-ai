#!/bin/sh
# TRIMUI Smart Pro S Launcher Script for Mmusic Player
# Place this folder in /mnt/SDCARD/Apps/MPlay

progdir=$(dirname "$0")
cd "$progdir"

# Launch html player using available system web browser / engine
if [ -f "/usr/trimui/bin/browser" ]; then
    /usr/trimui/bin/browser "$progdir/Mmusic.html"
elif command -v chromium >/dev/null 2>&1; then
    chromium --kiosk --window-size=1280,720 "$progdir/Mmusic.html"
elif command -v firefox >/dev/null 2>&1; then
    firefox --kiosk "$progdir/Mmusic.html"
else
    xdg-open "$progdir/Mmusic.html"
fi
