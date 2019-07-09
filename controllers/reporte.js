const zonaModel = require('../models/zona');
const aeuModel = require('../models/aeu');
const seccionModel = require('../models/seccion');
const subzonaModel = require('../models/subzona');


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
                        { "$multiply": [ { "$divide": [ "$cant_zona_segm", "$cant_zona_marco"] }, 100 ] }

                }
            }, { "$sort" :  {'codigo':1}}

        ]
            ,(err,data)=>{
                console.log('err>>>',err);
                console.log('data>>>',data);
                if(err) res.status(500).json({message:"Error al recuperar data",error:err});



                zonaModel.aggregate(
                    [
                                {"$match":match},
                                {"$group":{_id:null,
                                        "cant_ae_u":{"$sum":"$cant_ae_u"},
                                        "cant_secc_u":{"$sum":"$cant_secc_u"},
                                        "cant_mzs":{"$sum":"$cant_mzs"},
                                        "cant_viv":{"$sum":"$cant_viv"},
                                        "cant_pob":{"$sum":"$cant_pob"},

                                }},

                    ] ,
                    (err,data1)=>{
                    if(err) res.status(500).json({message:"Error al recuperar data",error:err});

                    let promedios=[];
                    let informativa=[];
                    console.log(data1);

                     let cant_aeus=data1[0].cant_ae_u;
                    if(data1.length>0 && cant_aeus>0){
                        let el={};

                        el.label='Cantidad de secciones urbanas';
                        el.valor= data1[0].cant_secc_u;
                        informativa.push(el);

                        el={};
                        el.label='Cantidad de areas de empadronamiento urbano';
                        el.valor= cant_aeus;
                        informativa.push(el);
                        el={};
                        el.label='Promedio de manzanas por area de empadronamiento';
                        el.valor= data1[0].cant_mzs/ cant_aeus;
                        promedios.push(el);

                        el={};
                        el.label='Promedio de viviendas por area de empadronamiento';
                        el.valor= data1[0].cant_viv/ cant_aeus;
                        promedios.push(el);
                        el={};
                        el.label='Promedio de Poblacion por area de empadronamiento';
                        el.valor= data1[0].cant_pob/cant_aeus;
                        promedios.push(el);

                    }

                    aeuModel.aggregate(
                        [
                            {"$match":match},
                            {$group:{ _id:{"cant_viv":"$cant_viv" } ,"valor":{"$sum":1} }},
                            { "$sort" :  {'_id.cant_viv':1}}

                        ],

                        (err,data2)=>{
                            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
                            let viviendas=[];
                            let viviendasGraficos=[];

                            console.log('cant_aeus>>',cant_aeus);
                            data2.forEach( (data,index )=>{
                                let el={},el2={};
                                el.label=`Area de empadronamiento con  ${data._id.cant_viv} viviendas` ;
                                el.valor= data.valor;
                                el.porcent= data.valor/cant_aeus*100;
                                el2=Object.assign({}, el);
                                el2.label=`${data._id.cant_viv} viv`; 
                                
                                viviendas.push(el);
                                viviendasGraficos.push(el2);
                            });
                            res.json({reporte:data, estadisticas:{viviendas:viviendas,promedios:promedios ,informativa:informativa} , graficos:{grafico1:viviendasGraficos}});
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



    },

    reporte_avance_calidad(req,res){

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
                        { "$multiply": [ { "$divide": [ "$cant_zona_segm", "$cant_zona_marco"] }, 100 ] }

                }
            }, { "$sort" :  {'codigo':1}}

        ]
            ,(err,data)=>{
                console.log('err>>>',err);
                console.log('data>>>',data);
                if(err) res.status(500).json({message:"Error al recuperar data",error:err});



                zonaModel.aggregate(
                    [
                                {"$match":match},
                                {"$group":{_id:null,
                                        "cant_ae_u":{"$sum":"$cant_ae_u"},
                                        "cant_secc_u":{"$sum":"$cant_secc_u"},
                                        "cant_mzs":{"$sum":"$cant_mzs"},
                                        "cant_viv":{"$sum":"$cant_viv"},
                                        "cant_pob":{"$sum":"$cant_pob"},

                                }},

                    ] ,
                    (err,data1)=>{
                    if(err) res.status(500).json({message:"Error al recuperar data",error:err});

                    let promedios=[];
                    let informativa=[];
                    console.log(data1);

                     let cant_aeus=data1[0].cant_ae_u;
                    if(data1.length>0 && cant_aeus>0){
                        let el={};

                        el.label='Cantidad de secciones urbanas';
                        el.valor= data1[0].cant_secc_u;
                        informativa.push(el);

                        el={};
                        el.label='Cantidad de areas de empadronamiento urbano';
                        el.valor= cant_aeus;
                        informativa.push(el);
                        el={};
                        el.label='Promedio de manzanas por area de empadronamiento';
                        el.valor= data1[0].cant_mzs/ cant_aeus;
                        promedios.push(el);

                        el={};
                        el.label='Promedio de viviendas por area de empadronamiento';
                        el.valor= data1[0].cant_viv/ cant_aeus;
                        promedios.push(el);
                        el={};
                        el.label='Promedio de Poblacion por area de empadronamiento';
                        el.valor= data1[0].cant_pob/cant_aeus;
                        promedios.push(el);

                    }

                    aeuModel.aggregate(
                        [
                            {"$match":match},
                            {$group:{ _id:{"cant_viv":"$cant_viv" } ,"valor":{"$sum":1} }},
                            { "$sort" :  {'_id.cant_viv':1}}

                        ],

                        (err,data2)=>{
                            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
                            let viviendas=[];
                            let viviendasGraficos=[];

                            console.log('cant_aeus>>',cant_aeus);
                            data2.forEach( (data,index )=>{
                                let el={},el2={};
                                el.label=`Area de empadronamiento con  ${data._id.cant_viv} viviendas` ;
                                el.valor= data.valor;
                                el.porcent= data.valor/cant_aeus*100;
                                el2=Object.assign({}, el);
                                el2.label=`${data._id.cant_viv} viv`; 
                                
                                viviendas.push(el);
                                viviendasGraficos.push(el2);
                            });
                            res.json({reporte:data, estadisticas:{viviendas:viviendas,promedios:promedios ,informativa:informativa} , graficos:{grafico1:viviendasGraficos}});
                    });

                    });

        });

    },

    
}

module.exports = Reporte;
