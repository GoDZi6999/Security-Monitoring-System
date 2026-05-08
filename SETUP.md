# 🚀 Setup & Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Git

### Step 1: Clone/Setup Project
```bash
# Navigate to the project directory
cd security-monitoring-saas

# Verify structure
ls -la
# You should see: server/, client/, README.md, docker-compose.yml
```

### Step 2: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Verify it looks good
cat .env
```

**Start the backend:**
```bash
npm start
# Output: 🔒 Security Monitoring Server running on port 5000
```

Test the backend:
```bash
# In another terminal
curl http://localhost:5000/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Step 3: Setup Frontend

**In a new terminal:**
```bash
cd client

# Install dependencies
npm install

# Start the development server
npm start
# Browser will open to http://localhost:3000
```

### Step 4: Login & Test

1. Open http://localhost:3000
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You should see the dashboard with real-time data

### Step 5: Generate Test Traffic

**Open a new terminal and run:**
```bash
# Generate rapid requests (will trigger rate limit)
for i in {1..100}; do curl http://localhost:5000/api/health; done

# You should see:
# - "Too many requests" error after 60 requests
# - RATE_LIMIT_EXCEEDED event in dashboard
```

---

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Single Command Deployment

```bash
# From project root
docker-compose up --build

# Wait for containers to start (~30 seconds)
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Manual Docker Deployment

**Backend:**
```bash
cd server

docker build -t security-monitor-backend .

docker run -p 5000:5000 security-monitor-backend
```

**Frontend:**
```bash
cd client

docker build -t security-monitor-frontend .

docker run -p 3000:3000 security-monitor-frontend
```

### Docker Network (for communication)

```bash
# Create network
docker network create security-monitor

# Run backend on network
docker run --network security-monitor \
  --name backend \
  -p 5000:5000 \
  security-monitor-backend

# Run frontend on network
docker run --network security-monitor \
  --name frontend \
  -p 3000:3000 \
  -e REACT_APP_API_URL=http://backend:5000/api \
  security-monitor-frontend
```

---

## Cloud Deployment

### Option 1: Deploy to Heroku

**Backend:**
```bash
cd server

# Login to Heroku
heroku login

# Create app
heroku create security-monitor-api

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Frontend (.env):**
```
REACT_APP_API_URL=https://security-monitor-api.herokuapp.com/api
```

### Option 2: Deploy to Vercel (Frontend)

```bash
cd client

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# REACT_APP_API_URL=<your-backend-url>
```

### Option 3: Deploy to AWS

#### Using Elastic Beanstalk (Backend)
```bash
cd server

# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 security-monitor-api

# Create environment
eb create

# Deploy
eb deploy
```

#### Using S3 + CloudFront (Frontend)
```bash
cd client

# Build
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-bucket-name

# Configure CloudFront distribution
```

### Option 4: Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# For backend
cd server
railway up

# For frontend
cd client
railway up
```

---

## Troubleshooting

### Backend Issues

#### Port 5000 Already in Use
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 npm start
```

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Connection Refused
- Ensure backend is running: `npm start` in `server/` folder
- Check if localhost:5000 is accessible
- Verify CORS is enabled in server.js

### Frontend Issues

#### Blank White Screen
1. Check browser console for errors (F12)
2. Ensure backend is running
3. Clear browser cache: Ctrl+Shift+Delete
4. Try: `rm -rf node_modules && npm install`

#### API Connection Errors
```javascript
// In SecurityDashboard.jsx, check:
const API_BASE = 'http://localhost:5000/api'; // Should match backend URL

// For production:
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

#### CORS Errors
- Backend has CORS enabled by default
- If still issues, add to server.js:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### Docker Issues

#### Image Build Fails
```bash
# Clean Docker
docker system prune -a

# Rebuild
docker-compose up --build
```

#### Container Won't Start
```bash
# View logs
docker logs <container_id>

# Check ports
docker ps -a

# Restart
docker-compose restart
```

#### Network Communication
```bash
# Verify network
docker network ls

# Inspect network
docker network inspect <network_name>

# Test connectivity
docker exec <container> ping <other-container>
```

### Database/Data Issues

#### Data Lost on Restart
This is expected with in-memory storage. To fix:

1. **Add MongoDB:**
```bash
# Update docker-compose.yml to include MongoDB
# Modify server.js to use MongoDB instead of in-memory

npm install mongoose
```

2. **Add SQLite** (simpler):
```bash
npm install sqlite3
# Modify server.js to use SQLite
```

#### Events Not Appearing
- Check Network tab in browser DevTools
- Verify API endpoints are responding: `curl http://localhost:5000/api/health`
- Check backend console for errors

---

## Production Checklist

- [ ] Change demo credentials (hardcoded in server.js)
- [ ] Add real authentication (JWT, OAuth, etc.)
- [ ] Setup database (MongoDB, PostgreSQL, etc.)
- [ ] Enable HTTPS/SSL
- [ ] Setup environment variables properly
- [ ] Add logging service (Winston, Datadog, etc.)
- [ ] Setup monitoring (New Relic, Datadog, etc.)
- [ ] Add API rate limiting middleware
- [ ] Setup automated backups
- [ ] Add error tracking (Sentry, etc.)
- [ ] Setup CI/CD pipeline
- [ ] Add security headers
- [ ] Test with production data
- [ ] Setup alerting/notifications
- [ ] Document deployment process
- [ ] Create runbook for incidents

---

## Monitoring & Logging

### Using PM2 (Production Process Manager)

```bash
npm install -g pm2

# Start with PM2
pm2 start server.js --name "security-monitor"

# View logs
pm2 logs security-monitor

# Restart
pm2 restart security-monitor

# Stop
pm2 stop security-monitor
```

### Using Docker Logs

```bash
# Follow logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Last 100 lines
docker logs --tail 100 <container_id>
```

---

## Performance Tips

### Backend
- Add caching layer (Redis)
- Use connection pooling for database
- Implement request queuing
- Add gzip compression
- Monitor memory usage

### Frontend
- Lazy load components
- Implement virtual scrolling for long lists
- Cache API responses
- Use web workers for heavy processing
- Optimize images

### General
- Use CDN for static assets
- Implement pagination for large datasets
- Setup load balancing
- Use database indexing
- Monitor response times

---

## Need Help?

1. Check logs: `docker-compose logs -f`
2. Verify endpoints: `curl http://localhost:5000/api/health`
3. Check browser console (F12)
4. Verify all dependencies are installed
5. Ensure ports aren't already in use
6. Try restarting containers/servers

---

**Happy Monitoring! 🔒**
