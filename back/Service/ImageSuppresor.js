const fs=require('fs');
exports.imageSuppressor=(req,post)=>{
    console.log(post.imageUrl);
    fs.unlink("Images/"+post.imageUrl.toLowerCase().split("/images/")[1],(err)=>{
        if(err){
            console.log(err,"\n l'image n'a pas pû être supprimée");
        }
    });
}
