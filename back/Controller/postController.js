const Post=require('../models/Post');
const Comm=require('../models/Comm');
const iSuppressor=require('../Service/ImageSuppresor');
const sanitize=require('mongo-sanitize');

exports.findAll=(req,res,next)=>{
    Post.find().sort({timestamp:"desc"}).then((p)=>
            res.status(201).json(p)
    ).catch((e)=>{
        res.status(404).json({
            message:"Aucuns Posts trouvés"
        });
    });
}

exports.findOne=(req,res,next)=>{
    Post.findOne({_id:req.body.id}).then((p)=>{
        Comm.find({where:
                {postId:p._id}
            }).then((c)=>{
            res.status(200).json({
                post:p,
                comm:c
            });
        }).catch(()=>{
            res.status(200).json({
                post:p
            });
        });
    }).catch(()=>{
        res.status(404).json({
            message:"Post introuvable"
        });
    });
}

exports.countAll=(req,res,next)=>{
    Post.count({},(c)=>{
        res.status(200).json({
            compte:c
        });
    });
}

exports.newPost=(req,res,next)=>{
    console.log(req.body);
    console.log("files",req.files);
    let file=req.files?req.files[0]:undefined;
    let cont=req.body;
    let p;
    if(file) {
        p = new Post({
            ...sanitize(cont),
            titre: cont.titre,
            contenu: cont.contenu,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`,
            timestamp: new Date().getTime()
        });
    }else{
        p = new Post({
            ...sanitize(cont),
            titre: cont.titre,
            contenu: cont.contenu,
            timestamp: new Date().getTime()
        });
    }
    p.save().then(()=>{
        return res.status(201).json({
            message:"Post créé"
        });
    }).catch((e)=>{
        console.log(e);
        return res.status(404).json({
            message:"Post n'a pas pû être créé"
        });
    });
}

exports.modPost=(req,res,next)=>{
    let file=req.files?req.files[0]:undefined;
    Post.findOne({_id:req.body.id}).then((p)=>{
        console.log("POST",p)
        if(p.auteurId!=req.auth.userId&&req.auth.admin===false){
            return res.status(401).json({
                message:"Cette Publication appartient a un autre usager"
            });
        }
        p.titre=req.body.titre;
        p.contenu=req.body.contenu;
        if(req.body.supprImage=="true"){
            p.imageUrl=undefined;
        }else if(file!==undefined){
            p.imageUrl=`${req.protocol}://${req.get('host')}/images/${file.filename}`
        }
        p.save().then(()=>{
            res.status(200).json({
                message:"post modifié ok",
                object:JSON.stringify(p)
            })
        }).catch((e)=>{
            console.log(e)
        });
    },()=>{console.log("rejeté")}).catch((e)=>{
        console.log(e)
        res.status(404).json({
            message:"erreur",
            erreur:e
        })
    });
}
//
//     Post.findOne({_id:req.body.id}).then((p)=>{
//         if(p===null){
//             return res.status(202).json({
//                 message:"Publication introuvable"
//             });
//         }
//         if(p.auteurId!=req.auth.userId&&req.auth.admin===false){
//             return res.status(401).json({
//                 message:"Cette Publication appartient a un autre usager"
//             });
//         }
//         Post.findOneAndUpdate({_id:req.body.id},{...sanitize(red.body)},{new:true}).then((p)=>{
//             if(req.file?req.file.filename:false) {
//                 iSuppr.imageSuppressor(req, p);
//                 p.imageUrl = sanitize(req.protocol + "://" + req.get('host') + "/images/" + req.file.filename);
//             }
//             p.save().then(()=>{
//                 res.status(200).json({
//                     message:"Publication mise à jour"
//                 });
//             }).catch((e)=>{
//                 console.log(e,"impossible de mettre à jour cette publication");
//             });
//         });
//     });
// }

exports.comptePost=async (req,res,next)=>{
    res.status(200).json({
        c:await Post.estimatedDocumentCount()
    });
}

exports.findAllComm=(req,res,next)=>{
   Comm.find({postId:req.query.id}).then((c)=>{
           return res.status(200).json(c);
   }).catch((e)=>{
           return res.status(404).json({
               e:e,
               message:"erreur sur le findAllComm"
           });
       });
}

exports.addComm=(req,res,next)=>{
    const c=new Comm({...sanitize(req.body),contenu:req.body.contenu,auteurId:req.auth.userId,timestamp:Date.now(),postId:req.body.postId});
    c.save().then((c)=>{
        return res.status(200).json({
            c:c,
            message:"commentaire ajouté"
        });
    }).catch((e)=>{
        console.log(e);
        return res.status(404).json({
            message: "Le commentaire n'a pas pû être ajouté"
        });
    });
}

exports.modComm=(req,res,next)=>{
    Comm.findOne({_id:req.body.id}).then((c)=>{
        if(c===null){
            return res.status(202).json({
                message:"Publication introuvable"
            });
        }
        if(c.auteurId!=req.auth.userId&&req.auth.admin===false){
            return res.status(401).json({
                message:"Cette Publication appartient a un autre usager"
            });
        }
        Comm.findOneAndUpdate({_id:req.body.id},{...sanitize(req.body)},{new:true}).then((c)=>{
            c.save().then(()=>{
                res.status(200).json({
                    message:"Publication mise à jour"
                });
            }).catch((e)=>{
                console.log(e,"impossible de mettre à jour ce commentaire");
            });
        });
    });
}

exports.compteComm=async (req,res,next)=>{
    Comm.find({postId:req.query.id}).then((c)=>{
        res.status(200).json({
            c: c.length
        });
    }).catch((e)=>{
        res.status(404).json({
            e:e
        });
    });

}

exports.remPost=(req,res,next)=>{
    Post.findOne({_id:req.params.id}).then((p)=>{
        if(req.auth.userId==p.auteurId||req.auth.admin===true) {
            if(p.imageUrl!==undefined)
                iSuppressor.imageSuppressor(req,p);
            Comm.find({postId: p._id}).then((c) => {
                for (let comm of c) {
                    comm.remove();
                }
            }).catch((e) => {
                console.log(e);
            });
            p.remove().then(() => {
                    return res.status(200).json({
                        message: "Post supprimé"
                    });
                }).catch(()=>{
                return res.status(404).json({
                    message: "Erreur lors de la suppresion du Post"
                });
            });
        }else{
            return res.status(401).json({
                message:"Ce post appartient à un autre utilisateur"
            });
        }
    }).catch((e)=>{
        console.log(e);
        return res.status(404).json({
            message:"Post introuvable"
        });
    });
}

exports.remComm=(req,res,next)=>{
    console.log(req.query.id);
    Comm.findOne({_id:req.query.id}).then((c)=>{
        if(req.auth.userId==c.auteurId||req.auth.admin===true) {
            c.remove().then(() => {
                return res.status(200).json({
                    message: "Commentaire supprimé"
                });
            });
        }else{
            return res.status(401).json({
                message:"Ce commentaire appartient à un autre utilisateur"
            });
        }
    }).catch((e)=>{
        console.log(e);
        return res.status(404).json({
            message:"Commentaire introuvable"
        });
    });
}

exports.modScore=(req,res,next)=>{
    console.log(req.body)
    Post.findOne({_id:req.body.id}).then((p)=> {
            p.score.includes(req.auth.userId) ?
                p.score.splice(p.score.indexOf(req.auth.userId), 1) :
                p.score.push(req.auth.userId);
            p.save().then(()=>{
                res.status(200).json({
                    message: p.score
                });
            }).catch((e)=>{
                console.log(e);
                res.status(404).json({
                    message: "echec de sauvegarde apres variation du score"
                })
            })
        }
    ).catch((e)=>{
        console.log(e);
        res.status(404).json({
            message: "echec du findOne"
        })
    });
}
//
// exports.modScore=(req,res,next)=>{
//         Post.findOne({_id:req.body.id}).then((p)=>{
//             cont.op===0?p.score.push(cont.user):p.score.splice(p.score.indexOf(cont.id),1);
//             p.save().then(()=>{
//                 return res.status(200).json({
//                     message:"Score modifié"
//                 });
//             }).catch((e)=>{
//                 console.log(e);
//                 return res.status(404).json({
//                     message: "Score n'a pas pû être modifié"
//                 });
//             });
//         }).catch((e)=>{
//                 console.log(e);
//                 return res.status(404).json({
//                     message:"Post introuvable"
//                 });
//             });
//     }else if(cont.type===1){
//         Comm.findOne({_id:cont.id}).then((c)=>{
//             cont.op===0?c.score.push(cont.user):c.score.splice(c.score.indexOf(cont.id),1);
//             c.save().then(()=>{
//                 return res.status(200).json({
//                     message:"Score modifié"
//                 });
//
//             }).catch((e)=>{
//                 console.log(e);
//                 return res.status(404).json({
//                     message: "Score n'a pas pû être modifié"
//                 });
//             });
//         }).catch((e)=>{
//             console.log(e);
//             return res.status(404).json({
//                 message:"Commentaire introuvable"
//             });
//         });
//     }
// }
