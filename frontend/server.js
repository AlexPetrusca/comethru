// LOCAL-ONLY express server
//  - serves ui
//  - proxies to backend

require('dotenv').config(); // Load environment variables

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.BACKEND_PORT || '8080';

app.use(morgan('dev')); // Middleware for logging requests

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy /api
app.use(createProxyMiddleware({
  pathFilter: '/api',
  target: `http://${BACKEND_HOST}:${BACKEND_PORT}`, // The destination server
  changeOrigin: true, // Needed for virtual hosted sites
  secure: false,
  logger: console,
  logLevel: 'error',
}));

// Proxy /auth
app.use(createProxyMiddleware({
  pathFilter: '/auth',
  target: `http://${BACKEND_HOST}:${BACKEND_PORT}`, // The destination server
  changeOrigin: true, // Needed for virtual hosted sites
  secure: false,
  logger: console,
  logLevel: 'error',
}));

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Proxy alternative via nginx:
// todo: use this in prod
// server {
//     listen 80;
//     server_name yourdomain.com;
//
//     location /auth/ {
//         # This forwards the request to your Spring Boot backend
//         proxy_pass http://localhost:8080;
//
//         # Standard proxy headers to preserve client info
//         proxy_set_header Host $host;
//         proxy_set_header X-Real-IP $remote_addr;
//         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//         proxy_set_header X-Forwarded-Proto $scheme;
//
//         # Handle Cookie domain/path issues if necessary
//         proxy_cookie_domain localhost yourdomain.com;
//     }
//
//     # You can serve your frontend or other local services here
//     location / {
//         proxy_pass http://localhost:3000;
//     }
// }