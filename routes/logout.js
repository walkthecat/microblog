const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});

module.exports = router;