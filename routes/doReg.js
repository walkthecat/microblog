const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/user.js');

router.post('/', (req, res, next) => {
    if (req.body.username == '') {
        req.flash('error', '请输入用户名');
        return res.redirect('/reg');
    }

    if (req.body['password'] == '') {
        req.flash('error', '请输入口令');
        return res.redirect('/reg');
    }

    if (req.body['password-repeat'] == '') {
        req.flash('error', '请输入重复口令');
        return res.redirect('/reg');
    }

    if (req.body['password-repeat'] != req.body['password']) {
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/reg');
    }
    //生成口令的散列值
    let md5 = crypto.createHash('md5');
    let password = md5.update(req.body.password).digest('base64');

    let newUser = new User({
        name: req.body.username,
        password: password
    });

    //检查用户名是否已经存在 
    User.get(newUser.name, (err, user) => {
        if (user)
            err = 'Username already exists.';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save((err) => {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        })
    })
});

module.exports = router;