require('dotenv').config();

const express = require('express');
const app = express();
const baseUrl = process.env.SERVICE_LLM_MERGING || null;
const port = new URL(baseUrl).port || 3005;

if (!baseUrl) {
  console.error('Error: The server port was not found in the environment variables. Please define the PORT variable in your .env file.');
  process.exit(1);
}

app.use(express.json());

const userRoutes = require('./routes/llmMerging');

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`User Service running at ${baseUrl}`);
});
