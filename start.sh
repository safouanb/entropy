#!/bin/bash

# Entropy Decision Engine - Startup Script
# ==========================================

set -e

# --- Styles & Colors ---
BOLD='\033[1m'
RED='\033[0,31m'
GREEN='\033[0,32m'
BLUE='\033[0,34m'
CYAN='\033[0,36m'
YELLOW='\033[1,33m'
NC='\033[0m' # No Color

# --- Helper Functions ---

log_info() {
    echo -e "${BLUE}[INFO]${NC}    $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC}    $1"
}

log_process() {
    echo -e "${CYAN}[$1]${NC}      $2"
}

print_banner() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "  _____       _                       "
    echo " | ____|_ __ | |_ _ __ ___  _ __  _   _ "
    echo " |  _| | '_ \| __| '__/ _ \| '_ \| | | |"
    echo " | |___| | | | |_| | | (_) | |_) | |_| |"
    echo " |_____|_| |_|\__|_|  \___/| .__/ \__| |"
    echo "                           |_|     __|_|"
    echo -e "${NC}"
    echo -e " ${BOLD}DECISION ENGINE${NC} :: v1.0.0-beta"
    echo -e " ${BLUE}----------------------------------------${NC}"
    echo ""
}

cleanup() {
    echo ""
    echo -e " ${BLUE}----------------------------------------${NC}"
    log_process "SYSTEM" "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    log_success "Shutdown complete. Goodbye!"
    echo ""
    exit 0
}

# --- Main Execution ---

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
trap cleanup SIGINT SIGTERM

print_banner

# 1. System Checks
log_info "Checking system readiness..."

# Check Backend Port (8080)
if lsof -i :8080 > /dev/null 2>&1; then
    log_warn "Port 8080 is in use. Releasing..."
    kill $(lsof -t -i :8080) 2>/dev/null || true
    sleep 1
fi
log_success "Port 8080 is ready."

# Check Frontend Port (3000)
if lsof -i :3000 > /dev/null 2>&1; then
    log_warn "Port 3000 is in use. Releasing..."
    kill $(lsof -t -i :3000) 2>/dev/null || true
    sleep 1
fi
log_success "Port 3000 is ready."
echo ""

# 2. Start Services
log_process "GO" "Starting backend server (port 8080)..."
cd "$PROJECT_ROOT/backend"
# Start Backend in background, letting logs flow to stdout
go run ./cmd/server &
BACKEND_PID=$!

log_process "NEXT" "Starting frontend client (port 3000)..."
cd "$PROJECT_ROOT/frontend-next"
# Start Frontend in background, letting logs flow to stdout
npm run dev &
FRONTEND_PID=$!

echo ""
# 3. Dashboard (Printed immediately so it's seen before logs potentially scroll it)
echo -e " ${CYAN}┌──────────────────────────────────────────────────┐${NC}"
echo -e " ${CYAN}│${NC}             ${BOLD}SYSTEM READY & RUNNING${NC}               ${CYAN}│${NC}"
echo -e " ${CYAN}├──────────────────────────────────────────────────┤${NC}"
echo -e " ${CYAN}│${NC}  ${BOLD}Frontend${NC}  : http://localhost:3000                ${CYAN}│${NC}"
echo -e " ${CYAN}│${NC}  ${BOLD}Backend${NC}   : http://localhost:8080                ${CYAN}│${NC}"
echo -e " ${CYAN}└──────────────────────────────────────────────────┘${NC}"
echo ""
log_info "Tailing logs from services..."
echo "--------------------------------------------------------"

# Wait indefinitely
wait
