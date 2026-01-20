#!/bin/bash

# Entropy Development Server Startup Script
# ==========================================

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "🔥 Starting Entropy..."
echo ""

# Check if backend port is in use
if lsof -i :8080 > /dev/null 2>&1; then
    echo "⚠️  Port 8080 in use, killing existing process..."
    kill $(lsof -t -i :8080) 2>/dev/null || true
    sleep 1
fi

# Check if frontend port is in use
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 in use, killing existing process..."
    kill $(lsof -t -i :3000) 2>/dev/null || true
    sleep 1
fi

# Start backend
echo "📦 Starting Go backend on :8080..."
cd "$PROJECT_ROOT/backend"
go run ./cmd/server &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo "⚡ Starting Next.js frontend on :3000..."
cd "$PROJECT_ROOT/frontend-next"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "════════════════════════════════════════"
echo "  ENTROPY DECISION ENGINE"
echo "════════════════════════════════════════"
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8080"
echo ""
echo "  Press Ctrl+C to stop all servers"
echo "════════════════════════════════════════"
echo ""

# Handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for either process to exit
wait
