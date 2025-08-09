// db.js
import { connect } from 'mongoose';
import { DB_NAME }  from '../constants.js';

const connectDB = async () => {
  try {
    const connectionInstance = await connect(`${process.env.MONGO_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`\n ✅ MongoDB connected successfully: ${connectionInstance.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit on error
  }
};

export default connectDB;
