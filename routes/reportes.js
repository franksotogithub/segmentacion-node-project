var express = require('express');
var router = express.Router();
var ReporteController = require('../controllers/reporte');
var  middleware = require('../core/middleware-auth');
/* GET users listing. */
router.get('/reporte_avance_segm/:ambito/:codigo', (req, res, next) =>{
    ReporteController.reporte_avance_segm(req,res);
});

router.get('/reporte_croquis_listado/:ambito/:codigo', (req, res, next) =>{
    ReporteController.reporte_croquis_listado(req,res);
});

module.exports = router;
