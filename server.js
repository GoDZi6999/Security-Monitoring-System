const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= SERVER ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", () => {
  console.log("Client connected");
});

/* ================= MONGODB CONNECTION ================= */
console.log("Connecting to MongoDB...");

mongoose
  .connect(
    "mongodb://admin:Test12345@ac-slc2pfz-shard-00-00.va1ezzu.mongodb.net:27017,ac-slc2pfz-shard-00-01.va1ezzu.mongodb.net:27017,ac-slc2pfz-shard-00-02.va1ezzu.mongodb.net:27017/security-dashboard?ssl=true&replicaSet=atlas-xsromc-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
      serverSelectionTimeoutMS: 5000,
    }
  )
  .then(() => {
    console.log("MongoDB connected");

    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:");
    console.error(err);
  });

/* ================= MODELS ================= */
const EventSchema = new mongoose.Schema({
  type: String,
  severity: String,
  ip: String,
  timestamp: Date,
  details: String,
});

const AlertSchema = new mongoose.Schema({
  type: String,
  message: String,
  severity: String,
  timestamp: Date,
  acknowledged: Boolean,
});

const Event = mongoose.model("Event", EventSchema);
const Alert = mongoose.model("Alert", AlertSchema);

/* ================= MEMORY ================= */
const store = {
  apiRequests: [],
  authLogs: [],
  rateLimit: new Map(),
};

/* ================= REQUEST LOGGING ================= */
app.use((req, res, next) => {
  const requestId = uuidv4();
  const clientIp = req.ip || req.connection.remoteAddress;

  const requestLog = {
    id: requestId,
    method: req.method,
    path: req.path,
    ip: clientIp,
    timestamp: new Date(),
  };

  store.apiRequests.push(requestLog);
  next();
});

/* ================= RATE LIMIT ================= */
app.use(async (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!store.rateLimit.has(ip)) {
    store.rateLimit.set(ip, { count: 1, reset: now + 60000 });
    return next();
  }

  const data = store.rateLimit.get(ip);

  if (now > data.reset) {
    store.rateLimit.set(ip, { count: 1, reset: now + 60000 });
    return next();
  }

  data.count++;

  if (data.count > 60) {
    const event = {
      type: "RATE_LIMIT_EXCEEDED",
      severity: "warning",
      ip,
      timestamp: new Date(),
      details: "Too many requests",
    };

    await Event.create(event);
    io.emit("new_event", event);

    return res.status(429).json({ error: "Too many requests" });
  }

  next();
});

/* ================= AUTH ================= */
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "admin123") {
    const event = {
      type: "FAILED_LOGIN",
      severity: "warning",
      ip: req.ip,
      timestamp: new Date(),
      details: "Invalid login",
    };

    await Event.create(event);
    io.emit("new_event", event);

    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ token: "demo-token" });
});

/* ================= DEMO EVENTS ================= */
const generateDemoEvent = async () => {
  const event = {
    type: "UNUSUAL_ACTIVITY",
    severity: "info",
    ip: "192.168.1.1",
    timestamp: new Date(),
    details: "Demo event",
  };

  await Event.create(event);
  io.emit("new_event", event);
};

setInterval(generateDemoEvent, 5000);

/* ================= API ================= */
app.get("/api/security/events", async (req, res) => {
  const events = await Event.find().sort({ timestamp: -1 }).limit(100);
  res.json(events);
});

app.get("/api/alerts", async (req, res) => {
  const alerts = await Alert.find().sort({ timestamp: -1 }).limit(100);
  res.json(alerts);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});