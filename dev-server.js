import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Import handlers
import coupleHandler from './api/couple.js';
import rubricHandler from './api/rubric.js';
import historyHandler from './api/history.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  
  // 1. Setup Vercel Request Helpers
  req.query = Object.fromEntries(parsedUrl.searchParams.entries());
  
  // 2. Setup Vercel Response Helpers
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
    return res;
  };
  
  res.send = (data) => {
    res.end(data);
    return res;
  };

  // Buffer incoming body
  let bodyBuffer = '';
  req.on('data', chunk => {
    bodyBuffer += chunk;
  });
  
  req.on('end', async () => {
    // Parse JSON body if present
    if (bodyBuffer) {
      try {
        req.body = JSON.parse(bodyBuffer);
      } catch (e) {
        req.body = {};
      }
    } else {
      req.body = {};
    }
    
    try {
      // 3. Routing Vercel API Endpoints
      if (pathname === '/api/couple') {
        return await coupleHandler(req, res);
      } else if (pathname === '/api/rubric') {
        return await rubricHandler(req, res);
      } else if (pathname === '/api/history') {
        return await historyHandler(req, res);
      }
      
      // 4. Static Files Routing
      // Clean path to prevent directory traversal
      const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
      let filePath = safePath === '/' ? '/index.html' : safePath;
      let absolutePath = path.join(__dirname, filePath);
      
      try {
        const stat = await fs.stat(absolutePath);
        if (stat.isFile()) {
          const ext = path.extname(absolutePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          
          res.setHeader('Content-Type', contentType);
          const fileContent = await fs.readFile(absolutePath);
          return res.end(fileContent);
        }
      } catch (e) {
        // Fall through to 404
      }
      
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('未找到该文件 (404 Not Found)');
      
    } catch (err) {
      console.error("Dev Server Error:", err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('服务器内部错误 (500 Internal Server Error)');
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`[Offline Dev Server] Cozy cabin dev server is running at http://localhost:${PORT}`);
});
