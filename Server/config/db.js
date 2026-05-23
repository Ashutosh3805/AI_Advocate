import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB using the URI specified in env variables.
 * Emits robust logs to help trace database lifecycle in the legal terminal.
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_advocate';
    const conn = await mongoose.connect(connStr);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[DATABASE_ERROR] Connection failure: ${error.message}`);
    process.exit(1); // Terminal halts if core db fails
  }
};

export default connectDB;
