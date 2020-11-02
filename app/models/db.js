var mongoose=require('mongoose');

// connect to db
mongoose.connect('mongodb://localhost:27017/assignment2');
var db=mongoose.connection;

db.on('open',function(err){
    if(err){
        console.log('fail on conncting database');
        throw err;
    }
    console.log('mongodb connected')
}
);

module.exports=mongoose;