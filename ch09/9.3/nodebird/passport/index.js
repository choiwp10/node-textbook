const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {  // { id: 1, name: cwp10, age: 20 } -> 1
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {  // 1 -> { id: 1, name: cwp10, age: 20 } -> req.user
    User.find({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};