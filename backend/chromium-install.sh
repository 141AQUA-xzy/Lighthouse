#!/bin/bash

set -e

echo "🔧 Installing Google Chrome..."

# Install dependencies
apt-get update -y
apt-get install -y wget gnupg ca-certificates

# Add Google's Linux package repository for Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Chrome
apt-get update -y
apt-get install -y google-chrome-stable

# Log Chrome version (for debugging)
google-chrome-stable --version

echo "✅ Chrome installed successfully"
