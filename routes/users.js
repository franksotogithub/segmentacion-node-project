var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

var  middleware = require('../core/middleware-auth');



/* GET users listing. */
router.get('/',function(req, res, next) {
    userController.get(req,res);
});

router.get('/:id',function(req, res, next) {
    userController.getByUsername(req,res);
});

router.put('/:id', middleware.checkToken,function(req, res, next) {
    userController.update(req,res);
});

router.delete('/:id',middleware.checkToken ,function(req, res, next) {
    userController.delete(req,res);
});

router.post('/',middleware.checkToken, (req, res) => {
    userController.create(req,res);
});

router.post('/login', (req, res) => {
    userController.login(req,res);
});

module.exports = router;
