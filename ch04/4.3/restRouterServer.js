const http = require('http');
const fs = require('fs');

const users = {};

const router = {
  get: {
    '/': (req, res) => {
      fs.readFile('./restFront.html', (err, data) => {
        if (err) {
          throw err;
        }
        res.end(data);
      });
    },
    '/users': (req, res) => {
      res.end(JSON.stringify(users));
    },
    '*': (req, res) => {
      fs.readFile(`.${req.url}`, (err, data) => {
        if (err) {
          res.writeHead(404, 'NOT FOUND');
          return res.end('NOT FOUND');
        }
        return res.end(data);
      });
    },
  },
  post: {
    '/users': (req, res) => {
      let body = '';
      req.on('data', (data) => {
        body += data;
      });
      return req.on('end', () => {
        console.log('POST 본문(Body):', body);
        const { name } = JSON.parse(body);
        const id = +new Date();
        users[id] = name;
        res.writeHead(201);
        res.end('등록 성공');
      });
    },
  },
  patch: {

  },
  put: {
    '/users': (req, res) => {
      const key = req.url.split('/')[2];
      let body = '';
      req.on('data', (data) => {
        body += data;
      });
      return req.on('end', () => {
        console.log('PUT 본문(Body):', body);
        users[key] = JSON.parse(body).name;
        return res.end(JSON.stringify(users));
      });
    },
  },
  delete: {
    '/users': (req, res) => {
      const key = req.url.split('/')[2];
      delete users[key];
      return res.end(JSON.stringify(users));
    },
  }
};

http.createServer((req, res) => {
  const matchedUrl = router[req.method.toLowerCase()][req.url];
  (matchedUrl || router[req.method.toLowerCase()]['*']) (req, res);
}).listen(8005, () => {
  console.log('8005번 포트에서 서버 대기 중입니다.');
});