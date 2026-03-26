const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('\n=== MongoDB Setup Required ===');
    console.log('1. Get a free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas');
    console.log('2. Create a cluster and get your connection string');
    console.log('3. Update MONGODB_URI in server/.env file');
    console.log('4. Restart the server\n');
    process.exit(1);
  }
};

module.exports = connectDB;
