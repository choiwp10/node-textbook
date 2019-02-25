const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('세 번째 라우터 미들웨어');
  //res.send('Hello express');
  res.render('test', {
    title: '익스프레스',
    title2: '안녕',
  });
});

router.get('/posts', (req, res) => {

});

router.get('/comments', (req, res) => {

});

router.get('/list', (req, res) => {

});

router.post('/', (req, res) => {

});


module.exports = router;
