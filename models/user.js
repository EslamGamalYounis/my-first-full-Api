const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    usrename:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        minlength:3,
        maxLength:15
    },
    age:{
        type:Number,
        min:13
    }
})


    const User = mongoose.model('User', userSchema);
    module.exports = User;
  