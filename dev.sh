#!/bin/bash

# Trap SIGINT to kill background processes when the script is stopped
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# Get the script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting Backend..."
cd "$DIR/backend" && make run-dev &

echo "Starting Frontend..."
cd "$DIR/frontend-next" && npm run dev &

# Wait for all background processes
wait
