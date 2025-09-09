// ===== Imports =====
const express = require("express");
const { MongoClient, MongoError, ObjectId } = require("mongodb");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { createAuthFunctions, generateToken, verifyToken } = require("./auth");
const { initPassport } = require("./oauth");
const { upload, transcribeAudio, transcribeStream } = require("./whisper");

require("dotenv").config();

const app = express();

// ===== Middleware =====
app.use(cors({}));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true in production
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ===== DB Setup =====
let db;
let authFunctions;

MongoClient.connect(process.env.DB_URL)
  .then((client) => {
    db = client.db("interviewtrainer");
    authFunctions = createAuthFunctions(db);
    initPassport(db);
    console.log("DB connection successful!! ✅");
  })
  .catch((err) =>
    console.log("Error in connection of database", err.message)
  );

// ====== AUTH Middleware ======
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ====== Routes ======

// Payments
const paymentRoutes = require("./Models/Payments");
app.use(paymentRoutes);

// Auth
app.post("/api/auth/signup", (req, res) => authFunctions.signUp(req, res));
app.post("/api/auth/signin", (req, res) => authFunctions.signIn(req, res));
app.get("/api/auth/validate", (req, res) => authFunctions.validateToken(req, res));

// OAuth (Google / GitHub)
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/api/auth/callback/google",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  }
);
app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/api/auth/callback/github",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  }
);

// Interview Response Storage
app.post("/api/interview/response", authenticateToken, async (req, res) => {
  try {
    const {
      question,
      questionId,
      response,
      wordCount,
      timeSpent,
      confidence,
      category,
      difficulty,
    } = req.body;

    if (!question || !response || !wordCount || timeSpent === undefined || !confidence) {
      return res.status(400).json({
        message:
          "Missing required fields: question, response, wordCount, timeSpent, confidence",
      });
    }

    const interviewResponse = {
      userId: req.user._id,
      userEmail: req.user.email,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      question: {
        id: questionId || null,
        text: question,
        category: category || "General",
        difficulty: difficulty || "Medium",
      },
      response: {
        text: response,
        wordCount: parseInt(wordCount),
        timeSpent: parseInt(timeSpent),
        confidence: parseFloat(confidence),
        timestamp: new Date(),
      },
      metadata: {
        createdAt: new Date(),
        sessionId: req.headers["x-session-id"] || null,
        userAgent: req.headers["user-agent"] || null,
      },
    };

    const result = await db
      .collection("interview_responses")
      .insertOne(interviewResponse);

    res.status(201).json({
      success: true,
      message: "Interview response saved successfully",
      responseId: result.insertedId,
      data: {
        id: result.insertedId,
        timestamp: interviewResponse.response.timestamp,
        wordCount: interviewResponse.response.wordCount,
        timeSpent: interviewResponse.response.timeSpent,
      },
    });
  } catch (error) {
    console.error("Error saving interview response:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save interview response",
      error: error.message,
    });
  }
});

// Get Interview Responses
app.get("/api/interview/responses", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, difficulty } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { userId: req.user._id };
    if (category && category !== "all") filter["question.category"] = category;
    if (difficulty && difficulty !== "all") filter["question.difficulty"] = difficulty;

    const responses = await db
      .collection("interview_responses")
      .find(filter)
      .sort({ "metadata.createdAt": -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const totalCount = await db.collection("interview_responses").countDocuments(filter);

    const stats = await db
      .collection("interview_responses")
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalResponses: { $sum: 1 },
            averageWordCount: { $avg: "$response.wordCount" },
            averageTimeSpent: { $avg: "$response.timeSpent" },
            averageConfidence: { $avg: "$response.confidence" },
            totalTimeSpent: { $sum: "$response.timeSpent" },
          },
        },
      ])
      .toArray();

    res.json({
      success: true,
      data: {
        responses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + responses.length < totalCount,
          hasPrev: parseInt(page) > 1,
        },
        statistics: stats[0] || {
          totalResponses: 0,
          averageWordCount: 0,
          averageTimeSpent: 0,
          averageConfidence: 0,
          totalTimeSpent: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching interview responses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview responses",
      error: error.message,
    });
  }
});

// ===== Whisper transcription =====
app.post("/api/transcribe", upload.single("audio"), transcribeAudio);
app.post("/api/transcribe/stream", upload.single("audio"), transcribeStream);

// ====== 🎥 Your Recording APIs ======

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/recordings";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadRecording = multer({ storage });

// Save Recording
app.post("/api/recordings", uploadRecording.single("file"), async (req, res) => {
  try {
    const recording = {
      filename: req.file.filename,
      path: `/uploads/recordings/${req.file.filename}`,
      role: req.body.role || "unknown",             // save role
      difficulty: req.body.difficulty || "unknown", // save difficulty
      createdAt: new Date(),
    };
    await db.collection("recordings").insertOne(recording);
    res.json({ success: true, recording });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving recording" });
  }
});


// Fetch Recordings (only if file exists)
app.get("/api/recordings", async (req, res) => {
  try {
    const recs = await db
      .collection("recordings")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // Filter out recordings whose files are missing
    const existingRecs = recs.filter((rec) => {
      const filePath = path.join(__dirname, rec.path);
      return fs.existsSync(filePath);
    });

    res.json(existingRecs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching recordings" });
  }
});


// Serve recordings
app.use("/uploads/recordings", express.static("uploads/recordings"));

// ===== Error handler =====
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error", payload: err.message });
});

// ===== Start server =====
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
