const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('클라이언트 접속', ip);
    ws.on('message', (message) => {
      console.log(message);
    });
    ws.on('error', (error) => {
      console.log(error);
    });
    ws.on('close', () => {
      console.log('클라이언트 접속 해제', ip);
      clearInterval(ws.interval);
    });
    const interval = setInterval(() => {
      if(ws.readyState === ws.OPEN) { // ws.CONNECTION, ws,CLOSING, ws.CLOSE
        ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
      }
    }, 3000);
    ws.interval = interval;
  });
};

// 클라이언트 -> http -> 서버
// 클라이언트 -> ws -> 서버