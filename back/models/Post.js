const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const PostSchema=mongoose.Schema({
    auteurId:{type:String,required:true},
    timestamp:{type:Number,required:true},
    titre:{type:String,required:true},
    contenu:{type:String,required:true},
    imageUrl:{type:String},
    score: {type:[String]}//uID
});
PostSchema.plugin(uniqueValidator);

module.exports=mongoose.model('Post',PostSchema);
