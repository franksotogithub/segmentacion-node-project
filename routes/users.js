var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    for (const key in req.query) {
        console.log(key, req.query[key])
    }
  res.send('respond with a resource');
});

router.post('/register', (req, res) => {
    userController.register(req,res);
    //res.status(200).send({ access_token:  '' });
});

router.post('/login', (req, res) => {
    userController.login(req,res);
});

module.exports = router;
