const postController=require('../Controller/postController');
const express=require('express');
const upload=require('../MiddleWares/Multer');
const auth = require('../MiddleWares/Auth');
const router=express.Router();

//Récupére tout les posts
router.get("/all",auth,postController.findAll);

//Récupére un post et ses commentaires
router.get("/select",auth,postController.findOne);

//Crée un nouveau post
router.post("/newPost",auth,upload.any("image"),postController.newPost);

//modifier un post
router.post("/modPost",auth,upload.any("image"),postController.modPost);

//Compte le nombre de posts
router.get("/comptePost",auth,postController.comptePost);

//Compte le nombre de commentaires
router.get("/compteComm",auth,postController.compteComm);

//Récupère les commentaires associés a un post
router.get("/findAllComm",auth,postController.findAllComm);

//Ajoute un commentaire a un post
router.post("/addComm",auth,postController.addComm);

//Supprime un post et les commentaires associés
router.delete("/remPost/:id",auth,postController.remPost);

//Supprime un commentaire
router.delete("/remComm",auth,postController.remComm);

//Modifie le score d'un post ou d'un commentaire
router.post("/modScore",auth,postController.modScore);

module.exports=router;