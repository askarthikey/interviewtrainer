const express = require('express');
const { MongoClient, MongoError } = require('mongodb');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { createAuthFunctions, generateToken, verifyToken } = require('./auth');
const { initPassport } = require('./oauth');
const { upload, transcribeAudio, transcribeStream } = require('./whisper');
const { ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors({}));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

let db;
let authFunctions;

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find user
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


MongoClient.connect(process.env.DB_URL)
  .then(client => {
    db = client.db("interviewtrainer");
    authFunctions = createAuthFunctions(db);
    initPassport(db);
    console.log("DB connection successful!!");

    const paymentRoutes = require('./Models/Payments');
    app.use(paymentRoutes);

    // Auth routes
    app.post('/api/auth/signup', (req, res) => authFunctions.signUp(req, res));
    app.post('/api/auth/signin', (req, res) => authFunctions.signIn(req, res));
    app.get('/api/auth/validate', (req, res) => authFunctions.validateToken(req, res));

    // OAuth routes
    app.get('/api/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/api/auth/callback/google',
      passport.authenticate('google', { failureRedirect: '/signin' }),
      (req, res) => {
        // Generate JWT token for the authenticated user
        const token = generateToken(req.user._id);
        // Redirect to frontend with token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/auth/callback?token=${token}`);
      }
    );

    app.get('/api/auth/github',
      passport.authenticate('github', { scope: ['user:email'] })
    );

    app.get('/api/auth/callback/github',
      passport.authenticate('github', { failureRedirect: '/signin' }),
      (req, res) => {
        // Generate JWT token for the authenticated user
        const token = generateToken(req.user._id);
        // Redirect to frontend with token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/auth/callback?token=${token}`);
      }
    );
  })
  .catch(err => console.log("Error in connection of database", err.message));

// Interview Response Storage Endpoint
app.post('/api/interview/response', authenticateToken, async (req, res) => {
  try {
    const { 
      question, 
      questionId, 
      response, 
      wordCount, 
      timeSpent, 
      confidence, 
      category,
      difficulty 
    } = req.body;

    // Validate input
    if (!question || !response || !wordCount || timeSpent === undefined || !confidence) {
      return res.status(400).json({ 
        message: 'Missing required fields: question, response, wordCount, timeSpent, confidence' 
      });
    }

    // Create the interview response document
    const interviewResponse = {
      userId: req.user._id,
      userEmail: req.user.email,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      question: {
        id: questionId || null,
        text: question,
        category: category || 'General',
        difficulty: difficulty || 'Medium'
      },
      response: {
        text: response,
        wordCount: parseInt(wordCount),
        timeSpent: parseInt(timeSpent), // in seconds
        confidence: parseFloat(confidence),
        timestamp: new Date()
      },
      metadata: {
        createdAt: new Date(),
        sessionId: req.headers['x-session-id'] || null,
        userAgent: req.headers['user-agent'] || null
      }
    };

    // Store in database
    const result = await db.collection('interview_responses').insertOne(interviewResponse);

    if (result.acknowledged) {
      res.status(201).json({
        success: true,
        message: 'Interview response saved successfully',
        responseId: result.insertedId,
        data: {
          id: result.insertedId,
          timestamp: interviewResponse.response.timestamp,
          wordCount: interviewResponse.response.wordCount,
          timeSpent: interviewResponse.response.timeSpent
        }
      });
    } else {
      throw new Error('Failed to save interview response');
    }

  } catch (error) {
    console.error('Error saving interview response:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save interview response',
      error: error.message 
    });
  }
});

// Get user's interview responses
app.get('/api/interview/responses', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, difficulty } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query filter
    const filter = { userId: req.user._id };
    if (category && category !== 'all') {
      filter['question.category'] = category;
    }
    if (difficulty && difficulty !== 'all') {
      filter['question.difficulty'] = difficulty;
    }

    // Get responses with pagination
    const responses = await db.collection('interview_responses')
      .find(filter)
      .sort({ 'metadata.createdAt': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('interview_responses').countDocuments(filter);

    // Calculate statistics
    const stats = await db.collection('interview_responses').aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalResponses: { $sum: 1 },
          averageWordCount: { $avg: '$response.wordCount' },
          averageTimeSpent: { $avg: '$response.timeSpent' },
          averageConfidence: { $avg: '$response.confidence' },
          totalTimeSpent: { $sum: '$response.timeSpent' }
        }
      }
    ]).toArray();

    res.json({
      success: true,
      data: {
        responses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + responses.length < totalCount,
          hasPrev: parseInt(page) > 1
        },
        statistics: stats[0] || {
          totalResponses: 0,
          averageWordCount: 0,
          averageTimeSpent: 0,
          averageConfidence: 0,
          totalTimeSpent: 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching interview responses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch interview responses',
      error: error.message 
    });
  }
});

// Whisper transcription routes
app.post('/api/transcribe', upload.single('audio'), transcribeAudio);
app.post('/api/transcribe/stream', upload.single('audio'), transcribeStream);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error", payload: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
