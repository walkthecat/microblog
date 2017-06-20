const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.post('/', (req, res, next) => {
    let currentUser = req.session.user;
    let post = new Post(currentUser.name, req.body.post);
    post.save((err) => {
        if (err) {
            req.flash('error', 'err');
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        return res.redirect('/u/' + currentUser.name);
    });
});

module.exports = router;