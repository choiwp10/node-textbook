const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log('서버 실행');
  fs.readFile('./server1.html', (err, data) => {
    if (err) {
      throw err;
    }
    res.end(data);
  });
}).listen(8080);

server.on('listening', () => {
  console.log('8080 번 포트에서 서버 대기중입니다.');
});

server.on('error', (roor) => {
  console.log(error);
});