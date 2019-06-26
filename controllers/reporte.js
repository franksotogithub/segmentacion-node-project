const zonaModel = require('../models/zona');
const aeuModel = require('../models/aeu');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let config = require('../config');

const ambitos =[
    { ambito:0,descripcion:'departamento',codigo:'ccdd' },
    { ambito:1,descripcion:'provincia',codigo:'ccpp' },
    { ambito:2,descripcion:'distrito',codigo:'ccdi' },
    { ambito:3,descripcion:'zona',codigo:'idzona' },

];

const arrayGroupBy =[
    'idsubzona','seccion','aeu'
];


let Reporte = {
    reporte_avance_segm(req,res){

        let ambito=!(req.params.ambito)?0:req.params.ambito;
        let codigo=!(req.params.codigo)?'00':req.params.codigo;
        let amb=ambitos.find(x=>x.ambito==ambito);
        let match={};

        if(codigo!=='00'){
            (codigo.length==2)? match['ccdd']= {'$in' : [codigo]}:(codigo.length==4)? match['ccpp']= {'$in' : [codigo]}:(codigo.length==6)? match['ccdi']= {'$in' : [codigo]}:true;
        }


        let groupBy={
            _id:{'descripcion':'$'+amb.descripcion ,"codigo":'$'+amb.codigo },
            "cant_zona_marco":{"$sum": 1 },
            "cant_zona_segm":{"$sum": "$flag_proc_segm" }
        }
        let sort={}
        sort[amb.codigo]=-1;

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
            }, { "$sort" :  {'codigo':1}}

        ]
            ,(err,data)=>{

                if(err) res.status(500).json({message:"Error al recuperar data",error:err});
                res.json(data);

        });

    },

    reporte_croquis_listado(req,res){
        let ambito=!(req.params.ambito)?0:req.params.ambito;
        let codigo=!(req.params.codigo)?'00':req.params.codigo;

        let match={
            'idzona':codigo
        }



        let groupBy={
            _id:{ },
            "cant_viv":{"$sum": 1 },
        };

        let sort={};

        arrayGroupBy.forEach((groupColum,index)=>{
            if(index<=ambito){
                groupBy._id[groupColum]='$'+groupColum;
                sort[`_id.${groupColum}`]=1;
            }
            else {
                return;
            }
        });

        aeuModel.aggregate([
            {"$match":match},
            {"$group" : groupBy},
            { "$sort" :  sort}

        ]  ,(err,data)=>{

            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
            res.json(data);

        })

    }


}

module.exports = Reporte;
