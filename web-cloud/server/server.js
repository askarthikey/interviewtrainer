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
const codeExecutorRoutes = require("./routes/codeExecutor");

require("dotenv").config();

const app = express();

// Trust proxy for HTTPS detection in production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ===== Middleware =====
app.use(cors({}));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // use secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Payments
const paymentRoutes = require("./Models/Payments");
app.use(paymentRoutes);

// Code Executor
app.use("/api", codeExecutorRoutes);

// Auth
app.post("/api/auth/signup", (req, res) => authFunctions.signUp(req, res));
app.post("/api/auth/signin", (req, res) => authFunctions.signIn(req, res));
app.get("/api/auth/validate", (req, res) => authFunctions.validateToken(req, res));

// OAuth (Google / GitHub)
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/api/auth/callback/google",
  passport.authenticate("google", { 
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/callback?error=google_auth_failed`
  }),
  (req, res) => {
    try {
      if (!req.user) {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        return res.redirect(`${clientUrl}/auth/callback?error=no_user_data`);
      }
      
      const token = generateToken(req.user._id);
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      res.redirect(`${clientUrl}/auth/callback?error=server_error`);
    }
  }
);

app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/api/auth/callback/github",
  passport.authenticate("github", { 
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/callback?error=github_auth_failed`
  }),
  (req, res) => {
    try {
      if (!req.user) {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        return res.redirect(`${clientUrl}/auth/callback?error=no_user_data`);
      }
      
      const token = generateToken(req.user._id);
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      res.redirect(`${clientUrl}/auth/callback?error=server_error`);
    }
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

// About Us API endpoints
app.get('/api/about/team', async (req, res) => {
  try {
    const teamMembers = [
      {
        name: "Alex Chen",
        role: "Co-Founder & CEO",
        image: "AC",
        description: "Former Google engineer with 8+ years in AI/ML. Led teams at top tech companies.",
        linkedin: "#",
        twitter: "#"
      },
      {
        name: "Sarah Johnson",
        role: "Co-Founder & CTO",
        image: "SJ",
        description: "AI researcher and Stanford PhD. Expert in natural language processing.",
        linkedin: "#",
        twitter: "#"
      },
      {
        name: "Michael Park",
        role: "Head of Product",
        image: "MP",
        description: "Product leader from Meta with deep experience in user-centric design.",
        linkedin: "#",
        twitter: "#"
      },
      {
        name: "Emily Davis",
        role: "Lead Engineer",
        image: "ED",
        description: "Full-stack engineer passionate about creating seamless user experiences.",
        linkedin: "#",
        twitter: "#"
      },
      {
        name: "David Wilson",
        role: "Data Scientist",
        image: "DW",
        description: "ML engineer specializing in speech recognition and behavioral analysis.",
        linkedin: "#",
        twitter: "#"
      },
      {
        name: "Jessica Lee",
        role: "UX Designer",
        image: "JL",
        description: "Creative designer focused on crafting intuitive and engaging user interfaces.",
        linkedin: "#",
        twitter: "#"
      },
      {
        name: "Robert Kim",
        role: "Backend Engineer",
        image: "RK",
        description: "Systems architect with expertise in scalable infrastructure and APIs.",
        linkedin: "#",
        twitter: "#"
      }
    ];

    res.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team data',
      error: error.message
    });
  }
});

app.get('/api/about/company', async (req, res) => {
  try {
    const companyData = {
      story: {
        title: "Our Story",
        paragraphs: [
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, My five centuries but also the leap into electronic typesetting.",
          "It has survived not only five centuries but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          "Our platform combines advanced AI with proven interview techniques to provide personalized feedback and practice opportunities that actually work."
        ]
      },
      stats: {
        successStories: "15K+",
        successRate: "98%",
        userRating: "4.9★"
      }
    };

    res.json({
      success: true,
      data: companyData
    });
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company data',
      error: error.message
    });
  }
});

app.get('/api/about/vision-mission', async (req, res) => {
  try {
    const visionMissionData = {
      vision: {
        title: "Our Vision",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. My five centuries but also the leap into electronic typesetting, remaining essentially unchanged."
      },
      mission: {
        title: "Our Mission",
        description: "It has survived not only five centuries but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software."
      }
    };

    res.json({
      success: true,
      data: visionMissionData
    });
  } catch (error) {
    console.error('Error fetching vision-mission data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vision-mission data',
      error: error.message
    });
  }
});

app.get('/api/about/contact', async (req, res) => {
  try {
    const contactData = {
      title: "Work with us",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. My five centuries but also the leap into electronic typesetting.",
      email: "contact@interviewtrainer.ai",
      ctaText: "Email to Us"
    };

    res.json({
      success: true,
      data: contactData
    });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact data',
      error: error.message
    });
  }
});

// Contact Us API endpoints
app.get('/api/contact/use-cases', async (req, res) => {
  try {
    const useCases = [
      {
        title: "Interview Preparation",
        description: "Practice with AI-powered mock interviews tailored to your industry and role.",
        icon: "💼"
      },
      {
        title: "Technical Skills Assessment",
        description: "Evaluate and improve your technical knowledge with interactive coding challenges.",
        icon: "⚡"
      },
      {
        title: "Behavioral Question Training",
        description: "Master the art of storytelling with STAR method coaching and feedback.",
        icon: "🎯"
      },
      {
        title: "Resume Optimization",
        description: "Get AI-powered suggestions to make your resume stand out to recruiters.",
        icon: "📄"
      }
    ];

    res.json({
      success: true,
      data: useCases
    });
  } catch (error) {
    console.error('Error fetching use cases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch use cases',
      error: error.message
    });
  }
});

// Contact form submission endpoint
app.post('/api/contact/submit', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, email, message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Create contact submission document
    const contactSubmission = {
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || null,
      message,
      timestamp: new Date(),
      status: 'new',
      metadata: {
        userAgent: req.headers['user-agent'] || null,
        ip: req.ip || req.connection.remoteAddress || null
      }
    };

    // Store in database
    const result = await db.collection('contact_submissions').insertOne(contactSubmission);

    if (result.acknowledged) {
      res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully',
        submissionId: result.insertedId,
        data: {
          id: result.insertedId,
          timestamp: contactSubmission.timestamp,
          status: contactSubmission.status
        }
      });
    } else {
      throw new Error('Failed to save contact submission');
    }

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
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
