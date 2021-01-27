const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true, useUnifiedTopology: true}
,(err)=>{
    if(err){
        console.log("failed to connect to mongo db");
        console.error(err);
        process.exit(1)
    }
    console.log("connected tp database successfully");
});
