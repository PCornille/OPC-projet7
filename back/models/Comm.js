const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const CommSchema=mongoose.Schema({
    auteurId:{type:String,required:true},
    postId:{type:String,required:true},
    timestamp:{type:String,default:(Date.now())},
    contenu:{type:String,required:true},
    score: {type:[String]}//uID
});
CommSchema.plugin(uniqueValidator);

module.exports=mongoose.model('Comm',CommSchema);
