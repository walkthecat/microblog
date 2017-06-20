const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    /*res.render('hello', {
        time: new Date()
    });*/ 
    res.send('The time is ' + new Date().toString());
});

module.exports = router;