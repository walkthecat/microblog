const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('reg', {
        title: '用户注册',
        error: req.flash('error').toString(),
        url: req.baseUrl.substr(1),
    });
});

module.exports = router;