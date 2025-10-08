# Cre8Hub Backend Deployment Guide

## Environment Variables Required

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cre8hub?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRES_IN=7d

# YouTube API Configuration
# For Production: Complete OAuth verification process first
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
YOUTUBE_REDIRECT_URI=https://your-backend-domain.com/oauth/youtube/callback

# YouTube API Scopes (must be verified for production)
# https://www.googleapis.com/auth/youtube.readonly
# https://www.googleapis.com/auth/youtube.force-ssl

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## Free Hosting Options

### 1. Railway (Recommended)
- **Free tier**: $5 credit monthly (usually enough for small apps)
- **Pros**: Easy MongoDB integration, automatic deployments
- **Deploy**: Connect GitHub repo, auto-deploys on push

### 2. Render
- **Free tier**: 750 hours/month, sleeps after 15min inactivity
- **Pros**: Good free tier, easy setup
- **Deploy**: Connect GitHub, set build command: `npm install`

### 3. Heroku (Limited Free Tier)
- **Free tier**: No longer available (paid only)
- **Alternative**: Use Railway or Render instead

### 4. Cyclic
- **Free tier**: Generous limits, serverless
- **Pros**: Good for Node.js apps, auto-scaling
- **Deploy**: Connect GitHub repo

## Deployment Steps (Railway)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Cre8Hub repository
5. Set root directory to `Backend`
6. Add environment variables in Railway dashboard
7. Deploy!

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster (M0 Sandbox)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and add to MONGODB_URI

## YouTube API Production Setup

### Current Status: Test Mode
- Only test users can authenticate
- Limited to 100 users
- Public users cannot link YouTube accounts

### Production Verification Process (4-6 weeks)

1. **OAuth Consent Screen**:
   - Go to Google Cloud Console > OAuth consent screen
   - Change from "Testing" to "Production"
   - Complete all required fields

2. **Required Scopes Justification**:
   ```
   youtube.readonly: "Analyze user's YouTube content for persona extraction and content generation"
   youtube.force-ssl: "Secure communication with YouTube API endpoints"
   ```

3. **Submission Requirements**:
   - App demo video (2-3 minutes)
   - Screenshots of OAuth flow
   - Privacy policy and terms of service
   - Detailed scope justifications

4. **Alternative: Manual Channel Integration**:
   - Users enter channel ID manually
   - Use public YouTube API endpoints
   - No OAuth verification needed
   - Faster to implement

### Environment Variables for Production
```env
# YouTube API (after verification)
YOUTUBE_CLIENT_ID=your-verified-client-id
YOUTUBE_CLIENT_SECRET=your-verified-client-secret
YOUTUBE_REDIRECT_URI=https://your-backend-domain.com/oauth/youtube/callback

# Or for manual integration (no verification needed)
YOUTUBE_API_KEY=your-youtube-api-key
```

## Health Check

Your API will be available at:
- Health: `GET https://your-domain.com/api/health`
- Sign Up: `POST https://your-domain.com/api/users/signup`
- Sign In: `POST https://your-domain.com/api/users/signin`
- YouTube OAuth: `GET https://your-domain.com/oauth/youtube/auth-url`
