# YouTube OAuth Setup Guide

This guide explains how to set up YouTube OAuth for transcript extraction in Cre8Hub.

## 🔧 Prerequisites

1. **Google Cloud Console Account**
2. **YouTube Data API v3 enabled**
3. **OAuth 2.0 credentials configured**

## 📋 Step-by-Step Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**

### 2. OAuth 2.0 Configuration

**Application Type:** Web application

**Authorized JavaScript origins:**
```
http://localhost:8080
https://yourdomain.com
```

**Authorized redirect URIs:**
```
http://localhost:8080/auth/youtube/callback
https://yourdomain.com/auth/youtube/callback
```

### 3. Environment Variables

Create a `.env` file in the Backend directory with:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/youtube/callback

# YouTube API Configuration
YOUTUBE_API_KEY=your-youtube-api-key

# Other existing variables...
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/UserData
REDIS_URL=redis://localhost:6379
FASTAPI_BASE_URL=http://localhost:8000
```

### 4. OAuth Scopes Required

The following scopes are requested:
- `https://www.googleapis.com/auth/youtube.readonly` - Read access to user's YouTube data
- `https://www.googleapis.com/auth/youtube.force-ssl` - Access to captions/transcripts

## 🚀 How It Works

### 1. User Flow

1. **User clicks "Connect YouTube Account"**
2. **Redirected to Google OAuth consent screen**
3. **User grants permissions**
4. **Redirected back to `/auth/youtube/callback`**
5. **Backend exchanges code for tokens**
6. **Tokens stored securely in database**
7. **User can now extract persona from their own videos**

### 2. API Endpoints

#### Get OAuth URL
```http
GET /api/oauth/youtube/auth-url
Authorization: Bearer <jwt-token>
```

#### OAuth Callback
```http
GET /api/oauth/youtube/callback?code=<auth-code>&state=<user-id>
```

#### Check Connection Status
```http
GET /api/oauth/youtube/status
Authorization: Bearer <jwt-token>
```

#### Disconnect YouTube
```http
POST /api/oauth/youtube/disconnect
Authorization: Bearer <jwt-token>
```

### 3. Persona Extraction

#### OAuth-based (User's own channel)
```http
POST /api/youtube/extract-persona
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userId": "user-id"
}
```

#### Public Channel (Any channel)
```http
POST /api/youtube/extract-persona-channel
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userId": "user-id",
  "channelId": "channel-id"
}
```

## 🔒 Security Features

### 1. Token Storage
- Access tokens encrypted in database
- Refresh tokens for automatic renewal
- Token expiration handling
- Secure token refresh flow

### 2. User Privacy
- Only user's own videos accessed
- No data shared with third parties
- User can disconnect anytime
- Clear permission scopes

### 3. Error Handling
- Graceful token expiration handling
- Automatic token refresh
- Clear error messages
- Fallback to public channel extraction

## 🧪 Testing

### 1. Test OAuth Flow
```bash
# Start backend
cd Backend
npm run dev

# Start frontend
cd Frontend
npm run dev

# Test OAuth connection
# 1. Go to http://localhost:3000/dashboard
# 2. Click "Connect YouTube Account"
# 3. Complete OAuth flow
# 4. Verify connection in database
```

### 2. Test Persona Extraction
```bash
# Test OAuth-based extraction
curl -X POST http://localhost:5001/api/youtube/extract-persona \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id"}'

# Test public channel extraction
curl -X POST http://localhost:5001/api/youtube/extract-persona-channel \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id", "channelId": "channel-id"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check GOOGLE_REDIRECT_URI matches Google Console
   - Ensure exact match including protocol

2. **"Access denied"**
   - User denied permissions
   - Check OAuth scopes are correct

3. **"Token expired"**
   - Implement token refresh
   - Check token expiration handling

4. **"No transcripts found"**
   - User's videos may not have captions
   - Check video privacy settings

### Debug Steps

1. Check environment variables
2. Verify Google Console configuration
3. Test OAuth flow step by step
4. Check database for stored tokens
5. Verify YouTube API access

## 📚 Additional Resources

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [YouTube Captions API](https://developers.google.com/youtube/v3/docs/captions)

## 🎯 Benefits of OAuth Method

1. **Real Transcripts**: Access to actual user video transcripts
2. **Better Accuracy**: Persona based on user's own content
3. **Privacy Compliant**: User controls what data is accessed
4. **No API Limits**: Uses user's own quota
5. **Automatic Updates**: Can re-extract as user creates new content

## 🔄 Migration from Mock Transcripts

The system now supports both methods:

1. **OAuth Method** (Recommended): Real transcripts from user's channel
2. **Public Channel Method**: Any public channel (fallback)
3. **Mock Method**: For testing/development (can be disabled)

Users can choose their preferred method, with OAuth providing the most accurate persona extraction.
