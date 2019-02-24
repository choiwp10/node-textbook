const http = require('http');
const https = require('https');

// lets encrypt 무료 인증서를 발급받았다고 칩시다.
https.createServer({
  cert: fs.readFileSync('도메인 인증서 경로'),
  key: fs.readFileSync('도메인 비밀키 경로'),
  ca: [
    fs.readFileSync('상위 인증서 경로'),
    fs.readFileSync('상위 인증서 경로'),
  ],
}, (req, res) => {
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
}).listen(443, () => {
  console.log('443번 포트에서 서버 대기중입니다!');
});