const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 1. Handle Route and Method
  if (req.method === 'POST' && req.url === '/upload') {
    const destination = path.join(process.cwd(), 'upload.txt');
    
    // 2. Create the Writable Stream
    const writeStream = fs.createWriteStream(destination);

    // 3. Pipe the request body directly into the file
    req.pipe(writeStream);

    // 4. Handle completion
    // We listen to the 'finish' event on the write stream 
    // to ensure all data was written before responding.
    writeStream.on('finish', () => {
      res.writeHead(200);
      res.end('Upload successful');
    });

    // 5. Basic Error Handling (to keep the server alive)
    req.on('error', () => {
      res.writeHead(500);
      res.end();
    });
    
    writeStream.on('error', () => {
      res.writeHead(500);
      res.end();
    });

  } else {
    // 6. Handle unknown routes
    res.writeHead(404);
    res.end();
  }
});

const port = process.argv[2] || 3000;
server.listen(port);
