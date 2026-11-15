#!/bin/sh
# Renders resume.html to the two PDFs the site serves. Needs Google Chrome and a network connection (fonts).
cd "$(dirname "$0")" || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
pdf() { "$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf="../public/$1" "file://$PWD/resume.html$2" 2>/dev/null; }
pdf Ullas_JS_Resume.pdf ""
pdf Ullas_JS_Resume_Print.pdf "?light"
