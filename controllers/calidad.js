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


const displayedColumnsCalidad = [
    {data: 'departamento', label: 'Departamento'},
    {data: 'provincia', label: 'Provincia'},
    {data: 'distrito', label: 'Distrito'},
    {data: 'zona', label: 'Zona'},
    {data: 'cant_ae_u', label: 'Cant. de AEUs'},
    {data: 'cant_secc_u', label: 'Cant. de Secciones'},
    {data: 'estado', label: 'Estado'},
    {data: 'cant_zona_calidad', label: 'Cant. Zonas Revisadas'},
    {data: 'cant_zona_calidad_acep', label: 'Cant. Zonas Aceptadas'},
    {data: 'cant_zona_calidad_rech', label: 'Cant. Zonas Rechazadas'},
    {data: 'porcent_avanc', label: '% Avance'},
    {data: 'seccion', label: 'Seccion'},
    {data: 'aeu', label: 'Nro. AEU'},
];



function getcolumsToDisplayCalidad(data){
    let res={}
    let columsToDisplay=[];
    let displayedColumns=[];
    if(data.length>0){
        columsToDisplay=Object.keys(data[0]);
        columsToDisplay=columsToDisplay.filter(  x=> displayedColumnsCalidad.map(x=>x.data).includes(x) );
        displayedColumns =displayedColumnsCalidad.filter( x=> { if(columsToDisplay.indexOf( x.data)>=0) return x });
    }
    res= {columsToDisplay:columsToDisplay,displayedColumns:displayedColumns};
    return res;
}


let Calidad = {

    reporte_avance_calidad(req,res){

        let ambito=!(req.params.ambito)?0:req.params.ambito;
        let codigo=!(req.params.codigo)?'00':req.params.codigo;
        let amb=ambitos.find(x=>x.ambito==ambito);
        let match={};



        let _id={'departamento':'$departamento'};


        if(codigo!=='00'){

            if(codigo.length==2)
            {
                match['ccdd']= {'$in' : [codigo]};
            }

            if(codigo.length==4)
            {
                match['ccpp']= {'$in' : [codigo]};

            }

            if(codigo.length==6)
            {
                match['ccdi']= {'$in' : [codigo]};

            }


        }



        for(let i=0;i<=amb;i++){
            _id[ambitos[i].descripcion] = '$'+ ambitos[i].descripcion;
        }
        _id["codigo"]='$'+amb.codigo;

        let groupBy={}

        if(ambito<3){
            groupBy={
                 _id:_id,
                "cant_zona_marco":{"$sum": 1 },
                "cant_ae_u":{"$sum":"$cant_ae_u"},
                "cant_secc_u":{"$sum":"$cant_secc_u"},
                "cant_zona_calidad":{"$sum":  {'$cond': [ {"$gt":["$flag_proc_calidad" ,0 ] } ,1,0 ] }   },
                "cant_zona_calidad_acep":{"$sum":  {'$cond': [ {"$eq":["$flag_proc_calidad" ,1 ] } ,1,0 ] } },
                "cant_zona_calidad_rech":{"$sum": {'$cond': [ {"$eq":["$flag_proc_calidad" ,2 ] } ,1,0 ] }},

            };
        }
        /*
        else{

            groupBy={
                _id:_id,
                "cant_zona_marco":{"$sum": 1 },
                "cant_ae_u":{"$sum":"$cant_ae_u"},
                "cant_secc_u":{"$sum":"$cant_secc_u"},
            };
        }
        */




        let project = {};

        let keys=Object.keys(_id);

        keys.forEach((key,index)=>{
            project[key]='$_id.'+key;

        });


        if(ambito<3){

            project=
                Object.assign(project,
                {
                "cant_zona_marco": 1,
                "cant_zona_calidad": 1,
                "cant_zona_calidad_acep":1,
                "cant_zona_calidad_rech":1,
                "cant_ae_u": 1,
                "cant_secc_u": 1,
                "porcent_avanc":
                { "$multiply": [ { "$divide": [ "$cant_zona_calidad_acep", "$cant_zona_marco"] }, 100 ] }
                });


        }

        else{
            project={
                "codigo":'$idzona',
                "departamento": 1,
                "provincia": 1,
                "distrito": 1,
                "zona": 1,
                "cant_ae_u": 1,
                "cant_secc_u": 1,
                "estado":"$flag_proc_calidad",
            }

        }


        if(ambito<3){
            zonaModel.aggregate([
                    {"$match":match},
                    {"$group":groupBy},
                    { "$project": project},
                    { "$sort" :  {'codigo':1}}

                ]
                ,(err,data)=>{
                    if(err) res.status(500).json({message:"Error al recuperar data",error:err});
                    let resp=getcolumsToDisplayCalidad(data);
                    res.json(Object.assign({data:data},resp));
                });

        }
        else if(ambito==3){
            zonaModel.aggregate([
                    {"$match":match},
                    { "$project": project},
                    { "$sort" :  {'codigo':1}}

                ]
                ,(err,data)=>{
                    if(err) res.status(500).json({message:"Error al recuperar data",error:err});
                    let resp=getcolumsToDisplayCalidad(data);
                    res.json(Object.assign({data:data},resp));

                });
        }



    },

    lista_aeu_muestra_calidad(req,res){


    },

    detalle_aeu_muestra_calidad(req,res){},

    generar_muestra_aeu_calidad(req,res){},

    evaluar_zona_calidad(req,res){},

}

module.exports = Reporte;
