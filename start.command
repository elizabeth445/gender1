#!/bin/zsh
cd "${0:A:h}"
source "$HOME/.codex/bin/frontend-env.sh"
npm run dev -- --port 5186 --strictPort
