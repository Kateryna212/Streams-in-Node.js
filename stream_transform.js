const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const { Transform } = require('stream');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // 1. Handle Route and Method
  if (req.method === 'GET' && parsedUrl.pathname === '/upper') {
    const fileName = parsedUrl.query.fileName;

    // 2. Validate Query Parameter
    if (!fileName) {
      res.writeHead(400);
      return res.end('Missing fileName parameter');
    }

    const filePath = path.join(process.cwd(), fileName);

    // 3. Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(400);
        return res.end('File not found');
      }

      // 4. Create the Transform Stream
      const upperCaseTranslator = new Transform({
        transform(chunk, encoding, callback) {
          // Convert the buffer chunk to string, uppercase it, and push it forward
          this.push(chunk.toString().toUpperCase());
          callback();
        }
      });

      // 5. Build the Pipeline: Readable -> Transform -> Writable
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      
      const fileStream = fs.createReadStream(filePath);
      
      fileStream
        .pipe(upperCaseTranslator)
        .pipe(res);

      // Handle stream errors to keep server alive
      fileStream.on('error', () => {
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
    });

  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.argv[2] || 3000;
server.listen(port);
