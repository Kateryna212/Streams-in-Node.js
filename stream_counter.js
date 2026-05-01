const http = require('http');

const server = http.createServer((req, res) => {
  // Check for the correct method and path
  if (req.method === 'POST' && req.url === '/count') {
    let bytes = 0;
    let chunks = 0;

    // The request (req) is a readable stream
    req.on('data', (chunk) => {
      bytes += chunk.length;
      chunks++;
    });

    // Once the stream ends, send the JSON response
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ bytes, chunks }));
    });
  } else {
    // Handle 404 for other routes
    res.writeHead(404);
    res.end();
  }
});

server.listen(process.argv[2] || 3000);
