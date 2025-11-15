var express = require('express');
var router = express.Router();

/* GET users listing. */
//localhost:3000/products
router.get('/', function(req, res, next) {
 // res.send('respond with a resource');
 res.json({ id:'1' ,name: 'Tai', age: 20});
});

module.exports = router;
