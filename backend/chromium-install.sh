#!/bin/bash

# Download and install Chromium
apt-get update -y
apt-get install -y wget gnupg

# Add Google's Linux package repository for Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

apt-get update -y
apt-get install -y google-chrome-stable

# Set CHROME_PATH to point to the installed chrome executable
export CHROME_PATH="/usr/bin/google-chrome-stable"
