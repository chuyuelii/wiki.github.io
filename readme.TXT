To run the project:
1, Run npm install on package.json dependency

2, modify the name of database at db.js, in specifically:
//** 

// connect to db
mongoose.connect('mongodb://localhost:27017/assignment2');

//**

3, modify the name of collection at revisions.js, in specifically:

//**

//define revision
var Revision = mongoose.model("Revision", revisionSchema, "revisions");

//**

4, execute server.js. Open the link in your browser: 

localhost:3001

