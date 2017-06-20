const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/user.js');

router.post('/', (req, res, next) => {
    let md5 = crypto.createHash('md5');
    let password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, (err, user) => {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }
        if (user.password != password) {
            req.flash('error', '用户口令错误');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');
    });
});

module.exports = router;