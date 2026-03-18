#!/bin/bash
# Download and install Tweego
mkdir -p bin
cd bin
if [ ! -f "tweego" ]; then
    echo "Downloading Tweego v2.1.1 for Linux x64..."
    curl -L https://github.com/tmedwards/tweego/releases/download/v2.1.1/tweego-2.1.1-linux-x64.zip -o tweego.zip
    unzip tweego.zip
    rm tweego.zip
    chmod +x tweego
fi
cd ..

# Set up local format symlink so Tweego recognizes "MobileCube"
mkdir -p format/MobileCube
if [ ! -f "format/MobileCube/format.js" ]; then
    echo "Creating symlink to compiled MobileCube format..."
    ln -sf ../../../dist/format.js format/MobileCube/format.js
fi
echo "Setup complete! You can now run './dev.sh' to start the hot-reload server."
