#!/bin/sh
# Renders the link-preview image and the Apple touch icon from og.html. Needs Google Chrome and a network connection (fonts).
cd "$(dirname "$0")" || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot() { "$CHROME" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=10000 --window-size="$2" --screenshot="../app/$1" "file://$PWD/og.html$3" 2>/dev/null; }
shot opengraph-image.png 1200,630 ""
shot apple-icon.png 180,180 "?icon"
sips -z 48 48 -s format ico ../app/apple-icon.png --out ../app/favicon.ico >/dev/null
