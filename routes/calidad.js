var express = require('express');
var router = express.Router();
var CalidadController = require('../controllers/calidad');
var  middleware = require('../core/middleware-auth');

router.get('/reporte_avance_calidad/:ambito/:codigo', (req, res, next) =>{
    CalidadController.reporte_avance_calidad(req,res);

});


router.get('/lista_aeu_muestra_calidad/:codigo', (req, res, next) =>{
    CalidadController.lista_aeu_muestra_calidad(req,res);
    
});

router.get('/viv_aeu_muestra_calidad/:codigo', (req, res, next) =>{
    CalidadController.viv_aeu_muestra_calidad(req,res);
    
});

router.get('/generar_muestra_aeu_calidad/:idzona', (req, res, next) =>{
    CalidadController.generar_muestra_aeu_calidad(req,res);
    
});

/* GET users listing. */
/*router.get('/reporte_avance_segm/:ambito/:codigo', (req, res, next) =>{
    ReporteController.reporte_avance_segm(req,res);
});

router.get('/reporte_croquis_listado/:ambito/:codigo', (req, res, next) =>{
    ReporteController.reporte_croquis_listado(req,res);
});


router.get('/reporte_avance_calidad/:ambito/:codigo', (req, res, next) =>{
    ReporteController.reporte_avance_calidad(req,res);
});*/

module.exports = router;
