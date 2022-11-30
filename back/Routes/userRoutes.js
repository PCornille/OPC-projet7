const userController=require('../Controller/userController');
const express=require('express');
const router=express.Router();
const auth = require('../MiddleWares/Auth');
const upload = require("../MiddleWares/Multer");

//Register
router.post("/register",userController.register);

//Login
router.post("/login",userController.login);

//addPhoto
router.post("/addPhoto",auth,upload.any("image"),userController.addPhoto)

//findOne
router.get("/findOne",auth,userController.findOne);

module.exports=router;