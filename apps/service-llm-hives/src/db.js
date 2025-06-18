import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Error: MongoDB URI not found in environment variables');
  process.exit(1);
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
    });
    isConnected = true;
    console.log('MongoDB connected:', conn.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
