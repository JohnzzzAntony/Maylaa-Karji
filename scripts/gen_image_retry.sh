#!/bin/bash
# Retry helper for z-ai image generation — handles HTTP 429 rate limits.
# Usage: gen_image_retry.sh "<prompt>" "<output_path>" [size]
# 3 attempts, 5s backoff between attempts.

set -u

PROMPT="$1"
OUTPUT="$2"
SIZE="${3:-1024x1024}"
MAX_ATTEMPTS=3
BACKOFF_SEC=5
LOG_DIR="/home/z/my-project/.zai-logs"
mkdir -p "$LOG_DIR"

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  echo "[attempt ${attempt}/${MAX_ATTEMPTS}] generating -> ${OUTPUT}"
  LOGFILE="${LOG_DIR}/zai_$(basename "$OUTPUT" .jpg)_${attempt}.log"
  if z-ai image -p "$PROMPT" -o "$OUTPUT" -s "$SIZE" >"$LOGFILE" 2>&1; then
    if [ -s "$OUTPUT" ]; then
      echo "  OK: $(file -b "$OUTPUT")"
      exit 0
    else
      echo "  FAIL: command succeeded but output file missing/empty"
    fi
  else
    echo "  FAIL: command exited non-zero (likely HTTP 429 rate limit)"
    tail -n 5 "$LOGFILE" 2>/dev/null | sed 's/^/    /'
  fi
  if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
    echo "  backing off ${BACKOFF_SEC}s..."
    sleep "$BACKOFF_SEC"
  fi
done

echo "  GIVE UP after ${MAX_ATTEMPTS} attempts: ${OUTPUT}"
exit 1
