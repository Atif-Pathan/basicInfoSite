import { createServer } from 'node:http';
import { readFile } from 'node:fs';

const hostname = '127.0.0.1';
const port = 8000;

// async function read(filePath) {
//   try {
//     const data = await readFile(filePath, 'utf8');
//     console.log(data);
//   } catch (error) {
//     console.error(`Error reading file: ${error.message}`);
//   }
// }

const server = createServer((req, res) => {
    let filePath = null;
    let contentType = 'text/html'; // Default to HTML
    let statusCode = 200;

    console.log(req.url);


    // figure out the file path, content type and status code for each file
    if (req.url === '/' || req.url === '/index.html') {
      filePath = './index.html';
    } else if (req.url === '/about') { 
      filePath = './about.html';
    } else if (req.url === '/contact-me') {
      filePath = './contact-me.html';
    } else if (req.url === '/style.css') { // Handle CSS file separately
      filePath = './style.css';
      contentType = 'text/css'; 
    } else if (req.url === '/favicon.ico') { // Handle favicon requests
      // If favicon.ico is not found, just send a 204 No Content response
      res.writeHead(204); // 204 No Content is often preferred for favicon requests that aren't found
      res.end();
      return;
    } else {
      // If none of the above match, it's a 404
      filePath = './404.html';
      statusCode = 404;
    }

    readFile(filePath, (err, data) => {
      console.log(`Request received for: ${filePath}`);
      
      if (err) {
        console.error(`Error reading file ${filePath}:`, err);
        // If any file read fails (e.g., 404.html is missing), send a generic error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      // If file is read successfully, send it
      res.writeHead(statusCode, { 'Content-Type': contentType });
      res.end(data);
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

