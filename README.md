# Cre8Hub - Full Stack Application

A complete content creation platform with a React frontend and Node.js backend API.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cre8hub
   JWT_SECRET=your_jwt_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   The backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be running on `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/users/signup` - Register a new user
- `POST /api/users/signin` - Sign in user
- `POST /api/users/refresh-token` - Refresh access token
- `POST /api/users/logout` - Sign out user

### User Profile
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/profile/role-specific` - Update role-specific profile
- `DELETE /api/users/account` - Delete user account

### Persona & Outputs
- `PUT /api/users/persona` - Update user persona
- `POST /api/users/past-outputs` - Add past output

### Health Check
- `GET /api/health` - API health status

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with refresh tokens
- **Security:** Helmet, CORS, rate limiting
- **Validation:** Express-validator
- **File Structure:**
  ```
  Backend/
  ├── src/
  │   ├── config/          # Database configuration
  │   ├── controllers/     # Route controllers
  │   ├── middleware/      # Custom middleware
  │   ├── models/          # Mongoose models
  │   ├── routes/          # API routes
  │   ├── services/        # Business logic
  │   ├── utils/           # Utility functions
  │   └── server.js        # Main server file
  ```

### Frontend (React + TypeScript + Vite)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Shadcn/ui components
- **Styling:** Tailwind CSS
- **State Management:** React Context + Custom hooks
- **Routing:** React Router DOM
- **File Structure:**
  ```
  Frontend/
  ├── src/
  │   ├── components/      # React components
  │   ├── hooks/           # Custom hooks
  │   ├── lib/             # Utility libraries
  │   ├── pages/           # Page components
  │   └── App.tsx          # Main app component
  ```

## 🔐 Authentication Flow

1. **Sign Up:** User creates account with email, password, and name
2. **Sign In:** User authenticates and receives access + refresh tokens
3. **Token Management:** Access tokens are automatically refreshed
4. **Protected Routes:** API endpoints require valid JWT tokens

## 📱 Features

### User Management
- User registration and authentication
- Role-based profiles (Content Creator, Entrepreneur, Social Media Manager)
- Profile customization and management

### Content Creation
- Personalized content generation based on user role
- Past output tracking and management
- Persona-based content customization

### Security
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting and CORS protection
- Input validation and sanitization

## 🛠️ Development

### Backend Development
```bash
cd Backend
npm run dev          # Start development server with nodemon
npm run test         # Run tests
npm run seed         # Seed database with sample data
```

### Frontend Development
```bash
cd Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, Vercel, etc.)
3. Ensure MongoDB connection string is configured

### Frontend Deployment
1. Update `VITE_API_URL` to point to your production backend
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your preferred platform

## 🔍 API Testing

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands

Example curl command for health check:
```bash
curl http://localhost:5000/api/health
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cre8hub
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
