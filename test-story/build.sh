#!/bin/bash
# Build test story to public/index.html

echo "Running setup..."
bash scripts/setup.sh

mkdir -p public
echo "Compiling story..."
TWEEGO_PATH=./format ./bin/tweego -f MobileCube -o public/index.html src/

echo "Build complete! File is at public/index.html"
