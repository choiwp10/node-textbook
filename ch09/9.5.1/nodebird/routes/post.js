const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  Post,
  Hashtag,
  User
} = require('../models');
const {
  isLoggedIn
} = require('./middlewares');

const router = express.Router();

fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({
    url: `/img/${req.file.filename}`
  });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({ // findOrCreate 있으면 찾고 없으면 만들기
        where: {
          title: tag.slice(1).toLowerCase()
        }, // # 때기
      })));
      await post.addHashtags(result.map(r => r[0])); // 게시글과 해쉬테그들을 연결
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      }
    });
    res.send('OK');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.find({
      where: {
        title: query
      }
    });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({
        include: [{
          model: User
        }]
      }); // 다대다 관계 관계있는 포스트들을 다 가져온다
    }
    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/:id/like', async (req, res, next) => {
  try {
    const post = await Post.find({
      where: {
        id: req.params.id
      }
    });
    await post.addLiker(req.user.id);
    res.send('OK');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete('/:id/like', async (req, res, next) => {
  try {
    const post = await Post.find({
      where: {
        id: req.params.id
      }
    });
    await post.removeLiker(req.user.id);
    res.send('OK');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;

// A.getB: 관계있는 로우 조회
// A.addB: 관계생성
// A.setB: 관계수정
// A.removeB: 관계 제거
