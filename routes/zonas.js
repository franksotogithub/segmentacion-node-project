var express = require('express');
var router = express.Router();
var zonaController = require('../controllers/zona');
var  middleware = require('../core/middleware-auth');
/* GET users listing. */
router.get('/reportes/:ambito/:codigo',middleware.checkToken, (req, res, next) =>{
    zonaController.reportes(req,res);
});

module.exports = router;
