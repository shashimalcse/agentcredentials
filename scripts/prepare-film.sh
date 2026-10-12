#!/usr/bin/env bash
# Prepare the promo film for the home page.
# Usage: scripts/prepare-film.sh <exported.mp4> [poster-second]
# Re-encodes the motion artifact's export for the web (H.264, AAC, fast start) and grabs a poster frame.
set -euo pipefail
in="${1:?usage: scripts/prepare-film.sh <exported.mp4> [poster-second]}"
at="${2:-41.5}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/video"
mkdir -p "$out"
ffmpeg -y -loglevel error -i "$in" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
  -vf "scale='min(1920,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "$out/agent-credentials.mp4"
ffmpeg -y -loglevel error -ss "$at" -i "$out/agent-credentials.mp4" -frames:v 1 -q:v 3 "$out/agent-credentials-poster.jpg"
ls -lh "$out"
