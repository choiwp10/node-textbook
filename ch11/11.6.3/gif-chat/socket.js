const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  app.set('io', io);  // 익스프레스 변수 저장 방법
  // req.app.get('io').of('/room').emit

  // 네임스페이스
  // io.of('/')
  const room = io.of('/room');
  const chat = io.of('/chat');

  // 익스프레스 미들웨어를 소켓IO에서 쓰는 방법
  io.use((socket, next) => {
    cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
  });
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    // /room/룸id (req.headers.referer)
    socket.join(roomId);  // 방에 접속

    /*socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
      number: socket.adapter.rooms[roomId].length,
    });*/
    axios.post(`http://localhost:8005/room/${roomId}/sys`, {
      type: 'join',
    }, {
        headers: {
          Cookie: `connect.sid=${'s%3A' + cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET)}`,
        }
      });

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId); // 방 나가기
      // 방에 인원이 하나도 없으면 방을 없애요
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if (userCount === 0) {
        //  여기에 디비 조작하시 말고 라우터를 통해서 디비 조작한다.
        axios.delete(`http://localhost:8005/room/${roomId}`)
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        /*socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
          number: socket.adapter.rooms[roomId].length,
        });*/
        axios.post(`http://localhost:8005/room/${roomId}/sys`, {
          type: 'exit',
        }, {
            headers: {
              Cookie: `connect.sid=${'s%3A' + cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET)}`,
            }
          });
      }
    });

    socket.on('dm', (data) => {
      socket.to(data.target).emit('dm', data);
    });
  });
};

// 클라이언트 -> http -> 서버
// 클라이언트 -> ws -> 서버