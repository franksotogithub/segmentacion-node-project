const zonaModel = require('../models/zona');
const aeuModel = require('../models/aeu');
const vivModel = require('../models/vivienda');
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
    /*{data: 'seccion', label: 'Seccion'},
    {data: 'aeu', label: 'Nro. AEU'},*/
];

const displayedColumnsAEUCalidad = [
    {data: 'zona', label: 'Zona'},
    {data: 'seccion', label: 'Seccion'},
    {data: 'aeu', label: 'Nro. AEU'},
    /*{data: 'ind1', label: 'Ind 1'},
    {data: 'ind2', label: 'Ind 2'},
    {data: 'ind3', label: 'Ind 3'},
    {data: 'ind4', label: 'Ind 4'},
    {data: 'ind5', label: 'Ind 5'},
    {data: 'ind6', label: 'Ind 6'},
    {data: 'ind7', label: 'Ind 7'},*/
    
];

const displayedColumnsVivCalidad = [
    {data: 'ord_viv_aeu', label: 'Viv Nº'},
    {data: 'manzana', label: 'Mz '},
    {data: 'frente_ord', label: 'Frente Nº'},
    {data: 'p20', label: 'Tipo Via'},
    {data: 'p21', label: 'Nombre Via'},
    {data: 'p22_a', label: 'Nº Puerta'},
    {data: 'p23', label: 'Block'},
    {data: 'p24', label: 'Mz Nº'},
    {data: 'p25', label: 'Lote Nº'},
    {data: 'p26', label: 'Piso Nº'},
    {data: 'p27_a', label: 'Int Nº'},
    {data: 'p28', label: 'Km Nº'},
    {data: 'jefe_hogar', label: 'Jefe H.'},
    
];



function getcolumsToDisplayCalidad(data,displayedColumnsSource){
    let res={}
    let columsToDisplay=[];
    let displayedColumns=[];

  
    if(data.length>0){
        
        columsToDisplay=Object.keys(data[0]);
        
        columsToDisplay=columsToDisplay.filter(  x=> displayedColumnsSource.map(x=>x.data).includes(x) );
        
        displayedColumns =displayedColumnsSource.filter( x=> { if(columsToDisplay.indexOf( x.data)>=0) return x });
     
    }
    res= {columsToDisplay:columsToDisplay,displayedColumns:displayedColumns};
    return res;
}


function getcolumsToDisplayCalidad2(displayedColumnsSource){
    let res={}
    let columsToDisplay=[];
    let displayedColumns=[];
    displayedColumns=displayedColumnsSource;
    columsToDisplay=displayedColumnsSource.map(x=>x.data);
    res= {columsToDisplay:columsToDisplay,displayedColumns:displayedColumns};
    return res;
}

function obtenerTamanioMuestra(totalAeus){
    let tam=0;
    if(2<=totalAeus && totalAeus<=25){
        tam=2;
    }
    else if (26<=totalAeus && totalAeus<=150){
        tam=8;
    }
    else if (151<=totalAeus && totalAeus<=280){
        tam=13;
    }
    else if (281<=totalAeus && totalAeus<=500){
        tam=20;
    }
    else if (501<=totalAeus && totalAeus<=1200){
        tam=32;
    }
    return tam;

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
                    let resp=getcolumsToDisplayCalidad(data,displayedColumnsCalidad);
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
                    let resp=getcolumsToDisplayCalidad(data,displayedColumnsCalidad);
                    res.json(Object.assign({data:data},resp));

                });
        }



    },

    lista_aeu_muestra_calidad(req,res){


        let codigo=!(req.params.codigo)?'00':req.params.codigo;
        aeuModel.find({idzona:codigo,flag_calidad:1},(err,data)=>{
            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
           
            let resp=getcolumsToDisplayCalidad2(displayedColumnsAEUCalidad);
            res.json(Object.assign({data:data},resp));

        });

    },

    viv_aeu_muestra_calidad(req,res){

        let codigo=!(req.params.codigo)?'00':req.params.codigo;
        let ccdi = codigo.substring(0,6);
        let zona = codigo.substring(6,11);
        let seccion = codigo.substring(11,14);
        let aeu = codigo.substring(14,18);
        console.log('ccdi',ccdi);
        console.log('zona',zona);
        console.log('aeu',aeu);
        
        vivModel.find({ccdi:ccdi,zona:zona,aeu:aeu},(err,data)=>{
            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
            
            let resp=getcolumsToDisplayCalidad2(displayedColumnsVivCalidad);
            
            res.json(Object.assign({data:data},resp));
        }
        );

    },

    generar_muestra_aeu_calidad(req,res){
        let idzona=!(req.params.idzona)?'00':req.params.idzona;
        
        aeuModel.find({idzona:idzona},(err,data)=>{
            let totalAeus=data.length;
            let n=obtenerTamanioMuestra(totalAeus);
            let k= Math.floor(totalAeus/n);
            let semilla =  Math.floor(Math.random()*(k-1))+1;
            let aeuMuestras=[];
            let aeuMuestra

            for(let i=0;i<n;i++){
                idAeuMuestra=data[semilla+ i*k]['idaeu'];
                aeuMuestras.push(idAeuMuestra);
            }

            aeuModel.updateMany({idzona:idzona},{$set:{'flag_calidad':0}},(err,result)=>{

                if(err) throw err;
                console.log(result);
                aeuModel.updateMany({idaeu: {'$in':aeuMuestras}},{'$set':{'flag_calidad':1}},(err,data)=>{
                    res.status(200).json({'message':'Muestra generada con exito'});
                });
            });
        });
    },


    evaluar_zona_calidad(req,res){

        
    },

}

module.exports = Calidad;
