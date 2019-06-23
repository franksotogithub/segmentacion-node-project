const zonaModel = require('../models/zona');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let config = require('../config');

const ambitos =[
    { ambito:0,descripcion:'departamento',codigo:'ccdd' },
    { ambito:1,descripcion:'provincia',codigo:'ccpp' },
    { ambito:2,descripcion:'distrito',codigo:'ccdi' },
];


let Zona = {


    reportes(req,res){

        let ambito=!(req.params.ambito)?0:req.params.ambito;
        let codigo=!(req.params.codigo)?'00':req.params.codigo;

        console.log('codigo',codigo);

        let amb=ambitos.find(x=>x.ambito==ambito);
        let match={

        }


        if(codigo!=='00'){
            match[amb.codigo]= {'$in' : [codigo]}
        }


        let groupBy={
            _id:{'descripcion':'$'+amb.descripcion ,"codigo":'$'+amb.codigo },
            "cant_zonas_marco":{"$sum": 1 },
            "cant_zonas_segm":{"$sum": "$flag_proc_segm" }
        }

        zonaModel.aggregate([
            {"$match":match},
            {"$group" : groupBy},
            { "$project": {
                    "codigo":'$_id.codigo',
                    "descripcion":'$_id.descripcion',
                    "cant_zonas_marco": 1,
                    "cant_zonas_segm": 1,
                    "porcent_segm":
                        { "$multiply": [ { "$divide": [ "$cant_zonas_marco", "$cant_zonas_segm"] }, 100 ] }

                }
            }

        ]
            ,(err,data)=>{

                if(err) res.status(500).json({message:"Error al recuperar data",error:err});
                res.json(data);

        });

    },



}

module.exports = Zona;