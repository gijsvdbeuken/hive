import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(
  '/api/chat',
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/chat': '/chat' },
  }),
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`api gateway is running on http://localhost:${PORT}`);
});

setInterval(() => {}, 60000);
