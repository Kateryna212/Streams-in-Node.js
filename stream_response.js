const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // 1. Route and Method Check
  if (req.method === 'GET' && parsedUrl.pathname === '/file') {
    const fileName = parsedUrl.query.fileName;

    // 2. Validate Query Parameter
    if (!fileName) {
      res.writeHead(400);
      return res.end('Missing fileName');
    }

    const filePath = path.join(process.cwd(), fileName);

    // 3. Check if file exists before streaming
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(400);
        return res.end('File not found');
      }

      // 4. Set Headers and Stream the file
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      
      const fileStream = fs.createReadStream(filePath);
      
      // The pipe method handles the data flow and backpressure automatically
      fileStream.pipe(res);
    });

  } else {
    res.writeHead(404);
    res.end();
  }
});

// Listen on the port provided by the exercise runner
const port = process.argv[2] || 3000;
server.listen(port);
