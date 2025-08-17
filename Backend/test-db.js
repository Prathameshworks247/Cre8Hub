const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cre8hub';
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 URI:', mongoURI);
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solution: Make sure MongoDB is running locally or use a cloud MongoDB instance.');
      console.log('   For local MongoDB: brew install mongodb-community && brew services start mongodb-community');
      console.log('   For cloud MongoDB: Update MONGODB_URI in your .env file');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Solution: Check your MongoDB credentials in the connection string.');
    }
    
    process.exit(1);
  }
};

testConnection();
