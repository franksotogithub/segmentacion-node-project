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

const displayedColumnsAEUIndicadiresCalidad = [
    
    {data: 'ind1', label: 'Ind 1'},
    {data: 'ind2', label: 'Ind 2'},
    {data: 'ind3', label: 'Ind 3'},
    {data: 'ind4', label: 'Ind 4'},
    {data: 'ind5', label: 'Ind 5'},
    {data: 'ind6', label: 'Ind 6'},
    {data: 'ind7', label: 'Ind 7'},
    
];

const displayedColumnsVivCalidad = [
    {data: 'ord_viv_aeu', label: 'Viv Nº'},
    {data: 'manzana', label: 'Mz'},
    {data: 'frente_ord', label: 'Fr. Nº'},
    {data: 'p20', label: 'Tip.Via'},
    {data: 'p21', label: 'Nombre Via   '},
    {data: 'p22_a', label: 'Nº P.'},
    {data: 'p23', label: 'Block'},
    {data: 'p24', label: 'Mz Nº'},
    {data: 'p25', label: 'L Nº'},
    {data: 'p26', label: 'P Nº'},
    {data: 'p27_a', label: 'Int Nº'},
    {data: 'p28', label: 'Km Nº'},
    {data: 'jefe_hogar', label: 'Jefe de Hogar'},
    
];

const displayedColumnsIndicadoresCalidad = [
    {data: 'departamento', label: 'Departamento'},
    {data: 'provincia', label: 'Provincia'},
    {data: 'distrito', label: 'Distrito'},
    {data: 'zona', label: 'Zona'},
    {data: 'total_aeu_muestra', label: 'Muestra de Aeus'},
    {data: 'total_aeu_error', label: 'Total Errores'},
    {data: 'tasa_error', label: 'Tasa de Error'},
    {data: 'ind1', label: 'Ind 1'},
    {data: 'ind2', label: 'Ind 2'},
    {data: 'ind3', label: 'Ind 3'},
    {data: 'ind4', label: 'Ind 4'},
    {data: 'ind5', label: 'Ind 5'},
    {data: 'ind6', label: 'Ind 6'},
    {data: 'ind7', label: 'Ind 7'},

];


function getcolumsToDisplayCalidad(data,displayedColumnsSource){
    let res={}
    let columsToDisplay=[];
    let displayedColumns=[];

  
    if(data.length>0){
        
        columsToDisplay=Object.keys(data[0]);
        
        columsToDisplay=columsToDisplay.filter(  x=> displayedColumnsSource.map(x=>x.data).includes(x) );
        
        displayedColumns =displayedColumnsSource.filter( x=> { if(columsToDisplay.indexOf( x.data)>=0) return x });
        columsToDisplay = displayedColumns.map(x => {
            return x.data;});
    }
    res= {columnsToDisplay:columsToDisplay,displayedColumns:displayedColumns};
    return res;
}


function getcolumsToDisplayCalidad2(displayedColumnsSource){
    let res={}
    let columsToDisplay=[];
    let displayedColumns=[];
    displayedColumns=displayedColumnsSource;
    columsToDisplay=displayedColumnsSource.map(x=>x.data);
    res= {columnsToDisplay:columsToDisplay,displayedColumns:displayedColumns};
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

function obtenerNivelCalidadAceptable(tamMuestra){
    let ac=0;
    (tamMuestra==2)? ac=0:
        (tamMuestra==8)? ac=1:
            (tamMuestra==13)? ac=2:
                (tamMuestra==20)? ac=3:
                    (tamMuestra==32)? ac=5:true;



    return ac;

}


let Calidad = {

    reporte_avance_calidad(req,res){

        let ambito=!(req.params.ambito)?0:req.params.ambito;
        let codigo=!(req.params.codigo)?'00':req.params.codigo;
        let amb=ambitos.find(x=>x.ambito==ambito);
        let match={};

        let _id= {}

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

   

        for(let i=0;i<=amb.ambito;i++){

            _id[ambitos[i].descripcion] = '$'+ ambitos[i].descripcion;
           
        }


        _id["codigo"]='$'+amb.codigo;
        _id["descripcion"]='$'+ambitos[amb.ambito].descripcion;
        

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
                /*"estado": {$cond: [  { "$eq": ["$flag_proc_segm",1]  } , "$flag_proc_calidad",-1 ] } ,*/
                "estado":"$flag_proc_calidad"
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

    detalle_indicadores_aeu_muestra_calidad(req,res){

        let idaeu=!(req.params.idaeu)?'00':req.params.idaeu;
        aeuModel.find({idaeu:idaeu},(err,data)=>{
            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
           
            let resp=getcolumsToDisplayCalidad2(displayedColumnsAEUIndicadiresCalidad);
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

            aeuModel.updateMany({idzona:idzona},{$set:{'flag_calidad':0,ind1:0,ind2:0,ind3:0,ind4:0,ind5:0,ind6:0,ind7:0}},(err,result)=>{

                if(err) throw err;
                console.log(result);
                aeuModel.updateMany({idaeu: {'$in':aeuMuestras}},{'$set':{'flag_calidad':1}},(err,data)=>{
                    if(err) throw err;

                    zonaModel.update({idzona:idzona},{'$set':{'flag_proc_calidad':0}},(err,data)=>{
                        if(err) throw err;
                        res.status(200).json({'message':'Muestra generada con exito', success:true});
                    });
                    
                });
            });
        });
    },

    evaluar_zona_calidad(req,res){
        let idzona=!(req.params.idzona)?'00':req.params.idzona;
        aeuModel.find({idzona:idzona,flag_calidad:1},(err,data)=>{
            let tamMuestra=data.length;
            let nivelAc=obtenerNivelCalidadAceptable(tamMuestra);
            let flag_proc_calidad=0;
            let cant_defectuosos=0;

            data.map(x=> { if(x.flag_defectuosa>0) cant_defectuosos++; });
            (cant_defectuosos<=nivelAc)?flag_proc_calidad=1:flag_proc_calidad=2;

            zonaModel.update({idzona:idzona},{flag_proc_calidad:flag_proc_calidad}, (err,data)=>{
                if(err) throw err;
                let message="Zona no evaluada";
                if (flag_proc_calidad==1)message="Zona aceptada";
                else if(flag_proc_calidad==2) message="Zona rechazada";
                res.status(200).json({'message':message,flag_proc_calidad:flag_proc_calidad, success:true});
            });

        });
    },

    actualizar_indicadores(req,res){
        let idaeu=!(req.params.idaeu)?'00':req.params.idaeu;
        let aeu={
            ind1:req.body.ind1,
            ind2:req.body.ind2,
            ind3:req.body.ind3,
            ind4:req.body.ind4,
            ind5:req.body.ind5,
            ind6:req.body.ind6,
            ind7:req.body.ind7,
        }
        if(aeu.ind1&&aeu.ind2&&aeu.ind3&&aeu.ind4&&aeu.ind5&&aeu.ind6&&aeu.ind7)
            aeu.flag_defectuosa=0;
        else
            aeu.flag_defectuosa=1;
        aeuModel.update({idaeu: idaeu}, {$set:aeu},(err,data)=>{
            console.log('actualizado>>>',data);
            console.log('error>>>',err);
            if(err)  res.status(500).json({message:"Error al actualiza el usuario",error:err});
            res.status(200).json({'message':"indicadores  del aeu actualzados"});
        });

    },

    reporte_indicadores(req,res){
        let ambito=!(req.params.ambito)?0:req.params.ambito;
        let codigo=!(req.params.codigo)?'00':req.params.codigo;
        let amb=ambitos.find(x=>x.ambito==ambito);
        
        let match={}
        let matchZona={}
        match['flag_calidad']=1;
        if(codigo!=='00'){

            if(codigo.length==2)
            {
                match['ccdd']= {'$in' : [codigo]};
                matchZona['ccdd']= {'$in' : [codigo]};
            }

            if(codigo.length==4)
            {
                match['ccpp']= {'$in' : [codigo]};
                matchZona['ccpp']= {'$in' : [codigo]};
            }

            if(codigo.length==6)
            {
                match['ccdi']= {'$in' : [codigo]};
                matchZona['ccdi']= {'$in' : [codigo]};
            }


        }

        let project = {};
        let _id ={};
        
  

        _id["codigo"]='$'+amb.codigo;
        
        let keys=Object.keys(_id);
        keys.forEach((key,index)=>{
            project[key]='$_id.'+key;
        });
      
        
        let groupBy={
            _id:_id,
           "ind1":{"$sum": { $cond: ["$ind1", 1, 0] } },
           "ind2":{"$sum": { $cond: ["$ind2", 1, 0] } },
           "ind3":{"$sum": { $cond: ["$ind3", 1, 0] } },
           "ind4":{"$sum": { $cond: ["$ind4", 1, 0] } },
           "ind5":{"$sum": { $cond: ["$ind5", 1, 0] } },
           "ind6":{"$sum": { $cond: ["$ind6", 1, 0] } },
           "ind7":{"$sum": { $cond: ["$ind7", 1, 0] } },
           "total_aeu_muestra":{"$sum":1},
           "total_aeu_error":{"$sum":"$flag_defectuosa"},
       };

       project=
       Object.assign(project,
       {
       "ind1": 1,
       "ind2": 1,
       "ind3":1,
       "ind4":1,
       "ind5":1,
       "ind6":1,
       "ind7":1,
       "total_aeu_muestra":1,
       "total_aeu_error":1,
       "total_errores":{"$add":['$ind1','$ind2','$ind3','$ind4','$ind5','$ind6','$ind7']},
       "tasa_error":
        
            {       
                "$multiply": 
                [  {$cond: [  { "$gt": ["$total_aeu_muestra",0]  } , { "$divide": [ "$total_aeu_error", "$total_aeu_muestra"] },0 ] }  , 100 ] 
             }
            

     

       });



       let _idZona={}
        for(let i=0;i<=amb.ambito;i++){

            _idZona[ambitos[i].descripcion] = '$'+ ambitos[i].descripcion;
           
        }


        _idZona["codigo"]='$'+amb.codigo;
        _idZona["descripcion"]='$'+ambitos[amb.ambito].descripcion;
        let groupByZona={
            _id:_idZona,}

            let projectZona = {};

            let keysZona=Object.keys(_idZona);
    
            keysZona.forEach((key,index)=>{
                projectZona[key]='$_id.'+key;
    
            });     

       zonaModel.aggregate([
            {"$match":matchZona},
            {"$group":groupByZona},
            { "$project": projectZona},
            { "$sort" :  {'codigo':1}}

        ]
        ,(err,dataZona)=>{
            if(err) res.status(500).json({message:"Error al recuperar data",error:err});
            /*console.log('match>>',match)
            console.log('groupByZona>>',groupByZona)
            console.log('projectZona>>',projectZona)
      
            console.log('data>>',data);
            */
            aeuModel.aggregate([
                {"$match":match},
                {"$group":groupBy},
                { "$project": project},
                { "$sort" :  {'codigo':1}}
            ]
            ,(err,data)=>{
                if(err) res.status(500).json({message:"Error al recuperar data",error:err});

                /*let resp=getcolumsToDisplayCalidad(data,displayedColumnsCalidad);*/
                let datafinal=data.map(x=>{
                    let d=dataZona.find(z=>z.codigo==x.codigo);
                    return Object.assign(x,d);

                })
                
                
                let resp=getcolumsToDisplayCalidad(datafinal,displayedColumnsIndicadoresCalidad);
                res.json(Object.assign({data:datafinal},resp));
            });


        });




    }
}

module.exports = Calidad;
