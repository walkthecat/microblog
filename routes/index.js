const express = require('express');
const router = express.Router();
const Post = require('../models/post');


/* GET home page. */
router.get('/', function (req, res, next) {
  Post.get(null, (err, posts) => {
    if (err) {
      posts = [];
    }
    res.render('index', {
      title: '首页',
      posts: [posts],
      error: req.flash('error').toString(),
      success: req.flash('success').toString(),
      user: req.session.user,
      layout: 'layout'
    });
  });
});

module.exports = router;