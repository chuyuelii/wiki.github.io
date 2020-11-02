var mongoose=require('./db')

var userSchma=new mongoose.Schema({
    firstname: String,
    lastname: String,
    password:String,
    email:String,
    resetquestion: String
});
var Identity = mongoose.model('Identity',userSchma);


module.exports=Identity;


