Lighthouse
This repository is designed to run a Lighthouse audit for web performance testing using Puppeteer, ChromeLauncher, and Lighthouse. The application is split into Frontend and Backend directories.

Backend: Handles the Lighthouse audits.

Frontend: Provides a user interface for users to trigger Lighthouse audits.

Table of Contents
Tech Stack

Installation

Backend Setup

Frontend Setup

Running the App Locally

Testing the API

Environment Variables

License

Tech Stack
Frontend: Next.js, Axios

Backend: Express, Puppeteer, Lighthouse, ChromeLauncher

Other: CORS for cross-origin requests, JSON parsing

Installation
Clone the repository

bash
git clone https://github.com/141AQUA-xzy/Lighthouse.git
cd Lighthouse
Install dependencies for both frontend and backend

In the root directory, you will find two separate directories: frontend and backend. Install dependencies for both.

bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
Backend Setup
The backend is powered by Express and utilizes Puppeteer and ChromeLauncher to run Lighthouse audits.

Set up environment variables (optional)

You may specify the path to Chrome in your environment variables if you're using a custom path.

bash
export CHROME_PATH="/path/to/your/chrome"
For local testing, it's generally not necessary to adjust this unless you're using a custom Chrome installation.

Run the backend server

Navigate to the backend directory and start the backend:

bash
cd backend
npm run start
By default, the server will be running on port 3001.

Frontend Setup
The frontend is a React application where users can input URLs and trigger Lighthouse audits.

Run the frontend

Navigate to the frontend directory and start the frontend:

bash
cd frontend
npm run start
The frontend will be running on localhost:3000.

Running the App Locally
Backend: Navigate to the backend directory and run:

bash
npm run start
This will start the backend server at http://localhost:3001.

Frontend: Navigate to the frontend directory and run:

bash
npm run start
This will start the React app at http://localhost:3000.

Testing the API
Once both the frontend and backend are running locally, you can test the API.

Open your browser and navigate to http://localhost:3000.

Input the URL you wish to audit in the frontend form.

Click the "Run Lighthouse" button.

The backend will trigger the Lighthouse audit and return the results.

You can also manually test the Lighthouse API by sending a POST request to the /api/lighthouse endpoint. Here's an example using Postman or curl:

bash
curl -X POST http://localhost:3001/api/lighthouse \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com"}'
The response will include the Lighthouse audit report in JSON, HTML, and CSV formats.

Frontend:

You can customize the UI to reflect your branding or any necessary changes.

Backend:

Ensure that the backend is running (npm run start in backend).

Test the Lighthouse audit API on any website you wish to showcase, using the /api/lighthouse endpoint.


Environment Variables
Make sure to add the following environment variables if necessary:

CHROME_PATH: '/usr/bin/google-chrome' (for Linux servers or specific setups).

License
This project is licensed under the MIT License - see the LICENSE file for details.