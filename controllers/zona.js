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
            //let ambc=ambitos.find(x=>x.ambito==ambito);
            //match[amb.codigo]= {'$in' : [codigo]}
            //match[amb.codigo]= {'$regex' : `/${codigo}$/` }

            (codigo.length==2)? match['ccdd']= {'$in' : [codigo]}:(codigo.length==4)? match['ccpp']= {'$in' : [codigo]}:(codigo.length==6)? match['ccdi']= {'$in' : [codigo]}:true;
        }


        let groupBy={
            _id:{'descripcion':'$'+amb.descripcion ,"codigo":'$'+amb.codigo },
            "cant_zona_marco":{"$sum": 1 },
            "cant_zona_segm":{"$sum": "$flag_proc_segm" }
        }

        zonaModel.aggregate([
            {"$match":match},
            {"$group" : groupBy},
            { "$project": {
                    "codigo":'$_id.codigo',
                    "descripcion":'$_id.descripcion',
                    "cant_zona_marco": 1,
                    "cant_zona_segm": 1,
                    "porcent_segm":
                        { "$multiply": [ { "$divide": [ "$cant_zona_marco", "$cant_zona_segm"] }, 100 ] }

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
