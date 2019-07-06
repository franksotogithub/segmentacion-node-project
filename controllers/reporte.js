const zonaModel = require('../models/zona');
const aeuModel = require('../models/aeu');
const seccionModel = require('../models/seccion');
const subzonaModel = require('../models/subzona');
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



const displayedColumns = [
    {data: 'idsubzona', label: 'SUBZONA'},
    {data: 'seccion', label: 'SECCION'},
    {data: 'aeu', label: 'AEU'},
];


const columnsToDisplay = displayedColumns.map(x => {
    return x.data
});

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

                //aeuModel
                aeuModel.aggregate(
                    [
                                {"$match":match},
                                {"$group":{_id:null, "valor":{"$sum":1}}},

                    ] ,
                    (err,data1)=>{
                    if(err) res.status(500).json({message:"Error al recuperar data",error:err});

                    let promedios=[];
                    let el={};
                     let cant_aeus=0;
                    if(data1.length>0){
                        cant_aeus=data1[0].valor;
                        el.label = 'Cantidad de AEU'
                        el.valor= cant_aeus;
                        promedios.push(el);
                    }

                    aeuModel.aggregate(
                        [
                            {"$match":match},
                            {$group:{ _id:{"cant_viv":"$cant_viv" } ,"valor":{"$sum":1} }},
                            { "$sort" :  {'_id.cant_viv':-1}}
                            //{"$sort"}

                        ],

                        (err,data2)=>{
                            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
                            let viviendas=[];
                            data2.forEach( (data,index )=>{
                                let el={}
                                el.label=`Area de empadronamiento con  ${data._id.cant_viv} viviendas` ;
                                el.valor= data.valor;
                                el.porcent= data.valor/cant_aeus*100;
                                viviendas.push(el)
                            });
                            res.json({reporte:data, estadisticas:{viviendas:viviendas,promedios:promedios } , graficos:{viviendas}});
                    });

                    });

        });

    },

    reporte_croquis_listado(req,res){
        let ambito=!(req.params.ambito)?0:req.params.ambito;
        let codigo=!(req.params.codigo)?'00':req.params.codigo;
        let model;
        let match={
            'idzona':codigo
        }



        let groupBy={
            _id:{ },
            "cant_viv":{"$sum": 1 },
        };

        let sort={};

        /*let project={
            "ccdi":1,
            "zona":1,
            "ruta_web": {'$concat': ["$ccdi","/","$zona",""]}
        };*/


        /*"$project": {
            "codigo":'$_id.codigo',
                "descripcion":'$_id.descripcion',
                "cant_zona_marco": 1,
                "cant_zona_segm": 1,
                "porcent_segm":
            { "$multiply": [ { "$divide": [ "$cant_zona_marco", "$cant_zona_segm"] }, 100 ] }

        }*/

        /*project['ruta_web']=*/

        /*arrayGroupBy.forEach((groupColum,index)=>{
            if(index<=ambito){
                groupBy._id[groupColum]='$'+groupColum;
                //sort[`_id.${groupColum}`]=1;
                sort[groupColum]=1;
                project[groupColum]=`$_id.${groupColum}`;

            }
            else {
                return;
            }
        });
*/

        (ambito==0)? model=subzonaModel:(ambito==1)? model=seccionModel:(ambito==2)? model=aeuModel:true;

        let fields={};
        let displayedColumnsx=[];
        let columnsToDisplayx=[];

        displayedColumns.forEach((column,index)=>{
            if(index<=ambito){
                fields[column.data]=1,
                displayedColumnsx.push(column);
            }
            else {
                return;
            }
        });

        columnsToDisplayx= displayedColumnsx.map(x => {
            return x.data
        });
        fields['ruta_web'] = 1;
        fields['cant_viv'] = 1;

        //let displayedColumns=displayedColumns



        model.find(match,fields,(err, result)=> {

            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
            res.json({data:result,displayedColumns:displayedColumnsx,columnsToDisplay:columnsToDisplayx});

        });
        /*aeuModel.aggregate([
            {"$match":match},
            {"$group" : groupBy},
            { "$sort" :  sort}

        ]  ,(err,data)=>{

            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
            res.json(data);

        })*/



    }


}

module.exports = Reporte;
