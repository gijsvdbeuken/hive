import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT } = process.env;

if (!PG_USER || !PG_HOST || !PG_DATABASE || !PG_PASSWORD) {
  console.error('Error: One or more PostgreSQL environment variables are missing');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
});

export const connectDB = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('PostgreSQL successfully connected at:', result.rows[0].now);
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
    process.exit(1);
  }
};

export default pool;
