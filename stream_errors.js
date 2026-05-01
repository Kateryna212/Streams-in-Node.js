const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // 1. Handle Route and Method
  if (req.method === 'GET' && parsedUrl.pathname === '/missing-file') {
    const fileName = parsedUrl.query.fileName;

    // 2. Validate Query Parameter
    if (!fileName) {
      res.writeHead(400);
      return res.end('Missing fileName parameter');
    }

    // 3. Create the Read Stream
    const fileStream = fs.createReadStream(fileName);

    // 4. Handle Stream Errors
    fileStream.on('error', (err) => {
      // If file doesn't exist or can't be read, send 500
      if (!res.headersSent) {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    });

    // 5. Pipe the file to the response
    fileStream.pipe(res);
    
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(process.argv[2] || 3000);
