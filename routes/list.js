const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('list', {
        title: 'list',
        items: [1983, 'jyj', 'express', 'Node.js']
    });
});

module.exports = router;