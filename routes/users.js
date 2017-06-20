const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Post = require('../models/post');

/* GET users listing. */
router.get('/:user', function (req, res, next) {
  //res.send('respond with a resource');
  User.get(req.params.user, (err, user) => {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    Post.get(user.name, (err, posts) => {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        posts: [posts],
        layout: 'layout',
        user: req.session.user,
      });
    });
  });
});

module.exports = router;