import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB using the URI specified in env variables.
 * Emits robust logs to help trace database lifecycle in the legal terminal.
 */
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI environment variable is missing.");
    process.exit(1);
  }

  const maskedUri = process.env.MONGO_URI.substring(0, 30) + '...';
  console.log(`[DATABASE] MONGO_URI prefix: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[DATABASE_ERROR] Connection failure: ${error.message}`);
    process.exit(1); // Terminal halts if core db fails
  }
};

export default connectDB;
