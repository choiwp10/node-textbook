const fs = require('fs');

setInterval(() => {
  console.log('시작');
  fs.unlink('./asfsadasd.js', (err) => {
    if (err) {
      console.log('시작');
      console.log(err);
      console.log('끝');
    }
  });
}, 1000);