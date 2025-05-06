// import express from "express";
// import cors from "cors";
// import * as chromeLauncher from "chrome-launcher";
// import { createRequire } from "node:module";
// import puppeteer from 'puppeteer';
// const require = createRequire(import.meta.url);

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());
// app.use(express.json());

// process.env.CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';

// app.post("/api/lighthouse", async (req, res) => {
//   let chrome;
//   try {
//     // Dynamic import of Lighthouse with error handling
//     const lighthouseModule = await import("lighthouse");
//     const { default: lighthouse } = lighthouseModule;
//     const { ReportGenerator } = await import(
//       "lighthouse/report/generator/report-generator.js"
//     );

//     const { url, options = {} } = req.body;

//     if (!url) {
//       return res.status(400).json({ error: "URL is required" });
//     }

//     // Configuration that avoids the NO_LCP error
//     const config = {
//       extends: "lighthouse:default",
//       settings: {
//         skipAudits: ["largest-contentful-paint"],
//         throttlingMethod: "devtools",
//         throttling: {
//           rttMs: 40,
//           throughputKbps: 10 * 1024,
//           cpuSlowdownMultiplier: 1,
//           requestLatencyMs: 0,
//           downloadThroughputKbps: 0,
//           uploadThroughputKbps: 0,
//         },
//       },
//     };

//     chrome = await chromeLauncher.launch({
//       chromePath: process.env.CHROME_PATH,
//       chromeFlags: [
//         "--headless",
//         "--no-sandbox",
//         "--disable-gpu",
//         "--disable-dev-shm-usage",
//         "--disable-setuid-sandbox",
//       ],
//     });

//     // Workaround for performance mark error
//     const runnerResult = await lighthouse(
//       url,
//       {
//         port: chrome.port,
//         output: "json",
//         ...options,
//         // Disable storage reset to prevent some timing issues
//         disableStorageReset: true,
//       },
//       config
//     );

//     if (!runnerResult) {
//       throw new Error("Lighthouse audit failed");
//     }

//     const reportJson = runnerResult.lhr;
//     const reportHtml = ReportGenerator.generateReport(runnerResult.lhr, "html");
//     const reportCsv = ReportGenerator.generateReport(runnerResult.lhr, "csv");

//     res.json({
//       success: true,
//       data: {
//         reportJson,
//         reportHtml,
//         reportCsv,
//         audits: runnerResult.lhr.audits,
//         categories: runnerResult.lhr.categories,
//       },
//     });
//   } catch (error) {
//     console.error("Full Lighthouse error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       // Include more details in development
//       ...(process.env.NODE_ENV === "development" && {
//         stack: error.stack,
//         errorType: error.constructor.name,
//       }),
//     });
//   } finally {
//     if (chrome)
//       await chrome
//         .kill()
//         .catch((e) => console.error("Error killing chrome:", e));
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });


import chrome from 'chrome-aws-lambda';
import express from 'express';
import cors from 'cors';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';

const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/lighthouse", async (req, res) => {
  let browser;

  try {
    const lighthouseModule = await import("lighthouse");
    const { default: lighthouse } = lighthouseModule;
    const { ReportGenerator } = await import("lighthouse/report/generator/report-generator.js");

    const { url, options = {} } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const config = {
      extends: "lighthouse:default",
      settings: {
        throttlingMethod: "devtools"
      }
    };

    const executablePath = await chrome.executablePath;
    const isProduction = !!executablePath;

    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: isProduction ? executablePath : undefined,
      headless: chrome.headless,
      defaultViewport: { width: 1280, height: 800 }
    });

    const runnerResult = await lighthouse(url, {
      port: new URL(browser.wsEndpoint()).port,
      output: "json",
      ...options,
      disableStorageReset: true
    }, config);

    if (!runnerResult) throw new Error("Lighthouse audit failed");

    const reportJson = runnerResult.lhr;
    const reportHtml = ReportGenerator.generateReport(runnerResult.lhr, "html");
    const reportCsv = ReportGenerator.generateReport(runnerResult.lhr, "csv");

    res.json({
      success: true,
      data: {
        reportJson,
        reportHtml,
        reportCsv,
        audits: runnerResult.lhr.audits,
        categories: runnerResult.lhr.categories,
      },
    });

  } catch (error) {
    console.error("Full Lighthouse error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    if (browser) await browser.close().catch(console.error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
