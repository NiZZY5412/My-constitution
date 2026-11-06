/**
 * Kenya Legal Oracle AI - Local Node.js Preview & API Server
 * Uses native Node.js HTTP/FS modules without external dependencies.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Forward API traffic to the FastAPI service.
  if (pathname.startsWith('/api/')) {
    proxyApiRequest(req, res);
    return;
  }

  // Static File Serving
  let filePath = path.join(BASE_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client-side routing
      filePath = path.join(BASE_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

function proxyApiRequest(req, res) {
  const backendRequest = http.request({
    hostname: '127.0.0.1',
    port: 8000,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: '127.0.0.1:8000' }
  }, backendResponse => {
    res.writeHead(backendResponse.statusCode || 502, backendResponse.headers);
    backendResponse.pipe(res);
  });

  backendRequest.on('error', error => {
    console.error(`Backend proxy error: ${error.message}`);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ detail: 'Backend unavailable. Start the API on port 8000.' }));
      return;
    }
    res.destroy(error);
  });
  req.pipe(backendRequest);
}

let currentPort = PORT;

function startServer(port) {
  server.listen(port, '::1', () => {
    console.log(`================================================================`);
    console.log(`⚖️  Kenya Legal Oracle AI - Constitution of Kenya 2010 Assistant`);
    console.log(`🚀 Server listening on: http://localhost:${port}`);
    console.log(`💡 Serving web client, Constitution explorer, M-Pesa billing, and Admin portal`);
    console.log(`================================================================`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(currentPort);
