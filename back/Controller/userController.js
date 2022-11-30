const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const secret="za:efh6ou2ghn874zaf_312z";

exports.register = (req, res, next) => {
    if(!req.body){
        res.status(404).json({
            message:"corps vide"
        });
    }
    bcrypt.hash(req.body.password, 3).then((h) => {
        const user = new User({
            email: req.body.email,
            nom:req.body.nom,
            password: h
        });
        user.save().then(() => {
            res.status(201).json({
                userId:user._id,
                token:jwt.sign(
                    {userId:user._id,admin:user.admin},
                    secret,
                    {expiresIn:"15h"},
                    null
                )
            });
        }).catch((e) => {
            res.status(400).json({
                message: "erreur :" + e
            })
        });
    }).catch((e)=>{
        res.status(500);
    });
}

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}).then((u) => {
        if (u === null) {
            return res.status(401).json({
                message: "Utilisateur inconnu"
            });
        } else {
            bcrypt.compare(req.body.password, u.password).then((r) => {
                r?res.status(200).json({
                        userId:u._id,
                        admin:u.admin,
                        token:jwt.sign(
                            {userId:u._id,
                                admin:u.admin},
                            secret,
                            {expiresIn:"15h"},
                            null
                        ),
                    })
                    :res.status(401).json({
                        message:"Mot de passe incorrect"
                    });
            }).catchy((e)=>{
                console.error("erreur bcrypt", e);
            });
        }
    }).catch((e)=>{
        res.status(500);
    })
}

exports.addPhoto=(req,res,next)=>{
    let file=req.files?req.files[0]:undefined;
    if(file) {
        User.findOne({_id: req.auth.userId}).then((u) => {
            u.image =`${req.protocol}://${req.get('host')}/images/${file.filename}`

        u.save().then(()=>{
            res.status(200).json({
                message:"ok image mis à jour"
            })
        }).catch((e)=>{
            console.log(e);
            res.status(404).json({
                message:"erreur"
            })
        })
        });
    }
}

exports.findOne=(req,res,next)=>{
    console.log(req.query)
    if(req.query.id==0){
        return res.status(200).json({
            message:"Anonyme"
        });
    }
    User.findOne({_id:req.query.id}).then((u)=>{
        if(u===null){
            return res.status(404).json({
                message:"usager inconnu"
            });
        }else{
            console.log("RET",u);
            return res.status(200).json({
                user:u.nom,
                imageUrl:u.image
            });
        }
    }).catch((e)=>{
        console.log("erreur findOne",e, req.query)
       return res.status(500).json({
           erreur:e
       });
    });
}