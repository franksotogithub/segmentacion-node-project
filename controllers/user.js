const userModel = require('../models/user');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let config = require('../config');


let User = {
    register(req,res){
        let email =  req.body.email;
        let username =  req.body.username;
        let password  =req.body.password;
        let nombres  =req.body.nombres;
        let apellidos  =req.body.apellidos;

        userModel.findOne({email: email} ).then(user=>{
            if(user){
                let error = 'La direccion de email ya existe en la base de datos';
                return res.status(400).json(error);
            }
            else{
                const newUser = new userModel({
                    username:username,
                    password:password,
                    email:email,
                    nombres:nombres,
                    apellidos:apellidos


                });

                bcrypt.hash(newUser.password, 10,(err,hash)=>{
                    if(err) throw err;
                    newUser.password= hash;
                    newUser.save().then(
                        user=>{
                            let respuesta={
                                success:true,
                                message:'Usuario creado',
                                user:{
                                    'username':newUser.username,
                                    'nombres':newUser.username,
                                    'apellidos':newUser.apellidos,
                                    'email':newUser.email,
                                }
                            }
                            res.status(200).json(respuesta)
                        }
                    ).catch(err=>res.status(400).json(err));
                });



                /*bcrypt.genSalt(10,(err,salt)=>{
                   if (err) throw err;
                   bcrypt.hash(newUser.password,salt,(err,hash=>{
                       console.log('hash>>>',hash);

                       if(err) throw err;
                       newUser.password= hash;
                       newUser.save().then(
                           user=>res.json(user)
                       ).catch(err=>res.status(400).json(err));
                   }));
                });*/



            }

        });
    },

    login(req,res){
        let username =  req.body.username;
        let password  =req.body.password;
        let errors={};
        userModel.findOne({username:username}).then(user=>{
            //errors
            if (!user) {

                errors.message = "Usuario no registrado";
                errors.username = errors.message;
                return res.status(404).json(errors);
            }
            bcrypt.compare(password,user.password).then(isMatch=>{
                if(isMatch){
                    const payload={
                        id:user._id,
                        name:user.username
                    }
                    jwt.sign(payload,config.jwt_token.secret_key,{expiresIn:config.jwt_token.expire_time},
                        (err,token)=>{
                        if(err) res.status(500).json({message:"Error al recuperar token",error:err});
                        res.json({
                            success:true,
                            token: `${token}`,
                            user:{
                                'username':user.username,
                                'nombres':user.username,
                                'apellidos':user.apellidos,
                                'email':user.email,
                            }
                        });


                    });
                } else {

                    errors.message="Password es incorrecto";
                    errors.password =errors.message;
                    res.status(400).json(errors);
                }
            });

        });


    }

}

module.exports = User;
