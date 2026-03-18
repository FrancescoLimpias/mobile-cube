#!/bin/bash
# Start development server and watch mode

echo "Running initial setup and ensuring story format is built..."
# Ensure the parent format is built
cd ../ && python3 build.py && cd test-story

# Ensure tweego is downloaded
bash scripts/setup.sh

echo "Starting Tweego watch process..."
# Create public dir if it doesn't exist
mkdir -p public
# Run Tweego watch mode in the background
TWEEGO_PATH=./format ./bin/tweego -f MobileCube -w -o public/index.html src/ &
TWEEGO_PID=$!

echo "Starting local Python web server at http://localhost:8000"
# Run Python server
cd public
python3 -m http.server 8000 &
SERVER_PID=$!

# Handle exit and kill background processes
function cleanup {
  echo "Stopping development server..."
  kill $TWEEGO_PID
  kill $SERVER_PID
}
trap cleanup EXIT

wait
