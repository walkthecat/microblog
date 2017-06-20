const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('reg', {
        title: '用户注册',
        error: req.flash('error').toString(),
        layout: 'layout'
    });
});

module.exports = router;