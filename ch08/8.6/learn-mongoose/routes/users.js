const express = require('express');
const router = express.Router();

const User = require('../schemas/user');

// GET /users
router.get('/', (req, res, next) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

router.post('/', (req, res, next) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  });
  user.save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = router;
