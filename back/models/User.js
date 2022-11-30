const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const UserSchema=mongoose.Schema({
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    nom:{type:String,required:true},
    // image:{type:String},
    admin:{type:Boolean,default:false}
});
UserSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User',UserSchema);
