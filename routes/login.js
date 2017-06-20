const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('login', {
        title: '用户登入',
        error: req.flash('error').toString(),
        url: req.baseUrl.substr(1),
    })
});

module.exports = router;