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

router.put('/generar_muestra_aeu_calidad/:idzona', (req, res, next) =>{
    CalidadController.generar_muestra_aeu_calidad(req,res);
    
});


router.put('/evaluar_zona_calidad/:idzona', (req, res, next) =>{
    CalidadController.evaluar_zona_calidad(req,res);
});


router.put('/actualizar_indicadores/:idaeu', (req, res, next) =>{
    CalidadController.actualizar_indicadores(req,res);
});

router.get('/detalle_indicadores_aeu_muestra_calidad/:idaeu', (req, res, next) =>{
    CalidadController.detalle_indicadores_aeu_muestra_calidad(req,res);
});

router.get('/reporte_indicadores/:ambito/:codigo', (req, res, next) =>{
    CalidadController.reporte_indicadores(req,res);
});


module.exports = router;
