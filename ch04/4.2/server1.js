const http = require('http');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

http.createServer((req, res) => {
  console.log(req.url, parseCookies(req.headers.cookie));
  res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });
  res.end('Hello Cookie');
}).listen(8082, () => {
  console.log('8082번 포트에서 서버 대기중입니다!');
});