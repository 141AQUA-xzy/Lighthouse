FROM node:18

# Install Chromium dependencies
RUN apt-get update && apt-get install -y wget gnupg unzip curl \
    ca-certificates fonts-liberation libappindicator3-1 libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 \
    libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    xdg-utils chromium

# Set environment variables
ENV CHROME_PATH=/usr/bin/chromium
ENV NODE_ENV=production

# Create app directory
WORKDIR /app
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]