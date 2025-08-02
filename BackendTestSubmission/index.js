const express = require("express");
const { Log, setAuthToken } = require("../LoggingMiddleware");
const { nanoid } = require("nanoid");
const app = express();
app.use(express.json());
let urls = [];

setAuthToken(
  "your-token-here"
);
Log("backend", "info", "handler", "Server started");
app.get("/", (req, res) => {
  Log("backend", "info", "handler", "Home route called");
  res.send("Hello World");
});
app.post("/shorturls", async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url) {
      await Log("backend", "error", "handler", "URL is required");
      return res.status(400).json({ error: "URL is required" });
    }
    let code = shortcode || nanoid(5);
    const existing = urls.find(u => u.shortcode === code);
    if (existing) {
      await Log("backend", "warn", "handler", "Shortcode already exists");
      return res.status(400).json({ error: "Shortcode already exists" });
    }
    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + validity * 60000);
    urls.push({
      originalUrl: url,
      shortcode: code,
      createdAt,
      expiry,
      clicks: [],
    });

    await Log("backend", "info", "handler", `Created short URL: ${code}`);
    res.status(201).json({
      shortLink: `http://localhost:3000/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = urls.find(u => u.shortcode === shortcode);
    if (!urlDoc) {
      await Log("backend", "error", "handler", "Shortcode not found");
      return res.status(404).send("Short URL not found");
    }
    if (new Date() > urlDoc.expiry) {
      await Log("backend", "warn", "handler", "Short URL expired");
      return res.status(410).send("Short URL has expired");
    }
    urlDoc.clicks.push({
      timestamp: new Date(),
      referrer: req.get("referer") || "direct",
      location: "unknown",
    });
    await Log("backend", "info", "handler", `Redirecting to ${urlDoc.originalUrl}`);
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/shorturls/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = urls.find(u => u.shortcode === shortcode);
    if (!urlDoc) {
      await Log("backend", "error", "handler", "Shortcode not found for stats");
      return res.status(404).json({ error: "Short URL not found" });
    }
    res.json({
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      expiry: urlDoc.expiry,
      clickCount: urlDoc.clicks.length,
      clicks: urlDoc.clicks,
    });
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
