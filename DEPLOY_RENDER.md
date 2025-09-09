# Deploying Interview Trainer Backend to Render with Docker

This guide explains how to deploy the Interview Trainer backend to Render using Docker to support all programming languages (Python, Java, C++, JavaScript, TypeScript).

## Why Docker?

Render's default Node.js environment doesn't include compilers like `g++` and `javac`. Using Docker allows us to install all necessary build tools and compilers.

## Prerequisites

- GitHub repository with your code
- Render account (free tier works)
- Dockerfile in your server directory (already created)

## Files Needed

### 1. Dockerfile (already created in `/server/Dockerfile`)
```dockerfile
# Use Node.js official image
FROM node:18-bullseye

# Install system dependencies for code execution
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    python3 \
    python3-pip \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy application code
COPY . .

# Create temp directory for code execution
RUN mkdir -p temp

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
```

### 2. .dockerignore (recommended)
Create in `/server/.dockerignore`:
```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
```

## Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub** with all changes
2. **Verify these files exist in your `/server` directory:**
   - `Dockerfile`
   - `package.json` with start script
   - `server.js`
   - All your routes and dependencies

### Step 2: Create New Service on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   - **Name**: `interviewtrainer-backend` (or your preferred name)
   - **Runtime**: Select **"Docker"** (Important!)
   - **Region**: Choose closest to your users
   - **Branch**: `main` or your deployment branch
   - **Root Directory**: `server` (important - point to server folder)
   - **Docker Command**: Leave empty (uses Dockerfile CMD)

### Step 3: Environment Variables

Add these environment variables in Render:

```bash
# Database
DB_URL=mongodb+srv://your-mongodb-connection-string

# JWT & Session
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Client URL (your frontend)
CLIENT_URL=https://interviewtrainer-one.vercel.app

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth (GitHub)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Braintree
BRAINTREE_MERCHANT_ID=your-braintree-merchant-id
BRAINTREE_PUBLIC_KEY=your-braintree-public-key
BRAINTREE_PRIVATE_KEY=your-braintree-private-key

# Node Environment
NODE_ENV=production
```

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for build to complete** (first build takes 5-10 minutes due to installing compilers)
3. **Check logs for any errors**

## Build Process

When you deploy, Render will:

1. **Pull your code from GitHub**
2. **Build Docker image:**
   - Install Node.js 18
   - Install system packages (g++, python3, java)
   - Install npm dependencies
   - Copy your application code
3. **Start the container** with `node server.js`
4. **Provide you with a URL** like `https://your-service-name.onrender.com`

## Testing Deployment

### 1. Health Check
```bash
curl https://your-service-name.onrender.com/api/health
```

### 2. Test Code Execution
```bash
# Test Python
curl -X POST https://your-service-name.onrender.com/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello World\")", "language": "python"}'

# Test C++
curl -X POST https://your-service-name.onrender.com/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "#include<iostream>\nusing namespace std;\nint main(){cout<<\"Hello World\";return 0;}", "language": "cpp"}'
```

## Updating Your Frontend

Update your frontend environment variable to point to your new Render URL:

**In `/client/.env`:**
```env
VITE_API_URL=https://interviewtrainerv2.onrender.com
```

## Troubleshooting

### Build Fails
- Check that `Dockerfile` is in `/server` directory
- Verify "Root Directory" is set to `server` in Render
- Check build logs for specific errors

### Code Execution Fails
- Check that Docker runtime was selected (not Node.js)
- Verify all compilers installed by checking logs
- Test individual language endpoints

### Environment Variables
- Ensure all required env vars are set in Render dashboard
- Check that `CLIENT_URL` points to your frontend
- Verify database connection string is correct

## Expected Build Time

- **First deployment**: 8-12 minutes (installing all compilers)
- **Subsequent deployments**: 2-5 minutes (Docker layer caching)

## Supported Languages After Deployment

✅ **Python 3** - Built-in  
✅ **JavaScript** - Node.js built-in  
✅ **Java** - OpenJDK installed via Dockerfile  
✅ **C++** - g++ compiler installed via Dockerfile  
✅ **TypeScript** - If ts-node is in dependencies  

## Free Tier Limitations

- Service sleeps after 15 minutes of inactivity
- 750 hours/month free (sufficient for most projects)
- Cold start time: ~30 seconds when waking up

## Alternative: Render.yaml Approach

If you prefer not to use Docker, you can also use `render.yaml`:

```yaml
services:
  - type: web
    name: interviewtrainer-backend
    env: node
    plan: free
    buildCommand: |
      apt-get update
      apt-get install -y build-essential g++ python3 default-jdk
      npm install
    startCommand: node server.js
```

However, Docker is more reliable and gives you better control over the environment.

---

## Summary

Using Docker ensures all programming languages work in your deployed application, providing a consistent interview coding experience for your users. The initial setup takes a bit longer, but results in a robust, fully-functional deployment.
