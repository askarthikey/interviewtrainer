const express = require("express");
const { MongoClient, MongoError } = require("mongodb");
const dotenv = require("dotenv").config();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { createAuthFunctions, generateToken } = require('./auth');
const { initPassport } = require('./oauth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
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

MongoClient.connect(process.env.DB_URL || 'mongodb://localhost:27017/interviewtrainer')
  .then(client => {
    db = client.db("interviewtrainer");
    authFunctions = createAuthFunctions(db);
    initPassport(db);
    console.log("DB connection successful!!");
  })
  .catch(err => console.log("Error in connection of database", err.message));

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

app.use((err, req, res, next) => {
  res.send({ message: "Error", payload: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));